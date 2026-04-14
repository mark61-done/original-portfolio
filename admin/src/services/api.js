import axios from 'axios'

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const API_BASE_URL = `${API_ORIGIN.replace(/\/$/, '')}/api`
const ADMIN_LOGIN_URL = '/admin/login'

export const assetUrl = (maybeRelativeUrl) => {
  if (!maybeRelativeUrl) return ''
  if (maybeRelativeUrl.startsWith('http://') || maybeRelativeUrl.startsWith('https://')) return maybeRelativeUrl
  if (maybeRelativeUrl.startsWith('/')) return `${API_ORIGIN.replace(/\/$/, '')}${maybeRelativeUrl}`
  return maybeRelativeUrl
}

const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = ADMIN_LOGIN_URL
    }
    return Promise.reject(error)
  },
)

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getFeatured: () => api.get('/projects/featured'),
  getById: (id) => api.get(`/projects/${id}`),
}

export const skillsAPI = {
  getAll: () => api.get('/skills'),
}

export const contactAPI = {
  sendMessage: (messageData) => api.post('/contact', messageData),
}

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
}

export const adminProjectsAPI = {
  getAll: () => api.get('/admin/projects'),
  getCount: () => api.get('/admin/projects/count'),
  getById: (id) => api.get(`/admin/projects/${id}`),
  create: (projectData) =>
    api.post('/admin/projects', projectData, {
      headers:
        projectData instanceof FormData
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' },
      timeout: 30000,
    }),
  update: (id, projectData) =>
    api.put(`/admin/projects/${id}`, projectData, {
      headers:
        projectData instanceof FormData
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' },
      timeout: 30000,
    }),
  delete: (id) => api.delete(`/admin/projects/${id}`),
}

export const messagesAPI = {
  getAll: () => api.get('/admin/messages'),
  getUnreadCount: () => api.get('/admin/messages/unread/count'),
  markAsRead: (id) => api.put(`/admin/messages/${id}/read`),
  delete: (id) => api.delete(`/admin/messages/${id}`),
}

export const adminSkillsAPI = {
  getAll: () => api.get('/admin/skills'),
  create: (skillData) => api.post('/admin/skills', skillData),
  update: (id, skillData) => api.put(`/admin/skills/${id}`, skillData),
  delete: (id) => api.delete(`/admin/skills/${id}`),
}

export default api
