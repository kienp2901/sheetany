<template>
    <header class="border-bottom px-4 py-3">
        <NotificationAlert ref="notificationAlert" />

        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item">
                            <router-link to="/dashboard/websites" class="text-decoration-none text-muted">My websites</router-link>
                        </li>
                        <li class="breadcrumb-item active text-dark">{{ websiteName }}</li>
                    </ol>
                </nav>
            </div>

            <div class="d-flex align-items-center gap-2">
                <span class="text-muted ms-3 small">Synced: {{ lastSyncedText }}</span>
                
                <a 
                    :href="linkGoogleSheet" 
                    target="_blank" 
                    class="btn btn-success btn-sm text-decoration-none"
                    v-if="linkGoogleSheet"
                >
                    <i class="bi bi-pencil me-1"></i>
                    Edit Google Sheets
                </a>
                <button v-else class="btn btn-success btn-sm" disabled>
                    <i class="bi bi-pencil me-1"></i>
                    Edit Google Sheets
                </button>

                <button class="btn btn-outline-secondary btn-sm" @click="syncSheets" :disabled="isSyncing">
                    <span v-if="isSyncing" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <i class="bi bi-arrow-clockwise" :class="{ 'me-1': isSyncing }"></i>
                    <span v-if="isSyncing">Syncing...</span>
                </button>
                
                <button class="btn btn-outline-success btn-sm">
                    View website <i class="bi bi-box-arrow-up-right ms-1"></i>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import NotificationAlert from '@/components/NotificationAlert.vue'

const route = useRoute()
const notificationAlert = ref(null)

// Define props with default values for safety
const props = defineProps({
    websiteName: {
        type: String,
        default: 'Loading...'
    },
    linkGoogleSheet: {
        type: String,
        default: ''
    },
    websiteId: {
        type: [String, Number],
        required: true // websiteId là bắt buộc để gọi API
    }
})

const isSyncing = ref(false) // Trạng thái cho nút đồng bộ
const lastSyncedAt = ref(null) // Thời gian cuối cùng đồng bộ, có thể lấy từ API

// Computed property để hiển thị thời gian đồng bộ
const lastSyncedText = computed(() => {
    if (!lastSyncedAt.value) {
        return 'Never';
    }
    // Logic để định dạng thời gian (ví dụ: "an hour ago", "just now")
    // Đây là một ví dụ đơn giản, bạn có thể dùng thư viện như 'moment.js' hoặc 'date-fns'
    const now = new Date();
    const lastSyncDate = new Date(lastSyncedAt.value);
    const diffMinutes = Math.round((now - lastSyncDate) / (1000 * 60));

    if (diffMinutes < 1) {
        return 'just now';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 24 * 60) {
        const diffHours = Math.round(diffMinutes / 60);
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
        const diffDays = Math.round(diffMinutes / (60 * 24));
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
});


// Function to handle sheet synchronization
const syncSheets = async () => {
    if (!props.websiteId) {
        notificationAlert.value?.showError('Website ID is missing. Cannot sync sheets.');
        return;
    }

    isSyncing.value = true; // Bắt đầu trạng thái đồng bộ

    try {
        // Gửi yêu cầu POST/PUT đến API đồng bộ, kèm theo websiteId
        // Giả định API endpoint của bạn là /api/sites/{id}/sync
        const response = await axios.post(`/api/sites/${props.websiteId}/sync`);

        if (response.data.success) {
            notificationAlert.value?.showSuccess('Sheets synced successfully!');
            // Cập nhật thời gian đồng bộ
            lastSyncedAt.value = new Date(); // Lấy thời gian hiện tại hoặc từ response.data.synced_at
            // Tùy chọn: gọi lại hàm fetchWebsiteInfo từ component cha hoặc gửi event để làm mới dữ liệu
            // emit('sheetsSynced'); // Nếu bạn muốn gửi event lên cha
        } else {
            notificationAlert.value?.showWarning(response.data.message || 'Failed to sync sheets.');
        }
    } catch (error) {
        console.error('Failed to sync sheets:', error);
        if (error.response?.status === 403) {
            notificationAlert.value?.showError('You do not have permission to sync sheets for this website.', 'Access Denied');
        } else if (error.response?.status === 404) {
            notificationAlert.value?.showError('Website not found.', 'Not Found');
        } else {
            notificationAlert.value?.showError('An error occurred during sync. Please try again.', 'Sync Error');
        }
    } finally {
        isSyncing.value = false; // Kết thúc trạng thái đồng bộ
    }
};

// Cập nhật thời gian đồng bộ ban đầu khi component được mount
onMounted(() => {
    // Nếu bạn có thời gian đồng bộ ban đầu từ API, hãy truyền nó vào đây
    // Ví dụ: lastSyncedAt.value = props.initialLastSyncedTime;
});
</script>