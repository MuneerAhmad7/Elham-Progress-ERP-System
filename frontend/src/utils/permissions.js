// /**
//  * Permissions Management Utilities
//  */

// import { useAuthStore } from '@/store/modules/auth'

// /**
//  * Check if user has specific permission
//  * @param {String} permission - Permission string (e.g., 'hr.employees.create')
//  * @returns {Boolean} True if user has permission
//  */
// export const hasPermission = (permission) => {
//   const authStore = useAuthStore()
//   return authStore.hasPermission(permission)
// }

// /**
//  * Check if user has any of the specified permissions
//  * @param {Array} permissions - Array of permission strings
//  * @returns {Boolean} True if user has at least one permission
//  */
// export const hasAnyPermission = (permissions) => {
//   const authStore = useAuthStore()
//   return permissions.some(permission => authStore.hasPermission(permission))
// }

// /**
//  * Check if user has all specified permissions
//  * @param {Array} permissions - Array of permission strings
//  * @returns {Boolean} True if user has all permissions
//  */
// export const hasAllPermissions = (permissions) => {
//   const authStore = useAuthStore()
//   return permissions.every(permission => authStore.hasPermission(permission))
// }

// /**
//  * Check if user has a specific role
//  * @param {String} role - Role name
//  * @returns {Boolean} True if user has the role
//  */
// export const hasRole = (role) => {
//   const authStore = useAuthStore()
//   return authStore.userRole === role
// }

// /**
//  * Check if user has any of the specified roles
//  * @param {Array} roles - Array of role names
//  * @returns {Boolean} True if user has at least one role
//  */
// export const hasAnyRole = (roles) => {
//   const authStore = useAuthStore()
//   return roles.includes(authStore.userRole)
// }

// /**
//  * Permission directive for Vue components
//  * Usage: v-permission="'hr.employees.create'"
//  */
// export const permissionDirective = {
//   mounted(el, binding) {
//     const permission = binding.value
    
//     if (!hasPermission(permission)) {
//       el.style.display = 'none'
//     }
//   }
// }

// /**
//  * Role directive for Vue components
//  * Usage: v-role="'admin'"
//  */
// export const roleDirective = {
//   mounted(el, binding) {
//     const role = binding.value
    
//     if (!hasRole(role)) {
//       el.style.display = 'none'
//     }
//   }
// }

// /**
//  * Permission module definitions
//  */
// export const PERMISSIONS = {
//   // HR Permissions
//   HR: {
//     EMPLOYEES: {
//       VIEW: 'hr.employees.view',
//       CREATE: 'hr.employees.create',
//       EDIT: 'hr.employees.edit',
//       DELETE: 'hr.employees.delete'
//     },
//     ATTENDANCE: {
//       VIEW: 'hr.attendance.view',
//       MANAGE: 'hr.attendance.manage',
//       APPROVE: 'hr.attendance.approve'
//     },
//     LEAVES: {
//       VIEW: 'hr.leaves.view',
//       CREATE: 'hr.leaves.create',
//       APPROVE: 'hr.leaves.approve',
//       REJECT: 'hr.leaves.reject'
//     },
//     PAYROLL: {
//       VIEW: 'hr.payroll.view',
//       PROCESS: 'hr.payroll.process',
//       APPROVE: 'hr.payroll.approve'
//     }
//   },
  
//   // Finance Permissions
//   FINANCE: {
//     ACCOUNTS: {
//       VIEW: 'finance.accounts.view',
//       CREATE: 'finance.accounts.create',
//       EDIT: 'finance.accounts.edit',
//       DELETE: 'finance.accounts.delete'
//     },
//     JOURNAL: {
//       VIEW: 'finance.journal.view',
//       CREATE: 'finance.journal.create',
//       POST: 'finance.journal.post',
//       APPROVE: 'finance.journal.approve'
//     },
//     INVOICES: {
//       VIEW: 'finance.invoices.view',
//       CREATE: 'finance.invoices.create',
//       EDIT: 'finance.invoices.edit',
//       DELETE: 'finance.invoices.delete'
//     },
//     REPORTS: {
//       VIEW: 'finance.reports.view',
//       EXPORT: 'finance.reports.export'
//     }
//   },
  
//   // CRM Permissions
//   CRM: {
//     LEADS: {
//       VIEW: 'crm.leads.view',
//       CREATE: 'crm.leads.create',
//       EDIT: 'crm.leads.edit',
//       DELETE: 'crm.leads.delete',
//       CONVERT: 'crm.leads.convert'
//     },
//     ACCOUNTS: {
//       VIEW: 'crm.accounts.view',
//       CREATE: 'crm.accounts.create',
//       EDIT: 'crm.accounts.edit',
//       DELETE: 'crm.accounts.delete'
//     },
//     OPPORTUNITIES: {
//       VIEW: 'crm.opportunities.view',
//       CREATE: 'crm.opportunities.create',
//       EDIT: 'crm.opportunities.edit',
//       DELETE: 'crm.opportunities.delete'
//     }
//   },
  
//   // Projects Permissions
//   PROJECTS: {
//     VIEW: 'projects.view',
//     CREATE: 'projects.create',
//     EDIT: 'projects.edit',
//     DELETE: 'projects.delete',
//     APPROVE: 'projects.approve',
//     FINANCIALS: 'projects.financials'
//   },
  
//   // Tasks Permissions
//   TASKS: {
//     VIEW: 'tasks.view',
//     CREATE: 'tasks.create',
//     EDIT: 'tasks.edit',
//     DELETE: 'tasks.delete',
//     ASSIGN: 'tasks.assign'
//   }
// }

// /**
//  * Default role permissions
//  */
// export const ROLE_PERMISSIONS = {
//   'Super Admin': ['all'],
//   'HR Manager': ['hr.*'],
//   'Accountant': ['finance.*'],
//   'Sales Manager': ['crm.*'],
//   'Project Manager': ['projects.*', 'tasks.*'],
//   'Employee': ['tasks.view', 'tasks.create', 'hr.attendance.view', 'hr.leaves.create']
// }

// export default {
//   hasPermission,
//   hasAnyPermission,
//   hasAllPermissions,
//   hasRole,
//   hasAnyRole,
//   permissionDirective,
//   roleDirective,
//   PERMISSIONS,
//   ROLE_PERMISSIONS
// }


// src/utils/permissions.js

export const permissionDirective = {
  mounted(el, binding) {
    const { value } = binding
    const userPermissions = JSON.parse(localStorage.getItem('permissions') || '[]')
    
    if (value && !userPermissions.includes(value)) {
      el.style.display = 'none'
    }
  }
}

export const roleDirective = {
  mounted(el, binding) {
    const { value } = binding
    const userRole = localStorage.getItem('role') || ''
    
    if (value && !value.includes(userRole)) {
      el.style.display = 'none'
    }
  }
}