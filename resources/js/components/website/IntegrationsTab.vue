<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Integrations</h4>
                <p class="text-muted mb-0">Add third party integrations to your website</p>
            </div>
        </div>

        <div class="row g-3">
            <!-- Google Analytics -->
            <div class="col-12 col-md-6">
                <div class="card h-100 border-1 integration-card" @click="openIntegrationDialog('google-analytics')">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-start mb-3">
                            <img :src="googleAnalytics" alt="Google Analytics" class="me-3" style="width: 40px; height: 40px;" />
                            <div class="flex-fill">
                                <h6 class="mb-1 fw-semibold">Google Analytics</h6>
                            </div>
                        </div>
                        <p class="card-text text-muted small mb-0">
                            Get traffic insights from your website in your Google Analytics dashboard.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Google Adsense -->
            <div class="col-12 col-md-6">
                <div class="card h-100 border-1 integration-card" @click="openIntegrationDialog('google-adsense')">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-start mb-3">
                            <img :src="googleAdsense" alt="Google Adsense" class="me-3" style="width: 40px; height: 40px;" />
                            <div class="flex-fill">
                                <h6 class="mb-1 fw-semibold">Google Adsense</h6>
                            </div>
                        </div>
                        <p class="card-text text-muted small mb-0">
                            Monetize your website with Google AdSense and earn revenue from ads.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Crisp Chat -->
            <div class="col-12 col-md-6">
                <div class="card h-100 border-1 integration-card" @click="openIntegrationDialog('crisp-chat')">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-start mb-3">
                            <img :src="crispLogo" alt="Crisp Chat" class="me-3" style="width: 40px; height: 40px;" />
                            <div class="flex-fill">
                                <h6 class="mb-1 fw-semibold">Crisp Chat</h6>
                            </div>
                        </div>
                        <p class="card-text text-muted small mb-0">
                            Engage with your visitors in real-time using Crisp Chat.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Google Tag Manager -->
            <div class="col-12 col-md-6">
                <div class="card h-100 border-1 integration-card" @click="openIntegrationDialog('google-tag-manager')">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-start mb-3">
                            <img :src="googleTag" alt="Google Tag Manager" class="me-3" style="width: 40px; height: 40px;" />
                            <div class="flex-fill">
                                <h6 class="mb-1 fw-semibold">Google Tag Manager</h6>
                            </div>
                        </div>
                        <p class="card-text text-muted small mb-0">
                            Easily track and manage audience interactions on your website.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Mailchimp -->
            <div class="col-12 col-md-6">
                <div class="card h-100 border-1 integration-card" @click="openIntegrationDialog('mailchimp')">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-start mb-3">
                            <img :src="mailchimpLogo" alt="Mailchimp" class="me-3" style="width: 40px; height: 40px;" />
                            <div class="flex-fill">
                                <h6 class="mb-1 fw-semibold">Mailchimp</h6>
                                <span class="badge bg-secondary small">Coming soon</span>
                            </div>
                        </div>
                        <p class="card-text text-muted small mb-0">
                            Grow your audience and manage email marketing campaigns with ease.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Disqus -->
            <div class="col-12 col-md-6">
                <div class="card h-100 border-1 integration-card" @click="openIntegrationDialog('disqus')">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-start mb-3">
                            <img :src="disqusLogo" alt="Disqus" class="me-3" style="width: 40px; height: 40px;" />
                            <div class="flex-fill">
                                <h6 class="mb-1 fw-semibold">Disqus</h6>
                                <span class="badge bg-secondary small">Coming soon</span>
                            </div>
                        </div>
                        <p class="card-text text-muted small mb-0">
                            Enable discussions and user engagement on your blog or website.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Integration Dialog -->
        <IntegrationDialog :show="showDialog" :integration="selectedIntegration" @close="closeIntegrationDialog" />
    </div>
</template>

<script>
import IntegrationDialog from './IntegrationDialog.vue';
import googleAnalytics from '@images/google-analytics.png'
import googleAdsense from '@images/google-adsense.png'
import crispLogo from '@images/crisp_logo.svg'
import googleTag from '@images/google-tag.png'
import mailchimpLogo from '@images/mailchimp.png'
import disqusLogo from '@images/disqus.svg'

export default {
    name: 'IntegrationsTab',
    components: {
        IntegrationDialog
    },
    data() {
        return {
            googleAnalytics,
            googleAdsense,
            crispLogo,
            googleTag,
            mailchimpLogo,
            disqusLogo,
            showDialog: false,
            selectedIntegration: null
        }
    },
    methods: {
        openIntegrationDialog(integrationId) {
            this.selectedIntegration = integrationId;
            this.showDialog = true;
        },
        closeIntegrationDialog() {
            this.showDialog = false;
            this.selectedIntegration = null;
        }
    }
}
</script>

<style scoped>
.integration-card {
    cursor: pointer;
    transition: all 0.2s ease;
}

.integration-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

@media (max-width: 768px) {
    .col-md-6 {
        margin-bottom: 1rem;
    }
}
</style>
