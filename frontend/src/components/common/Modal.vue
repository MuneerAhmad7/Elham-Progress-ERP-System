<template>
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="modelValue"
          class="fixed inset-0 z-50 overflow-y-auto"
          @click.self="closeModal"
        >
          <!-- Overlay -->
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
  
          <!-- Modal Container -->
          <div class="flex min-h-screen items-center justify-center p-4">
            <div
              class="relative bg-white rounded-lg shadow-xl transform transition-all"
              :class="sizeClass"
              @click.stop
            >
              <!-- Header -->
              <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
                <button
                  @click="closeModal"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>
  
              <!-- Body -->
              <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
                <slot />
              </div>
  
              <!-- Footer -->
              <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <slot name="footer" />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { XMarkIcon } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large', 'xl'].includes(value)
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const sizeClass = computed(() => {
    const sizes = {
      small: 'w-full max-w-md',
      medium: 'w-full max-w-lg',
      large: 'w-full max-w-2xl',
      xl: 'w-full max-w-4xl'
    }
    return sizes[props.size]
  })
  
  const closeModal = () => {
    if (props.closeOnOverlay) {
      emit('update:modelValue', false)
    }
  }
  </script>
  
  <style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  
  .modal-enter-active .relative,
  .modal-leave-active .relative {
    transition: transform 0.3s ease;
  }
  
  .modal-enter-from .relative,
  .modal-leave-to .relative {
    transform: scale(0.95);
  }
  </style>