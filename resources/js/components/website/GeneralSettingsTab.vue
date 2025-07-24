<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">General settings</h4>
                <p class="text-muted mb-0">Customize the displayed information on your website</p>
            </div>
        </div>

        <div class="row g-4">
            <!-- Left Column -->
            <div class="col-md-6">
                <!-- Name -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <h6 class="card-title">Name</h6>
                        <p class="text-muted small">Website name displayed in the dashboard</p>
                        <input v-model="websiteName" type="text" class="form-control" placeholder="Test Web">
                    </div>
                </div>

                <!-- Show dark mode -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title mb-1">Show dark mode</h6>
                                <p class="text-muted small mb-0">Display the dark mode button on your website menu</p>
                            </div>
                            <div class="form-check form-switch">
                                <input v-model="showDarkMode" class="form-check-input" type="checkbox" id="darkMode">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Hide footer -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title mb-1">Hide footer</h6>
                                <p class="text-muted small mb-0">Hide your website's footer</p>
                            </div>
                            <div class="form-check form-switch">
                                <input v-model="hideFooter" class="form-check-input" type="checkbox" id="hideFooter">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Show collected emails -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title mb-1">Show collected emails</h6>
                                <p class="text-muted small mb-0">Show block to collect email information from registered
                                    users</p>
                            </div>
                            <div class="form-check form-switch">
                                <input v-model="showCollectedEmails" class="form-check-input" type="checkbox"
                                    id="showEmails">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Disable auto-sync -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title mb-1">Disable auto-sync</h6>
                                <p class="text-muted small mb-0">Turn off automatic data updates from Google Sheets</p>
                            </div>
                            <div class="form-check form-switch">
                                <input v-model="disableAutoSync" class="form-check-input" type="checkbox" id="autoSync">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Text center -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title mb-1">Text center</h6>
                                <p class="text-muted small mb-0">Display the title and information at the center of the
                                    pages</p>
                            </div>
                            <div class="form-check form-switch">
                                <input v-model="textCenter" class="form-check-input" type="checkbox" id="textCenter">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination Size -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <h6 class="card-title">Pagination Size</h6>
                        <p class="text-muted small">Set the number of data items to display on the website. It should be
                            between 10 and 50.</p>
                        <input v-model="paginationSize" type="number" class="form-control" min="10" max="50"
                            placeholder="10">
                    </div>
                </div>

                <!-- Publish website -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title mb-1">Publish website</h6>
                                <p class="text-muted small mb-0">Publish your website to the internet</p>
                            </div>
                            <div class="form-check form-switch">
                                <input v-model="publishWebsite" class="form-check-input" type="checkbox"
                                    id="publishWebsite">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="col-md-6">
                <!-- Build on Sheetany -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title mb-1">
                                    Build on Sheetany
                                    <span class="badge bg-dark ms-2">3</span>
                                </h6>
                                <p class="text-muted small mb-0">Display the Build on Sheetany badge on your website</p>
                            </div>
                            <div class="form-check form-switch">
                                <input v-model="buildOnSheetany" class="form-check-input" type="checkbox"
                                    id="buildOnSheetany">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Hide header -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title mb-1">Hide header</h6>
                                <p class="text-muted small mb-0">Hide your website's header</p>
                            </div>
                            <div class="form-check form-switch">
                                <input v-model="hideHeader" class="form-check-input" type="checkbox" id="hideHeader">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Hide hero -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title mb-1">Hide hero</h6>
                                <p class="text-muted small mb-0">Hide your website's hero section</p>
                            </div>
                            <div class="form-check form-switch">
                                <input v-model="hideHero" class="form-check-input" type="checkbox" id="hideHero">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Show the About Us page -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title mb-1">Show the About Us page</h6>
                                <p class="text-muted small mb-0">Display the About Us page using data updated in Google
                                    Sheets</p>
                            </div>
                            <div class="form-check form-switch">
                                <input v-model="showAboutUs" class="form-check-input" type="checkbox" id="showAboutUs">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Show feedback form -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title mb-1">Show feedback form</h6>
                                <p class="text-muted small mb-0">Display the feedback page for users to enter
                                    information</p>
                            </div>
                            <div class="form-check form-switch">
                                <input v-model="showFeedbackForm" class="form-check-input" type="checkbox"
                                    id="showFeedbackForm">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Font size -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title mb-1">Font size</h6>
                                <p class="text-muted small mb-0">Display small text title</p>
                            </div>
                            <div class="form-check form-switch">
                                <input v-model="fontSize" class="form-check-input" type="checkbox" id="fontSize">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Font Family -->
                <div class="card border-1 mb-4">
                    <div class="card-body">
                        <h6 class="card-title">Font Family</h6>
                        <p class="text-muted small">Display font for website</p>
                        <select v-model="fontFamily" class="form-select">
                            <option value="Poppins">Poppins</option>
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">Times New Roman</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Update Settings Button -->
        <div class="mb-4">
            <button class="btn btn-success">
                Update setting <i class="bi bi-arrow-right ms-1"></i>
            </button>
        </div>

        <!-- Danger Zone -->
        <div class="card border-danger">
            <div class="card-body">
                <h6 class="card-title text-danger">Danger zone</h6>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">Delete website</h6>
                        <p class="text-muted small mb-0">This action will remove the website from your account</p>
                    </div>
                    <button class="btn btn-outline-danger btn-sm">
                        <i class="bi bi-trash me-1"></i>
                        Delete website
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const websiteName = ref('Test Web')
const showDarkMode = ref(true)
const hideFooter = ref(false)
const hideHeader = ref(false)
const hideHero = ref(false)
const showCollectedEmails = ref(true)
const disableAutoSync = ref(false)
const textCenter = ref(false)
const showAboutUs = ref(true)
const showFeedbackForm = ref(false)
const fontSize = ref(false)
const fontFamily = ref('Poppins')
const paginationSize = ref(10)
const publishWebsite = ref(true)
const buildOnSheetany = ref(true)
</script>