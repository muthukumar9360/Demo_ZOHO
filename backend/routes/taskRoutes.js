const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const {
  validateObjectId,
  validateCreateTask,
  validateUpdateStatus,
} = require('../middleware/validateTask');
const checkDbConnection = require('../middleware/checkDbConnection');

// Check DB connection on all task operations
router.use(checkDbConnection);

// Dashboard metrics endpoint
router.get('/stats/summary', getTaskStats);

// Main task collection routes
router.route('/')
  .get(getTasks)
  .post(validateCreateTask, createTask);

// Single task routes with ID parameter
router.route('/:id')
  .get(validateObjectId, getTaskById)
  .put(validateObjectId, updateTask)
  .delete(validateObjectId, deleteTask);

// Status-specific update route
router.patch('/:id/status', validateObjectId, validateUpdateStatus, updateTaskStatus);

module.exports = router;
