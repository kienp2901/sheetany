<template>
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">My workspaces</h4>
            <div class="d-flex gap-2">
                <div class="input-group" style="width: 300px;">
                    <span class="input-group-text">
                        <i class="bi bi-search"></i>
                    </span>
                    <input type="text" class="form-control" placeholder="Search...">
                </div>
                <button class="btn btn-success">
                    <i class="bi bi-plus me-1"></i>
                    Create workspace
                </button>
            </div>
        </div>

        <div class="bg-white rounded p-5 text-center">
            <i class="bi bi-briefcase fs-1 text-muted mb-3"></i>
            <h5 class="mb-2">You don't have any workspaces</h5>
            <p class="text-muted mb-4">Create a workspace with a list of websites and invite members to join today.</p>
            <button class="btn btn-success">
                <i class="bi bi-plus me-1"></i>
                Create workspace
            </button>
        </div>
    </div>
</template>