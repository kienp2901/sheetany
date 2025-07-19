<template>
    <div class="min-vh-100 d-flex">
        <!-- Sidebar -->
        <div class="bg-light border-end" style="width: 80px; min-height: 100vh;">
            <div class="d-flex flex-column align-items-center py-3">
                <!-- Logo -->
                <div class="mb-4 d-flex align-items-center justify-content-center bg-success rounded-circle"
                    style="width: 32px; height: 32px;">
                    <i class="bi bi-pause-fill text-white"></i>
                </div>

                <!-- Navigation Items -->
                <div class="d-flex flex-column gap-3">
                    <button @click="$router.push('/dashboard/websites')"
                        class="btn btn-sm d-flex flex-column align-items-center text-decoration-none border-0 text-muted bg-transparent"
                        style="width: 60px;">
                        <i class="bi bi-house fs-5 mb-1"></i>
                        <small style="font-size: 10px;">Home</small>
                    </button>

                    <button
                        class="btn btn-sm d-flex flex-column align-items-center text-decoration-none border-0 text-muted bg-transparent"
                        style="width: 60px;">
                        <i class="bi bi-grid fs-5 mb-1"></i>
                        <small style="font-size: 10px;">Website</small>
                    </button>

                    <button
                        class="btn btn-sm d-flex flex-column align-items-center text-decoration-none border-0 text-muted bg-transparent"
                        style="width: 60px;">
                        <i class="bi bi-upload fs-5 mb-1"></i>
                        <small style="font-size: 10px;">Files</small>
                    </button>

                    <button
                        class="btn btn-sm d-flex flex-column align-items-center text-decoration-none border-0 text-muted bg-transparent"
                        style="width: 60px;">
                        <i class="bi bi-currency-dollar fs-5 mb-1"></i>
                        <small style="font-size: 10px;">Pricing</small>
                    </button>

                    <button
                        class="btn btn-sm d-flex flex-column align-items-center text-decoration-none border-0 text-muted bg-transparent"
                        style="width: 60px;">
                        <i class="bi bi-person fs-5 mb-1"></i>
                        <small style="font-size: 10px;">Profile</small>
                    </button>

                    <button
                        class="btn btn-sm d-flex flex-column align-items-center text-decoration-none border-0 text-muted bg-transparent"
                        style="width: 60px;">
                        <i class="bi bi-code-slash fs-5 mb-1"></i>
                        <small style="font-size: 10px;">API</small>
                    </button>
                </div>

                <!-- Logout Button -->
                <div class="mt-auto">
                    <button @click="handleLogout"
                        class="btn btn-sm d-flex flex-column align-items-center text-muted text-decoration-none border-0 bg-transparent"
                        style="width: 60px;">
                        <i class="bi bi-box-arrow-right fs-5 mb-1"></i>
                        <small style="font-size: 10px;">Logout</small>
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-fill">
            <!-- Header -->
            <header class="bg-white border-bottom px-4 py-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb mb-0">
                                <li class="breadcrumb-item">
                                    <router-link to="/dashboard/websites" class="text-decoration-none text-muted">My
                                        websites</router-link>
                                </li>
                                <li class="breadcrumb-item active text-dark">{{ websiteName }}</li>
                            </ol>
                        </nav>
                        <span class="text-muted ms-3 small">Synced: an hour ago</span>
                    </div>

                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-brightness-high me-3 text-muted"></i>
                        <button class="btn btn-outline-secondary btn-sm">Feedback</button>
                        <button class="btn btn-success btn-sm">
                            <i class="bi bi-pencil me-1"></i>
                            Edit Google Sheets
                        </button>
                        <button class="btn btn-outline-secondary btn-sm">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                        <button class="btn btn-success btn-sm">Upgrade →</button>
                        <button class="btn btn-outline-success btn-sm">
                            View website <i class="bi bi-box-arrow-up-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </header>

            <div class="d-flex flex-fill">
                <!-- Website Sidebar -->
                <div class="bg-light border-end" style="width: 280px; min-height: calc(100vh - 80px);">
                    <div class="p-3">
                        <nav class="nav flex-column">
                            <button @click="setActiveTab('dashboard')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'dashboard' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-speedometer2 me-3"></i>
                                Dashboard
                            </button>

                            <button @click="setActiveTab('information')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'information' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-info-circle me-3"></i>
                                Information sheet
                            </button>

                            <button @click="setActiveTab('content')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'content' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-table me-3"></i>
                                Content sheet
                            </button>

                            <button @click="setActiveTab('domain')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'domain' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-globe me-3"></i>
                                Custom domain
                            </button>

                            <button @click="setActiveTab('code')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'code' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-code-slash me-3"></i>
                                Custom code
                            </button>

                            <button @click="setActiveTab('settings')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'settings' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-gear me-3"></i>
                                General settings
                            </button>

                            <button @click="setActiveTab('integrations')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'integrations' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-puzzle me-3"></i>
                                Integrations
                            </button>

                            <button @click="setActiveTab('navbar')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'navbar' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-menu-button-wide me-3"></i>
                                Navbar
                            </button>

                            <button @click="setActiveTab('pages')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'pages' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-file-earmark me-3"></i>
                                Pages
                            </button>

                            <button @click="setActiveTab('emails')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'emails' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-envelope me-3"></i>
                                Emails
                            </button>

                            <button @click="setActiveTab('orders')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'orders' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-bag me-3"></i>
                                Orders
                            </button>

                            <button @click="setActiveTab('feedbacks')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'feedbacks' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-chat-dots me-3"></i>
                                Feedbacks
                            </button>

                            <button @click="setActiveTab('webhooks')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'webhooks' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-webhook me-3"></i>
                                Webhooks
                            </button>

                            <button @click="setActiveTab('sitemap')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'sitemap' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-diagram-3 me-3"></i>
                                Sitemap
                            </button>

                            <button @click="setActiveTab('rss')"
                                :class="['nav-link', 'd-flex', 'align-items-center', 'text-start', 'border-0', 'bg-transparent', 'w-100', 'py-2', 'px-3', 'rounded', activeTab === 'rss' ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted']">
                                <i class="bi bi-rss me-3"></i>
                                RSS
                            </button>
                        </nav>
                    </div>
                </div>

                <!-- Tab Content -->
                <main class="flex-fill p-4" style="background-color: #f8f9fa;">
                    <DashboardTab v-if="activeTab === 'dashboard'" />
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
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

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
const websiteName = ref('Test Web')

const setActiveTab = (tab) => {
    activeTab.value = tab
}

const handleLogout = async () => {
    await authStore.logout()
    router.push('/')
}

onMounted(() => {
    // Get website ID from route params
    const websiteId = route.params.id
    console.log('Website ID:', websiteId)
})
</script>