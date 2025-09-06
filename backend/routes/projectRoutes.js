const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createProject,
    getProjects,
    getProjectById,
    addProjectMember
} = require('../controllers/projectController');

router.route('/').post(protect, createProject).get(protect, getProjects);
router.route('/:id').get(protect, getProjectById);
router.route('/:id/members').post(protect, addProjectMember);

module.exports = router;