const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a new task for a project
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
    const { title, description, projectId, assignee, dueDate , imageUrl} = req.body;
    try {
        const project = await Project.findById(projectId);
        if (!project || !project.members.includes(req.user._id)) {
            return res.status(401).json({ msg: 'Not authorized for this project' });
        }
        const newTask = new Task({
            title,
            description,
            project: projectId,
            assignee,
            dueDate,
            imageUrl,
            creator: req.user._id,
        });
        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all tasks for a specific project
// @route   GET /api/tasks/project/:projectId
// @access  Private
exports.getTasksByProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project || !project.members.includes(req.user._id)) {
            return res.status(401).json({ msg: 'Not authorized for this project' });
        }
        const tasks = await Task.find({ project: req.params.projectId }).populate('assignee', 'name email');
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    const { title, description, assignee, dueDate, status } = req.body;
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        const project = await Project.findById(task.project);
        if (!project.members.includes(req.user._id)) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, assignee, dueDate, status } },
            { new: true }
        );
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignee: req.user._id })
            .populate('project', 'name') // Gets the project name for context
            .sort({ dueDate: 1 }); 
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};