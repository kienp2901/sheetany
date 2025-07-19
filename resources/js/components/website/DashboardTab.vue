<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Dashboard</h4>
                <p class="text-muted mb-0">Customize and update your website</p>
            </div>
        </div>

        <div class="row g-4 mb-4">
            <!-- Customize your site -->
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body">
                        <h6 class="card-title">Customize your site</h6>
                        <p class="card-text text-muted small">Customize site: show or hide action blocks, page size,
                            etc.</p>
                        <button class="btn btn-outline-secondary btn-sm">
                            Customize <i class="bi bi-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Customize your domain -->
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body">
                        <h6 class="card-title">Customize your domain</h6>
                        <p class="card-text text-muted small">Personalize your domain by connecting it to Sheetany.</p>
                        <button class="btn btn-outline-secondary btn-sm">
                            Connect domain <i class="bi bi-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Pages -->
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body">
                        <h6 class="card-title">Pages</h6>
                        <p class="card-text text-muted small">Create multiple pages from Google Docs.</p>
                        <button class="btn btn-outline-secondary btn-sm">
                            Create page <i class="bi bi-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Embed your site into external websites -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <h6 class="card-title">Embed your site into external websites</h6>
                <p class="card-text text-muted">
                    Integrate your content or services into other websites through iframes for seamless visibility and
                    interaction.
                    Access the settings to customize the display of sections such as the header, footer, hero section,
                    and more.
                </p>
                <div class="bg-light p-3 rounded">
                    <code>&lt;iframe src="https://testweb.sheetany.site" width="100%" height="100%" frameborder="0" allowfullscreen&gt;&lt;/iframe&gt;</code>
                </div>
            </div>
        </div>

        <!-- Password protected -->
        <div class="card border-0 shadow-sm">
            <div class="card-body">
                <h6 class="card-title">Password protected</h6>
                <p class="card-text text-muted">
                    Limit access to your website with a password. Each line represents one password. Leave it blank if
                    your website is public.
                </p>
                <textarea v-model="passwords" class="form-control mb-3" rows="4"
                    placeholder="Each line represents one password"></textarea>
                <button class="btn btn-success btn-sm">
                    Update password <i class="bi bi-arrow-right ms-1"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const passwords = ref('')
</script>