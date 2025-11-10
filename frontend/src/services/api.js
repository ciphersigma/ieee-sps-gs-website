// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ieee_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('ieee_admin_token');
      localStorage.removeItem('ieee_admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Research API
export const researchAPI = {
  // Research Areas
  getAreas: () => apiClient.get('/research/areas'),
  createArea: (data) => apiClient.post('/research/areas', data),
  updateArea: (id, data) => apiClient.put(`/research/areas/${id}`, data),
  deleteArea: (id) => apiClient.delete(`/research/areas/${id}`),

  // Research Projects
  getProjects: (featured = false) => apiClient.get(`/research/projects${featured ? '?featured=true' : ''}`),
  createProject: (data) => apiClient.post('/research/projects', data),
  updateProject: (id, data) => apiClient.put(`/research/projects/${id}`, data),
  deleteProject: (id) => apiClient.delete(`/research/projects/${id}`),

  // Research Publications
  getPublications: (featured = false) => apiClient.get(`/research/publications${featured ? '?featured=true' : ''}`),
  createPublication: (data) => apiClient.post('/research/publications', data),
  updatePublication: (id, data) => apiClient.put(`/research/publications/${id}`, data),
  deletePublication: (id) => apiClient.delete(`/research/publications/${id}`),

  // Research Stats
  getStats: () => apiClient.get('/research/stats'),
  updateStats: (data) => apiClient.put('/research/stats', data),
};

// Events API
export const eventsAPI = {
  getEvents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/events${query ? '?' + query : ''}`);
  },
  createEvent: (data) => apiClient.post('/events', data),
  updateEvent: (id, data) => apiClient.put(`/events/${id}`, data),
  deleteEvent: (id) => apiClient.delete(`/events/${id}`),
  getEventsCount: () => apiClient.get('/events/count'),
};

// Members API
export const membersAPI = {
  getMembers: () => apiClient.get('/members'),
  createMember: (data) => apiClient.post('/members', data),
  updateMember: (id, data) => apiClient.put(`/members/${id}`, data),
  deleteMember: (id) => apiClient.delete(`/members/${id}`),
  getExecutive: () => apiClient.get('/members/executive'),
  createExecutive: (data) => apiClient.post('/members/executive', data),
  updateExecutive: (id, data) => apiClient.put(`/members/executive/${id}`, data),
  deleteExecutive: (id) => apiClient.delete(`/members/executive/${id}`),
};

// Content API
export const contentAPI = {
  getNews: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/content/news${query ? '?' + query : ''}`);
  },
  createNews: (data) => apiClient.post('/content/news', data),
  updateNews: (id, data) => apiClient.put(`/content/news/${id}`, data),
  deleteNews: (id) => apiClient.delete(`/content/news/${id}`),
  getGallery: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/content/gallery${query ? '?' + query : ''}`);
  },
  createGallery: (data) => apiClient.post('/content/gallery', data),
  deleteGallery: (id) => apiClient.delete(`/content/gallery/${id}`),
  getAchievements: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/content/achievements${query ? '?' + query : ''}`);
  },
  createAchievement: (data) => apiClient.post('/content/achievements', data),
  getContactMessages: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/content/contact-messages${query ? '?' + query : ''}`);
  },
  createContactMessage: (data) => apiClient.post('/content/contact-messages', data),
  updateContactMessage: (id, data) => apiClient.put(`/content/contact-messages/${id}`, data),
};

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  changePassword: (data) => apiClient.put('/auth/change-password', data),
  getProfile: () => apiClient.get('/auth/profile'),
};

// Branch API
export const branchAPI = {
  getBranches: () => apiClient.get('/branches'),
  getBranch: (id) => apiClient.get(`/branches/${id}`),
  createBranch: (data) => apiClient.post('/branches', data),
  updateBranch: (id, data) => apiClient.put(`/branches/${id}`, data),
  deleteBranch: (id) => apiClient.delete(`/branches/${id}`),
  toggleBranchStatus: (id) => apiClient.patch(`/branches/${id}/toggle-status`),
  assignRole: (id, data) => apiClient.post(`/branches/${id}/assign-role`, data),
};

// Admin API
export const adminAPI = {
  getCarousel: () => apiClient.get('/admin/carousel'),
  createCarousel: (data) => apiClient.post('/admin/carousel', data),
  updateCarousel: (id, data) => apiClient.put(`/admin/carousel/${id}`, data),
  deleteCarousel: (id) => apiClient.delete(`/admin/carousel/${id}`),
  getSiteStats: () => apiClient.get('/admin/stats'),
  updateSiteStats: (data) => apiClient.put('/admin/stats', data),
  getUsers: () => apiClient.get('/users'),
  createUser: (data) => apiClient.post('/users', data),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  toggleUserStatus: (id) => apiClient.patch(`/users/${id}/toggle-status`),
  resetUserPassword: (id, newPassword) => apiClient.patch(`/users/${id}/reset-password`, { newPassword }),
  getBranchUsers: (branchId) => apiClient.get(`/users?branch=${branchId}`),
};

// Public API client without auth token
const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Convenience methods for frontend components
export const api = {
  // Events
  getAllEvents: async () => {
    const response = await publicApiClient.get('/events');
    return response.data;
  },
  getUpcomingEvents: async (limit = 10) => {
    const response = await publicApiClient.get(`/events?upcoming=true&limit=${limit}`);
    return response.data;
  },
  getEventById: async (id) => {
    const response = await publicApiClient.get(`/events/${id}`);
    return response.data;
  },

  // Members
  getExecutiveCommittee: async () => {
    const response = await publicApiClient.get('/members/executive');
    return response.data;
  },
  getMembers: async () => {
    const response = await publicApiClient.get('/members');
    return response.data;
  },

  // Content
  getCarouselImages: async () => {
    const response = await publicApiClient.get('/admin/carousel');
    return response.data;
  },
  getNews: async (limit = 10) => {
    const response = await publicApiClient.get(`/content/news?limit=${limit}`);
    return response.data;
  },
  getGallery: async () => {
    const response = await publicApiClient.get('/content/gallery');
    return response.data;
  },

  // Research
  getResearchAreas: async () => {
    const response = await publicApiClient.get('/research/areas');
    return response.data;
  },
  getResearchProjects: async () => {
    const response = await publicApiClient.get('/research/projects');
    return response.data;
  },
  getResearchPublications: async () => {
    const response = await publicApiClient.get('/research/publications');
    return response.data;
  },
  getResearchStats: async () => {
    const response = await publicApiClient.get('/research/stats');
    return response.data;
  },

  // Branches
  getBranchById: async (id) => {
    const response = await publicApiClient.get(`/branches/${id}`);
    return response.data;
  },

  // Admin
  createMember: async (data) => {
    const response = await membersAPI.createMember(data);
    return response.data;
  },
  updateMember: async (id, data) => {
    const response = await membersAPI.updateMember(id, data);
    return response.data;
  },
  deleteMember: async (id) => {
    const response = await membersAPI.deleteMember(id);
    return response.data;
  },
  createExecutive: async (data) => {
    const response = await membersAPI.createExecutive(data);
    return response.data;
  },
  updateExecutive: async (id, data) => {
    const response = await membersAPI.updateExecutive(id, data);
    return response.data;
  },
  deleteExecutive: async (id) => {
    const response = await membersAPI.deleteExecutive(id);
    return response.data;
  },
  createResearchArea: async (data) => {
    const response = await researchAPI.createArea(data);
    return response.data;
  },
  updateResearchArea: async (id, data) => {
    const response = await researchAPI.updateArea(id, data);
    return response.data;
  },
  deleteResearchArea: async (id) => {
    const response = await researchAPI.deleteArea(id);
    return response.data;
  },
  createResearchProject: async (data) => {
    const response = await researchAPI.createProject(data);
    return response.data;
  },
  updateResearchProject: async (id, data) => {
    const response = await researchAPI.updateProject(id, data);
    return response.data;
  },
  deleteResearchProject: async (id) => {
    const response = await researchAPI.deleteProject(id);
    return response.data;
  },
  createResearchPublication: async (data) => {
    const response = await researchAPI.createPublication(data);
    return response.data;
  },
  updateResearchPublication: async (id, data) => {
    const response = await researchAPI.updatePublication(id, data);
    return response.data;
  },
  deleteResearchPublication: async (id) => {
    const response = await researchAPI.deletePublication(id);
    return response.data;
  },
  updateResearchStats: async (data) => {
    const response = await researchAPI.updateStats(data);
    return response.data;
  },
};

export default apiClient;