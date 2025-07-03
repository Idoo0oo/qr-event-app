<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-800">Admin Login</h1>
        <p class="text-gray-500">Welcome to QR Event Management</p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {{ errorMessage }}
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
          <input v-model="email" type="email" id="email" required class="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" id="password" required class="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <button type="submit" :disabled="isLoading" class="w-full py-2.5 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
          <span v-if="isLoading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    // Navigasi sudah dihandle di dalam action store
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Login failed. Please check your credentials.';
  } finally {
    isLoading.value = false;
  }
};
</script>