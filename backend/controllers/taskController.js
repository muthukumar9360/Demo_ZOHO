const Task = require('../models/Task');

/**
 * @desc    Get all tasks with optional search, filters, and sorting
 * @route   GET /api/tasks
 * @access  Public
 */
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, category, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = {};

    // Search filter across title and description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Build sort object
    const sortField = ['createdAt', 'updatedAt', 'dueDate', 'title', 'priority'].includes(sortBy)
      ? sortBy
      : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const tasks = await Task.find(query).sort({ [sortField]: sortOrder });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics & summary
 * @route   GET /api/tasks/stats/summary
 * @access  Public
 */
const getTaskStats = async (req, res, next) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: 'Completed' });
    const pending = await Task.countDocuments({ status: 'Pending' });
    const inProgress = await Task.countDocuments({ status: 'In Progress' });
    const highPriority = await Task.countDocuments({ priority: 'High' });

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        inProgress,
        highPriority,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Public
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Public
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, status, dueDate } = req.body;

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category ? category.trim() : 'General',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
const updateTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, status, dueDate } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // return updated document
      runValidators: true, // ensure schema validations run on update
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task status only
 * @route   PATCH /api/tasks/:id/status
 * @access  Public
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Task status updated to "${status}"`,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
