import API from './axios';

export const fetchTasks = (params) => API.get('/tasks', { params });
export const fetchTaskStats = () => API.get('/tasks/stats');
export const fetchTask = (id) => API.get(`/tasks/${id}`);
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
