<template>
  <div class="relative w-screen h-screen bg-black text-white flex flex-col items-center justify-center">
    <div v-if="scanResult" :class="resultColorClass" class="absolute inset-0 z-20 flex items-center justify-center text-center p-4 transition-opacity duration-300">
      <div>
        <h1 class="text-5xl md:text-7xl font-bold mb-4 uppercase">{{ resultTitle }}</h1>
        <p v-if="scanResult.data?.name" class="text-2xl md:text-4xl font-light">{{ scanResult.data.name }}</p>
        <p class="text-lg md:text-xl text-white/80">{{ resultMessage }}</p>
        <button @click="resetScanner" class="mt-8 px-8 py-3 bg-white text-black rounded-lg font-bold text-lg hover:bg-gray-200">
          Scan Again
        </button>
      </div>
    </div>

    <div v-if="!scanResult" class="w-full h-full">
      <p v-if="error" class="absolute top-5 left-5 text-white z-10 bg-red-500 bg-opacity-80 p-3 rounded">
        Error: {{ error }}
      </p>
      <qrcode-stream @detect="onDetect" @error="onError" class="w-full h-full"></qrcode-stream>
    </div>

    <router-link to="/dashboard" class="absolute bottom-5 left-5 z-10 px-4 py-2 bg-gray-500 bg-opacity-70 rounded-md hover:bg-gray-600">
      Back to Dashboard
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';
import apiClient from '../services/api';

const scanResult = ref(null);
const error = ref('');
const isProcessing = ref(false); // Flag untuk mencegah scan ganda

// Fungsi ini dipanggil saat QR code terdeteksi
const onDetect = async (detectedCodes) => {
  if (isProcessing.value) return; // Jika sedang proses, abaikan deteksi baru

  isProcessing.value = true;
  const guestId = detectedCodes[0].rawValue;

  try {
    const response = await apiClient.post('/checkin', { guestId });
    scanResult.value = { ...response.data, code: response.status };
  } catch (err) {
    if (err.response) {
      scanResult.value = { ...err.response.data, code: err.response.status };
    } else {
      scanResult.value = { status: 'error', message: 'Network error or server down.', code: 503 };
    }
  }
};

// Fungsi untuk mereset scanner dan kembali ke mode kamera
const resetScanner = () => {
  scanResult.value = null;
  // Beri sedikit jeda agar tidak langsung scan lagi
  setTimeout(() => {
    isProcessing.value = false;
  }, 500);
};

const onError = (err) => {
  error.value = err.name;
  if (err.name === 'NotAllowedError') {
    error.value = 'You need to grant camera access permission.';
  } else if (err.name === 'NotFoundError') {
    error.value = 'No camera on this device found.';
  } // ... handle error lainnya
};

// Computed property untuk menentukan judul hasil scan
const resultTitle = computed(() => {
  if (!scanResult.value) return '';
  switch (scanResult.value.code) {
    case 200: return 'Welcome';
    case 409: return 'Attention';
    default: return 'Invalid';
  }
});

// Computed property untuk menentukan pesan detail
const resultMessage = computed(() => scanResult.value?.message || 'An unknown error occurred.');

// Computed property untuk menentukan warna background overlay
const resultColorClass = computed(() => {
  if (!scanResult.value) return 'bg-transparent';
  switch (scanResult.value.code) {
    case 200: return 'bg-green-500'; // Success
    case 409: return 'bg-yellow-500'; // Conflict / Already checked-in
    default: return 'bg-red-600'; // Not Found / Error
  }
});
</script>