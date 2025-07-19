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
                    <button @click="setActiveTab('websites')"
                        :class="['btn', 'btn-sm', 'd-flex', 'flex-column', 'align-items-center', 'text-decoration-none', 'border-0', activeTab === 'websites' ? 'text-success bg-success bg-opacity-10' : 'text-muted bg-transparent']"
                        style="width: 60px;">
                        <i class="bi bi-house fs-5 mb-1"></i>
                        <small style="font-size: 10px;">Home</small>
                    </button>

                    <!-- <button @click="setActiveTab('websites')"
                        :class="['btn', 'btn-sm', 'd-flex', 'flex-column', 'align-items-center', 'text-decoration-none', 'border-0', activeTab === 'websites' ? 'text-success bg-success bg-opacity-10' : 'text-muted bg-transparent']"
                        style="width: 60px;">
                        <i class="bi bi-grid fs-5 mb-1"></i>
                        <small style="font-size: 10px;">WS</small>
                    </button> -->

                    <button @click="setActiveTab('files')"
                        :class="['btn', 'btn-sm', 'd-flex', 'flex-column', 'align-items-center', 'text-decoration-none', 'border-0', activeTab === 'files' ? 'text-success bg-success bg-opacity-10' : 'text-muted bg-transparent']"
                        style="width: 60px;">
                        <i class="bi bi-upload fs-5 mb-1"></i>
                        <small style="font-size: 10px;">Files</small>
                    </button>

                    <button @click="setActiveTab('pricing')"
                        :class="['btn', 'btn-sm', 'd-flex', 'flex-column', 'align-items-center', 'text-decoration-none', 'border-0', activeTab === 'pricing' ? 'text-success bg-success bg-opacity-10' : 'text-muted bg-transparent']"
                        style="width: 60px;">
                        <i class="bi bi-currency-dollar fs-5 mb-1"></i>
                        <small style="font-size: 10px;">Pricing</small>
                    </button>

                    <button @click="setActiveTab('profile')"
                        :class="['btn', 'btn-sm', 'd-flex', 'flex-column', 'align-items-center', 'text-decoration-none', 'border-0', activeTab === 'profile' ? 'text-success bg-success bg-opacity-10' : 'text-muted bg-transparent']"
                        style="width: 60px;">
                        <i class="bi bi-person fs-5 mb-1"></i>
                        <small style="font-size: 10px;">Profile</small>
                    </button>

                    <button @click="setActiveTab('workspaces')"
                        :class="['btn', 'btn-sm', 'd-flex', 'flex-column', 'align-items-center', 'text-decoration-none', 'border-0', activeTab === 'workspaces' ? 'text-success bg-success bg-opacity-10' : 'text-muted bg-transparent']"
                        style="width: 60px;">
                        <i class="bi bi-briefcase fs-5 mb-1"></i>
                        <small style="font-size: 10px;">WS</small>
                    </button>

                    <button @click="setActiveTab('api')"
                        :class="['btn', 'btn-sm', 'd-flex', 'flex-column', 'align-items-center', 'text-decoration-none', 'border-0', activeTab === 'api' ? 'text-success bg-success bg-opacity-10' : 'text-muted bg-transparent']"
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
                        <i class="bi bi-brightness-high me-3 text-muted"></i>
                    </div>

                    <div class="d-flex align-items-center gap-2">
                        <button @click="showFeedbackModal = true" class="btn btn-outline-secondary btn-sm">
                            Feedback
                        </button>
                        <button @click="setActiveTab('pricing')" class="btn btn-success btn-sm">
                            Upgrade →
                        </button>
                    </div>
                </div>
            </header>

            <!-- Tab Content -->
            <main class="p-4" style="background-color: #f8f9fa; min-height: calc(100vh - 80px);">
                <ProfileTab v-if="activeTab === 'profile'" />
                <WebsitesTab v-if="activeTab === 'websites'" />
                <FilesTab v-if="activeTab === 'files'" />
                <APITab v-if="activeTab === 'api'" />
                <WorkspacesTab v-if="activeTab === 'workspaces'" />
                <PricingTab v-if="activeTab === 'pricing'" />
            </main>
        </div>

        <!-- Feedback Modal -->
        <div v-if="showFeedbackModal" class="modal d-block" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title">Give us your feedback ❤️</h5>
                        <button type="button" class="btn-close" @click="showFeedbackModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <textarea v-model="feedbackText" class="form-control" rows="5"
                            placeholder="Feature, request, bug, improvement or other..."></textarea>
                    </div>
                    <div class="modal-footer border-0">
                        <button @click="submitFeedback" class="btn btn-success w-100">
                            Send feedback 🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import ProfileTab from '../components/dashboard/ProfileTab.vue'
import WebsitesTab from '../components/dashboard/WebsitesTab.vue'
import FilesTab from '../components/dashboard/FilesTab.vue'
import APITab from '../components/dashboard/APITab.vue'
import WorkspacesTab from '../components/dashboard/WorkspacesTab.vue'
import PricingTab from '../components/dashboard/PricingTab.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeTab = ref('websites')
const showFeedbackModal = ref(false)
const feedbackText = ref('')

onMounted(() => {
    const tab = route.meta?.tab || 'websites'
    activeTab.value = tab
})

const setActiveTab = (tab) => {
    activeTab.value = tab
    router.push(`/dashboard/${tab}`)
}

const handleLogout = async () => {
    await authStore.logout()
    router.push('/')
}

const submitFeedback = () => {
    console.log('Feedback:', feedbackText.value)
    showFeedbackModal.value = false
    feedbackText.value = ''
}
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