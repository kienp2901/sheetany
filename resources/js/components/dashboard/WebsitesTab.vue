<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">My websites ({{ websites.length }})</h4>
            <div class="d-flex gap-2">
                <div class="input-group" style="width: 300px;">
                    <span class="input-group-text">
                        <i class="bi bi-search"></i>
                    </span>
                    <input type="text" class="form-control" placeholder="Search...">
                </div>
                <button class="btn btn-primary">
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
            <div v-for="website in websites" :key="website.id" class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-primary rounded d-flex align-items-center justify-content-center me-3"
                                style="width: 40px; height: 40px;">
                                <span class="text-white fw-bold">{{ website.name.charAt(0) }}</span>
                            </div>
                            <div>
                                <h6 class="mb-1">{{ website.name }}</h6>
                                <small class="text-muted">{{ website.url }}</small>
                            </div>
                        </div>
                        <p class="text-muted small mb-3">Last updated on {{ website.lastUpdated }}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-speedometer2 me-1"></i>
                                Dashboard
                            </button>
                            <button class="btn btn-outline-secondary btn-sm">
                                <i class="bi bi-eye me-1"></i>
                                View website
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const websites = ref([
    {
        id: 1,
        name: 'Test Web',
        url: 'testweb.sheetany.site',
        lastUpdated: '18 Jul 2025'
    }
])
</script>