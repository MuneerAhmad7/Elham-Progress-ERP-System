<template>
    <div class="overflow-x-auto">
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th>Task</th>
            <th>Progress</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ item.task }}</td>
            <td>
              <progress class="progress progress-primary w-32" :value="item.progress" max="100"></progress>
              <span class="ml-2 text-sm">{{ item.progress }}%</span>
            </td>
            <td>
              <span class="badge" :class="statusClass(item.status)">{{ item.status }}</span>
            </td>
            <td>{{ item.dueDate }}</td>
          </tr>
          <tr v-if="!items || items.length === 0">
            <td colspan="4" class="text-center text-gray-400 py-4">No progress data available</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  defineProps({
    items: {
      type: Array,
      default: () => []
    }
  })
  
  const statusClass = (status) => {
    const classes = {
      completed: 'badge-success',
      'in-progress': 'badge-warning',
      pending: 'badge-ghost',
      delayed: 'badge-error'
    }
    return classes[status] || 'badge-ghost'
  }
  </script>