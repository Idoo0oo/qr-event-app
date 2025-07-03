import { defineStore } from 'pinia';
import apiClient from '../services/api';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Coba ambil dari localStorage saat pertama kali load
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials) {
      try {
        const response = await apiClient.post('/users/login', credentials);
        const { token, user } = response.data;

        // Simpan ke state
        this.token = token;
        this.user = user;

        // Simpan ke localStorage agar tidak hilang saat refresh
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Arahkan ke dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        // Anda bisa melempar error lagi untuk ditangani di komponen
        throw error;
      }
    },
    logout() {
      // Hapus semua data
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Arahkan ke halaman login
      router.push('/login');
    },
  },
});