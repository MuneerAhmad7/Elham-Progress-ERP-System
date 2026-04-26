<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Entry Header -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('finance.entryDetails') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="form-label">{{ t('finance.entryNumber') }}</label>
            <input
              v-model="form.entry_number"
              type="text"
              class="form-input bg-gray-50"
              readonly
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('finance.entryDate') }} *</label>
            <input
              v-model="form.entry_date"
              type="date"
              class="form-input"
              required
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('finance.entryType') }} *</label>
            <select
              v-model="form.entry_type"
              class="form-input"
              required
            >
              <option value="manual">{{ t('finance.manual') }}</option>
              <option value="system">{{ t('finance.system') }}</option>
              <option value="opening">{{ t('finance.opening') }}</option>
              <option value="closing">{{ t('finance.closing') }}</option>
              <option value="adjustment">{{ t('finance.adjustment') }}</option>
            </select>
          </div>
  
          <div class="md:col-span-3">
            <label class="form-label">{{ t('finance.description') }} *</label>
            <textarea
              v-model="form.description"
              class="form-input"
              rows="2"
              required
            ></textarea>
          </div>
  
          <div class="md:col-span-3">
            <label class="form-label">{{ t('finance.referenceNumber') }}</label>
            <input
              v-model="form.reference_number"
              type="text"
              class="form-input"
            />
          </div>
        </div>
      </div>
  
      <!-- Journal Lines -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">{{ t('finance.journalLines') }}</h3>
          <button
            type="button"
            @click="addLine"
            class="btn btn-sm btn-primary"
          >
            <PlusIcon class="h-4 w-4 mr-1" />
            {{ t('finance.addLine') }}
          </button>
        </div>
  
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {{ t('finance.account') }}
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {{ t('finance.description') }}
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {{ t('finance.costCenter') }}
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  {{ t('finance.debit') }}
                </th>
                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  {{ t('finance.credit') }}
                </th>
                <th class="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(line, index) in form.lines" :key="index">
                <td class="px-3 py-2 text-sm">{{ index + 1 }}</td>
                <td class="px-3 py-2">
                  <select
                    v-model="line.account_id"
                    class="form-input text-sm"
                    required
                    @change="onAccountChange(line)"
                  >
                    <option value="">{{ t('common.select') }}</option>
                    <option
                      v-for="account in accounts"
                      :key="account.id"
                      :value="account.id"
                      :disabled="account.is_header"
                    >
                      {{ account.account_code }} - {{ account.account_name }}
                    </option>
                  </select>
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model="line.description"
                    type="text"
                    class="form-input text-sm"
                  />
                </td>
                <td class="px-3 py-2">
                  <select
                    v-model="line.cost_center_id"
                    class="form-input text-sm"
                  >
                    <option value="">{{ t('common.none') }}</option>
                    <option
                      v-for="cc in costCenters"
                      :key="cc.id"
                      :value="cc.id"
                    >
                      {{ cc.code }} - {{ cc.name }}
                    </option>
                  </select>
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model.number="line.debit"
                    type="number"
                    step="0.01"
                    class="form-input text-sm text-right"
                    @input="onDebitChange(line)"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model.number="line.credit"
                    type="number"
                    step="0.01"
                    class="form-input text-sm text-right"
                    @input="onCreditChange(line)"
                  />
                </td>
                <td class="px-3 py-2">
                  <button
                    type="button"
                    @click="removeLine(index)"
                    class="text-red-600 hover:text-red-800"
                    :disabled="form.lines.length <= 2"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 font-semibold">
              <tr>
                <td colspan="4" class="px-3 py-2 text-right">{{ t('finance.totals') }}:</td>
                <td class="px-3 py-2 text-right" :class="{ 'text-red-600': !isBalanced }">
                  {{ formatCurrency(totalDebit) }}
                </td>
                <td class="px-3 py-2 text-right" :class="{ 'text-red-600': !isBalanced }">
                  {{ formatCurrency(totalCredit) }}
                </td>
                <td></td>
              </tr>
              <tr v-if="!isBalanced">
                <td colspan="7" class="px-3 py-2 text-center text-red-600 text-sm">
                  ⚠️ {{ t('finance.entryNotBalanced') }} - {{ t('finance.difference') }}: 
                  {{ formatCurrency(Math.abs(totalDebit - totalCredit)) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
  
      <!-- Notes -->
      <div>
        <label class="form-label">{{ t('finance.notes') }}</label>
        <textarea
          v-model="form.notes"
          class="form-input"
          rows="3"
        ></textarea>
      </div>
  
      <!-- Form Actions -->
      <div class="flex justify-between items-center pt-4 border-t">
        <div class="text-sm">
          <span class="font-medium">{{ t('finance.status') }}:</span>
          <span
            class="ml-2 badge"
            :class="isBalanced ? 'badge-success' : 'badge-danger'"
          >
            {{ isBalanced ? t('finance.balanced') : t('finance.notBalanced') }}
          </span>
        </div>
        
        <div class="flex space-x-3">
          <button
            type="button"
            @click="$emit('cancel')"
            class="btn btn-outline"
          >
            {{ t('common.cancel') }}
          </button>
          
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading || !isBalanced || form.lines.length < 2"
          >
            <LoadingSpinner v-if="loading" size="20px" />
            <span v-else>{{ t('common.save') }}</span>
          </button>
        </div>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive, computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
  import { formatCurrency } from '@/utils/formatters'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  
  const { t } = useI18n()
  
  const props = defineProps({
    entry: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['save', 'cancel'])
  
  const loading = ref(false)
  const accounts = ref([])
  const costCenters = ref([])
  
  const form = reactive({
    entry_number: 'JE-AUTO',
    entry_date: new Date().toISOString().split('T')[0],
    entry_type: 'manual',
    description: '',
    reference_number: '',
    notes: '',
    lines: []
  })
  
  const totalDebit = computed(() => {
    return form.lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0)
  })
  
  const totalCredit = computed(() => {
    return form.lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0)
  })
  
  const isBalanced = computed(() => {
    const diff = Math.abs(totalDebit.value - totalCredit.value)
    return diff < 0.01 && totalDebit.value > 0 && form.lines.length >= 2
  })
  
  watch(() => props.entry, (newEntry) => {
    if (newEntry) {
      Object.assign(form, {
        ...newEntry,
        lines: newEntry.lines || []
      })
    }
  }, { immediate: true })
  
  const addLine = () => {
    form.lines.push({
      account_id: '',
      description: '',
      cost_center_id: '',
      debit: 0,
      credit: 0
    })
  }
  
  const removeLine = (index) => {
    if (form.lines.length > 2) {
      form.lines.splice(index, 1)
    }
  }
  
  const onDebitChange = (line) => {
    if (parseFloat(line.debit) > 0) {
      line.credit = 0
    }
  }
  
  const onCreditChange = (line) => {
    if (parseFloat(line.credit) > 0) {
      line.debit = 0
    }
  }
  
  const onAccountChange = (line) => {
    // Optional: Auto-fill description from account
    const account = accounts.value.find(a => a.id === line.account_id)
    if (account && !line.description) {
      line.description = form.description
    }
  }
  
  const handleSubmit = async () => {
    if (!isBalanced.value) {
      alert(t('finance.entryMustBeBalanced'))
      return
    }
  
    loading.value = true
  
    try {
      const entryData = {
        ...form,
        total_debit: totalDebit.value,
        total_credit: totalCredit.value
      }
      
      emit('save', entryData)
    } catch (error) {
      console.error('Error saving journal entry:', error)
    } finally {
      loading.value = false
    }
  }
  
  // Initialize with empty lines
  if (form.lines.length === 0) {
    addLine()
    addLine()
  }
  
  // Load accounts and cost centers
  const loadData = async () => {
    // Mock data - replace with actual API calls
    accounts.value = [
      { id: 1, account_code: '1010', account_name: 'Cash', is_header: false },
      { id: 2, account_code: '1020', account_name: 'Bank', is_header: false },
      { id: 3, account_code: '4010', account_name: 'Sales Revenue', is_header: false },
      { id: 4, account_code: '5010', account_name: 'Cost of Sales', is_header: false }
    ]
    
    costCenters.value = [
      { id: 1, code: 'CC001', name: 'Administration' },
      { id: 2, code: 'CC002', name: 'Sales' },
      { id: 3, code: 'CC003', name: 'Operations' }
    ]
  }
  
  loadData()
  </script>