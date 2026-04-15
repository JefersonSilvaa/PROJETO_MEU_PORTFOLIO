const express = require('express');
const tasksController = require('../controllers/tasksController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// GET /api/tasks
router.get('/', tasksController.getTasks);

// POST /api/tasks
router.post('/', tasksController.createTask);

// PUT /api/tasks/:id
router.put('/:id', tasksController.updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
