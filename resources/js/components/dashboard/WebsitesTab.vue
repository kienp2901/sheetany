<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">My websites ({{ websites.length }})</h4>
            <div class="d-flex gap-2">
                <div class="input-group" style="width: 300px;">
                    <span class="input-group-text">
                        <i class="bi bi-search"></i>
                    </span>
                    <input v-model="searchQuery" type="text" class="form-control" placeholder="Search...">
                </div>
                <button @click="fetchWebsites" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="bi bi-arrow-clockwise me-1"></i>
                    Update
                </button>
            </div>
        </div>

        <div class="row">
            <!-- New Website Card -->
            <div class="col-md-4 mb-4">
                <div @click="$router.push('/new-website')"
                    class="border border-2 border-dashed rounded p-5 text-center h-100 d-flex flex-column justify-content-center cursor-pointer"
                    style="cursor: pointer;">
                    <i class="bi bi-plus-circle fs-1 text-muted mb-3"></i>
                    <h6 class="text-muted">New Website</h6>
                </div>
            </div>

            <!-- Existing Websites -->
            <div v-for="website in filteredWebsites" :key="website.id" class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-primary rounded d-flex align-items-center justify-content-center me-3"
                                style="width: 40px; height: 40px;">
                                <span class="text-white fw-bold">{{ website.name?.charAt(0) || 'W' }}</span>
                            </div>
                            <div>
                                <h6 class="mb-1">{{ website.name }}</h6>
                                <small class="text-muted">{{ website.domain_name }}</small>
                            </div>
                        </div>
                        <div class="mb-3">
                            <span class="badge" :class="website.type === 1 ? 'bg-info' : 'bg-success'">
                                {{ website.type === 1 ? 'Blog' : 'E-commerce' }}
                            </span>
                        </div>
                        <p class="text-muted small mb-3">Created {{ formatDate(website.created_at) }}</p>
                        <div class="d-flex gap-2">
                            <button @click="$router.push(`/website/${website.id}/manage`)"
                                class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-speedometer2 me-1"></i>
                                Dashboard
                            </button>
                            <button @click="viewWebsite(website)" class="btn btn-outline-secondary btn-sm">
                                <i class="bi bi-eye me-1"></i>
                                View website
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <!-- <div v-if="websites.length === 0 && !loading" class="col-12">
            <div class="bg-white rounded p-5 text-center">
                <i class="bi bi-globe fs-1 text-muted mb-3"></i>
                <h5 class="mb-2">No websites yet</h5>
                <p class="text-muted mb-4">Create your first website to get started.</p>
                <button @click="$router.push('/new-website')" class="btn btn-success">
                    <i class="bi bi-plus me-1"></i>
                    Create Website
                </button>
            </div>
        </div> -->
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const websites = ref([])
const searchQuery = ref('')
const loading = ref(false)

const filteredWebsites = computed(() => {
    if (!searchQuery.value) return websites.value
    return websites.value.filter(website => 
        website.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        website.domain_name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const fetchWebsites = async () => {
    loading.value = true
    try {
        const response = await axios.get('/api/sites')
        websites.value = response.data
    } catch (error) {
        console.error('Error fetching websites:', error)
    } finally {
        loading.value = false
    }
}

const viewWebsite = (website) => {
    window.open(`https://${website.domain_name}`, '_blank')
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
    fetchWebsites()
})
</script>