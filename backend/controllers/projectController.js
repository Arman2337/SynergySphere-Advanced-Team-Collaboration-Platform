const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newProject = new Project({
            name,
            description,
            owner: req.user._id,
            members: [req.user._id], // Owner is a member by default
        });
        const project = await newProject.save();
        res.status(201).json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ members: req.user._id }).populate('owner', 'name email').populate('members', 'name email');
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('owner', 'name email').populate('members', 'name email');
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        // Ensure user is a member of the project
        if (!project.members.some(member => member._id.equals(req.user._id))) {
             return res.status(401).json({ msg: 'User not authorized' });
        }
        res.json(project);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Add a member to a project
// @route   POST /api/projects/:id/members
// @access  Private
exports.addProjectMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }
        // Check if the current user is the owner
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'Only the project owner can add members' });
        }
        const userToAdd = await User.findOne({ email: req.body.email });
        if (!userToAdd) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (project.members.includes(userToAdd._id)) {
            return res.status(400).json({ msg: 'User is already a member' });
        }
        project.members.push(userToAdd._id);
        await project.save();
        res.json(project.members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};