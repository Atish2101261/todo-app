const express = require('express');
const {
    getTasks,
    getTaskStats,
    getTask,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(protect);

router.get('/stats', getTaskStats);
router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
