<template>
    <div class="account-tree">
      <!-- Search & Filter -->
      <div class="mb-4 flex space-x-4">
        <input
          v-model="searchQuery"
          type="text"
          class="form-input flex-1"
          :placeholder="t('finance.searchAccounts')"
        />
        
        <select v-model="filterType" class="form-input w-48">
          <option value="">{{ t('finance.allTypes') }}</option>
          <option value="asset">{{ t('finance.asset') }}</option>
          <option value="liability">{{ t('finance.liability') }}</option>
          <option value="equity">{{ t('finance.equity') }}</option>
          <option value="revenue">{{ t('finance.revenue') }}</option>
          <option value="expense">{{ t('finance.expense') }}</option>
        </select>
  
        <button @click="expandAll" class="btn btn-outline">
          <ChevronDownIcon class="h-4 w-4 mr-1" />
          {{ t('finance.expandAll') }}
        </button>
        
        <button @click="collapseAll" class="btn btn-outline">
          <ChevronRightIcon class="h-4 w-4 mr-1" />
          {{ t('finance.collapseAll') }}
        </button>
      </div>
  
      <!-- Tree View -->
      <div v-if="!loading" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/3">
                  {{ t('finance.accountName') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                  {{ t('finance.accountCode') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                  {{ t('finance.type') }}
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-40">
                  {{ t('finance.balance') }}
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-32">
                  {{ t('common.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <template v-for="account in filteredAccounts" :key="account.id">
                <AccountTreeNode
                  :account="account"
                  :level="0"
                  :expanded-nodes="expandedNodes"
                  @toggle="toggleNode"
                  @edit="$emit('edit', $event)"
                  @delete="$emit('delete', $event)"
                  @add-child="$emit('add-child', $event)"
                />
              </template>
            </tbody>
          </table>
        </div>
      </div>
  
      <LoadingSpinner v-else fullscreen />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
  import AccountTreeNode from './AccountTreeNode.vue'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  
  const { t } = useI18n()
  
  const props = defineProps({
    accounts: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  
  defineEmits(['edit', 'delete', 'add-child'])
  
  const searchQuery = ref('')
  const filterType = ref('')
  const expandedNodes = ref(new Set())
  
  const filteredAccounts = computed(() => {
    let filtered = props.accounts.filter(acc => !acc.parent_id)
  
    if (filterType.value) {
      filtered = filterAccountsByType(filtered, filterType.value)
    }
  
    if (searchQuery.value) {
      filtered = filterAccountsBySearch(filtered, searchQuery.value.toLowerCase())
    }
  
    return filtered
  })
  
  const filterAccountsByType = (accounts, type) => {
    return accounts.filter(acc => {
      if (acc.account_type === type) return true
      if (acc.children) {
        acc.children = filterAccountsByType(acc.children, type)
        return acc.children.length > 0
      }
      return false
    })
  }
  
  const filterAccountsBySearch = (accounts, query) => {
    return accounts.filter(acc => {
      const nameMatch = acc.account_name?.toLowerCase().includes(query)
      const codeMatch = acc.account_code?.toLowerCase().includes(query)
      
      if (nameMatch || codeMatch) return true
      
      if (acc.children) {
        acc.children = filterAccountsBySearch(acc.children, query)
        return acc.children.length > 0
      }
      
      return false
    })
  }
  
  const toggleNode = (accountId) => {
    if (expandedNodes.value.has(accountId)) {
      expandedNodes.value.delete(accountId)
    } else {
      expandedNodes.value.add(accountId)
    }
  }
  
  const expandAll = () => {
    const getAllIds = (accounts) => {
      let ids = []
      accounts.forEach(acc => {
        ids.push(acc.id)
        if (acc.children) {
          ids = ids.concat(getAllIds(acc.children))
        }
      })
      return ids
    }
    
    expandedNodes.value = new Set(getAllIds(props.accounts))
  }
  
  const collapseAll = () => {
    expandedNodes.value.clear()
  }
  </script>
  
  <style scoped>
  .account-tree {
    font-size: 14px;
  }
  </style>