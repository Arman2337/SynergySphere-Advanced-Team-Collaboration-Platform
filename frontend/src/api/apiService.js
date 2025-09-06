import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an Axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is crucial for sending cookies
});

// Auth
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const logout = () => api.post('/auth/logout');
export const getProfile = () => api.get('/users/profile');

// Projects
export const getProjects = () => api.get('/projects');
export const createProject = (projectData) => api.post('/projects', projectData);
export const getProjectById = (id) => api.get(`/projects/${id}`);

// Tasks
export const getTasksByProject = (projectId) => api.get(`/tasks/project/${projectId}`);
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);

export default api;