<template>
    <div class="flex space-x-4 overflow-x-auto pb-4">
      <div
        v-for="stage in stages"
        :key="stage.id"
        class="flex-shrink-0 w-80"
      >
        <!-- Stage Header -->
        <div
          class="bg-gray-100 rounded-t-lg p-4 border-b"
          :style="{ borderTopColor: stage.stage_color || '#3b82f6' }"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">
              {{ stage.stage_name }}
            </h3>
            <span class="badge badge-info">
              {{ getTasksByStage(stage.id).length }}
            </span>
          </div>
        </div>
  
        <!-- Tasks Container -->
        <draggable
          :list="getTasksByStage(stage.id)"
          group="tasks"
          item-key="id"
          class="bg-gray-50 rounded-b-lg p-4 min-h-[500px] space-y-3"
          @change="handleTaskMove"
        >
          <template #item="{ element }">
            <TaskCard
              :task="element"
              @view="$emit('view', element)"
              @edit="$emit('edit', element)"
              @delete="$emit('delete', element)"
            />
          </template>
          
          <template #footer>
            <div
              v-if="getTasksByStage(stage.id).length === 0"
              class="text-center text-gray-500 py-8"
            >
              {{ t('tasks.noTasks') }}
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import draggable from 'vuedraggable'
  import TaskCard from './TaskCard.vue'
  
  const { t } = useI18n()
  
  const props = defineProps({
    tasks: {
      type: Array,
      required: true
    },
    stages: {
      type: Array,
      required: true
    }
  })
  
  const emit = defineEmits(['task-move', 'view', 'edit', 'delete'])
  
  const getTasksByStage = (stageId) => {
    return props.tasks.filter(task => task.stage_id === stageId)
  }
  
  const handleTaskMove = async (event) => {
    if (event.added) {
      const taskId = event.added.element.id
      const newStageId = event.added.element.stage_id
      
      // Update task stage
      emit('task-move', taskId, newStageId)
    }
  }
  </script>