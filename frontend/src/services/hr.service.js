import api from './api'
import { buildQueryString } from '@/utils/api-helpers'

export default {
  // ==================== EMPLOYEES ====================
  
  /**
   * Get all employees
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getEmployees(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/hr/employees?${queryString}`)
    return response.data
  },

  /**
   * Get single employee
   * @param {String} id - Employee ID
   * @returns {Promise}
   */
  async getEmployee(id) {
    const response = await api.get(`/hr/employees/${id}`)
    return response.data
  },

  /**
   * Create new employee
   * @param {Object} employeeData - Employee data
   * @returns {Promise}
   */
  async createEmployee(employeeData) {
    const response = await api.post('/hr/employees', employeeData)
    return response.data
  },

  /**
   * Update employee
   * @param {String} id - Employee ID
   * @param {Object} employeeData - Updated employee data
   * @returns {Promise}
   */
  async updateEmployee(id, employeeData) {
    const response = await api.put(`/hr/employees/${id}`, employeeData)
    return response.data
  },

  /**
   * Delete employee
   * @param {String} id - Employee ID
   * @returns {Promise}
   */
  async deleteEmployee(id) {
    const response = await api.delete(`/hr/employees/${id}`)
    return response.data
  },

  /**
   * Upload employee document
   * @param {String} id - Employee ID
   * @param {FormData} formData - Document form data
   * @returns {Promise}
   */
  async uploadEmployeeDocument(id, formData) {
    const response = await api.post(`/hr/employees/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  /**
   * Get employee documents
   * @param {String} id - Employee ID
   * @returns {Promise}
   */
  async getEmployeeDocuments(id) {
    const response = await api.get(`/hr/employees/${id}/documents`)
    return response.data
  },

  /**
   * Delete employee document
   * @param {String} employeeId - Employee ID
   * @param {String} documentId - Document ID
   * @returns {Promise}
   */
  async deleteEmployeeDocument(employeeId, documentId) {
    const response = await api.delete(`/hr/employees/${employeeId}/documents/${documentId}`)
    return response.data
  },

  // ==================== ATTENDANCE ====================

  /**
   * Get attendance records
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getAttendance(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/hr/attendance?${queryString}`)
    return response.data
  },

  /**
   * Check in
   * @param {Object} attendanceData - Check-in data
   * @returns {Promise}
   */
  async checkIn(attendanceData) {
    const response = await api.post('/hr/attendance/checkin', attendanceData)
    return response.data
  },

  /**
   * Check out
   * @param {String} id - Attendance record ID
   * @param {Object} attendanceData - Check-out data
   * @returns {Promise}
   */
  async checkOut(id, attendanceData) {
    const response = await api.post(`/hr/attendance/${id}/checkout`, attendanceData)
    return response.data
  },

  /**
   * Regularize attendance
   * @param {String} id - Attendance record ID
   * @param {Object} regularizationData - Regularization data
   * @returns {Promise}
   */
  async regularizeAttendance(id, regularizationData) {
    const response = await api.post(`/hr/attendance/${id}/regularize`, regularizationData)
    return response.data
  },

  /**
   * Get attendance summary
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getAttendanceSummary(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/hr/attendance/summary?${queryString}`)
    return response.data
  },

  /**
   * Export attendance
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async exportAttendance(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/hr/attendance/export?${queryString}`, {
      responseType: 'blob'
    })
    return response.data
  },

  // ==================== LEAVES ====================

  /**
   * Get leave requests
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getLeaves(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/hr/leaves?${queryString}`)
    return response.data
  },

  /**
   * Get leave types
   * @returns {Promise}
   */
  async getLeaveTypes() {
    const response = await api.get('/hr/leave-types')
    return response.data
  },

  /**
   * Get leave balance for employee
   * @param {String} employeeId - Employee ID
   * @returns {Promise}
   */
  async getLeaveBalance(employeeId) {
    const response = await api.get(`/hr/employees/${employeeId}/leave-balance`)
    return response.data
  },

  /**
   * Create leave request
   * @param {Object} leaveData - Leave request data
   * @returns {Promise}
   */
  async createLeaveRequest(leaveData) {
    const response = await api.post('/hr/leaves', leaveData)
    return response.data
  },

  /**
   * Update leave request
   * @param {String} id - Leave request ID
   * @param {Object} leaveData - Updated leave data
   * @returns {Promise}
   */
  async updateLeaveRequest(id, leaveData) {
    const response = await api.put(`/hr/leaves/${id}`, leaveData)
    return response.data
  },

  /**
   * Approve leave request
   * @param {String} id - Leave request ID
   * @returns {Promise}
   */
  async approveLeave(id) {
    const response = await api.post(`/hr/leaves/${id}/approve`)
    return response.data
  },

  /**
   * Reject leave request
   * @param {String} id - Leave request ID
   * @param {String} reason - Rejection reason
   * @returns {Promise}
   */
  async rejectLeave(id, reason) {
    const response = await api.post(`/hr/leaves/${id}/reject`, { reason })
    return response.data
  },

  /**
   * Cancel leave request
   * @param {String} id - Leave request ID
   * @returns {Promise}
   */
  async cancelLeave(id) {
    const response = await api.post(`/hr/leaves/${id}/cancel`)
    return response.data
  },

  // ==================== PAYROLL ====================

  /**
   * Get payroll records
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getPayroll(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/hr/payroll?${queryString}`)
    return response.data
  },

  /**
   * Get payroll periods
   * @returns {Promise}
   */
  async getPayrollPeriods() {
    const response = await api.get('/hr/payroll/periods')
    return response.data
  },

  /**
   * Get payroll for period
   * @param {String} periodId - Period ID
   * @returns {Promise}
   */
  async getPayrollByPeriod(periodId) {
    const response = await api.get(`/hr/payroll/periods/${periodId}`)
    return response.data
  },

  /**
   * Process payroll for period
   * @param {String} periodId - Period ID
   * @returns {Promise}
   */
  async processPayroll(periodId) {
    const response = await api.post(`/hr/payroll/periods/${periodId}/process`)
    return response.data
  },

  /**
   * Approve payroll for period
   * @param {String} periodId - Period ID
   * @returns {Promise}
   */
  async approvePayroll(periodId) {
    const response = await api.post(`/hr/payroll/periods/${periodId}/approve`)
    return response.data
  },

  /**
   * Generate payslip
   * @param {String} payrollId - Payroll ID
   * @returns {Promise}
   */
  async generatePayslip(payrollId) {
    const response = await api.get(`/hr/payroll/${payrollId}/payslip`, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Export payroll
   * @param {String} periodId - Period ID
   * @returns {Promise}
   */
  async exportPayroll(periodId) {
    const response = await api.get(`/hr/payroll/periods/${periodId}/export`, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Generate bank file
   * @param {String} periodId - Period ID
   * @returns {Promise}
   */
  async generateBankFile(periodId) {
    const response = await api.get(`/hr/payroll/periods/${periodId}/bank-file`, {
      responseType: 'blob'
    })
    return response.data
  },

  // ==================== DEPARTMENTS & BRANCHES ====================

  /**
   * Get departments
   * @returns {Promise}
   */
  async getDepartments() {
    const response = await api.get('/hr/departments')
    return response.data
  },

  /**
   * Create department
   * @param {Object} departmentData - Department data
   * @returns {Promise}
   */
  async createDepartment(departmentData) {
    const response = await api.post('/hr/departments', departmentData)
    return response.data
  },

  /**
   * Update department
   * @param {String} id - Department ID
   * @param {Object} departmentData - Updated department data
   * @returns {Promise}
   */
  async updateDepartment(id, departmentData) {
    const response = await api.put(`/hr/departments/${id}`, departmentData)
    return response.data
  },

  /**
   * Delete department
   * @param {String} id - Department ID
   * @returns {Promise}
   */
  async deleteDepartment(id) {
    const response = await api.delete(`/hr/departments/${id}`)
    return response.data
  },

  /**
   * Get branches
   * @returns {Promise}
   */
  async getBranches() {
    const response = await api.get('/hr/branches')
    return response.data
  },

  /**
   * Create branch
   * @param {Object} branchData - Branch data
   * @returns {Promise}
   */
  async createBranch(branchData) {
    const response = await api.post('/hr/branches', branchData)
    return response.data
  },

  /**
   * Update branch
   * @param {String} id - Branch ID
   * @param {Object} branchData - Updated branch data
   * @returns {Promise}
   */
  async updateBranch(id, branchData) {
    const response = await api.put(`/hr/branches/${id}`, branchData)
    return response.data
  },

  /**
   * Delete branch
   * @param {String} id - Branch ID
   * @returns {Promise}
   */
  async deleteBranch(id) {
    const response = await api.delete(`/hr/branches/${id}`)
    return response.data
  },

  /**
   * Get job positions
   * @returns {Promise}
   */
  async getJobPositions() {
    const response = await api.get('/hr/job-positions')
    return response.data
  },

  /**
   * Create job position
   * @param {Object} positionData - Position data
   * @returns {Promise}
   */
  async createJobPosition(positionData) {
    const response = await api.post('/hr/job-positions', positionData)
    return response.data
  },

  /**
   * Update job position
   * @param {String} id - Position ID
   * @param {Object} positionData - Updated position data
   * @returns {Promise}
   */
  async updateJobPosition(id, positionData) {
    const response = await api.put(`/hr/job-positions/${id}`, positionData)
    return response.data
  },

  /**
   * Delete job position
   * @param {String} id - Position ID
   * @returns {Promise}
   */
  async deleteJobPosition(id) {
    const response = await api.delete(`/hr/job-positions/${id}`)
    return response.data
  },

  // ==================== REPORTS ====================

  /**
   * Get HR reports
   * @param {String} reportType - Report type
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getHRReport(reportType, params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/hr/reports/${reportType}?${queryString}`)
    return response.data
  },

  /**
   * Export HR report
   * @param {String} reportType - Report type
   * @param {String} format - Export format (pdf, excel)
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async exportHRReport(reportType, format, params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/hr/reports/${reportType}/export/${format}?${queryString}`, {
      responseType: 'blob'
    })
    return response.data
  }
}