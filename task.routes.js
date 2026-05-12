const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// In-memory task store
const tasks = [];
let taskIdCounter = 1;

// GET /api/tasks - Get all tasks for the authenticated user (Protected)
router.get('/', authenticateToken, (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.user.userId);
  res.json({ tasks: userTasks });
});

// POST /api/tasks - Create a new task (Protected)
router.post('/', authenticateToken, (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Task title is required.' });
  }

  const task = {
    id: taskIdCounter++,
    userId: req.user.userId,
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  res.status(201).json({ message: 'Task created successfully.', task });
});

// PUT /api/tasks/:id - Update a task (Protected)
router.put('/:id', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.user.userId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const { title, description, completed } = req.body;

  if (title !== undefined) tasks[taskIndex].title = title;
  if (description !== undefined) tasks[taskIndex].description = description;
  if (completed !== undefined) tasks[taskIndex].completed = completed;

  res.json({ message: 'Task updated successfully.', task: tasks[taskIndex] });
});

// DELETE /api/tasks/:id - Delete a task (Protected)
router.delete('/:id', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.user.userId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.json({ message: 'Task deleted successfully.', task: deletedTask });
});

module.exports = router;
