import { defineStore } from 'pinia';
import crmService from '../../services/crm.service';

export const useCrmStore = defineStore('crm', {
  state: () => ({
    leads: [],
    accounts: [],
    contacts: [],
    opportunities: [],
    loading: false,
    error: null,
  }),

  getters: {
    getLeadById: (state) => (id) => {
      return state.leads.find(lead => lead.id === id);
    },
    activeLeads: (state) => {
      return state.leads.filter(lead => lead.status !== 'Converted');
    },
  },

  actions: {
    async fetchLeads() {
      this.loading = true;
      try {
        const data = await crmService.getLeads();
        this.leads = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createLead(leadData) {
      try {
        const newLead = await crmService.createLead(leadData);
        this.leads.push(newLead);
        return { success: true, data: newLead };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async updateLead(id, leadData) {
      try {
        const updated = await crmService.updateLead(id, leadData);
        const index = this.leads.findIndex(lead => lead.id === id);
        if (index !== -1) {
          this.leads[index] = updated;
        }
        return { success: true, data: updated };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async fetchAccounts() {
      this.loading = true;
      try {
        const data = await crmService.getAccounts();
        this.accounts = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createAccount(accountData) {
      try {
        const data = await crmService.createAccount(accountData);
        this.accounts.push(data);
        return { success: true, data };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async fetchContacts() {
      this.loading = true;
      try {
        const data = await crmService.getContacts();
        this.contacts = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createContact(contactData) {
      try {
        const data = await crmService.createContact(contactData);
        this.contacts.push(data);
        return { success: true, data };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async fetchOpportunities() {
      this.loading = true;
      try {
        const data = await crmService.getOpportunities();
        this.opportunities = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createOpportunity(opportunityData) {
      try {
        const data = await crmService.createOpportunity(opportunityData);
        this.opportunities.push(data);
        return { success: true, data };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },
  },
});