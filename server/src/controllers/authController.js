const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { validate } = require('../middleware/errorHandler');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
    async (req, res, next) => {
        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already registered' });
            }

            const user = await User.create({ name, email, password });
            const token = generateToken(user._id);

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                token,
                user: { id: user._id, name: user.name, email: user.email },
            });
        } catch (error) {
            next(error);
        }
    },
];

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
    async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            const token = generateToken(user._id);

            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: { id: user._id, name: user.name, email: user.email },
            });
        } catch (error) {
            next(error);
        }
    },
];

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        res.json({
            success: true,
            user: { id: req.user._id, name: req.user.name, email: req.user.email },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe };
