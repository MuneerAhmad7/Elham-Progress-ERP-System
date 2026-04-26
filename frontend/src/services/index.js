/**
 * Services Index
 * Export all services from a single file for easy importing
 */

import authService from './auth.service'
import hrService from './hr.service'
import financeService from './finance.service'
import crmService from './crm.service'
import projectsService from './projects.service'
import tasksService from './tasks.service'

export {
  authService,
  hrService,
  financeService,
  crmService,
  projectsService,
  tasksService
}

export default {
  auth: authService,
  hr: hrService,
  finance: financeService,
  crm: crmService,
  projects: projectsService,
  tasks: tasksService
}