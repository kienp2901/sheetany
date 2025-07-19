<template>
    <div class="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                    <div class="text-center mb-4">
                        <div class="mx-auto mb-4 d-flex align-items-center justify-content-center bg-success rounded-circle"
                            style="width: 64px; height: 64px;">
                            <i class="bi bi-check-circle text-white fs-3"></i>
                        </div>
                        <h2 class="fw-bold text-dark mb-2">Welcome Back</h2>
                        <p class="text-muted">Please sign in to your account</p>
                    </div>

                    <form @submit.prevent="handleLogin" class="bg-white p-4 rounded shadow">
                        <div class="mb-3">
                            <label for="email" class="form-label fw-medium">Email address</label>
                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="bi bi-envelope"></i>
                                </span>
                                <input id="email" v-model="form.email" type="email" class="form-control"
                                    placeholder="Enter your email" required />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label fw-medium">Password</label>
                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="bi bi-lock"></i>
                                </span>
                                <input id="password" v-model="form.password" type="password" class="form-control"
                                    placeholder="Enter your password" required />
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <a href="#" class="text-success text-decoration-none">Forgot Password?</a>
                        </div>

                        <div v-if="error" class="alert alert-danger" role="alert">
                            {{ error }}
                        </div>

                        <button type="submit" :disabled="authStore.loading"
                            class="btn btn-success w-100 py-2 fw-medium">
                            <span v-if="authStore.loading">
                                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                Signing in...
                            </span>
                            <span v-else>Sign In</span>
                        </button>

                        <div class="text-center mt-3">
                            <p class="text-muted mb-0">
                                Don't have an account?
                                <router-link to="/register" class="text-success text-decoration-none fw-medium">Sign up
                                    now</router-link>
                            </p>
                        </div>

                        <hr class="my-4">

                        <button type="button" class="btn btn-outline-secondary w-100 py-2">
                            <i class="bi bi-google me-2"></i>
                            Sign in with Google
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
    email: '',
    password: ''
})

const error = ref('')

const handleLogin = async () => {
    error.value = ''

    const result = await authStore.login(form.value)

    if (result.success) {
        router.push('/dashboard')
    } else {
        error.value = result.message
    }
}
</script>