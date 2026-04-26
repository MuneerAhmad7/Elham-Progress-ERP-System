<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <!-- Logo & Title -->
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">
            {{ t('app.name') }}
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            {{ t('auth.register') }}
          </p>
        </div>
  
        <!-- Error Alert -->
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm"
        >
          {{ error }}
        </div>
  
        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label for="username" class="form-label">{{ t('auth.username') }}</label>
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="form-input"
                :placeholder="t('auth.username')"
              />
            </div>
  
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
              <label for="full_name" class="form-label">{{ t('auth.fullName') }}</label>
              <input
                id="full_name"
                v-model="form.full_name"
                type="text"
                required
                class="form-input"
                :placeholder="t('auth.fullName')"
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
  
            <div>
              <label for="confirmPassword" class="form-label">{{ t('auth.confirmPassword') }}</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="form-input"
                :placeholder="t('auth.confirmPassword')"
              />
            </div>
          </div>
  
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LoadingSpinner v-if="loading" size="20px" />
            <span v-else>{{ t('auth.signUp') }}</span>
          </button>
        </form>
  
        <!-- Login Link -->
        <p class="text-center text-sm text-gray-600">
          {{ t('auth.alreadyHaveAccount') }}
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            {{ t('auth.signIn') }}
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
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirmPassword: ''
  })
  
  const loading = ref(false)
  const error = ref(null)
  
  const handleRegister = async () => {
    if (form.value.password !== form.value.confirmPassword) {
      error.value = t('auth.passwordMismatch')
      toast.error(error.value)
      return
    }
  
    loading.value = true
    error.value = null
  
    try {
      await authStore.register({
        username: form.value.username,
        email: form.value.email,
        full_name: form.value.full_name,
        password: form.value.password
      })
  
      toast.success(t('auth.registerSuccess'))
    } catch (err) {
      error.value = err.response?.data?.message || t('auth.registerFailed')
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }
  </script>