<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Invoice Header -->
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ t('finance.invoiceDetails') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ t('finance.invoiceType') }} *</label>
            <select
              v-model="form.invoice_type"
              class="form-input"
              required
            >
              <option value="sales">{{ t('finance.sales') }}</option>
              <option value="purchase">{{ t('finance.purchase') }}</option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('finance.invoiceNumber') }}</label>
            <input
              v-model="form.invoice_number"
              type="text"
              class="form-input bg-gray-50"
              readonly
            />
          </div>
  
          <div>
            <label class="form-label">
              {{ form.invoice_type === 'sales' ? t('finance.customer') : t('finance.vendor') }} *
            </label>
            <select
              v-model="form.party_id"
              class="form-input"
              required
            >
              <option value="">{{ t('common.select') }}</option>
              <option
                v-for="party in parties"
                :key="party.id"
                :value="party.id"
              >
                {{ party.name }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="form-label">{{ t('finance.invoiceDate') }} *</label>
            <input
              v-model="form.invoice_date"
              type="date"
              class="form-input"
              required
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('finance.dueDate') }}</label>
            <input
              v-model="form.due_date"
              type="date"
              class="form-input"
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('finance.referenceNumber') }}</label>
            <input
              v-model="form.reference_number"
              type="text"
              class="form-input"
            />
          </div>
        </div>
      </div>
  
      <!-- Invoice Items -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">{{ t('finance.items') }}</h3>
          <button
            type="button"
            @click="addItem"
            class="btn btn-sm btn-primary"
          >
            <PlusIcon class="h-4 w-4 mr-1" />
            {{ t('finance.addItem') }}
          </button>
        </div>
  
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{{ t('finance.description') }}</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{{ t('finance.quantity') }}</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{{ t('finance.unitPrice') }}</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{{ t('finance.discount') }}</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{{ t('finance.vat') }}</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{{ t('finance.total') }}</th>
                <th class="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in form.items" :key="index">
                <td class="px-3 py-2">{{ index + 1 }}</td>
                <td class="px-3 py-2">
                  <input
                    v-model="item.description"
                    type="text"
                    class="form-input"
                    required
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    step="0.01"
                    class="form-input w-24"
                    required
                    @input="calculateItemTotal(item)"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model.number="item.unit_price"
                    type="number"
                    step="0.01"
                    class="form-input w-28"
                    required
                    @input="calculateItemTotal(item)"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model.number="item.discount_amount"
                    type="number"
                    step="0.01"
                    class="form-input w-24"
                    @input="calculateItemTotal(item)"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model.number="item.vat_rate"
                    type="number"
                    step="0.01"
                    class="form-input w-20"
                    @input="calculateItemTotal(item)"
                  />
                </td>
                <td class="px-3 py-2 font-medium">
                  {{ formatCurrency(item.total_amount) }}
                </td>
                <td class="px-3 py-2">
                  <button
                    type="button"
                    @click="removeItem(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Invoice Totals -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="max-w-sm ml-auto space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">{{ t('finance.subtotal') }}:</span>
            <span class="font-medium">{{ formatCurrency(subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">{{ t('finance.discount') }}:</span>
            <span class="font-medium">{{ formatCurrency(totalDiscount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">{{ t('finance.vat') }} (15%):</span>
            <span class="font-medium">{{ formatCurrency(totalVAT) }}</span>
          </div>
          <div class="flex justify-between text-lg font-bold border-t pt-2">
            <span>{{ t('finance.total') }}:</span>
            <span>{{ formatCurrency(grandTotal) }}</span>
          </div>
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
      <div class="flex justify-end space-x-3 pt-4 border-t">
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
          :disabled="loading || form.items.length === 0"
        >
          <LoadingSpinner v-if="loading" size="20px" />
          <span v-else>{{ t('common.save') }}</span>
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
  import { formatCurrency } from '@/utils/formatters'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  
  const { t } = useI18n()
  
  const emit = defineEmits(['save', 'cancel'])
  
  const loading = ref(false)
  const parties = ref([])
  
  const form = reactive({
    invoice_type: 'sales',
    invoice_number: 'INV-AUTO',
    party_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    reference_number: '',
    items: [],
    notes: ''
  })
  
  const subtotal = computed(() => {
    return form.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  })
  
  const totalDiscount = computed(() => {
    return form.items.reduce((sum, item) => sum + (item.discount_amount || 0), 0)
  })
  
  const totalVAT = computed(() => {
    return form.items.reduce((sum, item) => sum + (item.vat_amount || 0), 0)
  })
  
  const grandTotal = computed(() => {
    return form.items.reduce((sum, item) => sum + (item.total_amount || 0), 0)
  })
  
  const addItem = () => {
    form.items.push({
      description: '',
      quantity: 1,
      unit_price: 0,
      discount_amount: 0,
      vat_rate: 15,
      vat_amount: 0,
      total_amount: 0
    })
  }
  
  const removeItem = (index) => {
    form.items.splice(index, 1)
  }
  
  const calculateItemTotal = (item) => {
    const lineTotal = (item.quantity * item.unit_price) - (item.discount_amount || 0)
    item.vat_amount = lineTotal * (item.vat_rate / 100)
    item.total_amount = lineTotal + item.vat_amount
  }
  
  const handleSubmit = async () => {
    loading.value = true
  
    try {
      const invoiceData = {
        ...form,
        subtotal: subtotal.value,
        discount_amount: totalDiscount.value,
        vat_amount: totalVAT.value,
        total_amount: grandTotal.value
      }
      
      emit('save', invoiceData)
    } catch (error) {
      console.error('Error saving invoice:', error)
    } finally {
      loading.value = false
    }
  }
  
  // Initialize with one empty item
  addItem()
  </script>