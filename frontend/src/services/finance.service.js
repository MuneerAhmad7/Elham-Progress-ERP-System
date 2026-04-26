import api from './api'
import { buildQueryString } from '@/utils/api-helpers'

export default {
  // ==================== CHART OF ACCOUNTS ====================

  /**
   * Get chart of accounts
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getAccounts(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/accounts?${queryString}`)
    return response.data
  },

  /**
   * Get account by ID
   * @param {String} id - Account ID
   * @returns {Promise}
   */
  async getAccount(id) {
    const response = await api.get(`/finance/accounts/${id}`)
    return response.data
  },

  /**
   * Create account
   * @param {Object} accountData - Account data
   * @returns {Promise}
   */
  async createAccount(accountData) {
    const response = await api.post('/finance/accounts', accountData)
    return response.data
  },

  /**
   * Update account
   * @param {String} id - Account ID
   * @param {Object} accountData - Updated account data
   * @returns {Promise}
   */
  async updateAccount(id, accountData) {
    const response = await api.put(`/finance/accounts/${id}`, accountData)
    return response.data
  },

  /**
   * Delete account
   * @param {String} id - Account ID
   * @returns {Promise}
   */
  async deleteAccount(id) {
    const response = await api.delete(`/finance/accounts/${id}`)
    return response.data
  },

  /**
   * Get account balance
   * @param {String} id - Account ID
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getAccountBalance(id, params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/accounts/${id}/balance?${queryString}`)
    return response.data
  },

  /**
   * Get account ledger
   * @param {String} id - Account ID
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getAccountLedger(id, params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/accounts/${id}/ledger?${queryString}`)
    return response.data
  },

  // ==================== JOURNAL ENTRIES ====================

  /**
   * Get journal entries
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getJournalEntries(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/journal-entries?${queryString}`)
    return response.data
  },

  /**
   * Get journal entry by ID
   * @param {String} id - Journal entry ID
   * @returns {Promise}
   */
  async getJournalEntry(id) {
    const response = await api.get(`/finance/journal-entries/${id}`)
    return response.data
  },

  /**
   * Create journal entry
   * @param {Object} entryData - Journal entry data
   * @returns {Promise}
   */
  async createJournalEntry(entryData) {
    const response = await api.post('/finance/journal-entries', entryData)
    return response.data
  },

  /**
   * Update journal entry
   * @param {String} id - Journal entry ID
   * @param {Object} entryData - Updated entry data
   * @returns {Promise}
   */
  async updateJournalEntry(id, entryData) {
    const response = await api.put(`/finance/journal-entries/${id}`, entryData)
    return response.data
  },

  /**
   * Delete journal entry
   * @param {String} id - Journal entry ID
   * @returns {Promise}
   */
  async deleteJournalEntry(id) {
    const response = await api.delete(`/finance/journal-entries/${id}`)
    return response.data
  },

  /**
   * Post journal entry
   * @param {String} id - Journal entry ID
   * @returns {Promise}
   */
  async postJournalEntry(id) {
    const response = await api.post(`/finance/journal-entries/${id}/post`)
    return response.data
  },

  /**
   * Reverse journal entry
   * @param {String} id - Journal entry ID
   * @returns {Promise}
   */
  async reverseJournalEntry(id) {
    const response = await api.post(`/finance/journal-entries/${id}/reverse`)
    return response.data
  },

  // ==================== INVOICES ====================

  /**
   * Get invoices
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getInvoices(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/invoices?${queryString}`)
    return response.data
  },

  /**
   * Get invoice by ID
   * @param {String} id - Invoice ID
   * @returns {Promise}
   */
  async getInvoice(id) {
    const response = await api.get(`/finance/invoices/${id}`)
    return response.data
  },

  /**
   * Create invoice
   * @param {Object} invoiceData - Invoice data
   * @returns {Promise}
   */
  async createInvoice(invoiceData) {
    const response = await api.post('/finance/invoices', invoiceData)
    return response.data
  },

  /**
   * Update invoice
   * @param {String} id - Invoice ID
   * @param {Object} invoiceData - Updated invoice data
   * @returns {Promise}
   */
  async updateInvoice(id, invoiceData) {
    const response = await api.put(`/finance/invoices/${id}`, invoiceData)
    return response.data
  },

  /**
   * Delete invoice
   * @param {String} id - Invoice ID
   * @returns {Promise}
   */
  async deleteInvoice(id) {
    const response = await api.delete(`/finance/invoices/${id}`)
    return response.data
  },

  /**
   * Submit invoice to ZATCA
   * @param {String} id - Invoice ID
   * @returns {Promise}
   */
  async submitToZATCA(id) {
    const response = await api.post(`/finance/invoices/${id}/zatca-submit`)
    return response.data
  },

  /**
   * Print invoice
   * @param {String} id - Invoice ID
   * @returns {Promise}
   */
  async printInvoice(id) {
    const response = await api.get(`/finance/invoices/${id}/print`, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Email invoice
   * @param {String} id - Invoice ID
   * @param {Object} emailData - Email data
   * @returns {Promise}
   */
  async emailInvoice(id, emailData) {
    const response = await api.post(`/finance/invoices/${id}/email`, emailData)
    return response.data
  },

  // ==================== PAYMENTS ====================

  /**
   * Get payments
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getPayments(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/payments?${queryString}`)
    return response.data
  },

  /**
   * Get payment by ID
   * @param {String} id - Payment ID
   * @returns {Promise}
   */
  async getPayment(id) {
    const response = await api.get(`/finance/payments/${id}`)
    return response.data
  },

  /**
   * Create payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise}
   */
  async createPayment(paymentData) {
    const response = await api.post('/finance/payments', paymentData)
    return response.data
  },

  /**
   * Update payment
   * @param {String} id - Payment ID
   * @param {Object} paymentData - Updated payment data
   * @returns {Promise}
   */
  async updatePayment(id, paymentData) {
    const response = await api.put(`/finance/payments/${id}`, paymentData)
    return response.data
  },

  /**
   * Delete payment
   * @param {String} id - Payment ID
   * @returns {Promise}
   */
  async deletePayment(id) {
    const response = await api.delete(`/finance/payments/${id}`)
    return response.data
  },

  /**
   * Print payment receipt
   * @param {String} id - Payment ID
   * @returns {Promise}
   */
  async printReceipt(id) {
    const response = await api.get(`/finance/payments/${id}/receipt`, {
      responseType: 'blob'
    })
    return response.data
  },

  // ==================== CUSTOMERS & VENDORS ====================

  /**
   * Get customers
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getCustomers(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/customers?${queryString}`)
    return response.data
  },

  /**
   * Create customer
   * @param {Object} customerData - Customer data
   * @returns {Promise}
   */
  async createCustomer(customerData) {
    const response = await api.post('/finance/customers', customerData)
    return response.data
  },

  /**
   * Update customer
   * @param {String} id - Customer ID
   * @param {Object} customerData - Updated customer data
   * @returns {Promise}
   */
  async updateCustomer(id, customerData) {
    const response = await api.put(`/finance/customers/${id}`, customerData)
    return response.data
  },

  /**
   * Get vendors
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getVendors(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/vendors?${queryString}`)
    return response.data
  },

  /**
   * Create vendor
   * @param {Object} vendorData - Vendor data
   * @returns {Promise}
   */
  async createVendor(vendorData) {
    const response = await api.post('/finance/vendors', vendorData)
    return response.data
  },

  /**
   * Update vendor
   * @param {String} id - Vendor ID
   * @param {Object} vendorData - Updated vendor data
   * @returns {Promise}
   */
  async updateVendor(id, vendorData) {
    const response = await api.put(`/finance/vendors/${id}`, vendorData)
    return response.data
  },

  // ==================== COST CENTERS ====================

  /**
   * Get cost centers
   * @returns {Promise}
   */
  async getCostCenters() {
    const response = await api.get('/finance/cost-centers')
    return response.data
  },

  /**
   * Create cost center
   * @param {Object} costCenterData - Cost center data
   * @returns {Promise}
   */
  async createCostCenter(costCenterData) {
    const response = await api.post('/finance/cost-centers', costCenterData)
    return response.data
  },

  /**
   * Update cost center
   * @param {String} id - Cost center ID
   * @param {Object} costCenterData - Updated cost center data
   * @returns {Promise}
   */
  async updateCostCenter(id, costCenterData) {
    const response = await api.put(`/finance/cost-centers/${id}`, costCenterData)
    return response.data
  },

  // ==================== FISCAL YEARS & PERIODS ====================

  /**
   * Get fiscal years
   * @returns {Promise}
   */
  async getFiscalYears() {
    const response = await api.get('/finance/fiscal-years')
    return response.data
  },

  /**
   * Create fiscal year
   * @param {Object} fiscalYearData - Fiscal year data
   * @returns {Promise}
   */
  async createFiscalYear(fiscalYearData) {
    const response = await api.post('/finance/fiscal-years', fiscalYearData)
    return response.data
  },

  /**
   * Get accounting periods
   * @param {String} fiscalYearId - Fiscal year ID
   * @returns {Promise}
   */
  async getAccountingPeriods(fiscalYearId) {
    const response = await api.get(`/finance/fiscal-years/${fiscalYearId}/periods`)
    return response.data
  },

  /**
   * Close accounting period
   * @param {String} periodId - Period ID
   * @returns {Promise}
   */
  async closePeriod(periodId) {
    const response = await api.post(`/finance/periods/${periodId}/close`)
    return response.data
  },

  /**
   * Reopen accounting period
   * @param {String} periodId - Period ID
   * @returns {Promise}
   */
  async reopenPeriod(periodId) {
    const response = await api.post(`/finance/periods/${periodId}/reopen`)
    return response.data
  },

  // ==================== REPORTS ====================

  /**
   * Generate financial report
   * @param {String} reportType - Report type (trial_balance, balance_sheet, income_statement, etc.)
   * @param {Object} params - Report parameters
   * @returns {Promise}
   */
  async generateReport(reportType, params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/reports/${reportType}?${queryString}`)
    return response.data
  },

  /**
   * Export financial report
   * @param {String} reportType - Report type
   * @param {String} format - Export format (pdf, excel)
   * @param {Object} params - Report parameters
   * @returns {Promise}
   */
  async exportReport(reportType, format, params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/reports/${reportType}/export/${format}?${queryString}`, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Get aged receivables
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getAgedReceivables(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/reports/aged-receivables?${queryString}`)
    return response.data
  },

  /**
   * Get aged payables
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getAgedPayables(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/reports/aged-payables?${queryString}`)
    return response.data
  },

  /**
   * Get VAT return
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getVATReturn(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/finance/reports/vat-return?${queryString}`)
    return response.data
  }
}