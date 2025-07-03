import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const apiClient = axios.create({
  baseURL: '/api', // Menunjuk ke server Express.js kita
});

// Interceptor: Bagian ini secara otomatis menambahkan Token otorisasi
// ke setiap request jika user sudah login. Ajaib!
apiClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;