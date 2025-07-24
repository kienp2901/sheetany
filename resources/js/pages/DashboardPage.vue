<template>
  <DashboardLayout v-model:activeTab="activeTab">
    <ProfileTab v-if="activeTab === 'profile'" />
    <WebsitesTab v-if="activeTab === 'websites'" />
    <FilesTab v-if="activeTab === 'files'" />
    <APITab v-if="activeTab === 'api'" />
    <WorkspacesTab v-if="activeTab === 'workspaces'" />
    <PricingTab v-if="activeTab === 'pricing'" />
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import DashboardLayout from '@/layouts/DashboardLayout.vue'

import ProfileTab from '@/components/dashboard/ProfileTab.vue'
import WebsitesTab from '@/components/dashboard/WebsitesTab.vue'
import FilesTab from '@/components/dashboard/FilesTab.vue'
import APITab from '@/components/dashboard/APITab.vue'
import WorkspacesTab from '@/components/dashboard/WorkspacesTab.vue'
import PricingTab from '@/components/dashboard/PricingTab.vue'

const route = useRoute()
const activeTab = ref('websites')

onMounted(() => {
  activeTab.value = route.meta?.tab || 'websites'
})
</script>

<style scoped>
.modal {
    z-index: 1050;
}

.btn:focus {
    box-shadow: none;
}

.nav-item.active {
    color: #28a745 !important;
}

.input-group-text {
    background-color: #f8f9fa;
    border-right: none;
}

.form-control {
    border-left: none;
}

.form-control:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.input-group:focus-within .input-group-text {
    border-color: #28a745;
}
</style>