import { defineStore } from 'pinia';
import financeService from '../../services/finance.service';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    accounts: [],
    journalEntries: [],
    invoices: [],
    loading: false,
    error: null,
  }),

  getters: {
    getAccountById: (state) => (id) => {
      return state.accounts.find(acc => acc.id === id);
    },
    activeAccounts: (state) => {
      return state.accounts.filter(acc => acc.is_active);
    },
  },

  actions: {
    async fetchAccounts() {
      this.loading = true;
      try {
        const data = await financeService.getAccounts();
        this.accounts = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createAccount(accountData) {
      try {
        const newAccount = await financeService.createAccount(accountData);
        this.accounts.push(newAccount);
        return { success: true, data: newAccount };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async fetchJournalEntries(params) {
      this.loading = true;
      try {
        const data = await financeService.getJournalEntries(params);
        this.journalEntries = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createJournalEntry(entryData) {
      try {
        const data = await financeService.createJournalEntry(entryData);
        this.journalEntries.push(data);
        return { success: true, data };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    async fetchInvoices() {
      this.loading = true;
      try {
        const data = await financeService.getInvoices();
        this.invoices = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createInvoice(invoiceData) {
      try {
        const data = await financeService.createInvoice(invoiceData);
        this.invoices.push(data);
        return { success: true, data };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },
  },
});