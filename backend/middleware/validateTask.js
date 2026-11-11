const mongoose = require('mongoose');

/**
 * Middleware to validate MongoDB ObjectId from route parameters (:id)
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid task ID format: "${id}". Must be a valid 24-character hexadecimal ObjectId.`,
    });
  }
  next();
};

/**
 * Middleware to validate task creation payload
 */
const validateCreateTask = (req, res, next) => {
  const { title, priority, status, dueDate, category } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Task title is required and cannot be empty.',
    });
  }

  if (title.trim().length > 150) {
    return res.status(400).json({
      success: false,
      message: 'Task title cannot exceed 150 characters.',
    });
  }

  if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({
      success: false,
      message: 'Priority must be one of: Low, Medium, High.',
    });
  }

  if (status && !['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be one of: Pending, In Progress, Completed.',
    });
  }

  if (dueDate) {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid due date format. Please provide a valid ISO date.',
      });
    }
  }

  next();
};

/**
 * Middleware to validate task status update payload (PATCH /api/tasks/:id/status)
 */
const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required.',
    });
  }

  if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be one of: Pending, In Progress, Completed.',
    });
  }

  next();
};

module.exports = {
  validateObjectId,
  validateCreateTask,
  validateUpdateStatus,
};
