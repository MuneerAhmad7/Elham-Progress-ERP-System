import api from './api'
import { buildQueryString } from '@/utils/api-helpers'

export default {
  // ==================== PROJECTS ====================

  /**
   * Get all projects
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getProjects(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/projects?${queryString}`)
    return response.data
  },

  /**
   * Get project by ID
   * @param {String} id - Project ID
   * @returns {Promise}
   */
  async getProject(id) {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  /**
   * Create project
   * @param {Object} projectData - Project data
   * @returns {Promise}
   */
  async createProject(projectData) {
    const response = await api.post('/projects', projectData)
    return response.data
  },

  /**
   * Update project
   * @param {String} id - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise}
   */
  async updateProject(id, projectData) {
    const response = await api.put(`/projects/${id}`, projectData)
    return response.data
  },

  /**
   * Delete project
   * @param {String} id - Project ID
   * @returns {Promise}
   */
  async deleteProject(id) {
    const response = await api.delete(`/projects/${id}`)
    return response.data
  },

  /**
   * Update project status
   * @param {String} id - Project ID
   * @param {String} status - New status
   * @returns {Promise}
   */
  async updateProjectStatus(id, status) {
    const response = await api.put(`/projects/${id}/status`, { status })
    return response.data
  },

  /**
   * Get project dashboard
   * @param {String} id - Project ID
   * @returns {Promise}
   */
  async getProjectDashboard(id) {
    const response = await api.get(`/projects/${id}/dashboard`)
    return response.data
  },

  /**
   * Get project statistics
   * @param {String} id - Project ID
   * @returns {Promise}
   */
  async getProjectStats(id) {
    const response = await api.get(`/projects/${id}/stats`)
    return response.data
  },

  // ==================== BOQ (Bill of Quantities) ====================

  /**
   * Get BOQ for project
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getBOQ(projectId) {
    const response = await api.get(`/projects/${projectId}/boq`)
    return response.data
  },

  /**
   * Create BOQ item
   * @param {String} projectId - Project ID
   * @param {Object} itemData - BOQ item data
   * @returns {Promise}
   */
  async createBOQItem(projectId, itemData) {
    const response = await api.post(`/projects/${projectId}/boq`, itemData)
    return response.data
  },

  /**
   * Update BOQ item
   * @param {String} projectId - Project ID
   * @param {String} itemId - BOQ item ID
   * @param {Object} itemData - Updated BOQ item data
   * @returns {Promise}
   */
  async updateBOQItem(projectId, itemId, itemData) {
    const response = await api.put(`/projects/${projectId}/boq/${itemId}`, itemData)
    return response.data
  },

  /**
   * Delete BOQ item
   * @param {String} projectId - Project ID
   * @param {String} itemId - BOQ item ID
   * @returns {Promise}
   */
  async deleteBOQItem(projectId, itemId) {
    const response = await api.delete(`/projects/${projectId}/boq/${itemId}`)
    return response.data
  },

  /**
   * Import BOQ from Excel
   * @param {String} projectId - Project ID
   * @param {FormData} formData - Excel file form data
   * @returns {Promise}
   */
  async importBOQ(projectId, formData) {
    const response = await api.post(`/projects/${projectId}/boq/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  /**
   * Export BOQ to Excel
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async exportBOQ(projectId) {
    const response = await api.get(`/projects/${projectId}/boq/export`, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Update BOQ progress
   * @param {String} projectId - Project ID
   * @param {String} itemId - BOQ item ID
   * @param {Object} progressData - Progress data
   * @returns {Promise}
   */
  async updateBOQProgress(projectId, itemId, progressData) {
    const response = await api.put(`/projects/${projectId}/boq/${itemId}/progress`, progressData)
    return response.data
  },

  /**
   * Get BOQ summary
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getBOQSummary(projectId) {
    const response = await api.get(`/projects/${projectId}/boq/summary`)
    return response.data
  },

  // ==================== PROGRESS CLAIMS ====================

  /**
   * Get progress claims for project
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getProgressClaims(projectId) {
    const response = await api.get(`/projects/${projectId}/claims`)
    return response.data
  },

  /**
   * Get progress claim by ID
   * @param {String} projectId - Project ID
   * @param {String} claimId - Claim ID
   * @returns {Promise}
   */
  async getProgressClaim(projectId, claimId) {
    const response = await api.get(`/projects/${projectId}/claims/${claimId}`)
    return response.data
  },

  /**
   * Create progress claim
   * @param {String} projectId - Project ID
   * @param {Object} claimData - Claim data
   * @returns {Promise}
   */
  async createProgressClaim(projectId, claimData) {
    const response = await api.post(`/projects/${projectId}/claims`, claimData)
    return response.data
  },

  /**
   * Update progress claim
   * @param {String} projectId - Project ID
   * @param {String} claimId - Claim ID
   * @param {Object} claimData - Updated claim data
   * @returns {Promise}
   */
  async updateProgressClaim(projectId, claimId, claimData) {
    const response = await api.put(`/projects/${projectId}/claims/${claimId}`, claimData)
    return response.data
  },

  /**
   * Delete progress claim
   * @param {String} projectId - Project ID
   * @param {String} claimId - Claim ID
   * @returns {Promise}
   */
  async deleteProgressClaim(projectId, claimId) {
    const response = await api.delete(`/projects/${projectId}/claims/${claimId}`)
    return response.data
  },

  /**
   * Submit progress claim
   * @param {String} projectId - Project ID
   * @param {String} claimId - Claim ID
   * @returns {Promise}
   */
  async submitProgressClaim(projectId, claimId) {
    const response = await api.post(`/projects/${projectId}/claims/${claimId}/submit`)
    return response.data
  },

  /**
   * Approve progress claim
   * @param {String} projectId - Project ID
   * @param {String} claimId - Claim ID
   * @returns {Promise}
   */
  async approveProgressClaim(projectId, claimId) {
    const response = await api.post(`/projects/${projectId}/claims/${claimId}/approve`)
    return response.data
  },

  /**
   * Reject progress claim
   * @param {String} projectId - Project ID
   * @param {String} claimId - Claim ID
   * @param {String} reason - Rejection reason
   * @returns {Promise}
   */
  async rejectProgressClaim(projectId, claimId, reason) {
    const response = await api.post(`/projects/${projectId}/claims/${claimId}/reject`, { reason })
    return response.data
  },

  /**
   * Print progress claim
   * @param {String} projectId - Project ID
   * @param {String} claimId - Claim ID
   * @returns {Promise}
   */
  async printProgressClaim(projectId, claimId) {
    const response = await api.get(`/projects/${projectId}/claims/${claimId}/print`, {
      responseType: 'blob'
    })
    return response.data
  },

  // ==================== PROJECT COSTS ====================

  /**
   * Get project costs
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getProjectCosts(projectId) {
    const response = await api.get(`/projects/${projectId}/costs`)
    return response.data
  },

  /**
   * Create project cost
   * @param {String} projectId - Project ID
   * @param {Object} costData - Cost data
   * @returns {Promise}
   */
  async createProjectCost(projectId, costData) {
    const response = await api.post(`/projects/${projectId}/costs`, costData)
    return response.data
  },

  /**
   * Update project cost
   * @param {String} projectId - Project ID
   * @param {String} costId - Cost ID
   * @param {Object} costData - Updated cost data
   * @returns {Promise}
   */
  async updateProjectCost(projectId, costId, costData) {
    const response = await api.put(`/projects/${projectId}/costs/${costId}`, costData)
    return response.data
  },

  /**
   * Delete project cost
   * @param {String} projectId - Project ID
   * @param {String} costId - Cost ID
   * @returns {Promise}
   */
  async deleteProjectCost(projectId, costId) {
    const response = await api.delete(`/projects/${projectId}/costs/${costId}`)
    return response.data
  },

  /**
   * Get cost summary
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getCostSummary(projectId) {
    const response = await api.get(`/projects/${projectId}/costs/summary`)
    return response.data
  },

  /**
   * Get cost variance report
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getCostVariance(projectId) {
    const response = await api.get(`/projects/${projectId}/costs/variance`)
    return response.data
  },

  // ==================== DOCUMENTS ====================

  /**
   * Get project documents
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getDocuments(projectId) {
    const response = await api.get(`/projects/${projectId}/documents`)
    return response.data
  },

  /**
   * Upload document
   * @param {String} projectId - Project ID
   * @param {FormData} formData - Document form data
   * @returns {Promise}
   */
  async uploadDocument(projectId, formData) {
    const response = await api.post(`/projects/${projectId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  /**
   * Download document
   * @param {String} projectId - Project ID
   * @param {String} documentId - Document ID
   * @returns {Promise}
   */
  async downloadDocument(projectId, documentId) {
    const response = await api.get(`/projects/${projectId}/documents/${documentId}/download`, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Delete document
   * @param {String} projectId - Project ID
   * @param {String} documentId - Document ID
   * @returns {Promise}
   */
  async deleteDocument(projectId, documentId) {
    const response = await api.delete(`/projects/${projectId}/documents/${documentId}`)
    return response.data
  },

  /**
   * Get document categories
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getDocumentCategories(projectId) {
    const response = await api.get(`/projects/${projectId}/documents/categories`)
    return response.data
  },

  // ==================== TEAM ====================

  /**
   * Get project team
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getTeam(projectId) {
    const response = await api.get(`/projects/${projectId}/team`)
    return response.data
  },

  /**
   * Add team member
   * @param {String} projectId - Project ID
   * @param {Object} memberData - Team member data
   * @returns {Promise}
   */
  async addTeamMember(projectId, memberData) {
    const response = await api.post(`/projects/${projectId}/team`, memberData)
    return response.data
  },

  /**
   * Update team member
   * @param {String} projectId - Project ID
   * @param {String} memberId - Member ID
   * @param {Object} memberData - Updated member data
   * @returns {Promise}
   */
  async updateTeamMember(projectId, memberId, memberData) {
    const response = await api.put(`/projects/${projectId}/team/${memberId}`, memberData)
    return response.data
  },

  /**
   * Remove team member
   * @param {String} projectId - Project ID
   * @param {String} memberId - Member ID
   * @returns {Promise}
   */
  async removeTeamMember(projectId, memberId) {
    const response = await api.delete(`/projects/${projectId}/team/${memberId}`)
    return response.data
  },

  // ==================== SCHEDULE ====================

  /**
   * Get project schedule
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getSchedule(projectId) {
    const response = await api.get(`/projects/${projectId}/schedule`)
    return response.data
  },

  /**
   * Create schedule task
   * @param {String} projectId - Project ID
   * @param {Object} taskData - Task data
   * @returns {Promise}
   */
  async createScheduleTask(projectId, taskData) {
    const response = await api.post(`/projects/${projectId}/schedule`, taskData)
    return response.data
  },

  /**
   * Update schedule task
   * @param {String} projectId - Project ID
   * @param {String} taskId - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise}
   */
  async updateScheduleTask(projectId, taskId, taskData) {
    const response = await api.put(`/projects/${projectId}/schedule/${taskId}`, taskData)
    return response.data
  },

  /**
   * Delete schedule task
   * @param {String} projectId - Project ID
   * @param {String} taskId - Task ID
   * @returns {Promise}
   */
  async deleteScheduleTask(projectId, taskId) {
    const response = await api.delete(`/projects/${projectId}/schedule/${taskId}`)
    return response.data
  },

  /**
   * Get Gantt chart data
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getGanttData(projectId) {
    const response = await api.get(`/projects/${projectId}/schedule/gantt`)
    return response.data
  },

  // ==================== MILESTONES ====================

  /**
   * Get project milestones
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getMilestones(projectId) {
    const response = await api.get(`/projects/${projectId}/milestones`)
    return response.data
  },

  /**
   * Create milestone
   * @param {String} projectId - Project ID
   * @param {Object} milestoneData - Milestone data
   * @returns {Promise}
   */
  async createMilestone(projectId, milestoneData) {
    const response = await api.post(`/projects/${projectId}/milestones`, milestoneData)
    return response.data
  },

  /**
   * Update milestone
   * @param {String} projectId - Project ID
   * @param {String} milestoneId - Milestone ID
   * @param {Object} milestoneData - Updated milestone data
   * @returns {Promise}
   */
  async updateMilestone(projectId, milestoneId, milestoneData) {
    const response = await api.put(`/projects/${projectId}/milestones/${milestoneId}`, milestoneData)
    return response.data
  },

  /**
   * Complete milestone
   * @param {String} projectId - Project ID
   * @param {String} milestoneId - Milestone ID
   * @returns {Promise}
   */
  async completeMilestone(projectId, milestoneId) {
    const response = await api.post(`/projects/${projectId}/milestones/${milestoneId}/complete`)
    return response.data
  },

  // ==================== REPORTS ====================

  /**
   * Get project reports
   * @param {String} projectId - Project ID
   * @param {String} reportType - Report type
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getProjectReport(projectId, reportType, params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/projects/${projectId}/reports/${reportType}?${queryString}`)
    return response.data
  },

  /**
   * Export project report
   * @param {String} projectId - Project ID
   * @param {String} reportType - Report type
   * @param {String} format - Export format
   * @returns {Promise}
   */
  async exportProjectReport(projectId, reportType, format) {
    const response = await api.get(`/projects/${projectId}/reports/${reportType}/export/${format}`, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Get earned value analysis
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getEarnedValue(projectId) {
    const response = await api.get(`/projects/${projectId}/reports/earned-value`)
    return response.data
  },

  /**
   * Get progress S-curve
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getProgressCurve(projectId) {
    const response = await api.get(`/projects/${projectId}/reports/progress-curve`)
    return response.data
  },

  /**
   * Get cash flow forecast
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getCashFlow(projectId) {
    const response = await api.get(`/projects/${projectId}/reports/cash-flow`)
    return response.data
  },

  // ==================== RISK & ISSUES ====================

  /**
   * Get project risks
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getRisks(projectId) {
    const response = await api.get(`/projects/${projectId}/risks`)
    return response.data
  },

  /**
   * Create risk
   * @param {String} projectId - Project ID
   * @param {Object} riskData - Risk data
   * @returns {Promise}
   */
  async createRisk(projectId, riskData) {
    const response = await api.post(`/projects/${projectId}/risks`, riskData)
    return response.data
  },

  /**
   * Update risk
   * @param {String} projectId - Project ID
   * @param {String} riskId - Risk ID
   * @param {Object} riskData - Updated risk data
   * @returns {Promise}
   */
  async updateRisk(projectId, riskId, riskData) {
    const response = await api.put(`/projects/${projectId}/risks/${riskId}`, riskData)
    return response.data
  },

  /**
   * Get project issues
   * @param {String} projectId - Project ID
   * @returns {Promise}
   */
  async getIssues(projectId) {
    const response = await api.get(`/projects/${projectId}/issues`)
    return response.data
  },

  /**
   * Create issue
   * @param {String} projectId - Project ID
   * @param {Object} issueData - Issue data
   * @returns {Promise}
   */
  async createIssue(projectId, issueData) {
    const response = await api.post(`/projects/${projectId}/issues`, issueData)
    return response.data
  },

  /**
   * Resolve issue
   * @param {String} projectId - Project ID
   * @param {String} issueId - Issue ID
   * @param {Object} resolutionData - Resolution data
   * @returns {Promise}
   */
  async resolveIssue(projectId, issueId, resolutionData) {
    const response = await api.post(`/projects/${projectId}/issues/${issueId}/resolve`, resolutionData)
    return response.data
  }
}