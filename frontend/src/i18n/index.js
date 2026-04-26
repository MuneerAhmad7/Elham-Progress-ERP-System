// import { createI18n } from 'vue-i18n'

// import en from '@/locales/en.json'
// import ar from '@/locales/ar.json'

// const i18n = createI18n({
//   legacy: false,
//   locale: localStorage.getItem('locale') || 'en',
//   fallbackLocale: 'en',
//   messages: {
//     en,
//     ar
//   }
// })

// export default i18n

// src/i18n/index.js
import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      loading: 'Loading...',
      noData: 'No data available',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      success: 'Success',
      error: 'Error',
      warning: 'Warning'
    },
    nav: {
      dashboard: 'Dashboard',
      hr: 'Human Resources',
      finance: 'Finance',
      crm: 'CRM',
      projects: 'Projects',
      tasks: 'Tasks',
      settings: 'Settings'
    },
    auth: {
      login: 'Login',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me'
    }
  },
  ar: {
    common: {
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة',
      search: 'بحث',
      loading: 'جاري التحميل...',
      noData: 'لا توجد بيانات',
      confirm: 'تأكيد',
      yes: 'نعم',
      no: 'لا',
      success: 'نجاح',
      error: 'خطأ',
      warning: 'تحذير'
    },
    nav: {
      dashboard: 'لوحة التحكم',
      hr: 'الموارد البشرية',
      finance: 'المالية',
      crm: 'إدارة العملاء',
      projects: 'المشاريع',
      tasks: 'المهام',
      settings: 'الإعدادات'
    },
    auth: {
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      rememberMe: 'تذكرني'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n