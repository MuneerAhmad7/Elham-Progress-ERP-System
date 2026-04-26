import { defineStore } from 'pinia';
import authService from '../../services/auth.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    async login(credentials) {
      try {
        const data = await authService.login(credentials);
        this.token = data.access_token;
        this.isAuthenticated = true;
        
        const user = await authService.getCurrentUser();
        this.user = user;
        
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.detail || 'Login failed' 
        };
      }
    },
    
    async register(userData) {
      try {
        await authService.register(userData);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.detail || 'Registration failed' 
        };
      }
    },
    
    async fetchUser() {
      try {
        const user = await authService.getCurrentUser();
        this.user = user;
      } catch (error) {
        this.clearAuth();
      }
    },
    
    logout() {
      authService.logout();
      this.clearAuth();
    },

    clearAuth() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
    },
  },
});