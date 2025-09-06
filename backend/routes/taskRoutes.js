const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createTask,
    getTasksByProject,
    updateTask,
    getMyTasks
} = require('../controllers/taskController');

router.route('/').post(protect, createTask);
router.route('/project/:projectId').get(protect, getTasksByProject);
router.route('/:id').put(protect, updateTask);
router.route('/mytasks').get(protect, getMyTasks);

module.exports = router;