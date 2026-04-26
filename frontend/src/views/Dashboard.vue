<template>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ t('dashboard.title') }}
          </h1>
          <p class="text-gray-600 mt-1">
            {{ t('app.welcome') }}, {{ user?.full_name || user?.username }}!
          </p>
        </div>
        
        <!-- Date Display -->
        <div class="text-right">
          <div class="text-sm text-gray-600">{{ currentDateGregorian }}</div>
          <div class="text-sm text-gray-600">{{ currentDateHijri }}</div>
        </div>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          :title="t('dashboard.totalEmployees')"
          :value="stats.totalEmployees"
          icon="users"
          color="blue"
          :loading="loading"
        />
        
        <StatsCard
          :title="t('dashboard.activeProjects')"
          :value="stats.activeProjects"
          icon="briefcase"
          color="green"
          :loading="loading"
        />
        
        <StatsCard
          :title="t('dashboard.openTasks')"
          :value="stats.openTasks"
          icon="check-circle"
          color="orange"
          :loading="loading"
        />
        
        <StatsCard
          :title="t('dashboard.revenue')"
          :value="formatCurrency(stats.revenue)"
          icon="currency-dollar"
          color="purple"
          :loading="loading"
        />
      </div>
  
      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Chart -->
        <Card :title="$t('dashboard.revenueChart')">
          <apexchart
            v-if="!loading"
            type="area"
            height="300"
            :options="revenueChartOptions"
            :series="revenueChartSeries"
          />
          <LoadingSpinner v-else />
        </Card>
  
        <!-- Tasks Chart -->
        <Card :title="$t('dashboard.tasksOverview')">
          <apexchart
            v-if="!loading"
            type="donut"
            height="300"
            :options="tasksChartOptions"
            :series="tasksChartSeries"
          />
          <LoadingSpinner v-else />
        </Card>
      </div>
  
      <!-- Recent Activities & Upcoming Events -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activities -->
        <Card :title="t('dashboard.recentActivities')">
          <div v-if="!loading" class="space-y-4">
            <ActivityItem
              v-for="activity in recentActivities"
              :key="activity.id"
              :activity="activity"
            />
            
            <div v-if="recentActivities.length === 0" class="text-center py-8 text-gray-500">
              {{ t('common.noData') }}
            </div>
          </div>
          <LoadingSpinner v-else />
        </Card>
  
        <!-- Upcoming Events -->
        <Card :title="t('dashboard.upcomingEvents')">
          <div v-if="!loading" class="space-y-4">
            <EventItem
              v-for="event in upcomingEvents"
              :key="event.id"
              :event="event"
            />
            
            <div v-if="upcomingEvents.length === 0" class="text-center py-8 text-gray-500">
              {{ t('common.noData') }}
            </div>
          </div>
          <LoadingSpinner v-else />
        </Card>
      </div>
  
      <!-- Quick Actions -->
      <Card :title="$t('dashboard.quickActions')">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            icon="user-plus"
            :label="$t('dashboard.addEmployee')"
            @click="$router.push('/hr/employees')"
          />
          
          <QuickActionButton
            icon="document-plus"
            :label="$t('dashboard.newInvoice')"
            @click="$router.push('/finance/invoices')"
          />
          
          <QuickActionButton
            icon="clipboard-list"
            :label="$t('dashboard.createTask')"
            @click="$router.push('/tasks')"
          />
          
          <QuickActionButton
            icon="folder-plus"
            :label="$t('dashboard.newProject')"
            @click="$router.push('/projects')"
          />
        </div>
      </Card>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '@/store/modules/auth'
  import { format } from 'date-fns'
  import { HijriDate } from 'hijri-date/lib/safe'
  
  import Card from '@/components/common/Card.vue'
  import StatsCard from '@/components/common/StatsCard.vue'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  import ActivityItem from '@/components/dashboard/ActivityItem.vue'
  import EventItem from '@/components/dashboard/EventItem.vue'
  import QuickActionButton from '@/components/dashboard/QuickActionButton.vue'
  
  const { t } = useI18n()
  const authStore = useAuthStore()
  
  const user = computed(() => authStore.user)
  const loading = ref(true)
  
  // Stats
  const stats = ref({
    totalEmployees: 0,
    activeProjects: 0,
    openTasks: 0,
    revenue: 0
  })
  
  // Dates
  const currentDateGregorian = computed(() => {
    return format(new Date(), 'EEEE, MMMM dd, yyyy')
  })
  
  const currentDateHijri = computed(() => {
    const hijri = new HijriDate()
    return `${hijri.getDate()} ${hijri.getMonthName()} ${hijri.getFullYear()} هـ`
  })
  
  // Recent Activities
  const recentActivities = ref([])
  
  // Upcoming Events
  const upcomingEvents = ref([])
  
  // Revenue Chart
  const revenueChartSeries = ref([{
    name: 'Revenue',
    data: [30000, 40000, 35000, 50000, 49000, 60000, 70000, 91000, 85000, 100000, 95000, 110000]
  }])
  
  const revenueChartOptions = ref({
    chart: {
      type: 'area',
      toolbar: {
        show: false
      }
    },
    colors: ['#3b82f6'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return formatCurrency(value)
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => {
          return formatCurrency(value)
        }
      }
    }
  })
  
  // Tasks Chart
  const tasksChartSeries = ref([45, 30, 15, 10])
  const tasksChartOptions = ref({
    chart: {
      type: 'donut',
    },
    labels: ['Completed', 'In Progress', 'Pending', 'Cancelled'],
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => {
        return Math.round(val) + '%'
      }
    }
  })
  
  // Helper Functions
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(value)
  }
  
  const fetchDashboardData = async () => {
    loading.value = true
    
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      stats.value = {
        totalEmployees: 245,
        activeProjects: 18,
        openTasks: 67,
        revenue: 1250000
      }
      
      recentActivities.value = [
        {
          id: 1,
          type: 'employee',
          title: 'New employee added',
          description: 'John Doe joined as Software Engineer',
          time: '2 hours ago',
          icon: 'user-plus',
          color: 'blue'
        },
        {
          id: 2,
          type: 'invoice',
          title: 'Invoice created',
          description: 'INV-2024-001 for SAR 50,000',
          time: '4 hours ago',
          icon: 'document-text',
          color: 'green'
        },
        {
          id: 3,
          type: 'task',
          title: 'Task completed',
          description: 'Website redesign completed',
          time: '6 hours ago',
          icon: 'check-circle',
          color: 'purple'
        },
        {
          id: 4,
          type: 'project',
          title: 'Project milestone reached',
          description: 'Phase 1 of Building Construction completed',
          time: '1 day ago',
          icon: 'flag',
          color: 'orange'
        }
      ]
      
      upcomingEvents.value = [
        {
          id: 1,
          title: 'Team Meeting',
          date: 'Today, 3:00 PM',
          type: 'meeting',
          color: 'blue'
        },
        {
          id: 2,
          title: 'Project Deadline',
          date: 'Tomorrow',
          type: 'deadline',
          color: 'red'
        },
        {
          id: 3,
          title: 'Employee Training',
          date: 'Jan 25, 2024',
          type: 'training',
          color: 'green'
        },
        {
          id: 4,
          title: 'Board Meeting',
          date: 'Jan 30, 2024',
          type: 'meeting',
          color: 'purple'
        }
      ]
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    fetchDashboardData()
  })
  </script>