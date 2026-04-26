<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Navbar -->
      <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      
      <!-- Sidebar -->
      <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
      
      <!-- Main Content -->
      <div 
        class="transition-all duration-300"
        :class="sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'"
      >
        <main class="pt-16 px-4 sm:px-6 lg:px-8 py-8">
          <router-view />
        </main>
      </div>
      
      <!-- Footer -->
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Navbar from '@/components/common/Navbar.vue'
  import Sidebar from '@/components/common/Sidebar.vue'
  import Footer from '@/components/common/Footer.vue'
  
  const sidebarOpen = ref(true)
  </script>