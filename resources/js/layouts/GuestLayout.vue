<template>
    <div class="min-vh-100 bg-light">
        <header class="bg-white shadow-sm">
            <nav class="navbar navbar-expand-lg navbar-light">
                <div class="container">
                    <router-link to="/" class="navbar-brand d-flex align-items-center">
                        <div class="me-2 d-flex align-items-center justify-content-center bg-success rounded-circle"
                            style="width: 32px; height: 32px;">
                            <i class="bi bi-lightning text-white"></i>
                        </div>
                        <span class="fs-4 fw-bold text-dark">Sheetany</span>
                    </router-link>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link text-muted" href="#">Templates</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-muted" href="#">Pricing</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-muted" href="#">Features</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-muted" href="#">Showcase</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-muted" href="#">Docs</a>
                            </li>
                        </ul>

                        <div class="d-flex align-items-center">
                            <router-link to="/login" class="btn btn-link text-muted text-decoration-none me-3">
                                Sign In
                            </router-link>
                            <button class="btn btn-success">
                                Create Website
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        <main>
            <slot />
        </main>
    </div>
</template>

<script setup>
// Guest layout for unauthenticated pages
</script>