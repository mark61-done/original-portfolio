import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔐 API Request - Token found:', !!token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 Token added to request');
  } else {
    console.warn('⚠️ No token found in localStorage');
  }
  
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('🔐 API Response Error:', error.response?.status);
    
    if (error.response?.status === 401) {
      console.log('🔐 401 Unauthorized - Logging out');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Public APIs
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

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Admin APIs - FIXED VERSION
export const adminProjectsAPI = {
  getAll: () => api.get('/admin/projects'),
  getById: (id) => api.get(`/admin/projects/${id}`),
  create: (projectData) => {
    console.log('🔧 API - Creating project, data type:', typeof projectData);
    console.log('🔧 API - Is FormData?', projectData instanceof FormData);
    console.log('🔧 API - Data:', projectData);
    
    if (projectData instanceof FormData) {
      console.log('🔧 API - Sending as FormData');
      return api.post('/admin/projects', projectData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
    } else {
      console.log('🔧 API - Sending as JSON');
      return api.post('/admin/projects', projectData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  },
  update: (id, projectData) => {
    if (projectData instanceof FormData) {
      return api.put(`/admin/projects/${id}`, projectData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
    } else {
      return api.put(`/admin/projects/${id}`, projectData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  },
  delete: (id) => api.delete(`/admin/projects/${id}`),
};

export const messagesAPI = {
  getAll: () => api.get('/admin/messages'),
  getUnreadCount: () => api.get('/admin/messages/unread/count'),
  markAsRead: (id) => api.put(`/admin/messages/${id}/read`),
  delete: (id) => api.delete(`/admin/messages/${id}`),
};

// Admin Skills API
export const adminSkillsAPI = {
  getAll: () => api.get('/admin/skills'),
  create: (skillData) => api.post('/admin/skills', skillData),
  update: (id, skillData) => api.put(`/admin/skills/${id}`, skillData),
  delete: (id) => api.delete(`/admin/skills/${id}`),
};

export default api;