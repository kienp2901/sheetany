<template>
    <div class="bg-white border-end website-sidebar">
        <div class="p-3">
            <nav class="nav flex-column">
                <button v-for="item in dynamicTabs" :key="item.key" @click="$emit('change-tab', item.key)" :class="[
                    'nav-link d-flex align-items-center text-start border-0 bg-transparent w-100 py-2 px-3 rounded',
                    activeTab === item.key ? 'bg-primary bg-opacity-10 text-primary' : 'text-muted'
                ]">
                    <i :class="item.icon + ' me-3'"></i>
                    {{ item.label }}
                </button>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'; // Import computed

const props = defineProps({
    activeTab: String,
    websiteData: Object // Định nghĩa prop để nhận websiteData
})
const emit = defineEmits(['change-tab'])

// Định nghĩa các tab cơ bản
const baseTabs = [
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
];

// Sử dụng computed property để tạo danh sách tabs động
const dynamicTabs = computed(() => {
    // Tạo một bản sao của baseTabs để tránh thay đổi trực tiếp
    const updatedTabs = [...baseTabs];

    // Cập nhật nhãn cho 'information' tab
    const infoTab = updatedTabs.find(tab => tab.key === 'information');
    if (infoTab && props.websiteData && props.websiteData.information && props.websiteData.information.sheet_name) {
        infoTab.label = `${props.websiteData.information.sheet_name} sheet`;
    }

    // Cập nhật nhãn cho 'content' tab
    const contentTab = updatedTabs.find(tab => tab.key === 'content');
    if (contentTab && props.websiteData && props.websiteData.content && props.websiteData.content.sheet_name) {
        contentTab.label = `${props.websiteData.content.sheet_name} sheet`;
    }

    return updatedTabs;
});
</script>

<style scoped>
.website-sidebar {
    width: 280px;
    min-height: calc(100vh - 80px);
    flex-shrink: 0;
}
</style>