import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

//
// ────────────────────────────────────────────────
// PUBLIC API
// ────────────────────────────────────────────────
//

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getFeatured: () => api.get('/projects/featured'),
  getById: (id) => api.get(`/projects/${id}`),
};

export const skillsAPI = {
  getAll: () => api.get('/skills'),
};

export const contactAPI = {
  sendMessage: (messageData) => api.post('/contact', messageData),
};

//
// ────────────────────────────────────────────────
// AUTH API
// ────────────────────────────────────────────────
//

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

//
// ────────────────────────────────────────────────
// ADMIN PROJECTS API
// ────────────────────────────────────────────────
//

export const adminProjectsAPI = {
  getAll: () => api.get('/admin/projects'),
  getCount: () => api.get('/admin/projects/count'), // ✅ added for dashboard
  getById: (id) => api.get(`/admin/projects/${id}`),

  create: (projectData) =>
    api.post('/admin/projects', projectData, {
      headers: projectData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' },
      timeout: 30000,
    }),

  update: (id, projectData) =>
    api.put(`/admin/projects/${id}`, projectData, {
      headers: projectData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' },
      timeout: 30000,
    }),

  delete: (id) => api.delete(`/admin/projects/${id}`),
};

//
// ────────────────────────────────────────────────
// ADMIN MESSAGES API
// ────────────────────────────────────────────────
//

export const messagesAPI = {
  getAll: () => api.get('/admin/messages'),
  getUnreadCount: () => api.get('/admin/messages/unread/count'), // ✅ now working for dashboard
  markAsRead: (id) => api.put(`/admin/messages/${id}/read`),
  delete: (id) => api.delete(`/admin/messages/${id}`),
};

//
// ────────────────────────────────────────────────
// ADMIN SKILLS API
// ────────────────────────────────────────────────
//

export const adminSkillsAPI = {
  getAll: () => api.get('/admin/skills'),
  create: (skillData) => api.post('/admin/skills', skillData),
  update: (id, skillData) => api.put(`/admin/skills/${id}`, skillData),
  delete: (id) => api.delete(`/admin/skills/${id}`),
};

export default api;
