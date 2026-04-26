<template>
    <div class="space-y-4">
      <!-- Header Actions -->
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ t('projects.billOfQuantities') }}</h3>
        <button
          @click="showAddModal = true"
          class="btn btn-sm btn-primary"
        >
          <PlusIcon class="h-4 w-4 mr-1" />
          {{ t('projects.addItem') }}
        </button>
      </div>
  
      <!-- BOQ Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('projects.itemCode') }}
              </th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('projects.description') }}
              </th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('projects.quantity') }}
              </th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('projects.unit') }}
              </th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('projects.unitPrice') }}
              </th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('projects.total') }}
              </th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('projects.completedQty') }}
              </th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {{ t('projects.progress') }}
              </th>
              <th class="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in boqItems" :key="item.id" class="hover:bg-gray-50">
              <td class="px-3 py-2 text-sm font-medium">
                {{ item.item_code }}
              </td>
              <td class="px-3 py-2 text-sm">
                {{ item.description }}
              </td>
              <td class="px-3 py-2 text-sm">
                {{ formatNumber(item.quantity) }}
              </td>
              <td class="px-3 py-2 text-sm">
                {{ item.unit }}
              </td>
              <td class="px-3 py-2 text-sm">
                {{ formatCurrency(item.unit_price) }}
              </td>
              <td class="px-3 py-2 text-sm font-medium">
                {{ formatCurrency(item.total_price) }}
              </td>
              <td class="px-3 py-2 text-sm">
                <input
                  v-model.number="item.completed_quantity"
                  type="number"
                  step="0.01"
                  class="form-input w-20 text-sm"
                  @change="updateProgress(item)"
                />
              </td>
              <td class="px-3 py-2 text-sm">
                <div class="flex items-center space-x-2">
                  <div class="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full"
                      :class="getProgressColor(item.progress_percent)"
                      :style="{ width: item.progress_percent + '%' }"
                    ></div>
                  </div>
                  <span class="text-xs">{{ item.progress_percent }}%</span>
                </div>
              </td>
              <td class="px-3 py-2 text-right">
                <button
                  @click="editItem(item)"
                  class="text-blue-600 hover:text-blue-800 mr-2"
                >
                  <PencilIcon class="h-4 w-4" />
                </button>
                <button
                  @click="deleteItem(item.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td colspan="6" class="px-3 py-2 text-right font-semibold">
                {{ t('projects.total') }}:
              </td>
              <td class="px-3 py-2 font-semibold">
                {{ formatCurrency(totalValue) }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
  
      <!-- Add/Edit Modal -->
      <Modal
        v-model="showModal"
        :title="editingItem ? t('projects.editBOQItem') : t('projects.addBOQItem')"
      >
        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="form-label">{{ t('projects.itemCode') }} *</label>
            <input
              v-model="form.item_code"
              type="text"
              class="form-input"
              required
            />
          </div>
  
          <div>
            <label class="form-label">{{ t('projects.description') }} *</label>
            <textarea
              v-model="form.description"
              class="form-input"
              rows="2"
              required
            ></textarea>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">{{ t('projects.quantity') }} *</label>
              <input
                v-model.number="form.quantity"
                type="number"
                step="0.01"
                class="form-input"
                required
                @input="calculateTotal"
              />
            </div>
  
            <div>
              <label class="form-label">{{ t('projects.unit') }} *</label>
              <input
                v-model="form.unit"
                type="text"
                class="form-input"
                required
              />
            </div>
  
            <div>
              <label class="form-label">{{ t('projects.unitPrice') }} *</label>
              <input
                v-model.number="form.unit_price"
                type="number"
                step="0.01"
                class="form-input"
                required
                @input="calculateTotal"
              />
            </div>
  
            <div>
              <label class="form-label">{{ t('projects.discountAmount') }}</label>
              <input
                v-model.number="form.discount_amount"
                type="number"
                step="0.01"
                class="form-input"
                @input="calculateTotal"
              />
            </div>
  
            <div>
              <label class="form-label">{{ t('projects.vatRate') }}</label>
              <input
                v-model.number="form.vat_rate"
                type="number"
                step="0.01"
                class="form-input"
                @input="calculateTotal"
              />
            </div>
  
            <div>
              <label class="form-label">{{ t('projects.totalAmount') }}</label>
              <input
                v-model.number="form.total_amount"
                type="number"
                step="0.01"
                class="form-input bg-gray-50"
                readonly
              />
            </div>
          </div>
  
          <div>
            <label class="form-label">{{ t('projects.completedQuantity') }}</label>
            <input
              v-model.number="form.completed_quantity"
              type="number"
              step="0.01"
              class="form-input"
            />
          </div>
  
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showModal = false"
              class="btn btn-outline"
            >
              {{ t('common.cancel') }}
            </button>
            
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              <LoadingSpinner v-if="loading" size="20px" />
              <span v-else>{{ editingItem ? t('common.update') : t('common.create') }}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useProjectsStore } from '@/store/modules/projects'
  import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
  import Modal from '@/components/common/Modal.vue'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  import { formatCurrency, formatNumber } from '@/utils/formatters'
  
  const { t } = useI18n()
  const projectsStore = useProjectsStore()
  
  const props = defineProps({
    projectId: {
      type: String,
      required: true
    }
  })
  
  const loading = ref(false)
  const showModal = ref(false)
  const editingItem = ref(null)
  
  const boqItems = computed(() => projectsStore.boqItems)
  const totalValue = computed(() => {
    return boqItems.value.reduce((sum, item) => sum + (item.total_price || 0), 0)
  })
  
  const form = ref({
    item_code: '',
    description: '',
    quantity: 1,
    unit: '',
    unit_price: 0,
    discount_amount: 0,
    vat_rate: 15,
    vat_amount: 0,
    total_amount: 0,
    completed_quantity: 0
  })
  
  const calculateTotal = () => {
    const lineTotal = (form.value.quantity * form.value.unit_price) - (form.value.discount_amount || 0)
    form.value.vat_amount = lineTotal * (form.value.vat_rate / 100)
    form.value.total_amount = lineTotal + form.value.vat_amount
  }
  
  const calculateItemTotal = (item) => {
    const lineTotal = (item.quantity * item.unit_price) - (item.discount_amount || 0)
    item.vat_amount = lineTotal * (item.vat_rate / 100)
    item.total_amount = lineTotal + item.vat_amount
  }
  
  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }
  
  const addItem = () => {
    editingItem.value = null
    form.value = {
      item_code: '',
      description: '',
      quantity: 1,
      unit: '',
      unit_price: 0,
      discount_amount: 0,
      vat_rate: 15,
      vat_amount: 0,
      total_amount: 0,
      completed_quantity: 0
    }
    showModal.value = true
  }
  
  const editItem = (item) => {
    editingItem.value = item
    Object.assign(form.value, { ...item })
    showModal.value = true
  }
  
  const deleteItem = async (itemId) => {
    if (confirm(t('common.confirmDelete'))) {
      try {
        await projectsStore.deleteBOQItem(props.projectId, itemId)
      } catch (error) {
        console.error('Error deleting BOQ item:', error)
      }
    }
  }
  
  const updateProgress = async (item) => {
    try {
      await projectsStore.updateBOQProgress(props.projectId, item.id, {
        completed_quantity: item.completed_quantity
      })
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }
  
  const handleSave = async () => {
    loading.value = true
    
    try {
      if (editingItem.value) {
        await projectsStore.updateBOQItem(props.projectId, editingItem.value.id, form.value)
      } else {
        await projectsStore.createBOQItem(props.projectId, form.value)
      }
      
      showModal.value = false
      await projectsStore.fetchBOQ(props.projectId)
    } catch (error) {
      console.error('Error saving BOQ item:', error)
    } finally {
      loading.value = false
    }
  }
  
  const fetchBOQ = async () => {
    await projectsStore.fetchBOQ(props.projectId)
  }
  
  onMounted(() => {
    fetchBOQ()
  })
  </script>