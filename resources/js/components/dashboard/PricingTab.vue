<template>
    <div class="container-fluid">
        <div class="text-center mb-5">
            <h3 class="mb-3">Choose the plan that's right for you or your company.</h3>
            <div class="d-flex justify-content-center gap-3 mb-4">
                <button class="btn btn-outline-secondary">Monthly</button>
                <button class="btn btn-outline-secondary">
                    Yearly
                    <span class="badge bg-success ms-1">Save 40%</span>
                </button>
            </div>
        </div>

        <div class="row g-4 mb-5">
            <!-- Basic Plan -->
            <div class="col-lg-3">
                <div class="card h-100">
                    <div class="card-body p-4">
                        <h5 class="card-title">Basic</h5>
                        <div class="mb-3">
                            <span class="h2">$9</span>
                            <span class="text-muted">/mo</span>
                        </div>
                        <p class="text-muted mb-4">Perfect for getting started</p>
                        <button class="btn btn-dark w-100 mb-4">Buy Now →</button>

                        <ul class="list-unstyled">
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>1 Custom domain</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>SSL (HTTPS)</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>Google Analytics</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>Search, Filters & Sorting
                            </li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>Collect Emails</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>Optimized SEO</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Premium Plan -->
            <div class="col-lg-3">
                <div class="card h-100">
                    <div class="card-body p-4">
                        <h5 class="card-title">Premium</h5>
                        <div class="mb-3">
                            <span class="h2">$19</span>
                            <span class="text-muted">/mo</span>
                        </div>
                        <p class="text-muted mb-4">For individuals and small teams</p>
                        <button class="btn btn-dark w-100 mb-4">Buy Now →</button>

                        <ul class="list-unstyled">
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>4 Custom domain</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>SSL (HTTPS)</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>Google Analytics</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>Search, Filters & Sorting
                            </li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>Collect Emails</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>Optimized SEO</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Business Plan -->
            <div class="col-lg-3">
                <div class="card h-100 border-success">
                    <div class="card-header bg-success text-white text-center">
                        <small>Most Popular</small>
                    </div>
                    <div class="card-body p-4">
                        <h5 class="card-title">Business</h5>
                        <div class="mb-3">
                            <span class="h2">$39</span>
                            <span class="text-muted">/mo</span>
                        </div>
                        <p class="text-muted mb-4">For professional teams</p>
                        <button class="btn btn-success w-100 mb-4">Start Now →</button>

                        <ul class="list-unstyled">
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>10 Custom domain</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>SSL (HTTPS)</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Google Analytics</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Search, Filters &
                                Sorting</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Collect Emails</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Optimized SEO</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Enterprise Plan -->
            <div class="col-lg-3">
                <div class="card h-100">
                    <div class="card-body p-4">
                        <h5 class="card-title">Enterprise</h5>
                        <div class="mb-3">
                            <span class="h2">$69</span>
                            <span class="text-muted">/mo</span>
                        </div>
                        <p class="text-muted mb-4">For large businesses</p>
                        <button class="btn btn-dark w-100 mb-4">Buy Now →</button>

                        <ul class="list-unstyled">
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>100 Custom domain</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>SSL (HTTPS)</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>Google Analytics</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>Search, Filters & Sorting
                            </li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>Collect Emails</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-muted me-2"></i>Optimized SEO</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lifetime Plan -->
        <div class="row justify-content-center">
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-body p-4 text-center">
                        <h5 class="card-title">Agency Pro Lifetime</h5>
                        <div class="mb-3">
                            <span class="h2">$999</span>
                        </div>
                        <p class="text-muted mb-3">One-time payment</p>
                        <div class="alert alert-warning d-flex align-items-center mb-3">
                            <i class="bi bi-fire me-2"></i>
                            <small>15 spots left ($1499 soon)</small>
                        </div>
                        <button class="btn btn-primary w-100 mb-4">Claim Lifetime Access →</button>

                        <p class="mb-3">Everything in <strong>Enterprise</strong>, and:</p>
                        <ul class="list-unstyled text-start">
                            <li class="mb-2"><i
                                    class="bi bi-check-circle text-primary me-2"></i><strong>Unlimited</strong> Custom
                                domain</li>
                            <li class="mb-2"><i
                                    class="bi bi-check-circle text-primary me-2"></i><strong>Unlimited</strong>
                                Workspace</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-primary me-2"></i>Webhook and API</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-primary me-2"></i>Prioritize feature
                                requests</li>
                            <li class="mb-2"><i class="bi bi-check-circle text-primary me-2"></i>Highest support
                                priority</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>