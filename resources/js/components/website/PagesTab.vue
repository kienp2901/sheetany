<template>
    <div>
        <NotificationAlert ref="notificationAlert" />

        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Pages</h4>
                <p class="text-muted mb-0">Manage your website pages</p>
            </div>
            <button @click="showCreateModal = true" class="btn btn-success">
                <i class="bi bi-plus me-1"></i>
                Create a new page
            </button>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted mt-2">Loading pages...</p>
        </div>

        <div v-else-if="pages.length > 0" class="card border-0 shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="px-3 py-3 text-muted small">TITLE</th>
                                <th class="px-3 py-3 text-muted small">ADDRESS</th>
                                <th class="px-3 py-3 text-muted small">TYPE</th>
                                <th class="px-3 py-3 text-muted small">CREATED</th>
                                <th class="px-3 py-3 text-muted small">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="page in pages" :key="page.id">
                                <td class="px-3 py-3">
                                    <div class="fw-medium">{{ page.title }}</div>
                                    <small class="text-muted">{{ page.meta_title }}</small>
                                </td>
                                <td class="px-3 py-3">
                                    <code>{{ page.page_address }}</code>
                                </td>
                                <td class="px-3 py-3">
                                    <span
                                        :class="['badge', page.content_type === 'google_doc' ? 'bg-info' : 'bg-secondary']">
                                        {{ page.content_type === 'google_doc' ? 'Google Doc' : 'Text' }}
                                    </span>
                                </td>
                                <td class="px-3 py-3">
                                    <small class="text-muted">{{ formatDate(page.created_at) }}</small>
                                </td>
                                <td class="px-3 py-3">
                                    <button class="btn btn-sm btn-outline-primary me-1">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger">
                                        <i class="bi bi-trash"></i>
                                    </button>
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
                <h5 class="mb-2">You don't have any pages</h5>
                <p class="text-muted">Create a page and display your content</p>
                <button @click="showCreateModal = true" class="btn btn-success">
                    <i class="bi bi-plus me-1"></i>
                    Create a new page
                </button>
            </div>
        </div>

        <!-- Create Page Modal -->
        <div v-if="showCreateModal" class="modal fade show d-block" tabindex="-1"
            style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Create a new page</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <form @submit.prevent="createPage">
                        <div class="modal-body">
                            <!-- Page Content Section -->
                            <div class="mb-4">
                                <h6 class="fw-bold mb-3">Page content</h6>

                                <div class="mb-3">
                                    <label class="form-label">Title <span class="text-danger">*</span></label>
                                    <input v-model="form.title" type="text" class="form-control"
                                        placeholder="Add a page title" required>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Content Type <span class="text-danger">*</span></label>
                                    <select v-model="form.content_type" class="form-select" required>
                                        <option value="text">Text</option>
                                        <option value="google_doc">Google Doc</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Content <span class="text-danger">*</span></label>
                                    <input v-if="form.content_type === 'google_doc'" v-model="form.content" type="url"
                                        class="form-control" placeholder="Link to public your Google Docs" required>
                                    <textarea v-else v-model="form.content" class="form-control" rows="8" placeholder="<!-- ✅ Meta Title -->
<title>Khóa học Lập trình Web từ A đến Z | Hocmai</title>

<!-- ✅ Meta Description -->
<meta name=&quot;description&quot; content=&quot;Tham gia khóa học lập trình web từ cơ bản đến nâng cao, hướng dẫn chi tiết HTML, CSS, JavaScript và PHP. Phù hợp cho người mới bắt đầu.&quot; />

<!-- ✅ Open Graph (Facebook, Zalo, LinkedIn...) -->
<meta property=&quot;og:type&quot; content=&quot;website&quot; />
<meta property=&quot;og:title&quot; content=&quot;Khóa học Lập trình Web từ A đến Z | Hocmai&quot; />
<meta property=&quot;og:description&quot; content=&quot;Tham gia khóa học lập trình web từ cơ bản đến nâng cao, hướng dẫn chi tiết HTML, CSS, JavaScript và PHP.&quot; />
<meta property=&quot;og:image&quot; content=&quot;https://yourdomain.com/images/seo-thumbnail.jpg&quot; />
<meta property=&quot;og:url&quot; content=&quot;https://yourdomain.com/khoa-hoc-lap-trinh-web&quot; />
<meta property=&quot;og:site_name&quot; content=&quot;Hocmai&quot; />

