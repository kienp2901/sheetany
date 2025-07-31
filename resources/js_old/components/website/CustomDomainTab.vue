<template>
    <div>
        <NotificationAlert ref="notificationAlert" />
        
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Custom domain</h4>
                <p class="text-muted mb-0">Manage your custom domain and subdomain for this website.</p>
            </div>
        </div>

        <div class="card border-1 mb-4">
            <div class="card-body">
                <h6 class="card-title">Subdomain</h6>
                <p class="text-muted">
                    Your **.microgem.io.vn** subdomain.<br>
                    You can easily update it here.
                </p>

                <div class="mb-3">
                    <label class="form-label">Choose your subdomain <span class="text-danger">*</span></label>
                    <div class="input-group">
                        <span class="input-group-text">https://</span>
                        <input v-model="subdomain" type="text" class="form-control" placeholder="your-subdomain">
                        <span class="input-group-text text-muted">.microgem.io.vn</span>
                        <button class="btn btn-success" @click="updateSubdomain" :disabled="isUpdating">
                            <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {{ isUpdating ? 'Updating...' : 'Update' }} <i v-if="!isUpdating" class="bi bi-arrow-right ms-1"></i>
                        </button>
                    </div>
                    <div v-if="currentFullDomain" class="form-text mt-2">
                        Current URL: <a :href="`https://${currentFullDomain}`" target="_blank">{{ `https://${currentFullDomain}` }}</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="card border-1">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="card-title mb-0">
                        Custom domain
                        <span class="badge bg-dark ms-2">Pro</span>
                    </h6>
                    <button class="btn btn-success btn-sm">Upgrade to Pro →</button>
                </div>

                <div class="bg-light p-4 rounded text-center">
                    <div class="text-muted">
                        <p class="mb-2">The custom domain feature is available with **Pro** plans.</p>
                        <p class="mb-0">Upgrade to connect your own domain to your website.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { route as ziggyRoute } from 'ziggy-js'
import NotificationAlert from '@/components/NotificationAlert.vue';

const route = useRoute();
const notificationAlert = ref(null);

const loading = ref(true);
const subdomain = ref('');
const currentFullDomain = ref('');
const siteData = ref(null);
const isUpdating = ref(false); // New reactive variable to manage loading state for update button


// Function to extract subdomain
const extractSubdomain = (fullDomain) => {
    if (fullDomain) {
        const parts = fullDomain.split('.microgem.io.vn');
        if (parts.length > 0 && parts[0]) {
            return parts[0];
        }
    }
    return '';
};

// Function to handle subdomain update
const updateSubdomain = async () => {
    if (!subdomain.value || subdomain.value.trim() === '') {
        notificationAlert.value?.showError('Subdomain cannot be empty.');
        return;
    }

    if (!route.params.id) {
        notificationAlert.value?.showError('Website ID is missing. Cannot update subdomain.');
        return;
    }

    isUpdating.value = true; // Start loading state for the button

    try {
        // Assume your API endpoint for updating subdomain is something like /api/sites/{id}/subdomain
        // And it expects a POST/PUT request with the new subdomain in the body.
        // const response = await axios.post(`/api/sites/${route.params.id}/subdomain`, {
        //     subdomain: subdomain.value
        // });

        const response = await axios.post(ziggyRoute('api.sites.subdomain.update', { site: route.params.id }), {
            subdomain: subdomain.value
        });

        // Check if the API returned updated site data, or just a success message
        if (response.data && response.data.domain_name) {
            siteData.value.domain_name = response.data.domain_name;
            currentFullDomain.value = response.data.domain_name;
            // Re-extract subdomain in case backend modifies it (e.g., adds validation)
            subdomain.value = extractSubdomain(response.data.domain_name); 
            notificationAlert.value?.showSuccess('Subdomain updated successfully!');
        } else {
            // Fallback if backend just returns a success status without full data
            currentFullDomain.value = `${subdomain.value}.microgem.io.vn`;
            notificationAlert.value?.showSuccess('Subdomain updated successfully!');
        }
    } catch (error) {
        console.error('Failed to update subdomain:', error);

        if (error.response?.status === 403) {
            notificationAlert.value?.showError('You do not have permission to update this subdomain.', 'Access Denied');
        } else if (error.response?.status === 422 && error.response.data.errors?.subdomain) {
            // Handle validation errors from Laravel (if using Laravel backend)
            notificationAlert.value?.showError(error.response.data.errors.subdomain[0], 'Validation Error');
        } else {
            notificationAlert.value?.showError('Failed to update subdomain. Please try again.', 'Update Error');
        }
    } finally {
        isUpdating.value = false; // End loading state
    }
};

const fetchWebsiteInfo = async (id) => {
    try {
        loading.value = true;
        // const response = await axios.get(`/api/sites/${id}`);
         const response = await axios.get(ziggyRoute('api.sites.show', { id }));

        if (response.data) {
            siteData.value = response.data;
            currentFullDomain.value = siteData.value.domain_name;

            subdomain.value = extractSubdomain(siteData.value.domain_name);

            notificationAlert.value?.showSuccess('Website information loaded successfully.');
        } else {
            notificationAlert.value?.showWarning('No website information found.');
        }
    } catch (error) {
        console.error('Failed to fetch website info:', error);

        if (error.response?.status === 403) {
            notificationAlert.value?.showError('You do not have permission to access this website.', 'Access Denied');
        } else if (error.response?.status === 404) {
            notificationAlert.value?.showError('Website not found.', 'Not Found');
        } else {
            notificationAlert.value?.showError('Failed to load website information.', 'Loading Error');
        }
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    const websiteId = route.params.id;
    if (websiteId) {
        fetchWebsiteInfo(websiteId);
    }
});
</script>