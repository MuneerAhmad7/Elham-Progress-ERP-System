<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <!-- Logo & Title -->
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">
            {{ t('app.name') }}
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            {{ t('auth.login') }}
          </p>
        </div>
  
        <!-- Error Alert -->
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
        >
          {{ error }}
        </div>
  
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label for="email" class="form-label">{{ t('auth.email') }}</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="form-input"
                :placeholder="t('auth.email')"
              />
            </div>
  
            <div>
              <label for="password" class="form-label">{{ t('auth.password') }}</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="form-input"
                :placeholder="t('auth.password')"
              />
            </div>
          </div>
  
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-900">
                {{ t('auth.rememberMe') }}
              </label>
            </div>
  
            <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-500">
              {{ t('auth.forgotPassword') }}
            </a>
          </div>
  
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LoadingSpinner v-if="loading" size="20px" />
            <span v-else>{{ t('auth.signIn') }}</span>
          </button>
        </form>
  
        <!-- Register Link -->
        <p class="text-center text-sm text-gray-600">
          {{ t('auth.dontHaveAccount') }}
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            {{ t('auth.signUp') }}
          </router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '@/store/modules/auth'
  import { useToast } from 'vue-toastification'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  
  const { t } = useI18n()
  const authStore = useAuthStore()
  const toast = useToast()
  
  const form = ref({
    email: 'admin@demo.com',
    password: 'Admin@123',
    remember: false
  })
  
  const loading = ref(false)
  const error = ref(null)
  
  const handleLogin = async () => {
    loading.value = true
    error.value = null
  
    try {
      await authStore.login({
        email: form.value.email,
        password: form.value.password
      })
  
      toast.success(t('auth.loginSuccess'))
    } catch (err) {
      error.value = err.response?.data?.message || t('auth.loginFailed')
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }
  </script>