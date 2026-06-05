const router = require('express').Router();
const Task = require('../models/Task');
const auth = require('../middleware/authMiddleware');

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      msg: 'Server Error'
    });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        msg: 'Title is required'
      });
    }

    const task = await Task.create({
      title,
      description,
      userId: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      msg: 'Server Error'
    });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      req.body,
      {
        new: true
      }
    );

    if (!task) {
      return res.status(404).json({
        msg: 'Task not found'
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      msg: 'Server Error'
    });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        msg: 'Task not found'
      });
    }

    res.json({
      msg: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Server Error'
    });
  }
});

// Toggle task status
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        msg: 'Task not found'
      });
    }

    task.status =
      task.status === 'pending'
        ? 'completed'
        : 'pending';

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({
      msg: 'Server Error'
    });
  }
});

module.exports = router;