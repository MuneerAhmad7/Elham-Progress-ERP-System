import { defineStore } from 'pinia';
import projectsService from '../../services/projects.service';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  }),

  getters: {
    getProjectById: (state) => (id) => {
      return state.projects.find(project => project.id === id);
    },
    activeProjects: (state) => {
      return state.projects.filter(project => project.status === 'Active');
    },
  },

  actions: {
    async fetchProjects() {
      this.loading = true;
      try {
        const data = await projectsService.getProjects();
        this.projects = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchProject(id) {
      this.loading = true;
      try {
        const data = await projectsService.getProject(id);
        this.currentProject = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createProject(projectData) {
      try {
        const newProject = await projectsService.createProject(projectData);
        this.projects.push(newProject);
        return { success: true, data: newProject };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async updateProject(id, projectData) {
      try {
        const updated = await projectsService.updateProject(id, projectData);
        const index = this.projects.findIndex(project => project.id === id);
        if (index !== -1) {
          this.projects[index] = updated;
        }
        return { success: true, data: updated };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async deleteProject(id) {
      try {
        await projectsService.deleteProject(id);
        this.projects = this.projects.filter(project => project.id !== id);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },
  },
});