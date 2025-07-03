<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click.self="$emit('close')">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
      <h2 class="text-2xl font-bold mb-6">{{ isEditing ? 'Edit Guest' : 'Add New Guest' }}</h2>
      <form @submit.prevent="saveGuest">
        <div class="mb-4">
          <label for="name" class="block text-gray-700">Full Name</label>
          <input v-model="form.name" type="text" id="name" required class="w-full px-3 py-2 border rounded-md">
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-700">Email</label>
          <input v-model="form.email" type="email" id="email" required class="w-full px-3 py-2 border rounded-md">
        </div>
        <div class="mb-6">
          <label for="category" class="block text-gray-700">Category (optional)</label>
          <input v-model="form.category" type="text" id="category" class="w-full px-3 py-2 border rounded-md">
        </div>
        <div class="flex justify-end space-x-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" :disabled="isSaving" class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import apiClient from '../services/api';

const props = defineProps({
  show: Boolean,
  guest: Object,
});

const emit = defineEmits(['close', 'saved']);

const form = ref({
  name: '',
  email: '',
  category: '',
});
const isSaving = ref(false);

const isEditing = computed(() => !!props.guest);

watch(() => props.guest, (newGuest) => {
  if (newGuest) {
    form.value = { ...newGuest };
  } else {
    form.value = { name: '', email: '', category: '' };
  }
}, { immediate: true });

const saveGuest = async () => {
  isSaving.value = true;
  try {
    if (isEditing.value) {
      // Update guest
      await apiClient.put(`/guests/${props.guest.id}`, form.value);
    } else {
      // Create new guest
      await apiClient.post('/guests', form.value);
    }
    emit('saved');
    emit('close');
  } catch (error) {
    console.error('Failed to save guest:', error);
    alert('Error saving guest. Check console for details.');
  } finally {
    isSaving.value = false;
  }
};
</script>