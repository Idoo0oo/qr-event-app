<template>
  <div v-if="isLoading" class="text-center text-gray-500">Loading stats...</div>
  <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    
    <div class="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4">
      <div class="bg-blue-100 p-3 rounded-full">
        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
      </div>
      <div>
        <p class="text-sm text-gray-500">Total Tamu</p>
        <p class="text-2xl font-bold text-gray-800">{{ stats.totalGuests }}</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4">
      <div class="bg-green-100 p-3 rounded-full">
         <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <div>
        <p class="text-sm text-gray-500">Sudah Check-in</p>
        <p class="text-2xl font-bold text-gray-800">{{ stats.checkedInCount }}</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4">
      <div class="bg-yellow-100 p-3 rounded-full">
        <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <div>
        <p class="text-sm text-gray-500">Menunggu</p>
        <p class="text-2xl font-bold text-gray-800">{{ stats.waitingCount }}</p>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-2xl shadow-md">
      <p class="text-sm text-gray-500">Tingkat Kehadiran</p>
      <div class="flex items-center justify-between">
        <p class="text-2xl font-bold text-gray-800">{{ attendancePercentage }}%</p>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div class="bg-blue-500 h-2.5 rounded-full" :style="{ width: attendancePercentage + '%' }"></div>
      </div>
    </div>

  </div>
  <div v-else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-lg">{{ error }}</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiClient from '../services/api';

const stats = ref(null);
const isLoading = ref(true);
const error = ref('');

const fetchStats = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const response = await apiClient.get('/dashboard/stats');
    stats.value = response.data;
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err);
    error.value = 'Could not load event statistics.';
  } finally {
    isLoading.value = false;
  }
};

const attendancePercentage = computed(() => {
  if (!stats.value || stats.value.totalGuests === 0) {
    return 0;
  }
  return Math.round((stats.value.checkedInCount / stats.value.totalGuests) * 100);
});

onMounted(fetchStats);
</script>