<!-- ✅ Twitter Card -->
<meta name=&quot;twitter:card&quot; content=&quot;summary_large_image&quot; />
<meta name=&quot;twitter:title&quot; content=&quot;Khóa học Lập trình Web từ A đến Z | Hocmai&quot; />
<meta name=&quot;twitter:description&quot; content=&quot;Tham gia khóa học lập trình web từ cơ bản đến nâng cao, hướng dẫn chi tiết HTML, CSS, JavaScript và PHP.&quot; />
<meta name=&quot;twitter:image&quot; content=&quot;https://yourdomain.com/images/seo-thumbnail.jpg&quot; />"
                                        required></textarea>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Page address <span class="text-danger">*</span></label>
                                    <input v-model="form.page_address" type="text" class="form-control"
                                        placeholder="page-address" required>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Page width</label>
                                    <select v-model="form.page_width" class="form-select">
                                        <option value="2XL">2XL</option>
                                        <option value="XL">XL</option>
                                        <option value="L">L</option>
                                        <option value="M">M</option>
                                        <option value="S">S</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Navigation Section -->
                            <div class="mb-4">
                                <h6 class="fw-bold mb-3">Navigation</h6>

                                <div class="mb-3">
                                    <label class="form-label">Menu title</label>
                                    <input v-model="form.menu_title" type="text" class="form-control">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Menu type</label>
                                    <select v-model="form.menu_type" class="form-select">
                                        <option value="link">Link</option>
                                        <option value="button">Button</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Open page in</label>
                                    <select v-model="form.open_page_in" class="form-select">
                                        <option value="same_tab">Same tab</option>
                                        <option value="new_tab">New tab</option>
                                    </select>
                                </div>

                                <div class="form-check">
                                    <input v-model="form.show_in_header" class="form-check-input" type="checkbox"
                                        id="showInHeader">
                                    <label class="form-check-label" for="showInHeader">
                                        Show page from header
                                    </label>
                                </div>
                            </div>

                            <!-- SEO Section -->
                            <div class="mb-4">
                                <h6 class="fw-bold mb-3">SEO</h6>

                                <div class="mb-3">
                                    <label class="form-label">Meta title</label>
                                    <input v-model="form.meta_title" type="text" class="form-control">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Meta description</label>
                                    <textarea v-model="form.meta_description" class="form-control" rows="3"></textarea>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Image for social media sharing</label>
                                    <input v-model="form.social_image" type="url" class="form-control"
                                        placeholder="Direct link to image">
                                </div>

                                <div class="form-check">
                                    <input v-model="form.show_in_search" class="form-check-input" type="checkbox"
                                        id="showInSearch">
                                    <label class="form-check-label" for="showInSearch">
                                        Show page from search results
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                            <button type="submit" class="btn btn-success" :disabled="creating">
                                <span v-if="creating" class="spinner-border spinner-border-sm me-2"></span>
                                Create a new page
                                <i class="bi bi-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </form>
                </div>
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
const creating = ref(false)
const pages = ref([])
const showCreateModal = ref(false)

const form = ref({
    title: '',
    content_type: 'text',
    content: '',
    page_address: '',
    page_width: '2XL',
    menu_title: '',
    menu_type: 'link',
    open_page_in: 'same_tab',
    show_in_header: true,
    meta_title: '',
    meta_description: '',
    social_image: '',
    show_in_search: true
})

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
}

const fetchPages = async () => {
    try {
        loading.value = true
        const response = await axios.get('/api/pages')
        pages.value = response.data
        notificationAlert.value?.showSuccess('Pages loaded successfully')
    } catch (error) {
        console.error('Failed to fetch pages:', error)
        notificationAlert.value?.showError('Failed to load pages', 'Loading Error')
    } finally {
        loading.value = false
    }
}

const createPage = async () => {
    try {
        creating.value = true
        const response = await axios.post('/api/pages', form.value)
        pages.value.unshift(response.data)
        notificationAlert.value?.showSuccess('Page created successfully', 'Success!')
        closeModal()
    } catch (error) {
        console.error('Failed to create page:', error)

        if (error.response?.status === 422) {
            const errors = error.response.data.errors
            const errorMessages = Object.values(errors).flat().join(', ')
            notificationAlert.value?.showError(errorMessages, 'Validation Error')
        } else {
            notificationAlert.value?.showError('Failed to create page', 'Creation Error')
        }
    } finally {
        creating.value = false
    }
}

const closeModal = () => {
    showCreateModal.value = false
    // Reset form
    form.value = {
        title: '',
        content_type: 'text',
        content: '',
        page_address: '',
        page_width: '2XL',
        menu_title: '',
        menu_type: 'link',
        open_page_in: 'same_tab',
        show_in_header: true,
        meta_title: '',
        meta_description: '',
        social_image: '',
        show_in_search: true
    }
}

onMounted(() => {
    fetchPages()
})
</script>

<style scoped>
.modal {
    display: block !important;
}
</style>
