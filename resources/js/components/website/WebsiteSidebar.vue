<template>
    <div class="bg-white border-end website-sidebar">
        <div class="p-3">
            <nav class="nav flex-column">
                <button
                    v-for="item in tabs"
                    :key="item.key"
                    @click="$emit('change-tab', item.key)"
                    :class="[
                        'nav-link d-flex align-items-center text-start border-0 bg-transparent w-100 py-2 px-3 rounded',
                        activeTab === item.key ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted'
                    ]"
                >
                    <i :class="item.icon + ' me-3'"></i>
                    {{ item.label }}
                </button>
            </nav>
        </div>
    </div>
</template>

<script setup>
defineProps(['activeTab'])
const emit = defineEmits(['change-tab'])

const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: 'bi bi-speedometer2' },
    { key: 'information', label: 'Information sheet', icon: 'bi bi-info-circle' },
    { key: 'content', label: 'Content sheet', icon: 'bi bi-table' },
    { key: 'domain', label: 'Custom domain', icon: 'bi bi-globe' },
    { key: 'code', label: 'Custom code', icon: 'bi bi-code-slash' },
    { key: 'settings', label: 'General settings', icon: 'bi bi-gear' },
    { key: 'integrations', label: 'Integrations', icon: 'bi bi-puzzle' },
    { key: 'navbar', label: 'Navbar', icon: 'bi bi-menu-button-wide' },
    { key: 'pages', label: 'Pages', icon: 'bi bi-file-earmark' },
    { key: 'emails', label: 'Emails', icon: 'bi bi-envelope' },
    { key: 'orders', label: 'Orders', icon: 'bi bi-bag' },
    { key: 'feedbacks', label: 'Feedbacks', icon: 'bi bi-chat-dots' },
    { key: 'webhooks', label: 'Webhooks', icon: 'bi bi-webhook' },
    { key: 'sitemap', label: 'Sitemap', icon: 'bi bi-diagram-3' },
    { key: 'rss', label: 'RSS', icon: 'bi bi-rss' }
]
</script>

<style scoped>
.website-sidebar {
    width: 280px;
    min-height: calc(100vh - 80px);
    flex-shrink: 0;
}
</style>
