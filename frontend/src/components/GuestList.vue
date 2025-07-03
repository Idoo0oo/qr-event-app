<template>
  <div> 
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-700">Guest List</h2>
        <button @click="showAddModal = true" class="flex items-center px-4 py-2 text-white bg-orange-400 rounded-md hover:bg-orange-600 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Add Guest
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-50">
            <tr>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="5" class="py-4 text-center text-gray-500">Loading guests...</td>
            </tr>
            <tr v-else-if="guests.length === 0">
              <td colspan="5" class="py-4 text-center text-gray-500">No guests found. Add one!</td>
            </tr>
            <tr v-for="guest in guests" :key="guest.id" class="hover:bg-gray-50 transition-colors">
              <td class="py-3 px-4 whitespace-nowrap">{{ guest.name }}</td>
              <td class="py-3 px-4 whitespace-nowrap">{{ guest.email }}</td>
              <td class="py-3 px-4 whitespace-nowrap">{{ guest.category || '-' }}</td>
              <td class="py-3 px-4 text-center whitespace-nowrap">
                <span :class="getStatusClass(guest.status)" class="px-3 py-1 text-xs font-semibold rounded-full">
                  {{ guest.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="py-3 px-4 text-center whitespace-nowrap space-x-2">
                <button @click="showGuestDetails(guest)" title="Show QR Code" class="p-2 text-gray-400 hover:text-green-500 rounded-full hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5"></path></svg>
                </button>
                <button @click="editGuest(guest)" title="Edit Guest" class="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button @click="openDeleteModal(guest)" title="Delete Guest" class="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <Teleport to="body">
      <GuestForm 
        v-if="showAddModal || showEditModal" 
        :show="showAddModal || showEditModal"
        :guest="guestToEdit"
        @close="closeModal" 
        @saved="fetchGuests" 
      />
    </Teleport>

    <Teleport to="body">
      <div v-if="selectedGuest" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40" @click.self="selectedGuest = null">
        <div class="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm w-full mx-4">
            <h3 class="text-2xl font-bold mb-2">{{ selectedGuest.name }}</h3>
            <p class="text-gray-600 mb-6">{{ selectedGuest.email }}</p>
            
            <div ref="qrWrapperRef" class="inline-block">
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
    </Teleport>

    <ConfirmActionModal
      :show="showDeleteModal"
      title="Delete Guest"
      :message="`Are you sure you want to delete ${guestToDelete?.name}? This data will be permanently removed.`"
      @confirm="handleDelete"
      @cancel="closeDeleteModal"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'; 
import apiClient from '../services/api';
import GuestForm from './GuestForm.vue';
import QrcodeVue from 'qrcode.vue';
// [BARU] Import komponen modal yang baru
import ConfirmActionModal from './ConfirmActionModal.vue';

const guests = ref([]);
const isLoading = ref(true);
const showAddModal = ref(false);
const showEditModal = ref(false);
const guestToEdit = ref(null);
const selectedGuest = ref(null);
const qrWrapperRef = ref(null); 
const canShare = computed(() => !!navigator.share);

// [BARU] State untuk mengontrol modal delete
const showDeleteModal = ref(false);
const guestToDelete = ref(null);

const openDeleteModal = (guest) => {
  guestToDelete.value = guest;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  guestToDelete.value = null;
};

const handleDelete = async () => {
  if (!guestToDelete.value) return;

  try {
    await apiClient.delete(`/guests/${guestToDelete.value.id}`);
    fetchGuests(); // Refresh daftar setelah berhasil hapus
  } catch (error) {
    console.error('Failed to delete guest:', error);
    alert('Failed to delete guest.');
  } finally {
    closeDeleteModal(); // Tutup modal setelah selesai
  }
};

// ... (sisa fungsi lainnya tetap sama) ...
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

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  guestToEdit.value = null;
};

onMounted(() => {
  closeModal();
  selectedGuest.value = null;
  fetchGuests();
});
</script>