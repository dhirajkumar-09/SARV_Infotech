import axios from 'axios';

// Create configured Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inject JWT token into Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired, clear user state
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected routes, can clear stale token
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        // Only clear if on a protected route or token is corrupt
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
