const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'MERN Todo API is running 🚀', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
