<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Custom Code</h4>
                <p class="text-muted mb-0">Customize JS and CSS code for your website</p>
            </div>
        </div>

        <!-- Inject custom JS code -->
        <div class="card border-1 mb-4">
            <div class="card-body">
                <h6 class="card-title">Inject custom JS code</h6>
                <p class="text-muted">
                    You can inject custom JS code here. This code will be applied across all pages.
                    You can choose the position to display the JS code on your website.
                </p>

                <div class="mb-3">
                    <label class="form-label">JS position</label>
                    <select v-model="jsPosition" class="form-select">
                        <option value="head">Head</option>
                        <option value="body-start">Body Start</option>
                        <option value="body-end">Body End</option>
                    </select>
                </div>

                <div class="mb-3">
                    <textarea v-model="customJS" class="form-control font-monospace" rows="8"
                        placeholder="Enter your JS code here..."></textarea>
                </div>
            </div>
        </div>

        <!-- Inject custom CSS code -->
        <div class="card border-1 mb-4">
            <div class="card-body">
                <h6 class="card-title">Inject custom CSS code</h6>
                <p class="text-muted">
                    You can inject custom CSS code here, without the &lt;style&gt; tag. This code will be applied across
                    all pages.
                </p>

                <div class="mb-3">
                    <textarea v-model="customCSS" class="form-control font-monospace" rows="8"
                        placeholder="Enter your CSS code here..."></textarea>
                </div>
            </div>
        </div>

        <button class="btn btn-success">
            Update code <i class="bi bi-arrow-right ms-1"></i>
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const jsPosition = ref('head')
const customJS = ref('')
const customCSS = ref('')
</script>