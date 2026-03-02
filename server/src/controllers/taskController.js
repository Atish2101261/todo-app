const { body, query } = require('express-validator');
const Task = require('../models/Task');
const { validate } = require('../middleware/errorHandler');

// Validation rules for task
const taskValidation = [
    body('title').trim().notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description max 500 chars'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate').optional({ nullable: true }).isISO8601().toDate().withMessage('Invalid date format'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    validate,
];

// @desc    Get all tasks (with filter, sort, pagination)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
    try {
        const {
            status,
            priority,
            search,
            sortBy = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 6,
        } = req.query;

        const filter = { user: req.user._id };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const allowedSort = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'];
        const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(20, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Task.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: tasks,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get task stats
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
    try {
        const stats = await Task.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const result = { pending: 0, 'in-progress': 0, completed: 0, total: 0 };
        stats.forEach(({ _id, count }) => {
            result[_id] = count;
            result.total += count;
        });

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = [
    ...taskValidation,
    async (req, res, next) => {
        try {
            const { title, description, status, priority, dueDate, tags } = req.body;
            const task = await Task.create({
                title, description, status, priority, dueDate, tags,
                user: req.user._id,
            });
            res.status(201).json({ success: true, message: 'Task created', data: task });
        } catch (error) {
            next(error);
        }
    },
];

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = [
    body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 chars'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description max 500 chars'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate').optional({ nullable: true }).isISO8601().toDate().withMessage('Invalid date'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    validate,
    async (req, res, next) => {
        try {
            const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
            if (!task) {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }

            const { title, description, status, priority, dueDate, tags } = req.body;
            if (title !== undefined) task.title = title;
            if (description !== undefined) task.description = description;
            if (status !== undefined) task.status = status;
            if (priority !== undefined) task.priority = priority;
            if (dueDate !== undefined) task.dueDate = dueDate;
            if (tags !== undefined) task.tags = tags;

            await task.save();
            res.json({ success: true, message: 'Task updated', data: task });
        } catch (error) {
            next(error);
        }
    },
];

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTasks, getTaskStats, getTask, createTask, updateTask, deleteTask };
