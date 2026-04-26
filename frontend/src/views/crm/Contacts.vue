<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('nav.contacts') }}</h1>
          <p class="text-gray-600 mt-1">{{ t('crm.contactsDescription') }}</p>
        </div>
        <button
          @click="showModal = true"
          class="btn btn-primary"
        >
          {{ t('crm.addContact') }}
        </button>
      </div>
  
      <!-- Contacts Table -->
      <Card>
        <DataTable
          :columns="columns"
          :data="contacts"
          :loading="loading"
          @view="handleView"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </Card>
  
      <!-- Add/Edit Modal -->
      <Modal
        v-model="showModal"
        :title="editingContact ? t('crm.editContact') : t('crm.addContact')"
      >
        <ContactForm
          :contact="editingContact"
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
  import DataTable from '@/components/common/DataTable.vue'
  import Modal from '@/components/common/Modal.vue'
  import ContactForm from '@/components/crm/ContactForm.vue'
  
  const { t } = useI18n()
  const toast = useToast()
  
  const loading = ref(false)
  const showModal = ref(false)
  const editingContact = ref(null)
  const contacts = ref([])
  
  const columns = [
    { key: 'full_name', label: t('crm.name'), sortable: true },
    { key: 'account_name', label: t('crm.account'), sortable: true },
    { key: 'job_title', label: t('crm.jobTitle') },
    { key: 'email', label: t('crm.email') },
    { key: 'phone', label: t('crm.phone') },
    { key: 'mobile', label: t('crm.mobile') },
    { key: 'contact_type', label: t('crm.type') },
    { key: 'actions', label: t('common.actions'), type: 'actions' }
  ]
  
  const fetchContacts = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      contacts.value = [
        {
          id: 1,
          full_name: 'Ahmed Al-Malik',
          account_name: 'Saudi Tech Solutions',
          job_title: 'CEO',
          email: 'ahmed@sauditech.sa',
          phone: '+966112345678',
          mobile: '+966501234567',
          contact_type: 'decision_maker'
        },
        {
          id: 2,
          full_name: 'Fatima Al-Salem',
          account_name: 'Al-Bina Construction',
          job_title: 'Procurement Manager',
          email: 'fatima@albina.sa',
          phone: '+966126543210',
          mobile: '+966507654321',
          contact_type: 'influencer'
        }
      ]
    } catch (error) {
      toast.error(t('common.errorFetchingData'))
    } finally {
      loading.value = false
    }
  }
  
  const handleView = (contact) => {
    console.log('View contact:', contact)
  }
  
  const handleEdit = (contact) => {
    editingContact.value = { ...contact }
    showModal.value = true
  }
  
  const handleDelete = async (contact) => {
    if (confirm(t('common.confirmDelete'))) {
      try {
        contacts.value = contacts.value.filter(c => c.id !== contact.id)
        toast.success(t('crm.contactDeleted'))
      } catch (error) {
        toast.error(t('common.errorDeleting'))
      }
    }
  }
  
  const handleSave = async (contact) => {
    try {
      if (editingContact.value) {
        const index = contacts.value.findIndex(c => c.id === contact.id)
        contacts.value[index] = contact
        toast.success(t('crm.contactUpdated'))
      } else {
        contacts.value.push({ ...contact, id: Date.now() })
        toast.success(t('crm.contactCreated'))
      }
      
      showModal.value = false
      editingContact.value = null
    } catch (error) {
      toast.error(t('common.errorSaving'))
    }
  }
  
  onMounted(() => {
    fetchContacts()
  })
  </script>