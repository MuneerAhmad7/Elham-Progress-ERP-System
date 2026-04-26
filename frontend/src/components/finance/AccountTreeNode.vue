<template>
    <tr class="hover:bg-gray-50">
      <!-- Account Name with Indentation -->
      <td class="px-4 py-3">
        <div class="flex items-center" :style="{ paddingLeft: (level * 24) + 'px' }">
          <button
            v-if="account.children && account.children.length > 0"
            @click="$emit('toggle', account.id)"
            class="mr-2 p-1 hover:bg-gray-200 rounded"
          >
            <ChevronRightIcon
              class="h-4 w-4 transition-transform"
              :class="{ 'transform rotate-90': isExpanded }"
            />
          </button>
          <span v-else class="w-6 mr-2"></span>
          
          <FolderIcon v-if="account.is_header" class="h-5 w-5 text-yellow-500 mr-2" />
          <DocumentTextIcon v-else class="h-5 w-5 text-blue-500 mr-2" />
          
          <span
            class="font-medium"
            :class="{ 'font-semibold text-gray-900': account.is_header }"
          >
            {{ account.account_name }}
            <span v-if="account.account_name_ar" class="text-gray-500 text-sm">
              ({{ account.account_name_ar }})
            </span>
          </span>
        </div>
      </td>
  
      <!-- Account Code -->
      <td class="px-4 py-3">
        <span class="font-mono text-sm">{{ account.account_code }}</span>
      </td>
  
      <!-- Account Type -->
      <td class="px-4 py-3">
        <span class="badge" :class="getTypeBadgeClass(account.account_type)">
          {{ t(`finance.${account.account_type}`) }}
        </span>
      </td>
  
      <!-- Balance -->
      <td class="px-4 py-3 text-right">
        <span
          v-if="!account.is_header"
          class="font-semibold"
          :class="getBalanceClass(account.current_balance)"
        >
          {{ formatCurrency(account.current_balance || 0) }}
        </span>
      </td>
  
      <!-- Actions -->
      <td class="px-4 py-3">
        <div class="flex justify-center space-x-1">
          <button
            @click="$emit('edit', account)"
            class="p-1 hover:bg-blue-50 rounded"
            :title="t('common.edit')"
          >
            <PencilIcon class="h-4 w-4 text-blue-600" />
          </button>
          
          <button
            v-if="account.is_header"
            @click="$emit('add-child', account)"
            class="p-1 hover:bg-green-50 rounded"
            :title="t('finance.addSubAccount')"
          >
            <PlusIcon class="h-4 w-4 text-green-600" />
          </button>
          
          <button
            @click="$emit('delete', account)"
            class="p-1 hover:bg-red-50 rounded"
            :title="t('common.delete')"
          >
            <TrashIcon class="h-4 w-4 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  
    <!-- Children Nodes -->
    <template v-if="isExpanded && account.children">
      <AccountTreeNode
        v-for="child in account.children"
        :key="child.id"
        :account="child"
        :level="level + 1"
        :expanded-nodes="expandedNodes"
        @toggle="$emit('toggle', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @add-child="$emit('add-child', $event)"
      />
    </template>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    ChevronRightIcon,
    FolderIcon,
    DocumentTextIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon
  } from '@heroicons/vue/24/outline'
  import { formatCurrency } from '@/utils/formatters'
  
  const { t } = useI18n()
  
  const props = defineProps({
    account: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    expandedNodes: {
      type: Set,
      required: true
    }
  })
  
  defineEmits(['toggle', 'edit', 'delete', 'add-child'])
  
  const isExpanded = computed(() => {
    return props.expandedNodes.has(props.account.id)
  })
  
  const getTypeBadgeClass = (type) => {
    const classes = {
      asset: 'badge-success',
      liability: 'badge-danger',
      equity: 'badge-info',
      revenue: 'badge-primary',
      expense: 'badge-warning'
    }
    return classes[type] || 'badge-secondary'
  }
  
  const getBalanceClass = (balance) => {
    if (balance > 0) return 'text-green-600'
    if (balance < 0) return 'text-red-600'
    return 'text-gray-600'
  }
  </script>