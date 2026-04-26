import { defineStore } from 'pinia';
import hrService from '../../services/hr.service';

export const useHrStore = defineStore('hr', {
  state: () => ({
    employees: [],
    attendance: [],
    leaves: [],
    payroll: [],
    loading: false,
    error: null,
  }),

  getters: {
    getEmployeeById: (state) => (id) => {
      return state.employees.find(emp => emp.id === id);
    },
    activeEmployees: (state) => {
      return state.employees.filter(emp => emp.is_active);
    },
  },

  actions: {
    async fetchEmployees() {
      this.loading = true;
      try {
        const data = await hrService.getEmployees();
        this.employees = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createEmployee(employeeData) {
      try {
        const newEmployee = await hrService.createEmployee(employeeData);
        this.employees.push(newEmployee);
        return { success: true, data: newEmployee };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async updateEmployee(id, employeeData) {
      try {
        const updated = await hrService.updateEmployee(id, employeeData);
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
          this.employees[index] = updated;
        }
        return { success: true, data: updated };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async deleteEmployee(id) {
      try {
        await hrService.deleteEmployee(id);
        this.employees = this.employees.filter(emp => emp.id !== id);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async fetchAttendance(params) {
      this.loading = true;
      try {
        const data = await hrService.getAttendance(params);
        this.attendance = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async markAttendance(attendanceData) {
      try {
        const data = await hrService.markAttendance(attendanceData);
        this.attendance.push(data);
        return { success: true, data };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async fetchLeaves() {
      this.loading = true;
      try {
        const data = await hrService.getLeaves();
        this.leaves = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createLeave(leaveData) {
      try {
        const data = await hrService.createLeave(leaveData);
        this.leaves.push(data);
        return { success: true, data };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async approveLeave(id, status) {
      try {
        const data = await hrService.approveLeave(id, status);
        const index = this.leaves.findIndex(leave => leave.id === id);
        if (index !== -1) {
          this.leaves[index] = data;
        }
        return { success: true, data };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },
  },
});