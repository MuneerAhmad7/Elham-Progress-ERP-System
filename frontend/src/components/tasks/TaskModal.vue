<template>
    <Modal
      v-model="isOpen"
      :title="task ? t('tasks.editTask') : t('tasks.newTask')"
      size="xl"
    >
      <TaskForm
        :task="task"
        @save="handleSave"
        @cancel="handleCancel"
      />
    </Modal>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Modal from '@/components/common/Modal.vue'
  import TaskForm from './TaskForm.vue'
  
  const { t } = useI18n()
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    },
    task: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'save'])
  
  const isOpen = ref(props.modelValue)
  
  watch(() => props.modelValue, (newValue) => {
    isOpen.value = newValue
  })
  
  watch(isOpen, (newValue) => {
    emit('update:modelValue', newValue)
  })
  
  const handleSave = (taskData) => {
    emit('save', taskData)
    isOpen.value = false
  }
  
  const handleCancel = () => {
    isOpen.value = false
  }
  </script>