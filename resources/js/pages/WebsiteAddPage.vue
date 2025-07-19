<template>
    <div class="min-vh-100" style="background-color: #f8f9fa;">
        <!-- Header -->
        <header class="bg-white border-bottom px-4 py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="d-flex align-items-center justify-content-center bg-success rounded-circle me-3"
                        style="width: 32px; height: 32px;">
                        <i class="bi bi-pause-fill text-white"></i>
                    </div>
                    <span class="fw-bold text-success fs-5">Sheetany</span>
                </div>

                <button @click="exitFlow" class="btn btn-outline-secondary">
                    <i class="bi bi-x me-1"></i>
                    Exit
                </button>
            </div>
        </header>

        <!-- Progress Steps -->
        <div class="bg-white border-bottom px-4 py-3">
            <div class="d-flex justify-content-center">
                <div class="d-flex align-items-center gap-4">
                    <!-- Step 1 -->
                    <div class="d-flex align-items-center">
                        <div :class="['rounded-circle d-flex align-items-center justify-content-center me-2', currentStep >= 1 ? 'bg-success text-white' : 'bg-light text-muted']"
                            style="width: 32px; height: 32px;">
                            <i v-if="currentStep > 1" class="bi bi-check"></i>
                            <span v-else>1</span>
                        </div>
                        <span :class="currentStep >= 1 ? 'text-success fw-medium' : 'text-muted'">Create Google
                            Sheet</span>
                    </div>

                    <!-- Step 2 -->
                    <div class="d-flex align-items-center">
                        <div :class="['rounded-circle d-flex align-items-center justify-content-center me-2', currentStep >= 2 ? 'bg-success text-white' : 'bg-light text-muted']"
                            style="width: 32px; height: 32px;">
                            <i v-if="currentStep > 2" class="bi bi-check"></i>
                            <span v-else>2</span>
                        </div>
                        <span :class="currentStep >= 2 ? 'text-success fw-medium' : 'text-muted'">Data Mapping</span>
                    </div>

                    <!-- Step 3 -->
                    <div class="d-flex align-items-center">
                        <div :class="['rounded-circle d-flex align-items-center justify-content-center me-2', currentStep >= 3 ? 'bg-success text-white' : 'bg-light text-muted']"
                            style="width: 32px; height: 32px;">
                            <span>3</span>
                        </div>
                        <span :class="currentStep >= 3 ? 'text-success fw-medium' : 'text-muted'">Select
                            subdomain</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="container py-5">
            <!-- Step 1: Create Google Sheet -->
            <div v-if="currentStep === 1" class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="text-center mb-5">
                        <h3 class="fw-bold mb-3">Create content with Google Sheets</h3>
                        <p class="text-muted">
                            Bring your own Google Sheets or "Make a copy" our Google Sheets
                        </p>
                    </div>

                    <div class="bg-white rounded p-5 text-center shadow-sm">
                        <p class="text-muted mb-4">
                            Make a copy our Google Sheets template include information and content
                        </p>
                        <button @click="makeACopy" class="btn btn-outline-secondary mb-4">
                            Make a copy <i class="bi bi-box-arrow-up-right ms-1"></i>
                        </button>
                    </div>

                    <div class="d-flex justify-content-end mt-4">
                        <button @click="nextStep" class="btn btn-dark px-4">Next</button>
                    </div>
                </div>
            </div>

            <!-- Step 2: Data Mapping -->
            <div v-if="currentStep === 2" class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="text-center mb-5">
                        <h3 class="fw-bold mb-3">Mapping data from your template to site</h3>
                        <p class="text-muted">
                            To build the site, you need to connect two <strong>sheets</strong>: information and
                            <strong>content</strong> from Google Sheets.
                        </p>
                    </div>

                    <div class="bg-white rounded p-5 shadow-sm">
                        <div v-if="!isConnected" class="text-center">
                            <h5 class="mb-3">Google Sheets is not connected</h5>
                            <p class="text-muted mb-4">Please enter public Google Sheets URL of your site</p>

                            <div class="mb-4">
                                <label class="form-label text-start d-block">Google Sheets URL <span
                                        class="text-danger">*</span></label>
                                <div class="input-group">
                                    <input v-model="googleSheetsUrl" type="url" class="form-control"
                                        placeholder="https://docs.google.com/spreadsheets/d/xxx">
                                    <button @click="connectGoogleSheets" class="btn btn-outline-secondary">
                                        Connect <i class="bi bi-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-else class="text-center">
                            <h5 class="mb-3 text-success">Google Sheets is connected</h5>
                            <p class="text-muted mb-4">Please enter public Google Sheets URL of your site</p>

                            <div class="mb-4">
                                <label class="form-label text-start d-block">Google Sheets URL <span
                                        class="text-danger">*</span></label>
                                <div class="input-group">
                                    <input v-model="googleSheetsUrl" type="url" class="form-control" readonly>
                                    <button @click="connectGoogleSheets" class="btn btn-outline-secondary">
                                        Connect <i class="bi bi-arrow-right ms-1"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="alert alert-success d-flex align-items-center mb-4">
                                <i class="bi bi-check-circle me-2"></i>
                                <div class="text-start">
                                    Connected to your Google Sheets. Choose the sheet on the right that matches the
                                    information on the left to build your site.
                                </div>
                            </div>

                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label text-start d-block fw-medium">Information</label>
                                    <p class="text-muted small text-start">Information Sheet</p>
                                    <select v-model="selectedInfoSheet" class="form-select">
                                        <option value="">Information</option>
                                        <option v-for="sheet in availableSheets" :key="sheet" :value="sheet">{{ sheet }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label text-start d-block fw-medium">Content</label>
                                    <p class="text-muted small text-start">Content Sheet</p>
                                    <select v-model="selectedContentSheet" class="form-select">
                                        <option value="">Content</option>
                                        <option v-for="sheet in availableSheets" :key="sheet" :value="sheet">{{ sheet }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between mt-4">
                        <button @click="prevStep" class="btn btn-outline-secondary px-4">Back</button>
                        <button @click="nextStep" :disabled="!canProceedStep2" class="btn btn-dark px-4">Next</button>
                    </div>
                </div>
            </div>

            <!-- Step 3: Select subdomain -->
            <div v-if="currentStep === 3" class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="text-center mb-5">
                        <h3 class="fw-bold mb-3">You're all set to go!</h3>
                        <p class="text-muted">
                            Choose a sheetany.site subdomain for your site. Don't worry,<br>
                            you can change and add your own domain later.
                        </p>
                    </div>

                    <div class="bg-white rounded p-5 shadow-sm">
                        <p class="text-muted mb-4 text-center">
                            Make sure you enter only the first part of the subdomain.
                        </p>

                        <div class="mb-4">
                            <label class="form-label">Enter your site's name <span class="text-danger">*</span></label>
                            <input v-model="siteName" type="text" class="form-control" placeholder="Test Web">
                        </div>

                        <div class="mb-4">
                            <label class="form-label">Choose your subdomain <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text">https://</span>
                                <input v-model="subdomain" type="text" class="form-control" placeholder="testweb">
                                <span class="input-group-text text-muted">.sheetany.site</span>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between mt-4">
                        <button @click="prevStep" class="btn btn-outline-secondary px-4">Back</button>
                        <button @click="finishWebsite" :disabled="!canFinish"
                            class="btn btn-success px-4">Finish</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const currentStep = ref(1)
const templateId = ref('')
const googleSheetsUrl = ref('')
const isConnected = ref(false)
const availableSheets = ref([])
const selectedInfoSheet = ref('')
const selectedContentSheet = ref('')
const siteName = ref('')
const subdomain = ref('')

const canProceedStep2 = computed(() => {
    return isConnected.value && selectedInfoSheet.value && selectedContentSheet.value
})

const canFinish = computed(() => {
    return siteName.value.trim() && subdomain.value.trim()
})

const makeACopy = () => {
    // Open Google Sheets template in new tab
    window.open('https://docs.google.com/spreadsheets/d/1IF9-vLSGFMK-Wv-4393Zu7RY81y-4-zPP2g5CvpjNVQ/copy', '_blank')
}

const extractSpreadsheetId = (url) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    return match ? match[1] : null
}

const connectGoogleSheets = async () => {
    if (!googleSheetsUrl.value) return

    try {
        const spreadsheetId = extractSpreadsheetId(googleSheetsUrl.value)
        if (!spreadsheetId) {
            alert('Invalid Google Sheets URL')
            return
        }

        // Call Google Sheets API to get sheet names
        const apiKey = 'AIzaSyAwU9gxvZ2R5xkrCaViJ3Juiz44oQCg5Z0'
        const response = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`,
            { withCredentials: false } // Thêm dòng này
        )

        if (response.data && response.data.sheets) {
            availableSheets.value = response.data.sheets.map(sheet => sheet.properties.title)
            isConnected.value = true

            // Auto-select sheets if available
            if (availableSheets.value.includes('Information')) {
                selectedInfoSheet.value = 'Information'
            }
            if (availableSheets.value.includes('Content')) {
                selectedContentSheet.value = 'Content'
            }
        }
    } catch (error) {
        console.error('Error connecting to Google Sheets:', error)
        alert('Failed to connect to Google Sheets. Please check the URL and make sure the sheet is public.')
    }
}

const nextStep = () => {
    if (currentStep.value < 3) {
        currentStep.value++
    }
}

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--
    }
}

const finishWebsite = () => {
    // Create website logic here
    console.log('Creating website:', {
        templateId: templateId.value,
        siteName: siteName.value,
        subdomain: subdomain.value,
        googleSheetsUrl: googleSheetsUrl.value,
        infoSheet: selectedInfoSheet.value,
        contentSheet: selectedContentSheet.value
    })

    // Redirect to dashboard
    router.push('/dashboard/websites')
}

const exitFlow = () => {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
        router.push('/dashboard/websites')
    }
}

onMounted(() => {
    templateId.value = route.params.templateId
})
</script>

<style scoped>
.input-group-text {
    background-color: #f8f9fa;
}

.form-control:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
</style>