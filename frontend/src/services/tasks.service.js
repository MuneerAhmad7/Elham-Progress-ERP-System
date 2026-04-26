import api from './api'
import { buildQueryString } from '@/utils/api-helpers'

export default {
  // ==================== TASKS ====================

  /**
   * Get all tasks
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getTasks(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/tasks?${queryString}`)
    return response.data
  },

  /**
   * Get task by ID
   * @param {String} id - Task ID
   * @returns {Promise}
   */
  async getTask(id) {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  /**
   * Create task
   * @param {Object} taskData - Task data
   * @returns {Promise}
   */
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData)
    return response.data
  },

  /**
   * Update task
   * @param {String} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise}
   */
  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData)
    return response.data
  },

  /**
   * Delete task
   * @param {String} id - Task ID
   * @returns {Promise}
   */
  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`)
    return response.data
  },

  /**
   * Update task status
   * @param {String} id - Task ID
   * @param {String} status - New status
   * @returns {Promise}
   */
  async updateTaskStatus(id, status) {
    const response = await api.put(`/tasks/${id}/status`, { status })
    return response.data
  },

  /**
   * Update task stage
   * @param {String} id - Task ID
   * @param {String} stageId - Stage ID
   * @returns {Promise}
   */
  async updateTaskStage(id, stageId) {
    const response = await api.put(`/tasks/${id}/stage`, { stage_id: stageId })
    return response.data
  },

  /**
   * Assign task
   * @param {String} id - Task ID
   * @param {String} userId - User ID to assign to
   * @returns {Promise}
   */
  async assignTask(id, userId) {
    const response = await api.post(`/tasks/${id}/assign`, { user_id: userId })
    return response.data
  },

  /**
   * Complete task
   * @param {String} id - Task ID
   * @returns {Promise}
   */
  async completeTask(id) {
    const response = await api.post(`/tasks/${id}/complete`)
    return response.data
  },

  /**
   * Reopen task
   * @param {String} id - Task ID
   * @returns {Promise}
   */
  async reopenTask(id) {
    const response = await api.post(`/tasks/${id}/reopen`)
    return response.data
  },

  /**
   * Duplicate task
   * @param {String} id - Task ID
   * @returns {Promise}
   */
  async duplicateTask(id) {
    const response = await api.post(`/tasks/${id}/duplicate`)
    return response.data
  },

  /**
   * Get my tasks
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getMyTasks(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/tasks/my-tasks?${queryString}`)
    return response.data
  },

  /**
   * Get overdue tasks
   * @returns {Promise}
   */
  async getOverdueTasks() {
    const response = await api.get('/tasks/overdue')
    return response.data
  },

  // ==================== BOARDS & STAGES ====================

  /**
   * Get task boards
   * @returns {Promise}
   */
  async getBoards() {
    const response = await api.get('/tasks/boards')
    return response.data
  },

  /**
   * Create board
   * @param {Object} boardData - Board data
   * @returns {Promise}
   */
  async createBoard(boardData) {
    const response = await api.post('/tasks/boards', boardData)
    return response.data
  },

  /**
   * Update board
   * @param {String} id - Board ID
   * @param {Object} boardData - Updated board data
   * @returns {Promise}
   */
  async updateBoard(id, boardData) {
    const response = await api.put(`/tasks/boards/${id}`, boardData)
    return response.data
  },

  /**
   * Delete board
   * @param {String} id - Board ID
   * @returns {Promise}
   */
  async deleteBoard(id) {
    const response = await api.delete(`/tasks/boards/${id}`)
    return response.data
  },

  /**
   * Get stages for board
   * @param {String} boardId - Board ID
   * @returns {Promise}
   */
  async getStages(boardId) {
    const response = await api.get(`/tasks/boards/${boardId}/stages`)
    return response.data
  },

  /**
   * Create stage
   * @param {String} boardId - Board ID
   * @param {Object} stageData - Stage data
   * @returns {Promise}
   */
  async createStage(boardId, stageData) {
    const response = await api.post(`/tasks/boards/${boardId}/stages`, stageData)
    return response.data
  },

  /**
   * Update stage
   * @param {String} boardId - Board ID
   * @param {String} stageId - Stage ID
   * @param {Object} stageData - Updated stage data
   * @returns {Promise}
   */
  async updateStage(boardId, stageId, stageData) {
    const response = await api.put(`/tasks/boards/${boardId}/stages/${stageId}`, stageData)
    return response.data
  },

  /**
   * Delete stage
   * @param {String} boardId - Board ID
   * @param {String} stageId - Stage ID
   * @returns {Promise}
   */
  async deleteStage(boardId, stageId) {
    const response = await api.delete(`/tasks/boards/${boardId}/stages/${stageId}`)
    return response.data
  },

  /**
   * Reorder stages
   * @param {String} boardId - Board ID
   * @param {Array} stageOrder - Array of stage IDs in new order
   * @returns {Promise}
   */
  async reorderStages(boardId, stageOrder) {
    const response = await api.put(`/tasks/boards/${boardId}/stages/reorder`, { order: stageOrder })
    return response.data
  },

  // ==================== COMMENTS ====================

  /**
   * Get task comments
   * @param {String} taskId - Task ID
   * @returns {Promise}
   */
  async getComments(taskId) {
    const response = await api.get(`/tasks/${taskId}/comments`)
    return response.data
  },

  /**
   * Add comment
   * @param {String} taskId - Task ID
   * @param {Object} commentData - Comment data
   * @returns {Promise}
   */
  async addComment(taskId, commentData) {
    const response = await api.post(`/tasks/${taskId}/comments`, commentData)
    return response.data
  },

  /**
   * Update comment
   * @param {String} taskId - Task ID
   * @param {String} commentId - Comment ID
   * @param {Object} commentData - Updated comment data
   * @returns {Promise}
   */
  async updateComment(taskId, commentId, commentData) {
    const response = await api.put(`/tasks/${taskId}/comments/${commentId}`, commentData)
    return response.data
  },

  /**
   * Delete comment
   * @param {String} taskId - Task ID
   * @param {String} commentId - Comment ID
   * @returns {Promise}
   */
  async deleteComment(taskId, commentId) {
    const response = await api.delete(`/tasks/${taskId}/comments/${commentId}`)
    return response.data
  },

  // ==================== ATTACHMENTS ====================

  /**
   * Get task attachments
   * @param {String} taskId - Task ID
   * @returns {Promise}
   */
  async getAttachments(taskId) {
    const response = await api.get(`/tasks/${taskId}/attachments`)
    return response.data
  },

  /**
   * Upload attachment
   * @param {String} taskId - Task ID
   * @param {File} file - File to upload
   * @returns {Promise}
   */
  async uploadAttachment(taskId, file) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  /**
   * Download attachment
   * @param {String} taskId - Task ID
   * @param {String} attachmentId - Attachment ID
   * @returns {Promise}
   */
  async downloadAttachment(taskId, attachmentId) {
    const response = await api.get(`/tasks/${taskId}/attachments/${attachmentId}/download`, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Delete attachment
   * @param {String} taskId - Task ID
   * @param {String} attachmentId - Attachment ID
   * @returns {Promise}
   */
  async deleteAttachment(taskId, attachmentId) {
    const response = await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`)
    return response.data
  },

  // ==================== SUBTASKS ====================

  /**
   * Get subtasks
   * @param {String} taskId - Parent task ID
   * @returns {Promise}
   */
  async getSubtasks(taskId) {
    const response = await api.get(`/tasks/${taskId}/subtasks`)
    return response.data
  },

  /**
   * Create subtask
   * @param {String} taskId - Parent task ID
   * @param {Object} subtaskData - Subtask data
   * @returns {Promise}
   */
  async createSubtask(taskId, subtaskData) {
    const response = await api.post(`/tasks/${taskId}/subtasks`, subtaskData)
    return response.data
  },

  /**
   * Complete subtask
   * @param {String} taskId - Parent task ID
   * @param {String} subtaskId - Subtask ID
   * @returns {Promise}
   */
  async completeSubtask(taskId, subtaskId) {
    const response = await api.post(`/tasks/${taskId}/subtasks/${subtaskId}/complete`)
    return response.data
  },

  /**
   * Delete subtask
   * @param {String} taskId - Parent task ID
   * @param {String} subtaskId - Subtask ID
   * @returns {Promise}
   */
  async deleteSubtask(taskId, subtaskId) {
    const response = await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`)
    return response.data
  },

  // ==================== CHECKLISTS ====================

  /**
   * Get checklists
   * @param {String} taskId - Task ID
   * @returns {Promise}
   */
  async getChecklists(taskId) {
    const response = await api.get(`/tasks/${taskId}/checklists`)
    return response.data
  },

  /**
   * Create checklist
   * @param {String} taskId - Task ID
   * @param {Object} checklistData - Checklist data
   * @returns {Promise}
   */
  async createChecklist(taskId, checklistData) {
    const response = await api.post(`/tasks/${taskId}/checklists`, checklistData)
    return response.data
  },

  /**
   * Update checklist item
   * @param {String} taskId - Task ID
   * @param {String} checklistId - Checklist ID
   * @param {String} itemId - Item ID
   * @param {Object} itemData - Updated item data
   * @returns {Promise}
   */
  async updateChecklistItem(taskId, checklistId, itemId, itemData) {
    const response = await api.put(`/tasks/${taskId}/checklists/${checklistId}/items/${itemId}`, itemData)
    return response.data
  },

  /**
   * Toggle checklist item
   * @param {String} taskId - Task ID
   * @param {String} checklistId - Checklist ID
   * @param {String} itemId - Item ID
   * @returns {Promise}
   */
  async toggleChecklistItem(taskId, checklistId, itemId) {
    const response = await api.post(`/tasks/${taskId}/checklists/${checklistId}/items/${itemId}/toggle`)
    return response.data
  },

  // ==================== TIME TRACKING ====================

  /**
   * Get time logs
   * @param {String} taskId - Task ID
   * @returns {Promise}
   */
  async getTimeLogs(taskId) {
    const response = await api.get(`/tasks/${taskId}/time-logs`)
    return response.data
  },

  /**
   * Start time log
   * @param {String} taskId - Task ID
   * @returns {Promise}
   */
  async startTimeLog(taskId) {
    const response = await api.post(`/tasks/${taskId}/time-logs/start`)
    return response.data
  },

  /**
   * Stop time log
   * @param {String} taskId - Task ID
   * @param {String} timeLogId - Time log ID
   * @returns {Promise}
   */
  async stopTimeLog(taskId, timeLogId) {
    const response = await api.post(`/tasks/${taskId}/time-logs/${timeLogId}/stop`)
    return response.data
  },

  /**
   * Add manual time log
   * @param {String} taskId - Task ID
   * @param {Object} timeLogData - Time log data
   * @returns {Promise}
   */
  async addTimeLog(taskId, timeLogData) {
    const response = await api.post(`/tasks/${taskId}/time-logs`, timeLogData)
    return response.data
  },

  /**
   * Update time log
   * @param {String} taskId - Task ID
   * @param {String} timeLogId - Time log ID
   * @param {Object} timeLogData - Updated time log data
   * @returns {Promise}
   */
  async updateTimeLog(taskId, timeLogId, timeLogData) {
    const response = await api.put(`/tasks/${taskId}/time-logs/${timeLogId}`, timeLogData)
    return response.data
  },

  /**
   * Delete time log
   * @param {String} taskId - Task ID
   * @param {String} timeLogId - Time log ID
   * @returns {Promise}
   */
  async deleteTimeLog(taskId, timeLogId) {
    const response = await api.delete(`/tasks/${taskId}/time-logs/${timeLogId}`)
    return response.data
  },

  /**
   * Get time summary
   * @param {String} taskId - Task ID
   * @returns {Promise}
   */
  async getTimeSummary(taskId) {
    const response = await api.get(`/tasks/${taskId}/time-logs/summary`)
    return response.data
  },

  // ==================== TAGS & LABELS ====================

  /**
   * Get task tags
   * @returns {Promise}
   */
  async getTags() {
    const response = await api.get('/tasks/tags')
    return response.data
  },

  /**
   * Create tag
   * @param {Object} tagData - Tag data
   * @returns {Promise}
   */
  async createTag(tagData) {
    const response = await api.post('/tasks/tags', tagData)
    return response.data
  },

  /**
   * Add tag to task
   * @param {String} taskId - Task ID
   * @param {String} tagId - Tag ID
   * @returns {Promise}
   */
  async addTagToTask(taskId, tagId) {
    const response = await api.post(`/tasks/${taskId}/tags/${tagId}`)
    return response.data
  },

  /**
   * Remove tag from task
   * @param {String} taskId - Task ID
   * @param {String} tagId - Tag ID
   * @returns {Promise}
   */
  async removeTagFromTask(taskId, tagId) {
    const response = await api.delete(`/tasks/${taskId}/tags/${tagId}`)
    return response.data
  },

  // ==================== DEPENDENCIES ====================

  /**
   * Get task dependencies
   * @param {String} taskId - Task ID
   * @returns {Promise}
   */
  async getDependencies(taskId) {
    const response = await api.get(`/tasks/${taskId}/dependencies`)
    return response.data
  },

  /**
   * Add dependency
   * @param {String} taskId - Task ID
   * @param {Object} dependencyData - Dependency data
   * @returns {Promise}
   */
  async addDependency(taskId, dependencyData) {
    const response = await api.post(`/tasks/${taskId}/dependencies`, dependencyData)
    return response.data
  },

  /**
   * Remove dependency
   * @param {String} taskId - Task ID
   * @param {String} dependencyId - Dependency ID
   * @returns {Promise}
   */
  async removeDependency(taskId, dependencyId) {
    const response = await api.delete(`/tasks/${taskId}/dependencies/${dependencyId}`)
    return response.data
  },

  // ==================== RECURRENCE ====================

  /**
   * Create recurring task
   * @param {Object} taskData - Task data with recurrence rules
   * @returns {Promise}
   */
  async createRecurringTask(taskData) {
    const response = await api.post('/tasks/recurring', taskData)
    return response.data
  },

  /**
   * Update recurrence
   * @param {String} taskId - Task ID
   * @param {Object} recurrenceData - Recurrence data
   * @returns {Promise}
   */
  async updateRecurrence(taskId, recurrenceData) {
    const response = await api.put(`/tasks/${taskId}/recurrence`, recurrenceData)
    return response.data
  },

  /**
   * Stop recurrence
   * @param {String} taskId - Task ID
   * @returns {Promise}
   */
  async stopRecurrence(taskId) {
    const response = await api.delete(`/tasks/${taskId}/recurrence`)
    return response.data
  },

  // ==================== REPORTS ====================

  /**
   * Get task statistics
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getTaskStats(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/tasks/stats?${queryString}`)
    return response.data
  },

  /**
   * Get productivity report
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getProductivityReport(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/tasks/reports/productivity?${queryString}`)
    return response.data
  },

  /**
   * Get time tracking report
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  async getTimeTrackingReport(params = {}) {
    const queryString = buildQueryString(params)
    const response = await api.get(`/tasks/reports/time-tracking?${queryString}`)
    return response.data
  },

  /**
   * Export tasks
   * @param {Object} params - Query parameters
   * @param {String} format - Export format (csv, excel, pdf)
   * @returns {Promise}
   */
  async exportTasks(params = {}, format = 'excel') {
    const queryString = buildQueryString(params)
    const response = await api.get(`/tasks/export/${format}?${queryString}`, {
      responseType: 'blob'
    })
    return response.data
  }
}