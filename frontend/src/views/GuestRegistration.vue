<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-800">GadingPro Awards VII</h1>
        <p class="text-gray-500">Fill in your details to get your QR code invitation.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6" v-if="!isSuccess">
        <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {{ errorMessage }}
        </div>
        
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nama Panggung</label>
          <input v-model="form.name" type="text" id="name" required class="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email Address <span class="text-xs">(Email Aktif)</span></label>
          <input v-model="form.email" type="email" id="email" required class="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Category <span class="text-xs">(e.g., Agent, Principle, etc.)</span></label>
          <input v-model="form.category" type="text" id="category" class="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <button type="submit" :disabled="isLoading" class="w-full py-2.5 text-white bg-orange-400 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
          <span v-if="isLoading">Registering...</span>
          <span v-else>Register & Get QR Code</span>
        </button>
      </form>

      <div v-if="isSuccess" class="text-center py-8">
        <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mt-4">Registration Successful!</h2>
        <p class="text-gray-600 mt-2">{{ successMessage }}</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from '../services/api';

const form = ref({
  name: '',
  email: '',
  category: '',
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const isSuccess = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await apiClient.post('/public/register-guest', form.value);
    successMessage.value = response.data.message;
    isSuccess.value = true;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>