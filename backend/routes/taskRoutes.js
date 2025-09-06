const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createTask,
    getTasksByProject,
    updateTask,
    getMyTasks,
    getTaskById 
} = require('../controllers/taskController');

router.route('/').post(protect, createTask);
router.route('/project/:projectId').get(protect, getTasksByProject);
router.route('/mytasks').get(protect, getMyTasks);
router.route('/:id').get(protect, getTaskById).put(protect, updateTask);

module.exports = router;