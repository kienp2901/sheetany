<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <!-- User Info Card -->
                <div class="bg-info bg-opacity-10 rounded p-4 mb-4 text-center">
                    <div class="d-flex align-items-center justify-content-center bg-primary rounded-circle mx-auto mb-3"
                        style="width: 80px; height: 80px;">
                        <span class="text-white fs-2 fw-bold">{{ authStore.user?.name?.charAt(0).toUpperCase() }}</span>
                    </div>
                    <h4 class="mb-2">{{ authStore.user?.name }}</h4>
                    <span class="badge bg-warning text-dark mb-2">Trial Account</span>
                    <p class="text-muted mb-0">Expire date: 02 Aug 2025</p>
                </div>

                <!-- Profile Form -->
                <div class="bg-white rounded p-4 shadow-sm">
                    <h5 class="mb-4">Your Profile</h5>
                    <form @submit.prevent="updateProfile">
                        <div class="mb-3">
                            <label class="form-label text-muted">Email</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light">
                                    <i class="bi bi-envelope text-muted"></i>
                                </span>
                                <input v-model="profileForm.email" type="email" class="form-control bg-light"
                                    readonly />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label text-muted">Name</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light">
                                    <i class="bi bi-person text-muted"></i>
                                </span>
                                <input v-model="profileForm.name" type="text" class="form-control" />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label text-muted">Profile image URL</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light">
                                    <i class="bi bi-image text-muted"></i>
                                </span>
                                <input v-model="profileForm.avatar" type="url" class="form-control"
                                    placeholder="https://example.com/image.jpg" />
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label text-muted">Bio</label>
                            <textarea v-model="profileForm.bio" class="form-control" rows="4"
                                placeholder="Tell us about yourself..."></textarea>
                        </div>

                        <button type="submit" class="btn btn-success w-100">
                            Update profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.js'

const authStore = useAuthStore()

const profileForm = ref({
    name: '',
    email: '',
    avatar: '',
    bio: ''
})

onMounted(() => {
    if (authStore.user) {
        profileForm.value.name = authStore.user.name
        profileForm.value.email = authStore.user.email
    }
})

const updateProfile = () => {
    console.log('Updating profile:', profileForm.value)
}
</script>