<template>
    <div class="bg-light border-end d-flex flex-column align-items-center py-3" style="width: 80px; min-width: 80px; max-width: 80px; min-height: 100vh;">
        <div class="d-flex flex-column align-items-center py-3">
            <!-- Logo -->
            <div class="mb-4 d-flex align-items-center justify-content-center bg-success rounded-circle"
                style="width: 32px; height: 32px;">
                <i class="bi bi-pause-fill text-white"></i>
            </div>

            <!-- Navigation Items -->
            <div class="d-flex flex-column gap-3">
                <button
                    v-for="item in menuItems"
                    :key="item.tab"
                    @click="$emit('change-tab', item.tab)"
                    :class="['btn', 'btn-sm', 'd-flex', 'flex-column', 'align-items-center', 'text-decoration-none', 'border-0',
                        activeTab === item.tab ? 'text-success bg-success bg-opacity-10' : 'text-muted bg-transparent']"
                    style="width: 60px;"
                >
                    <i :class="['bi', item.icon, 'fs-5', 'mb-1']"></i>
                    <small style="font-size: 10px;">{{ item.label }}</small>
                </button>
            </div>

            <!-- Logout Button -->
            <div class="mt-auto">
                <button
                    @click="$emit('logout')"
                    class="btn btn-sm d-flex flex-column align-items-center text-muted text-decoration-none border-0 bg-transparent"
                    style="width: 60px;"
                >
                    <i class="bi bi-box-arrow-right fs-5 mb-1"></i>
                    <small style="font-size: 10px;">Logout</small>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    activeTab: String
})

const emits = defineEmits(['change-tab', 'logout'])

const menuItems = [
    { tab: 'websites', label: 'Home', icon: 'bi-house' },
    { tab: 'files', label: 'Files', icon: 'bi-upload' },
    { tab: 'pricing', label: 'Pricing', icon: 'bi-currency-dollar' },
    { tab: 'profile', label: 'Profile', icon: 'bi-person' },
    { tab: 'workspaces', label: 'WS', icon: 'bi-briefcase' },
    { tab: 'api', label: 'API', icon: 'bi-code-slash' },
]
</script>
