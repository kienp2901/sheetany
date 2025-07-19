<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Custom domain</h4>
                <p class="text-muted mb-0">Customize subdomain and custom domain for your website</p>
            </div>
        </div>

        <!-- Subdomain Section -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <h6 class="card-title">Subdomain</h6>
                <p class="text-muted">
                    Your <strong>.sheetany.site</strong> subdomain.<br>
                    You can also use a custom domain or a subdirectory on your main domain to host your site if you have
                    one.
                </p>

                <div class="mb-3">
                    <label class="form-label">Choose your subdomain <span class="text-danger">*</span></label>
                    <div class="input-group">
                        <span class="input-group-text">https://</span>
                        <input v-model="subdomain" type="text" class="form-control" placeholder="testweb">
                        <span class="input-group-text text-muted">.sheetany.site</span>
                        <button class="btn btn-success">
                            Update <i class="bi bi-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Custom Domain Section -->
        <div class="card border-0 shadow-sm">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="card-title mb-0">
                        Custom domain
                        <span class="badge bg-dark ms-2">3</span>
                    </h6>
                    <button class="btn btn-success btn-sm">Upgrade →</button>
                </div>

                <div class="bg-light p-4 rounded text-center">
                    <div class="text-muted">
                        <p class="mb-2">Custom domain feature is available in premium plans.</p>
                        <p class="mb-0">Upgrade to connect your own domain.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const subdomain = ref('testweb')
</script>