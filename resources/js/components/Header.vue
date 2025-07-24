<template>
    <header class="bg-white border-bottom px-4 py-3">
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <i class="bi bi-brightness-high me-3 text-muted"></i>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button @click="$emit('show-feedback')" class="btn btn-outline-secondary btn-sm">
                    Feedback
                </button>
                <button @click="$emit('change-tab', 'pricing')" class="btn btn-success btn-sm">
                    Upgrade →
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
// Emits show-feedback and change-tab events
</script>
