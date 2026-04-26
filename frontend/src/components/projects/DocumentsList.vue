<template>
    <div>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Documents</h3>
        <button class="btn btn-sm btn-primary">Upload Document</button>
      </div>
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(doc, index) in documents" :key="index">
              <td>{{ doc.name }}</td>
              <td>{{ doc.type }}</td>
              <td>{{ doc.size }}</td>
              <td>{{ doc.uploadedAt }}</td>
              <td>
                <button class="btn btn-xs btn-ghost">Download</button>
                <button class="btn btn-xs btn-error">Delete</button>
              </td>
            </tr>
            <tr v-if="!documents || documents.length === 0">
              <td colspan="5" class="text-center text-gray-400 py-4">No documents uploaded</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    documents: {
      type: Array,
      default: () => []
    }
  })
  </script>