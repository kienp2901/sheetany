<template>
    <header class="border-bottom px-4 py-3">
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item">
                            <router-link to="/dashboard/websites" class="text-decoration-none text-muted">My websites</router-link>
                        </li>
                        <li class="breadcrumb-item active text-dark">{{ websiteName }}</li>
                    </ol>
                </nav>
            </div>

            <div class="d-flex align-items-center gap-2">
                <span class="text-muted ms-3 small">Synced: an hour ago</span>
                <button class="btn btn-success btn-sm">
                    <i class="bi bi-pencil me-1"></i>
                    Edit Google Sheets
                </button>
                <button class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button class="btn btn-outline-success btn-sm">
                    View website <i class="bi bi-box-arrow-up-right ms-1"></i>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
defineProps(['websiteName'])
</script>
