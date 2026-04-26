<template>
    <nav class="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left Side -->
          <div class="flex items-center">
            <!-- Sidebar Toggle -->
            <button
              @click="$emit('toggle-sidebar')"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <Bars3Icon class="h-6 w-6" />
            </button>
            
            <!-- Logo -->
            <div class="flex items-center ml-4">
              <img src="@/assets/images/logo.svg" alt="Logo" class="h-8 w-auto" />
              <span class="ml-2 text-xl font-bold text-gray-900">
                {{ t('app.name') }}
              </span>
            </div>
          </div>
  
          <!-- Right Side -->
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <!-- Language Switcher -->
            <button
              @click="toggleLanguage"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <LanguageIcon class="h-6 w-6" />
              <span class="ml-1 text-sm">{{ currentLocale === 'en' ? 'AR' : 'EN' }}</span>
            </button>
  
            <!-- Notifications -->
            <div class="relative">
              <button
                @click="showNotifications = !showNotifications"
                class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative"
              >
                <BellIcon class="h-6 w-6" />
                <span 
                  v-if="unreadCount > 0"
                  class="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
                >
                  {{ unreadCount }}
                </span>
              </button>
              
              <!-- Notifications Dropdown -->
              <transition name="dropdown">
                <div
                  v-if="showNotifications"
                  v-click-outside="closeNotifications"
                  class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                  <div class="p-4 border-b border-gray-200">
                    <h3 class="font-semibold">{{ t('notifications.title') }}</h3>
                  </div>
                  <div class="max-h-96 overflow-y-auto">
                    <div
                      v-for="notification in notifications"
                      :key="notification.id"
                      class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <p class="text-sm font-medium">{{ notification.title }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ notification.message }}</p>
                      <p class="text-xs text-gray-400 mt-1">{{ notification.time }}</p>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
  
            <!-- User Menu -->
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center space-x-2 rtl:space-x-reverse">
                <img
                  :src="user?.avatar_url || '/default-avatar.png'"
                  alt="User"
                  class="h-8 w-8 rounded-full"
                />
                <span class="text-sm font-medium text-gray-700">
                  {{ user?.full_name || user?.username }}
                </span>
                <ChevronDownIcon class="h-4 w-4 text-gray-400" />
              </MenuButton>
              
              <transition name="dropdown">
                <MenuItems class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[active ? 'bg-gray-50' : '', 'block px-4 py-2 text-sm text-gray-700']"
                    >
                      <UserIcon class="inline h-4 w-4 mr-2" />
                      {{ t('nav.profile') }}
                    </a>
                  </MenuItem>
                  
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[active ? 'bg-gray-50' : '', 'block px-4 py-2 text-sm text-gray-700']"
                    >
                      <CogIcon class="inline h-4 w-4 mr-2" />
                      {{ t('nav.settings') }}
                    </a>
                  </MenuItem>
                  
                  <div class="border-t border-gray-200"></div>
                  
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="handleLogout"
                      :class="[active ? 'bg-gray-50' : '', 'block w-full text-left px-4 py-2 text-sm text-red-600']"
                    >
                      <ArrowRightOnRectangleIcon class="inline h-4 w-4 mr-2" />
                      {{ t('app.logout') }}
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '@/store/modules/auth'
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
  import {
    Bars3Icon,
    BellIcon,
    UserIcon,
    CogIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
    LanguageIcon
  } from '@heroicons/vue/24/outline'
  
  const emit = defineEmits(['toggle-sidebar'])
  
  const { t, locale } = useI18n()
  const authStore = useAuthStore()
  
  const user = computed(() => authStore.user)
  const currentLocale = computed(() => locale.value)
  
  const showNotifications = ref(false)
  const unreadCount = ref(3)
  const notifications = ref([
    {
      id: 1,
      title: 'New task assigned',
      message: 'You have been assigned to Project Alpha',
      time: '5 minutes ago'
    },
    {
      id: 2,
      title: 'Leave request approved',
      message: 'Your leave request has been approved',
      time: '1 hour ago'
    },
    {
      id: 3,
      title: 'New invoice',
      message: 'Invoice #INV-2024-001 has been created',
      time: '2 hours ago'
    }
  ])
  
  const toggleLanguage = () => {
    locale.value = locale.value === 'en' ? 'ar' : 'en'
    localStorage.setItem('locale', locale.value)
    
    // Toggle RTL
    if (locale.value === 'ar') {
      document.body.classList.add('rtl')
      document.body.setAttribute('dir', 'rtl')
    } else {
      document.body.classList.remove('rtl')
      document.body.setAttribute('dir', 'ltr')
    }
  }
  
  const closeNotifications = () => {
    showNotifications.value = false
  }
  
  const handleLogout = async () => {
    await authStore.logout()
  }
  
  // Click outside directive
  const vClickOutside = {
    mounted(el, binding) {
      el.clickOutsideEvent = (event) => {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value()
        }
      }
      document.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted(el) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
  </script>
  
  <style scoped>
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.2s ease;
  }
  
  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  </style>