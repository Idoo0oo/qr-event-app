<template>
  <div class="relative min-h-screen md:flex">
    
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false" 
      class="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
    ></div>

    <div 
      :class="['fixed', 'inset-y-0', 'left-0', 'transform', 'md:relative', 'md:translate-x-0', 'transition-transform', 'duration-300', 'ease-in-out', 'w-64', 'bg-gray-800', 'z-30', { 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }]"
    >
      <div class="flex items-center justify-center h-16 bg-gray-900 px-4">
        <img 
          :src="logo" 
          alt="Gading Pro Logo"
          class="h-10 object-contain"
        >
      </div>
      <div class="flex flex-col flex-1 overflow-y-auto">
        <nav class="flex-1 px-2 py-4 bg-gray-800">
          <router-link to="/dashboard" @click="isSidebarOpen = false" class="flex items-center px-4 py-2 text-gray-100 bg-gray-700 rounded-md">
            <span class="mx-4">Dashboard</span>
          </router-link>
          <router-link to="/scanner" @click="isSidebarOpen = false" class="flex items-center px-4 py-2 mt-4 text-gray-400 hover:bg-gray-700 hover:text-gray-100 rounded-md">
            <span class="mx-4">QR Scanner</span>
          </router-link>
        </nav>
      </div>
    </div>

    <div class="flex flex-col flex-1">
      <div class="flex items-center justify-between h-16 bg-white border-b border-gray-200">
        <div class="flex items-center px-4">
          
          <button @click="isSidebarOpen = !isSidebarOpen" class="text-gray-500 focus:outline-none md:hidden">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>

          <h1 class="text-xl md:text-2xl font-bold text-gray-800 ml-3 md:ml-0">Guest Dashboard</h1>
        </div>
        <div class="flex items-center pr-4">
          
          <span class="hidden md:inline text-gray-600 mr-4">Welcome, {{ authStore.user?.fullName }}</span>

          <button @click="authStore.logout()" class="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
      <div class="p-4 md:p-8 overflow-y-auto">
        <GuestList />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import GuestList from '../components/GuestList.vue';
import logo from '../assets/GadingPro.png';

const authStore = useAuthStore();

// [BARU] State untuk mengontrol status buka/tutup sidebar di mobile
const isSidebarOpen = ref(false);
</script>