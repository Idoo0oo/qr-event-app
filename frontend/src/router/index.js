import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Import Views (Halaman)
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Scanner from '../views/Scanner.vue'; // Kita buat di Bagian 3
import NotFound from '../views/NotFound.vue';
import GuestRegistration from '../views/GuestRegistration.vue';

const routes = [
  {
    path: '/register',
    name: 'GuestRegistration',
    component: GuestRegistration,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }, // Rute ini butuh login
  },
  {
    path: '/scanner',
    name: 'Scanner',
    component: Scanner,
    // Rute ini bisa dibuat publik atau dilindungi, sesuai kebutuhan
  },
  {
    path: '/',
    redirect: '/dashboard', // Arahkan halaman utama ke dashboard
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: NotFound 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard: Pelindung rute
// Sebelum masuk ke rute manapun, fungsi ini akan dijalankan
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Jika rute butuh login dan user belum login, tendang ke halaman login
    next({ name: 'Login' });
  } else {
    // Jika tidak, biarkan dia lewat
    next();
  }
});

export default router;