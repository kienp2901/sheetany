<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <!-- User Info Card -->
                <div class="bg-info rounded p-4 mb-4 text-center">
                    <div class="position-relative d-inline-block mb-3">
                        <div v-if="profileForm.avatar || authStore.user?.avatar" class="position-relative">
                            <img :src="profileForm.avatar || authStore.user?.avatar" :alt="authStore.user?.name"
                                class="rounded-circle border border-3 border-white shadow"
                                style="width: 80px; height: 80px; object-fit: cover;" @error="handleImageError" />
                            <button @click="removeAvatar"
                                class="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0"
                                style="width: 24px; height: 24px; padding: 0; font-size: 12px;" title="Remove avatar">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                        <div v-else
                            class="d-flex align-items-center justify-content-center bg-primary rounded-circle mx-auto border border-3 border-white shadow"
                            style="width: 80px; height: 80px;">
                            <span class="text-white fs-2 fw-bold">{{ getInitials(authStore.user?.name) }}</span>
                        </div>

                        <!-- Upload Avatar Button -->
                        <button @click="triggerFileUpload"
                            class="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0"
                            style="width: 28px; height: 28px; padding: 0;" title="Upload avatar" :disabled="uploading">
                            <i v-if="uploading" class="bi bi-arrow-clockwise"></i>
                            <i v-else class="bi bi-camera"></i>
                        </button>

                        <!-- Hidden file input -->
                        <input ref="fileInput" type="file" accept="image/*" @change="handleFileUpload" class="d-none" />
                    </div>

                    <h4 class="mb-2">{{ profileForm.name || authStore.user?.name }}</h4>
                    <span class="badge bg-warning text-dark mb-2">Trial Account</span>
                    <p class="text-muted mb-0">Expire date: 02 Aug 2025</p>

                    <!-- Google Account Badge -->
                    <div v-if="authStore.user?.google_id" class="mt-2">
                        <span class="badge bg-success">
                            <i class="bi bi-google me-1"></i>
                            Connected with Google
                        </span>
                    </div>
                </div>

                <!-- Profile Form -->
                <div class="bg-white rounded p-4 shadow-sm">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="mb-0">Your Profile</h5>
                        <div v-if="hasChanges" class="text-muted small">
                            <i class="bi bi-circle-fill text-warning me-1" style="font-size: 8px;"></i>
                            Unsaved changes
                        </div>
                    </div>

                    <form @submit.prevent="updateProfile">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label class="form-label text-muted">Email</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light">
                                            <i class="bi bi-envelope text-muted"></i>
                                        </span>
                                        <input v-model="profileForm.email" type="email" class="form-control bg-light"
                                            readonly />
                                        <span v-if="authStore.user?.email_verified_at"
                                            class="input-group-text bg-success text-white">
                                            <i class="bi bi-check-circle" title="Verified"></i>
                                        </span>
                                    </div>
                                    <small class="text-muted">Email cannot be changed</small>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted">Name <span class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light">
                                            <i class="bi bi-person text-muted"></i>
                                        </span>
                                        <input v-model="profileForm.name" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.name }" placeholder="Enter your name"
                                            required />
                                    </div>
                                    <div v-if="errors.name" class="invalid-feedback d-block">
                                        {{ errors.name[0] }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted">Phone</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light">
                                            <i class="bi bi-telephone text-muted"></i>
                                        </span>
                                        <input v-model="profileForm.phone" type="tel" class="form-control"
                                            :class="{ 'is-invalid': errors.phone }" placeholder="+1 (555) 123-4567" />
                                    </div>
                                    <div v-if="errors.phone" class="invalid-feedback d-block">
                                        {{ errors.phone[0] }}
                                    </div>
                                </div>
                            </div>

                            <!-- <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label text-muted">Website</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light">
                                            <i class="bi bi-globe text-muted"></i>
                                        </span>
                                        <input v-model="profileForm.website" type="url" class="form-control"
                                            :class="{ 'is-invalid': errors.website }"
                                            placeholder="https://example.com" />
                                    </div>
                                    <div v-if="errors.website" class="invalid-feedback d-block">
                                        {{ errors.website[0] }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted">Location</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light">
                                            <i class="bi bi-geo-alt text-muted"></i>
                                        </span>
                                        <input v-model="profileForm.location" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.location }" placeholder="City, Country" />
                                    </div>
                                    <div v-if="errors.location" class="invalid-feedback d-block">
                                        {{ errors.location[0] }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted">Company</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light">
                                            <i class="bi bi-building text-muted"></i>
                                        </span>
                                        <input v-model="profileForm.company" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.company }" placeholder="Your company name" />
                                    </div>
                                    <div v-if="errors.company" class="invalid-feedback d-block">
                                        {{ errors.company[0] }}
                                    </div>
                                </div>
                            </div> -->
                        </div>

                        <div class="mb-4">
                            <label class="form-label text-muted">Bio</label>
                            <textarea v-model="profileForm.bio" class="form-control"
                                :class="{ 'is-invalid': errors.bio }" rows="4" placeholder="Tell us about yourself..."
                                maxlength="500"></textarea>
                            <div class="d-flex justify-content-between">
                                <div v-if="errors.bio" class="invalid-feedback d-block">
                                    {{ errors.bio[0] }}
                                </div>
                                <small class="text-muted">{{ profileForm.bio?.length || 0 }}/500</small>
                            </div>
                        </div>

                        <!-- Success/Error Messages -->
                        <div v-if="successMessage" class="alert alert-success d-flex align-items-center mb-3">
                            <i class="bi bi-check-circle me-2"></i>
                            {{ successMessage }}
                        </div>

                        <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center mb-3">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            {{ errorMessage }}
                        </div>

                        <!-- Action Buttons -->
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-success" :disabled="loading || !hasChanges">
                                <span v-if="loading">
                                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Updating...
                                </span>
                                <span v-else>
                                    <i class="bi bi-check me-1"></i>
                                    Update profile
                                </span>
                            </button>

                            <button type="button" @click="resetForm" class="btn btn-outline-secondary"
                                :disabled="loading || !hasChanges">
                                <i class="bi bi-arrow-clockwise me-1"></i>
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Account Settings -->
                <!-- <div class="bg-white rounded p-4 shadow-sm mt-4">
                    <h5 class="mb-4">Account Settings</h5>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="card border-0 bg-light">
                                <div class="card-body">
                                    <h6 class="card-title">
                                        <i class="bi bi-shield-lock me-2"></i>
                                        Change Password
                                    </h6>
                                    <p class="card-text text-muted small">Update your account password</p>
                                    <button @click="showPasswordModal = true" class="btn btn-outline-primary btn-sm"
                                        :disabled="authStore.user?.google_id">
                                        Change Password
                                    </button>
                                    <small v-if="authStore.user?.google_id" class="text-muted d-block mt-1">
                                        Password change not available for Google accounts
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="card border-0 bg-light">
                                <div class="card-body">
                                    <h6 class="card-title">
                                        <i class="bi bi-shield-check me-2"></i>
                                        Two-Factor Authentication
                                    </h6>
                                    <p class="card-text text-muted small">Add an extra layer of security</p>
                                    <button class="btn btn-outline-primary btn-sm">
                                        Enable 2FA
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="card border-0 bg-light">
                                <div class="card-body">
                                    <h6 class="card-title">
                                        <i class="bi bi-download me-2"></i>
                                        Download Data
                                    </h6>
                                    <p class="card-text text-muted small">Download your account data</p>
                                    <button class="btn btn-outline-secondary btn-sm">
                                        Request Data
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="card border-0 bg-light">
                                <div class="card-body">
                                    <h6 class="card-title text-danger">
                                        <i class="bi bi-exclamation-triangle me-2"></i>
                                        Delete Account
                                    </h6>
                                    <p class="card-text text-muted small">Permanently delete your account</p>
                                    <button @click="showDeleteModal = true" class="btn btn-outline-danger btn-sm">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>

        <!-- Change Password Modal -->
        <div v-if="showPasswordModal" class="modal d-block" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Change Password</h5>
                        <button type="button" class="btn-close" @click="closePasswordModal"></button>
                    </div>
                    <form @submit.prevent="changePassword">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Current Password</label>
                                <input v-model="passwordForm.current_password" type="password" class="form-control"
                                    :class="{ 'is-invalid': passwordErrors.current_password }" required />
                                <div v-if="passwordErrors.current_password" class="invalid-feedback">
                                    {{ passwordErrors.current_password[0] }}
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">New Password</label>
                                <input v-model="passwordForm.password" type="password" class="form-control"
                                    :class="{ 'is-invalid': passwordErrors.password }" required />
                                <div v-if="passwordErrors.password" class="invalid-feedback">
                                    {{ passwordErrors.password[0] }}
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Confirm New Password</label>
                                <input v-model="passwordForm.password_confirmation" type="password" class="form-control"
                                    required />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closePasswordModal">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary" :disabled="passwordLoading">
                                <span v-if="passwordLoading">
                                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Updating...
                                </span>
                                <span v-else>Update Password</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Delete Account Modal -->
        <!-- <div v-if="showDeleteModal" class="modal d-block" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title text-danger">Delete Account</h5>
                        <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            <strong>Warning!</strong> This action cannot be undone.
                        </div>
                        <p>Are you sure you want to delete your account? This will:</p>
                        <ul class="text-muted">
                            <li>Permanently delete your profile</li>
                            <li>Remove all your websites</li>
                            <li>Delete all your data</li>
                            <li>Cancel your subscription</li>
                        </ul>
                        <div class="mb-3">
                            <label class="form-label">Type "DELETE" to confirm:</label>
                            <input v-model="deleteConfirmation" type="text" class="form-control" placeholder="DELETE" />
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
                            Cancel
                        </button>
                        <button type="button" class="btn btn-danger" :disabled="deleteConfirmation !== 'DELETE'"
                            @click="deleteAccount">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import axios from 'axios'
import { route as ziggyRoute } from 'ziggy-js'

const authStore = useAuthStore()

// Form data
const profileForm = ref({
    name: '',
    email: '',
    phone: '',
    // website: '',
    // location: '',
    // company: '',
    bio: '',
    avatar: ''
})

// Original data for comparison
const originalData = ref({})

// State
const loading = ref(false)
const uploading = ref(false)
const errors = ref({})
const successMessage = ref('')
const errorMessage = ref('')

// Password change
const showPasswordModal = ref(false)
const passwordForm = ref({
    current_password: '',
    password: '',
    password_confirmation: ''
})
const passwordErrors = ref({})
const passwordLoading = ref(false)

// Delete account
const showDeleteModal = ref(false)
const deleteConfirmation = ref('')

// File upload
const fileInput = ref(null)

// Computed
const hasChanges = computed(() => {
    return JSON.stringify(profileForm.value) !== JSON.stringify(originalData.value)
})

// Methods
const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const loadProfile = async () => {
    try {
        // const response = await axios.get('/api/profile')
        const response = await axios.get(ziggyRoute('api.profile.show'))
        const userData = response.data

        profileForm.value = {
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            // website: userData.website || '',
            // location: userData.location || '',
            // company: userData.company || '',
            bio: userData.bio || '',
            avatar: userData.avatar || ''
        }

        originalData.value = { ...profileForm.value }
    } catch (error) {
        console.error('Failed to load profile:', error)
    }
}

const updateProfile = async () => {
    loading.value = true
    errors.value = {}
    successMessage.value = ''
    errorMessage.value = ''

    try {
        // const response = await axios.put('/api/profile', profileForm.value)
        const response = await axios.put(ziggyRoute('api.profile.update', profileForm.value))

        if (response.data.success) {
            successMessage.value = 'Profile updated successfully!'
            originalData.value = { ...profileForm.value }

            // Update auth store
            authStore.user = { ...authStore.user, ...response.data.user }

            // Clear success message after 3 seconds
            setTimeout(() => {
                successMessage.value = ''
            }, 3000)
        }
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {}
        } else {
            errorMessage.value = error.response?.data?.message || 'Failed to update profile'
        }
    } finally {
        loading.value = false
    }
}

