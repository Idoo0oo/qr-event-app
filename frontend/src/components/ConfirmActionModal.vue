<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="p-6 text-center">
            
            <div class="w-16 h-16 mx-auto flex items-center justify-center bg-red-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>

            <h3 class="text-2xl font-bold text-gray-800">{{ title }}</h3>
            <p class="text-gray-600 mt-2">
              {{ message }}
            </p>

          </div>
          
          <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <button @click="$emit('cancel')" class="px-6 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-semibold">
              Cancel
            </button>
            <button @click="$emit('confirm')" class="px-6 py-2 bg-red-600 border border-red-600 rounded-md text-white hover:bg-red-700 font-semibold">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: 'Are you sure?'
  },
  message: {
    type: String,
    default: 'This action cannot be undone.'
  }
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>