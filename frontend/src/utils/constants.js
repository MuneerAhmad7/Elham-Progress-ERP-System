/**
 * Application Constants
 */

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me'
  },
  
  HR: {
    EMPLOYEES: '/hr/employees',
    ATTENDANCE: '/hr/attendance',
    LEAVES: '/hr/leaves',
    PAYROLL: '/hr/payroll'
  },
  
  FINANCE: {
    ACCOUNTS: '/finance/accounts',
    JOURNAL: '/finance/journal-entries',
    INVOICES: '/finance/invoices',
    PAYMENTS: '/finance/payments',
    REPORTS: '/finance/reports'
  },
  
  CRM: {
    LEADS: '/crm/leads',
    ACCOUNTS: '/crm/accounts',
    CONTACTS: '/crm/contacts',
    OPPORTUNITIES: '/crm/opportunities'
  },
  
  PROJECTS: {
    PROJECTS: '/projects',
    BOQ: '/projects/:id/boq',
    CLAIMS: '/projects/:id/claims'
  },
  
  TASKS: {
    TASKS: '/tasks',
    BOARDS: '/tasks/boards',
    COMMENTS: '/tasks/:id/comments'
  }
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  FULL: 'MMMM dd, yyyy',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm'
}

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['jpg', 'jpeg', 'png', 'gif'],
    DOCUMENTS: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
    ALL: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx']
  }
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
}

// Status Options
export const STATUS_OPTIONS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DRAFT: 'draft'
}

// Priority Options
export const PRIORITY_OPTIONS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
}

// Saudi Cities
export const SAUDI_CITIES = [
  'Riyadh',
  'Jeddah',
  'Mecca',
  'Medina',
  'Dammam',
  'Khobar',
  'Dhahran',
  'Jubail',
  'Tabuk',
  'Abha',
  'Khamis Mushait',
  'Najran',
  'Jazan',
  'Hail',
  'Al Qassim',
  'Al Kharj',
  'Yanbu',
  'Taif'
]

// Nationalities
export const NATIONALITIES = [
  'Saudi',
  'Egyptian',
  'Indian',
  'Pakistani',
  'Bangladeshi',
  'Filipino',
  'Yemeni',
  'Syrian',
  'Jordanian',
  'Sudanese'
]

// Industries
export const INDUSTRIES = [
  'Technology',
  'Construction',
  'Healthcare',
  'Education',
  'Retail',
  'Manufacturing',
  'Finance',
  'Real Estate',
  'Hospitality',
  'Transportation'
]

// Employment Types
export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  TEMPORARY: 'temporary',
  INTERN: 'intern'
}

// Leave Types
export const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  EMERGENCY: 'emergency',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  UNPAID: 'unpaid'
}

// Account Types
export const ACCOUNT_TYPES = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  EQUITY: 'equity',
  REVENUE: 'revenue',
  EXPENSE: 'expense'
}

// Invoice Types
export const INVOICE_TYPES = {
  SALES: 'sales',
  PURCHASE: 'purchase'
}

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  CHECK: 'check',
  CREDIT_CARD: 'credit_card'
}

export default {
  API_ENDPOINTS,
  DATE_FORMATS,
  FILE_UPLOAD,
  PAGINATION,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  SAUDI_CITIES,
  NATIONALITIES,
  INDUSTRIES,
  EMPLOYMENT_TYPES,
  LEAVE_TYPES,
  ACCOUNT_TYPES,
  INVOICE_TYPES,
  PAYMENT_METHODS
}