const resetForm = () => {
    profileForm.value = { ...originalData.value }
    errors.value = {}
    successMessage.value = ''
    errorMessage.value = ''
}

const triggerFileUpload = () => {
    fileInput.value?.click()
}

const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
        errorMessage.value = 'Please select a valid image file'
        return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
        errorMessage.value = 'Image size must be less than 5MB'
        return
    }

    uploading.value = true
    errorMessage.value = ''

    try {
        const formData = new FormData()
        formData.append('avatar', file)

        await axios.get("/sanctum/csrf-cookie");

        // const response = await axios.post('/api/profile/avatar', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // })

        const response = await axios.post(
            ziggyRoute('api.profile.avatar.upload'), // ✅ sử dụng tên route
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (response.data.success) {
            profileForm.value.avatar = response.data.avatar_url
            successMessage.value = 'Avatar updated successfully!'

            setTimeout(() => {
                successMessage.value = ''
            }, 3000)
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Failed to upload avatar'
    } finally {
        uploading.value = false
        // Reset file input
        if (fileInput.value) {
            fileInput.value.value = ''
        }
    }
}

const removeAvatar = async () => {
    try {
        // const response = await axios.delete('/api/profile/avatar')
        const response = await axios.delete(ziggyRoute('api.profile.avatar.remove'))

        if (response.data.success) {
            profileForm.value.avatar = ''
            successMessage.value = 'Avatar removed successfully!'

            setTimeout(() => {
                successMessage.value = ''
            }, 3000)
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Failed to remove avatar'
    }
}

const handleImageError = () => {
    profileForm.value.avatar = ''
}

const changePassword = async () => {
    passwordLoading.value = true
    passwordErrors.value = {}

    try {
        // const response = await axios.put('/api/profile/password', passwordForm.value)
        const response = await axios.put(
            ziggyRoute('api.profile.password.update'), // ✅ sử dụng tên route
            passwordForm.value
        )

        if (response.data.success) {
            closePasswordModal()
            successMessage.value = 'Password changed successfully!'

            setTimeout(() => {
                successMessage.value = ''
            }, 3000)
        }
    } catch (error) {
        if (error.response?.status === 422) {
            passwordErrors.value = error.response.data.errors || {}
        } else {
            errorMessage.value = error.response?.data?.message || 'Failed to change password'
        }
    } finally {
        passwordLoading.value = false
    }
}

const closePasswordModal = () => {
    showPasswordModal.value = false
    passwordForm.value = {
        current_password: '',
        password: '',
        password_confirmation: ''
    }
    passwordErrors.value = {}
}

const deleteAccount = async () => {
    try {
        const response = await axios.delete('/api/profile')

        if (response.data.success) {
            await authStore.logout()
            // Redirect will be handled by auth store
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Failed to delete account'
        showDeleteModal.value = false
    }
}

// Watch for auth store changes
watch(() => authStore.user, (newUser) => {
    if (newUser) {
        profileForm.value.name = newUser.name || ''
        profileForm.value.email = newUser.email || ''
        profileForm.value.avatar = newUser.avatar || ''
    }
}, { immediate: true })

onMounted(() => {
    loadProfile()
})
</script>

<style scoped>
.modal {
    z-index: 1050;
}

.btn:focus {
    box-shadow: none;
}

.form-control:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.input-group:focus-within .input-group-text {
    border-color: #28a745;
}

.card {
    transition: transform 0.2s ease-in-out;
}

.card:hover {
    transform: translateY(-2px);
}

.position-relative .btn {
    transition: all 0.2s ease-in-out;
}

.position-relative .btn:hover {
    transform: scale(1.1);
}
</style>