import api from './api'
import { buildQueryString } from '@/utils/api-helpers'

export default {
  // ==================== LEADS ====================

  /**
   * Get leads
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getLeads(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/crm/leads?${queryString}`)
    return response.data
  },

  /**
   * Get lead by ID
   * @param {String} id - Lead ID
   * @returns {Promise}
   */
  async getLead(id) {
    const response = await api.get(`/crm/leads/${id}`)
    return response.data
  },

  /**
   * Create lead
   * @param {Object} leadData - Lead data
   * @returns {Promise}
   */
  async createLead(leadData) {
    const response = await api.post('/crm/leads', leadData)
    return response.data
  },

  /**
   * Update lead
   * @param {String} id - Lead ID
   * @param {Object} leadData - Updated lead data
   * @returns {Promise}
   */
  async updateLead(id, leadData) {
    const response = await api.put(`/crm/leads/${id}`, leadData)
    return response.data
  },

  /**
   * Delete lead
   * @param {String} id - Lead ID
   * @returns {Promise}
   */
  async deleteLead(id) {
    const response = await api.delete(`/crm/leads/${id}`)
    return response.data
  },

  /**
   * Convert lead
   * @param {String} id - Lead ID
   * @param {Object} conversionData - Conversion data
   * @returns {Promise}
   */
  async convertLead(id, conversionData) {
    const response = await api.post(`/crm/leads/${id}/convert`, conversionData)
    return response.data
  },

  /**
   * Assign lead
   * @param {String} id - Lead ID
   * @param {String} userId - User ID to assign to
   * @returns {Promise}
   */
  async assignLead(id, userId) {
    const response = await api.post(`/crm/leads/${id}/assign`, { user_id: userId })
    return response.data
  },

  /**
   * Update lead score
   * @param {String} id - Lead ID
   * @param {Number} score - Lead score
   * @returns {Promise}
   */
  async updateLeadScore(id, score) {
    const response = await api.put(`/crm/leads/${id}/score`, { score })
    return response.data
  },

  // ==================== ACCOUNTS ====================

  /**
   * Get accounts
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getAccounts(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/crm/accounts?${queryString}`)
    return response.data
  },

  /**
   * Get account by ID
   * @param {String} id - Account ID
   * @returns {Promise}
   */
  async getAccount(id) {
    const response = await api.get(`/crm/accounts/${id}`)
    return response.data
  },

  /**
   * Create account
   * @param {Object} accountData - Account data
   * @returns {Promise}
   */
  async createAccount(accountData) {
    const response = await api.post('/crm/accounts', accountData)
    return response.data
  },

  /**
   * Update account
   * @param {String} id - Account ID
   * @param {Object} accountData - Updated account data
   * @returns {Promise}
   */
  async updateAccount(id, accountData) {
    const response = await api.put(`/crm/accounts/${id}`, accountData)
    return response.data
  },

  /**
   * Delete account
   * @param {String} id - Account ID
   * @returns {Promise}
   */
  async deleteAccount(id) {
    const response = await api.delete(`/crm/accounts/${id}`)
    return response.data
  },

  /**
   * Get account hierarchy
   * @param {String} id - Account ID
   * @returns {Promise}
   */
  async getAccountHierarchy(id) {
    const response = await api.get(`/crm/accounts/${id}/hierarchy`)
    return response.data
  },

  // ==================== CONTACTS ====================

  /**
   * Get contacts
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getContacts(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/crm/contacts?${queryString}`)
    return response.data
  },

  /**
   * Get contact by ID
   * @param {String} id - Contact ID
   * @returns {Promise}
   */
  async getContact(id) {
    const response = await api.get(`/crm/contacts/${id}`)
    return response.data
  },

  /**
   * Create contact
   * @param {Object} contactData - Contact data
   * @returns {Promise}
   */
  async createContact(contactData) {
    const response = await api.post('/crm/contacts', contactData)
    return response.data
  },

  /**
   * Update contact
   * @param {String} id - Contact ID
   * @param {Object} contactData - Updated contact data
   * @returns {Promise}
   */
  async updateContact(id, contactData) {
    const response = await api.put(`/crm/contacts/${id}`, contactData)
    return response.data
  },

  /**
   * Delete contact
   * @param {String} id - Contact ID
   * @returns {Promise}
   */
  async deleteContact(id) {
    const response = await api.delete(`/crm/contacts/${id}`)
    return response.data
  },

  /**
   * Set primary contact
   * @param {String} id - Contact ID
   * @returns {Promise}
   */
  async setPrimaryContact(id) {
    const response = await api.post(`/crm/contacts/${id}/set-primary`)
    return response.data
  },

  // ==================== OPPORTUNITIES ====================

  /**
   * Get opportunities
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getOpportunities(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/crm/opportunities?${queryString}`)
    return response.data
  },

  /**
   * Get opportunity by ID
   * @param {String} id - Opportunity ID
   * @returns {Promise}
   */
  async getOpportunity(id) {
    const response = await api.get(`/crm/opportunities/${id}`)
    return response.data
  },

  /**
   * Create opportunity
   * @param {Object} opportunityData - Opportunity data
   * @returns {Promise}
   */
  async createOpportunity(opportunityData) {
    const response = await api.post('/crm/opportunities', opportunityData)
    return response.data
  },

  /**
   * Update opportunity
   * @param {String} id - Opportunity ID
   * @param {Object} opportunityData - Updated opportunity data
   * @returns {Promise}
   */
  async updateOpportunity(id, opportunityData) {
    const response = await api.put(`/crm/opportunities/${id}`, opportunityData)
    return response.data
  },

  /**
   * Delete opportunity
   * @param {String} id - Opportunity ID
   * @returns {Promise}
   */
  async deleteOpportunity(id) {
    const response = await api.delete(`/crm/opportunities/${id}`)
    return response.data
  },

  /**
   * Update opportunity stage
   * @param {String} id - Opportunity ID
   * @param {String} stage - New stage
   * @returns {Promise}
   */
  async updateOpportunityStage(id, stage) {
    const response = await api.put(`/crm/opportunities/${id}/stage`, { stage })
    return response.data
  },

  /**
   * Mark opportunity as won
   * @param {String} id - Opportunity ID
   * @returns {Promise}
   */
  async markAsWon(id) {
    const response = await api.post(`/crm/opportunities/${id}/won`)
    return response.data
  },

  /**
   * Mark opportunity as lost
   * @param {String} id - Opportunity ID
   * @param {String} reason - Loss reason
   * @returns {Promise}
   */
  async markAsLost(id, reason) {
    const response = await api.post(`/crm/opportunities/${id}/lost`, { reason })
    return response.data
  },

  // ==================== ACTIVITIES ====================

  /**
   * Get activities
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getActivities(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/crm/activities?${queryString}`)
    return response.data
  },

  /**
   * Log activity
   * @param {Object} activityData - Activity data
   * @returns {Promise}
   */
  async logActivity(activityData) {
    const response = await api.post('/crm/activities', activityData)
    return response.data
  },

  /**
   * Update activity
   * @param {String} id - Activity ID
   * @param {Object} activityData - Updated activity data
   * @returns {Promise}
   */
  async updateActivity(id, activityData) {
    const response = await api.put(`/crm/activities/${id}`, activityData)
    return response.data
  },

  /**
   * Delete activity
   * @param {String} id - Activity ID
   * @returns {Promise}
   */
  async deleteActivity(id) {
    const response = await api.delete(`/crm/activities/${id}`)
    return response.data
  },

  // ==================== METADATA ====================

  /**
   * Get lead sources
   * @returns {Promise}
   */
  async getSources() {
    const response = await api.get('/crm/sources')
    return response.data
  },

  /**
   * Get territories
   * @returns {Promise}
   */
  async getTerritories() {
    const response = await api.get('/crm/territories')
    return response.data
  },

  /**
   * Get industries
   * @returns {Promise}
   */
  async getIndustries() {
    const response = await api.get('/crm/industries')
    return response.data
  },

  // ==================== REPORTS ====================

  /**
   * Get CRM reports
   * @param {String} reportType - Report type
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getCRMReport(reportType, params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/crm/reports/${reportType}?${queryString}`)
    return response.data
  },

  /**
   * Get sales funnel
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getSalesFunnel(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/crm/reports/sales-funnel?${queryString}`)
    return response.data
  },

  /**
   * Get conversion rates
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getConversionRates(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/crm/reports/conversion-rates?${queryString}`)
    return response.data
  }
}