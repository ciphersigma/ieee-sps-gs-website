// src/services/authAPI.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
console.log('AuthAPI: Using API base URL:', API_BASE_URL);

const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('ieee_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
authAPI.interceptors.response.use(
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

export const authService = {
  async login(email, password) {
    try {
      console.log('AuthAPI: Attempting login to', `${API_BASE_URL}/auth/login`);
      const response = await authAPI.post('/login', { email, password });
      console.log('AuthAPI: Login response', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('ieee_admin_token', token);
      localStorage.setItem('ieee_admin_user', JSON.stringify(user));
      
      return { data: { user }, error: null };
    } catch (error) {
      console.error('AuthAPI: Login error', error);
      console.error('AuthAPI: Error response', error.response?.data);
      return { 
        data: null, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  },

  async getCurrentUser() {
    try {
      const response = await authAPI.get('/me');
      return { data: response.data.user, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to get user' 
      };
    }
  },

  async logout() {
    try {
      await authAPI.post('/logout');
      localStorage.removeItem('ieee_admin_token');
      localStorage.removeItem('ieee_admin_user');
      return { error: null };
    } catch (error) {
      localStorage.removeItem('ieee_admin_token');
      localStorage.removeItem('ieee_admin_user');
      return { error: null };
    }
  }
};

export default authService;