<template>
  <div> 
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-700">Guest List</h2>
        <button @click="showAddModal = true" class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          + Add Guest
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-200">
            <tr>
              <th class="py-3 px-4 text-left">Name</th>
              <th class="py-3 px-4 text-left">Email</th>
              <th class="py-3 px-4 text-left">Category</th>
              <th class="py-3 px-4 text-center">Status</th>
              <th class="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="5" class="py-4 text-center text-gray-500">Loading guests...</td>
            </tr>
            <tr v-else-if="guests.length === 0">
              <td colspan="5" class="py-4 text-center text-gray-500">No guests found. Add one!</td>
            </tr>
            <tr v-for="guest in guests" :key="guest.id" class="border-b hover:bg-gray-50">
              <td class="py-3 px-4">{{ guest.name }}</td>
              <td class="py-3 px-4">{{ guest.email }}</td>
              <td class="py-3 px-4">{{ guest.category || '-' }}</td>
              <td class="py-3 px-4 text-center">
                <span :class="getStatusClass(guest.status)" class="px-3 py-1 text-xs font-semibold rounded-full">
                  {{ guest.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-center space-x-2">
                <button @click="showGuestDetails(guest)" title="Show QR Code" class="p-1 text-green-500 hover:text-green-700">QR</button>
                <button @click="editGuest(guest)" title="Edit Guest" class="p-1 text-blue-500 hover:text-blue-700">Edit</button>
                <button @click="confirmDelete(guest)" title="Delete Guest" class="p-1 text-red-500 hover:text-red-700">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <GuestForm 
      v-if="showAddModal || showEditModal" 
      :show="showAddModal || showEditModal"
      :guest="guestToEdit"
      @close="closeModal" 
      @saved="fetchGuests" 
    />

    <div v-if="selectedGuest" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40" @click.self="selectedGuest = null">
      <div class="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm w-full mx-4">
          <h3 class="text-2xl font-bold mb-2">{{ selectedGuest.name }}</h3>
          <p class="text-gray-600 mb-6">{{ selectedGuest.email }}</p>
          
          <div ref="qrWrapperRef">
            <qrcode-vue :value="selectedGuest.id" :size="250" level="H" />
          </div>

          <p class="text-xs text-gray-500 mt-4 break-all">{{ selectedGuest.id }}</p>
          
          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <button @click="downloadQR" class="w-full py-2.5 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-semibold">
              Download
            </button>
            <button v-if="canShare" @click="shareQR" class="w-full py-2.5 text-white bg-green-600 rounded-md hover:bg-green-700 font-semibold">
              Share
            </button>
          </div>
          
          <button @click="selectedGuest = null" class="mt-3 w-full py-2 bg-gray-200 rounded-md hover:bg-gray-300">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'; 
import apiClient from '../services/api';
import GuestForm from './GuestForm.vue';
import QrcodeVue from 'qrcode.vue';

const guests = ref([]);
const isLoading = ref(true);
const showAddModal = ref(false);
const showEditModal = ref(false);
const guestToEdit = ref(null);
const selectedGuest = ref(null);
// [SOLUSI] 2. Ubah nama ref agar lebih jelas
const qrWrapperRef = ref(null); 
const canShare = computed(() => !!navigator.share);

const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

const getCanvasFromWrapper = () => {
  const wrapper = qrWrapperRef.value;
  if (!wrapper) {
    console.error("QR Code wrapper div not found.");
    return null;
  }
  // Cari elemen canvas DI DALAM wrapper div
  const canvas = wrapper.querySelector('canvas');
  if (!canvas) {
    console.error("Canvas element not found inside the wrapper.");
    return null;
  }
  return canvas;
}

const downloadQR = async () => {
  if (!selectedGuest.value) return;
  await nextTick();

  // [SOLUSI] 3. Gunakan fungsi helper baru untuk mengambil canvas
  const canvas = getCanvasFromWrapper();
  if (!canvas) {
    alert('Error: Could not find QR Code element to download.');
    return;
  }

  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `qr-code-${selectedGuest.value.name.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error during download process:", error);
    alert('Failed to process QR Code for download.');
  }
};

const shareQR = async () => {
    if (!selectedGuest.value || !navigator.share) return;
    await nextTick();

    // [SOLUSI] 3. Gunakan fungsi helper baru untuk mengambil canvas
    const canvas = getCanvasFromWrapper();
    if (!canvas) {
      alert('Error: Could not find QR Code element to share.');
      return;
    }

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const fileName = `qr-code-${selectedGuest.value.name.replace(/\s+/g, '-')}.png`;
      const file = dataURLtoFile(dataUrl, fileName);

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
              files: [file],
              title: `QR Code for ${selectedGuest.value.name}`,
              text: `Here is the QR code invitation for ${selectedGuest.value.name}.`,
          });
      } else {
          alert('This browser does not support sharing files.');
      }
    } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing QR Code:', error);
          alert('Could not share the QR Code.');
        }
    }
};

// ... sisa fungsi tidak berubah ...
const fetchGuests = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.get('/guests');
    guests.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch guests:', error);
    alert('Could not fetch guests. Please check the console.');
  } finally {
    isLoading.value = false;
  }
};
const getStatusClass = (status) => {
  return status === 'checked_in' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
};
const editGuest = (guest) => {
  guestToEdit.value = { ...guest };
  showEditModal.value = true;
};
const showGuestDetails = (guest) => {
    selectedGuest.value = guest;
};
const confirmDelete = async (guest) => {
    if(confirm(`Are you sure you want to delete ${guest.name}? This action cannot be undone.`)) {
        try {
            await apiClient.delete(`/guests/${guest.id}`);
            fetchGuests();
        } catch (error) {
            console.error('Failed to delete guest:', error);
            alert('Failed to delete guest.');
        }
    }
};
const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  guestToEdit.value = null;
};
onMounted(fetchGuests);
</script>