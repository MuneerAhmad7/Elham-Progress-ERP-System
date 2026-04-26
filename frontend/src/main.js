// import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import router from './router'
// import i18n from './i18n'
// import App from './App.vue'

// // Styles
// import './assets/styles/main.css'

// // Toast Notifications
// import Toast from 'vue-toastification'
// import 'vue-toastification/dist/index.css'

// // Apex Charts
// import VueApexCharts from 'vue3-apexcharts'

// // Vue Use
// import { VueUse } from '@vueuse/components'

// // Permissions Directive
// import { permissionDirective, roleDirective } from './utils/permissions'

// // Error Handler
// const errorHandler = (err, instance, info) => {
//   console.error('Global error:', err)
//   console.error('Component:', instance)
//   console.error('Error info:', info)
  
//   // Send to error tracking service (e.g., Sentry)
//   if (window.Sentry) {
//     window.Sentry.captureException(err)
//   }
// }

// // Create App
// const app = createApp(App)

// // Global Error Handler
// app.config.errorHandler = errorHandler

// // Performance Monitoring
// app.config.performance = import.meta.env.DEV

// // Global Properties
// app.config.globalProperties.$filters = {
//   currency(value) {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'SAR'
//     }).format(value || 0)
//   },
//   date(value) {
//     if (!value) return ''
//     return new Date(value).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     })
//   }
// }

// // Use Plugins
// app.use(createPinia())
// app.use(router)
// app.use(i18n)
// app.use(Toast, {
//   position: 'top-right',
//   timeout: 3000,
//   closeOnClick: true,
//   pauseOnFocusLoss: true,
//   pauseOnHover: true,
//   draggable: true,
//   draggablePercent: 0.6,
//   showCloseButtonOnHover: false,
//   hideProgressBar: false,
//   closeButton: 'button',
//   icon: true,
//   rtl: false,
//   transition: 'Vue-Toastification__fade',
//   maxToasts: 5,
//   newestOnTop: true
// })
// app.use(VueApexCharts)

// // Register Global Directives
// app.directive('permission', permissionDirective)
// app.directive('role', roleDirective)

// // Register Global Components
// app.component('apexchart', VueApexCharts)

// // Mount App
// app.mount('#app')

// // Service Worker Registration (PWA)
// if ('serviceWorker' in navigator && import.meta.env.PROD) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js').then(
//       (registration) => {
//         console.log('SW registered:', registration)
//       },
//       (error) => {
//         console.log('SW registration failed:', error)
//       }
//     )
//   })
// }

// // Handle unhandled promise rejections
// window.addEventListener('unhandledrejection', (event) => {
//   console.error('Unhandled promise rejection:', event.reason)
//   if (window.Sentry) {
//     window.Sentry.captureException(event.reason)
//   }
// })

// // Log app info in development
// if (import.meta.env.DEV) {
//   console.log('🚀 Enterprise ERP System')
//   console.log('📦 Version:', import.meta.env.VITE_APP_VERSION || '1.0.0')
//   console.log('🌍 Environment:', import.meta.env.MODE)
//   console.log('🔌 API URL:', import.meta.env.VITE_API_URL)
// }


// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './i18n'
import App from './App.vue'

// Styles
import './assets/styles/main.css'

// Toast Notifications
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Apex Charts
import VueApexCharts from 'vue3-apexcharts'

// Permissions Directive
import { permissionDirective, roleDirective } from './utils/permissions'

// Error Handler
const errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Component:', instance)
  console.error('Error info:', info)
}

// Create App
const app = createApp(App)

// Global Error Handler
app.config.errorHandler = errorHandler

// Performance Monitoring
app.config.performance = import.meta.env.DEV

// Global Properties
app.config.globalProperties.$filters = {
  currency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(value || 0)
  },
  date(value) {
    if (!value) return ''
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

// Use Plugins
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__fade',
  maxToasts: 5,
  newestOnTop: true
})
app.use(VueApexCharts)

// Register Global Directives
app.directive('permission', permissionDirective)
app.directive('role', roleDirective)

// Register Global Components
app.component('apexchart', VueApexCharts)

// Mount App
app.mount('#app')

// Log app info in development
if (import.meta.env.DEV) {
  console.log('🚀 Enterprise ERP System')
  console.log('📦 Version:', import.meta.env.VITE_APP_VERSION || '1.0.0')
  console.log('🌍 Environment:', import.meta.env.MODE)
}