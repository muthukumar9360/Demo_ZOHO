import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Normalizes error messages from API responses
 */
export const formatErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message === 'Network Error') {
    return 'Cannot reach backend server. Please make sure the backend is running on http://localhost:5000.';
  }
  return error.message || 'An unexpected error occurred';
};

// Health check endpoint
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

// Tasks CRUD API
export const getTasks = async (params = {}) => {
  try {
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export const getTaskStats = async () => {
  try {
    const response = await apiClient.get('/tasks/stats/summary');
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export const getTaskById = async (id) => {
  try {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await apiClient.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/tasks/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export default apiClient;
