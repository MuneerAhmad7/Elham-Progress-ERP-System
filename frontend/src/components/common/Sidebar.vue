<template>
    <!-- Backdrop for mobile -->
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
    ></div>
    
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="h-full px-3 pb-4 overflow-y-auto">
        <ul class="space-y-2 font-medium">
          <!-- Dashboard -->
          <li>
            <router-link
              to="/"
              class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              active-class="bg-blue-100 text-primary"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              <span class="ml-3">{{ $t('nav.dashboard') }}</span>
            </router-link>
          </li>
          
          <!-- HR Module -->
          <li>
            <button
              @click="toggleSection('hr')"
              class="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
              </svg>
              <span class="flex-1 ml-3 text-left whitespace-nowrap">{{ $t('nav.hr') }}</span>
              <svg class="w-3 h-3" :class="{ 'rotate-180': openSections.hr }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <ul v-if="openSections.hr" class="py-2 space-y-2 ml-8">
              <li>
                <router-link to="/hr/employees" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.employees') }}
                </router-link>
              </li>
              <li>
                <router-link to="/hr/attendance" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.attendance') }}
                </router-link>
              </li>
              <li>
                <router-link to="/hr/leaves" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.leaves') }}
                </router-link>
              </li>
              <li>
                <router-link to="/hr/payroll" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.payroll') }}
                </router-link>
              </li>
            </ul>
          </li>
          
          <!-- Finance Module -->
          <li>
            <button
              @click="toggleSection('finance')"
              class="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"></path>
              </svg>
              <span class="flex-1 ml-3 text-left whitespace-nowrap">{{ $t('nav.finance') }}</span>
              <svg class="w-3 h-3" :class="{ 'rotate-180': openSections.finance }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <ul v-if="openSections.finance" class="py-2 space-y-2 ml-8">
              <li>
                <router-link to="/finance/accounts" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.accounts') }}
                </router-link>
              </li>
              <li>
                <router-link to="/finance/journal-entries" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.journal') }}
                </router-link>
              </li>
              <li>
                <router-link to="/finance/invoices" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.invoices') }}
                </router-link>
              </li>
              <li>
                <router-link to="/finance/reports" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.reports') }}
                </router-link>
              </li>
            </ul>
          </li>
          
          <!-- CRM Module -->
          <li>
            <button
              @click="toggleSection('crm')"
              class="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
              <span class="flex-1 ml-3 text-left whitespace-nowrap">{{ $t('nav.crm') }}</span>
              <svg class="w-3 h-3" :class="{ 'rotate-180': openSections.crm }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <ul v-if="openSections.crm" class="py-2 space-y-2 ml-8">
              <li>
                <router-link to="/crm/leads" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.leads') }}
                </router-link>
              </li>
              <li>
                <router-link to="/crm/accounts" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.crmAccounts') }}
                </router-link>
              </li>
              <li>
                <router-link to="/crm/contacts" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.contacts') }}
                </router-link>
              </li>
              <li>
                <router-link to="/crm/opportunities" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.opportunities') }}
                </router-link>
              </li>
            </ul>
          </li>
          
          <!-- Projects -->
          <li>
            <router-link
              to="/projects"
              class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              active-class="bg-blue-100 text-primary"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
              </svg>
              <span class="ml-3">{{ $t('nav.projects') }}</span>
            </router-link>
          </li>
          
          <!-- Tasks -->
          <li>
            <button
              @click="toggleSection('tasks')"
              class="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
              </svg>
              <span class="flex-1 ml-3 text-left whitespace-nowrap">{{ $t('nav.tasks') }}</span>
              <svg class="w-3 h-3" :class="{ 'rotate-180': openSections.tasks }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <ul v-if="openSections.tasks" class="py-2 space-y-2 ml-8">
              <li>
                <router-link to="/tasks" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.tasks') }}
                </router-link>
              </li>
              <li>
                <router-link to="/tasks/board" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" active-class="bg-blue-100 text-primary">
                  {{ $t('nav.taskBoard') }}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </aside>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  defineProps({
    isOpen: {
      type: Boolean,
      required: true
    }
  })
  
  defineEmits(['close'])
  
  const openSections = ref({
    hr: false,
    finance: false,
    crm: false,
    tasks: false
  })
  
  const toggleSection = (section) => {
    openSections.value[section] = !openSections.value[section]
  }
  </script>