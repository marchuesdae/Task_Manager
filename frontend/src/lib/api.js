import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

// Task API functions
export const taskAPI = {
  // Get all tasks with optional search and filter
  getTasks: (params = {}) => {
    return api.get('/tasks', { params });
  },

  // Get a single task
  getTask: (id) => {
    return api.get(`/tasks/${id}`);
  },

  // Create a new task
  createTask: (taskData) => {
    return api.post('/tasks', taskData);
  },

  // Update a task
  updateTask: (id, taskData) => {
    return api.put(`/tasks/${id}`, taskData);
  },

  // Delete a task
  deleteTask: (id) => {
    return api.delete(`/tasks/${id}`);
  },

  // Get task statistics
  getTaskStats: () => {
    return api.get('/tasks/stats');
  },
};

export default api;
