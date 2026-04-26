<template>
  <div
    id="app"
    :class="{ rtl: currentLocale === 'ar' }"
    :dir="currentLocale === 'ar' ? 'rtl' : 'ltr'"
  >
    <router-view />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/store/modules/auth";

const { locale } = useI18n();
const authStore = useAuthStore();

const currentLocale = computed(() => locale.value);

onMounted(async () => {
  // Check if user is logged in
  if (localStorage.getItem("token")) {
    await authStore.checkAuth();
  }

  // Set language from localStorage or default
  const savedLocale = localStorage.getItem("locale") || "en";
  locale.value = savedLocale;

  // Apply RTL class if Arabic
  if (savedLocale === "ar") {
    document.body.classList.add("rtl");
  }
});
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>
