import API from './api';

export const authService = {
  // Register a new account
  async signup(userData) {
    const response = await API.post('/api/auth/signup', userData);
    return response.data;
  },

  // Log in with email & password
  async login(credentials) {
    const response = await API.post('/api/auth/login', credentials);
    return response.data;
  },

  // Get current logged-in user profile
  async getMe() {
    const response = await API.get('/api/auth/me');
    return response.data;
  },
};

export default authService;
