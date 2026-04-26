<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.accounts') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('finance.accountsDescription') }}</p>
        </div>
        <button
          @click="showModal = true"
          class="btn btn-primary"
        >
          {{ t('finance.addAccount') }}
        </button>
      </div>
  
      <!-- Account Tree -->
      <Card :title="t('finance.accountStructure')">
        <AccountTree
          :accounts="accounts"
          :loading="loading"
          @edit="handleEdit"
          @delete="handleDelete"
          @add-child="handleAddChild"
        />
      </Card>
  
      <!-- Modal -->
      <Modal
        v-model="showModal"
        :title="editingAccount ? t('finance.editAccount') : t('finance.addAccount')"
      >
        <AccountForm
          :account="editingAccount"
          :parent-account="parentAccount"
          @save="handleSave"
          @cancel="showModal = false"
        />
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  
  import Card from '@/components/common/Card.vue'
  import Modal from '@/components/common/Modal.vue'
  import AccountTree from '@/components/finance/AccountTree.vue'
  import AccountForm from '@/components/finance/AccountForm.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const showModal = ref(false)
  const editingAccount = ref(null)
  const parentAccount = ref(null)
  const accounts = ref([])
  
  const fetchAccounts = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      accounts.value = [
        {
          id: 1,
          account_code: '1000',
          account_name: 'Assets',
          account_type: 'asset',
          is_header: true,
          children: [
            {
              id: 2,
              account_code: '1100',
              account_name: 'Current Assets',
              account_type: 'asset',
              is_header: true,
              children: [
                {
                  id: 3,
                  account_code: '1110',
                  account_name: 'Cash',
                  account_type: 'asset',
                  balance: 100000
                }
              ]
            }
          ]
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const handleEdit = (account) => {
    editingAccount.value = { ...account }
    showModal.value = true
  }
  
  const handleDelete = async (account) => {
    if (confirm(t('common.confirmDelete'))) {
      try {
        toast.success(t('finance.accountDeleted'))
      } catch (error) {
        toast.error(t('common.errorDeleting'))
      }
    }
  }
  
  const handleAddChild = (account) => {
    parentAccount.value = account
    showModal.value = true
  }
  
  const handleSave = async (account) => {
    try {
      toast.success(editingAccount.value ? t('finance.accountUpdated') : t('finance.accountCreated'))
      showModal.value = false
      editingAccount.value = null
      parentAccount.value = null
      await fetchAccounts()
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  onMounted(() => {
    fetchAccounts()
  })
  </script>