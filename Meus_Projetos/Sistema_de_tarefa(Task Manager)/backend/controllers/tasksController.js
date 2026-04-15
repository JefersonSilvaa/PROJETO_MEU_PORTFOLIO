const Task = require('../models/Task');

// Get all tasks for user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId })
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new task
exports.createTask = async (req, res) => {
    try {
        const { title, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        const task = new Task({
            title,
            dueDate,
            user: req.userId
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed, dueDate } = req.body;

        // Find task and verify ownership
        const task = await Task.findOne({ _id: id, user: req.userId });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update fields
        if (title !== undefined) task.title = title;
        if (completed !== undefined) task.completed = completed;
        if (dueDate !== undefined) task.dueDate = dueDate;

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({ _id: id, user: req.userId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
