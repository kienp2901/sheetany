<template>
    <DashboardLayout v-model:activeTab="activeTab">
        <!-- Header -->
        <WebsiteHeader :websiteName="websiteName" :linkGoogleSheet="linkGoogleSheet" :websiteId="websiteId"  />

        <div class="d-flex flex-grow-1" style="min-height: 0;">
            <!-- Website Sidebar -->
            <WebsiteSidebar :activeTab="activeTab" @change-tab="setActiveTab" />

            <!-- Tab Content -->
            <main class="flex-fill p-4 overflow-auto" style="background-color: #f8f9fa;">
                <DashboardTab v-if="activeTab === 'dashboard'" @change-tab="setActiveTab" />
                <InformationSheetTab v-if="activeTab === 'information'" />
                <ContentSheetTab v-if="activeTab === 'content'" />
                <CustomDomainTab v-if="activeTab === 'domain'" />
                <CustomCodeTab v-if="activeTab === 'code'" />
                <GeneralSettingsTab v-if="activeTab === 'settings'" />
                <IntegrationsTab v-if="activeTab === 'integrations'" />
                <NavbarTab v-if="activeTab === 'navbar'" />
                <PagesTab v-if="activeTab === 'pages'" />
                <EmailsTab v-if="activeTab === 'emails'" />
                <OrdersTab v-if="activeTab === 'orders'" />
                <FeedbacksTab v-if="activeTab === 'feedbacks'" />
                <WebhooksTab v-if="activeTab === 'webhooks'" />
                <SitemapTab v-if="activeTab === 'sitemap'" />
                <RSSTab v-if="activeTab === 'rss'" />
            </main>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth.js'

import DashboardLayout from '@/layouts/DashboardLayout.vue'
import Sidebar from '../components/Sidebar.vue'
import WebsiteSidebar from '../components/website/WebsiteSidebar.vue'
import WebsiteHeader from '../components/website/WebsiteHeader.vue'

// Import components
import DashboardTab from '../components/website/DashboardTab.vue'
import InformationSheetTab from '../components/website/InformationSheetTab.vue'
import ContentSheetTab from '../components/website/ContentSheetTab.vue'
import CustomDomainTab from '../components/website/CustomDomainTab.vue'
import CustomCodeTab from '../components/website/CustomCodeTab.vue'
import GeneralSettingsTab from '../components/website/GeneralSettingsTab.vue'
import IntegrationsTab from '../components/website/IntegrationsTab.vue'
import NavbarTab from '../components/website/NavbarTab.vue'
import PagesTab from '../components/website/PagesTab.vue'
import EmailsTab from '../components/website/EmailsTab.vue'
import OrdersTab from '../components/website/OrdersTab.vue'
import FeedbacksTab from '../components/website/FeedbacksTab.vue'
import WebhooksTab from '../components/website/WebhooksTab.vue'
import SitemapTab from '../components/website/SitemapTab.vue'
import RSSTab from '../components/website/RSSTab.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeTab = ref('dashboard')
const websiteName = ref('')
const linkGoogleSheet = ref('')
const websiteData = ref(null)
let websiteId = route.params.id

const setActiveTab = (tab) => {
    activeTab.value = tab
}

const handleLogout = async () => {
    await authStore.logout()
    router.push('/')
}

// ✨ Fetch website info by ID
const fetchWebsiteInfo = async (id) => {
    try {
        const res = await axios.get(`/api/sites/${id}`)
        websiteData.value = res.data
        websiteName.value = res.data.name || 'Unnamed Website'
        linkGoogleSheet.value = res.data.google_sheet || ''
        console.log('Website data:', res.data)
    } catch (err) {
        console.error('Failed to fetch website info:', err)
        websiteName.value = 'Unknown Website'
        inkGoogleSheet.value = ''
    }
}

onMounted(() => {
    if (websiteId) {
        fetchWebsiteInfo(websiteId) // ✨ Call the function
    }
})
</script>