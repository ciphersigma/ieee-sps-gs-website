import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ieee_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ieee_admin_token');
        localStorage.removeItem('ieee_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

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
    return response.data.data || response.data;
  },
  getUpcomingEvents: async (limit = 10) => {
    const response = await publicApiClient.get(`/events?upcoming=true&limit=${limit}`);
    return response.data.data || response.data;
  },
  getEventById: async (id: string) => {
    const response = await publicApiClient.get(`/events/${id}`);
    return response.data.data || response.data;
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

  // Contact
  submitContactForm: async (data: any) => {
    const response = await publicApiClient.post('/content/contact-messages', data);
    return response.data;
  },
};

export default apiClient;