import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000/";

export const useAuthStore = defineStore("auth", () => {
    const user = ref(null);
    const isAuthenticated = ref(false);
    const loading = ref(false);
    const isAuthChecked = ref(false);

    const login = async (credentials) => {
        loading.value = true;
        try {
            // Get CSRF token first
            await axios.get("/sanctum/csrf-cookie");

            // Attempt login
            const response = await axios.post("/api/login", credentials);

            if (response.data.success) {
                user.value = response.data.user;
                isAuthenticated.value = true;
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
            };
        } finally {
            loading.value = false;
        }
    };

    const register = async (userData) => {
        loading.value = true;
        try {
            // Get CSRF token first
            await axios.get("/sanctum/csrf-cookie");

            // Attempt registration
            const response = await axios.post("/api/register", userData);

            if (response.data.success) {
                user.value = response.data.user;
                isAuthenticated.value = true;
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",
                errors: error.response?.data?.errors || {},
            };
        } finally {
            loading.value = false;
        }
    };

    const loginWithGoogle = async (googleToken) => {
        loading.value = true
        try {
            // Get CSRF token first
            await axios.get("/sanctum/csrf-cookie")

            // Send Google token to backend
            const response = await axios.post("/api/auth/google", {
                token: googleToken,
            })

            if (response.data.success) {
                user.value = response.data.user
                isAuthenticated.value = true
                return { success: true }
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Google login failed",
            }
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        try {
            await axios.post("/api/logout");
            user.value = null;
            isAuthenticated.value = false;
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const checkAuth = async () => {
        try {
            const response = await axios.get("/api/user");
            if (response.data) {
                user.value = response.data;
                isAuthenticated.value = true;
            }
        } catch {
            user.value = null;
            isAuthenticated.value = false;
        } finally {
            isAuthChecked.value = true;
        }
    };

    return {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        checkAuth,
    };
});
