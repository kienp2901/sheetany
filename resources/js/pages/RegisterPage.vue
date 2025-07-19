<template>
    <div class="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                    <div class="text-center mb-4">
                        <div class="mx-auto mb-4 d-flex align-items-center justify-content-center bg-success rounded-circle"
                            style="width: 64px; height: 64px;">
                            <i class="bi bi-pause-fill text-white fs-3"></i>
                        </div>
                        <div class="bg-primary text-white px-3 py-2 rounded mb-2 d-inline-block">
                            <h2 class="mb-0 fs-5 fw-bold">Sign up for free</h2>
                        </div>
                        <p class="text-muted">Welcome To Sheetany</p>
                    </div>

                    <form @submit.prevent="handleRegister" class="bg-white p-4 rounded shadow">
                        <div class="mb-3">
                            <label for="name" class="form-label text-muted">Name</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0">
                                    <i class="bi bi-person text-muted"></i>
                                </span>
                                <input id="name" v-model="form.name" type="text" class="form-control border-start-0"
                                    :class="{ 'is-invalid': errors.name }" placeholder="Enter your name" required />
                            </div>
                            <div v-if="errors.name" class="invalid-feedback d-block">
                                {{ errors.name[0] }}
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="email" class="form-label text-muted">Email address</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0">
                                    <i class="bi bi-envelope text-muted"></i>
                                </span>
                                <input id="email" v-model="form.email" type="email" class="form-control border-start-0"
                                    :class="{ 'is-invalid': errors.email }" placeholder="Enter your email" required />
                            </div>
                            <div v-if="errors.email" class="invalid-feedback d-block">
                                {{ errors.email[0] }}
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label text-muted">Password</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0">
                                    <i class="bi bi-lock text-muted"></i>
                                </span>
                                <input id="password" v-model="form.password" type="password"
                                    class="form-control border-start-0" :class="{ 'is-invalid': errors.password }"
                                    placeholder="Enter your password" required />
                            </div>
                            <div v-if="errors.password" class="invalid-feedback d-block">
                                {{ errors.password[0] }}
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="password_confirmation" class="form-label text-muted">Confirm Password</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0">
                                    <i class="bi bi-lock text-muted"></i>
                                </span>
                                <input id="password_confirmation" v-model="form.password_confirmation" type="password"
                                    class="form-control border-start-0" placeholder="Confirm your password" required />
                            </div>
                        </div>

                        <div class="mb-3">
                            <small class="text-muted">
                                By signing up, I agree to the
                                <a href="#" class="text-success text-decoration-none">Terms</a> and
                                <a href="#" class="text-success text-decoration-none">privacy policy</a>
                            </small>
                        </div>

                        <div v-if="error" class="alert alert-danger" role="alert">
                            {{ error }}
                        </div>

                        <button type="submit" :disabled="authStore.loading"
                            class="btn btn-success w-100 py-2 fw-medium mb-3">
                            <span v-if="authStore.loading">
                                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                Signing up...
                            </span>
                            <span v-else>Sign Up</span>
                        </button>

                        <div class="text-center mb-3">
                            <p class="text-muted mb-0">
                                Already have an account?
                                <router-link to="/login" class="text-success text-decoration-none fw-medium">
                                    Sign In
                                </router-link>
                            </p>
                        </div>

                        <hr class="my-3">

                        <button type="button" class="btn btn-outline-secondary w-100 py-2">
                            <i class="bi bi-google me-2"></i>
                            Sign up with Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
})

const error = ref('')
const errors = ref({})

const handleRegister = async () => {
    error.value = ''
    errors.value = {}

    // Basic validation
    if (form.value.password !== form.value.password_confirmation) {
        error.value = 'Passwords do not match'
        return
    }

    const result = await authStore.register(form.value)

    if (result.success) {
        router.push('/dashboard')
    } else {
        error.value = result.message
        errors.value = result.errors || {}
    }
}
</script>

<style scoped>
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