<template>
    <div>
        <NotificationAlert ref="notificationAlert" />

        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Content sheet</h4>
                <p class="text-muted mb-0">Content sheet mapped from your Google Sheets</p>
            </div>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted mt-2">Loading content sheet...</p>
        </div>

        <div v-else-if="contentData.length > 0" class="card border-0 shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive-scroll">
                    <table class="table table-hover mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="px-3 py-3 text-muted small bg-primary/10">#</th>
                                <th v-for="header in contentSheetHeaders" :key="header" class="px-3 py-3 text-muted small bg-primary/10">
                                    {{ header.toUpperCase() }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in contentData" :key="index">
                                <td class="px-3 py-3">{{ index + 1 }}</td>
                                <td v-for="(header, headerIndex) in contentSheetHeaders" :key="headerIndex" class="px-3 py-3">
                                    <!-- <template v-if="header === 'Thumbnail'">
                                        <img v-if="item[header]" :src="item[header]" alt="Thumbnail" class="rounded"
                                            style="width: 40px; height: 40px; object-fit: cover;">
                                        <span v-else class="text-muted">No image</span>
                                    </template> -->
                                    <template v-if="header === 'Content'">
                                        <a v-if="item[header]" :href="item[header]" target="_blank"
                                            class="text-decoration-none">
                                            <i class="bi bi-file-earmark-text me-1"></i>
                                            View
                                        </a>
                                        <span v-else class="text-muted">No content</span>
                                    </template>
                                    <template v-else-if="header === 'Categories'">
                                        <span class="badge bg-secondary">{{ item[header] }}</span>
                                    </template>
                                    <template v-else-if="header === 'Slug'">
                                        <code class="small">{{ item[header] }}</code>
                                    </template>
                                    <template v-else-if="header === 'Excerpt'">
                                        <div class="text-truncate" style="max-width: 200px;" :title="item[header]">
                                            {{ item[header] }}
                                        </div>
                                    </template>
                                     <template v-else-if="header === 'Title'">
                                        <div class="fw-medium">{{ item[header] }}</div>
                                    </template>
                                    <template v-else>
                                        {{ item[header] }}
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div v-else class="card border-0 shadow-sm">
            <div class="card-body text-center py-5">
                <i class="bi bi-file-earmark fs-1 text-muted mb-3"></i>
                <h5 class="mb-2">No Content Sheet Data</h5>
                <p class="text-muted">No content sheet data found for this website</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import NotificationAlert from '@/components/NotificationAlert.vue'

const route = useRoute()
const notificationAlert = ref(null)

const loading = ref(true)
const contentData = ref([])
const contentSheetHeaders = ref([])

const fetchWebsiteInfo = async (id) => {
    try {
        loading.value = true
        const response = await axios.get(`/api/sites/${id}`)

        if (response.data && response.data.sheets) {
            const contentSheet = response.data.sheets.find(sheet => sheet.sheet_name === 'Content')
            if (contentSheet && contentSheet.sheet_data) {
                contentData.value = contentSheet.sheet_data
                if (contentSheet.sheet_headers) {
                    contentSheetHeaders.value = contentSheet.sheet_headers
                }
                notificationAlert.value.showSuccess('Content sheet loaded successfully')
            } else {
                notificationAlert.value.showWarning('No content sheet found')
            }
        }
    } catch (error) {
        console.error('Failed to fetch website info:', error)

        if (error.response?.status === 403) {
            notificationAlert.value.showError('You do not have permission to access this website', 'Access Denied')
        } else if (error.response?.status === 404) {
            notificationAlert.value.showError('Website not found', 'Not Found')
        } else {
            notificationAlert.value.showError('Failed to load content sheet', 'Loading Error')
        }
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    const websiteId = route.params.id
    if (websiteId) {
        fetchWebsiteInfo(websiteId)
    }
})
</script>

<style scoped>
/* CSS để làm cho bảng cuộn ngang */
.table-responsive-scroll {
    overflow-x: auto; /* Cho phép cuộn ngang khi nội dung tràn ra */
    -webkit-overflow-scrolling: touch; /* Tăng trải nghiệm cuộn trên thiết bị di động */
}

/* Tùy chỉnh thêm nếu cần để bảng không bị thu nhỏ quá mức */
.table {
    white-space: nowrap; /* Ngăn chặn văn bản bị ngắt dòng trong các ô */
    min-width: 100%; /* Đảm bảo bảng luôn chiếm ít nhất 100% chiều rộng của cha */
}

.bg-primary\/10 {
    background-color: rgba(15, 157, 96, .1);
}
</style>