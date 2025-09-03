const Task = require('../models/Task');
const { sendSuccess, sendError, sendNotFound, sendValidationError } = require('../utils/apiResponse');

/**
 * Get all tasks with optional search and filter
 * GET /api/tasks?search=keyword&status=pending&page=1&limit=10
 */
const getTasks = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    // Build query object
    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Task.countDocuments(query);
    
    const response = {
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalTasks: total,
        hasNext: skip + tasks.length < total,
        hasPrev: parseInt(page) > 1
      }
    };
    
    sendSuccess(res, 'Tasks retrieved successfully', response);
  } catch (error) {
    sendError(res, 'Error retrieving tasks', error.message);
  }
};

/**
 * Get a single task by ID
 * GET /api/tasks/:id
 */
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return sendNotFound(res, 'Task not found');
    }
    
    sendSuccess(res, 'Task retrieved successfully', task);
  } catch (error) {
    sendError(res, 'Error retrieving task', error.message);
  }
};

/**
 * Create a new task
 * POST /api/tasks
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status = 'pending' } = req.body;
    
    // Validation
    if (!title || !description) {
      return sendValidationError(res, 'Title and description are required');
    }
    
    const task = new Task({
      title,
      description,
      status
    });
    
    const savedTask = await task.save();
    sendSuccess(res, 'Task created successfully', savedTask, 201);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return sendValidationError(res, 'Validation error', error.errors);
    }
    sendError(res, 'Error creating task', error.message);
  }
};

/**
 * Update a task
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return sendNotFound(res, 'Task not found');
    }
    
    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    
    const updatedTask = await task.save();
    sendSuccess(res, 'Task updated successfully', updatedTask);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return sendValidationError(res, 'Validation error', error.errors);
    }
    sendError(res, 'Error updating task', error.message);
  }
};

/**
 * Delete a task
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return sendNotFound(res, 'Task not found');
    }
    
    await Task.findByIdAndDelete(req.params.id);
    sendSuccess(res, 'Task deleted successfully');
  } catch (error) {
    sendError(res, 'Error deleting task', error.message);
  }
};

/**
 * Get task statistics
 * GET /api/tasks/stats
 */
const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const formattedStats = {
      total: 0,
      pending: 0,
      'in-progress': 0,
      completed: 0
    };
    
    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });
    
    sendSuccess(res, 'Task statistics retrieved successfully', formattedStats);
  } catch (error) {
    sendError(res, 'Error retrieving task statistics', error.message);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
