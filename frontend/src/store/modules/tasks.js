import { defineStore } from 'pinia';
import tasksService from '../../services/tasks.service';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
  }),

  getters: {
    getTaskById: (state) => (id) => {
      return state.tasks.find(task => task.id === id);
    },
    tasksByStatus: (state) => (status) => {
      return state.tasks.filter(task => task.status === status);
    },
    myTasks: (state) => (userId) => {
      return state.tasks.filter(task => task.assigned_to === userId);
    },
  },

  actions: {
    async fetchTasks(params) {
      this.loading = true;
      try {
        const data = await tasksService.getTasks(params);
        this.tasks = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchTask(id) {
      this.loading = true;
      try {
        const data = await tasksService.getTask(id);
        this.currentTask = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createTask(taskData) {
      try {
        const newTask = await tasksService.createTask(taskData);
        this.tasks.push(newTask);
        return { success: true, data: newTask };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async updateTask(id, taskData) {
      try {
        const updated = await tasksService.updateTask(id, taskData);
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
          this.tasks[index] = updated;
        }
        if (this.currentTask?.id === id) {
          this.currentTask = updated;
        }
        return { success: true, data: updated };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async deleteTask(id) {
      try {
        await tasksService.deleteTask(id);
        this.tasks = this.tasks.filter(task => task.id !== id);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async updateTaskStatus(id, status) {
      return this.updateTask(id, { status });
    },
  },
});