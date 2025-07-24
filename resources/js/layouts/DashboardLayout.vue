<template>
  <div class="min-vh-100 d-flex">
   <Sidebar :activeTab="currentTab" @change-tab="setActiveTab" @logout="handleLogout" />

    <div class="flex-fill d-flex flex-column overflow-hidden">
      <Header @show-feedback="showFeedbackModal = true" @change-tab="setActiveTab" />

      <!-- Nội dung truyền từ page -->
      <main class="p-4" style="background-color: #f8f9fa; min-height: calc(100vh - 80px);">
        <slot />
      </main>
    </div>

    <FeedbackModal
      v-if="showFeedbackModal"
      @close="showFeedbackModal = false"
      @submit="submitFeedback"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'
import FeedbackModal from '@/components/FeedbackModal.vue'

// === Nhận props từ cha ===
const props = defineProps({
  activeTab: String,
})
const emit = defineEmits(['update:activeTab'])

const showFeedbackModal = ref(false)
const router = useRouter()
const authStore = useAuthStore()

// Dùng computed để ánh xạ activeTab từ prop và có thể emit ngược lại
const currentTab = computed({
  get: () => props.activeTab,
  set: (val) => emit('update:activeTab', val),
})

const setActiveTab = (tab) => {
  currentTab.value = tab
  router.push(`/dashboard/${tab}`)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const submitFeedback = (text) => {
  console.log('Feedback submitted:', text)
}
</script>
