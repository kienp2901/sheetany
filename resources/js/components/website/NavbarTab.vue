<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Navbar</h4>
                <p class="text-muted mb-0">Add navigation menus</p>
            </div>
            <button class="btn btn-success d-flex align-items-center" @click="showCreateForm">
                <i class="bi bi-plus me-2"></i>
                Add navbar item
            </button>
        </div>

        <!-- Empty State -->
        <div v-if="navbarItems.length === 0" class="card border-1">
            <div class="card-body text-center py-5">
                <i class="bi bi-menu-button-wide fs-1 text-muted mb-3"></i>
                <h5 class="mb-2">You don't have any nav items</h5>
                <p class="text-muted mb-3">Add a navigation menu item and choose the display position.</p>
                <button @click="showCreateForm" class="btn btn-success">
                    <i class="bi bi-plus me-1"></i>
                    Add navbar item
                </button>
            </div>
        </div>

        <!-- Navbar Items Table -->
        <div v-else class="card border-0 shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <tbody>
                            <tr v-for="(item, index) in navbarItems" :key="item.id" class="navbar-item-row"
                                :draggable="true" @dragstart="dragStart(index)" @dragover.prevent @drop="drop(index)">
                                <td class="ps-4 py-3" style="width: 40px;">
                                    <i class="bi bi-grip-vertical text-muted drag-handle"></i>
                                </td>
                                <td class="py-3">
                                    <span class="fw-medium">{{ item.title }}</span>
                                </td>
                                <td class="py-3">
                                    <div class="d-flex gap-2">
                                        <span class="badge" :class="{
                                            'bg-success': item.position === 'header',
                                            'bg-primary': item.position === 'footer'
                                        }">
                                            {{ item.position === 'header' ? 'Header' : 'Footer' }}
                                        </span>
                                        <span v-if="item.target === 'new'" class="badge bg-info">
                                            New tab
                                        </span>
                                    </div>
                                </td>
                                <td class="pe-4 py-3 text-end" style="width: 100px;">
                                    <div class="d-flex gap-2 justify-content-end">
                                        <button class="btn btn-sm btn-outline-primary" @click="editNavbarItem(item)">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger"
                                            @click="deleteNavbarItem(item.id)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Navbar Form Modal -->
        <NavbarForm :show="showForm" :navbar-item="editingItem" @close="closeForm" @submit="handleFormSubmit" />

        <!-- Confirm Delete Dialog -->
        <ConfirmDialog :show="showDeleteDialog" title="Delete navbar item"
            message="Are you sure you want to delete this navbar item? This action cannot be undone."
            @confirm="confirmDelete" @cancel="cancelDelete" />
    </div>
</template>

<script>
import axios from 'axios'
import { route as ziggyRoute } from 'ziggy-js'
import NavbarForm from './NavbarForm.vue';
import ConfirmDialog from '../ConfirmDialog.vue';

export default {
    name: 'NavbarTab',
    components: {
        NavbarForm,
        ConfirmDialog
    },
    data() {
        return {
            navbarItems: [],
            showForm: false,
            editingItem: null,
            showDeleteDialog: false,
            deletingItemId: null,
            draggedIndex: null,
            loading: false
        }
    },
    mounted() {
        this.loadNavbarItems();
    },
    methods: {
        async loadNavbarItems() {
            try {
                // Mock API call - replace with actual API
                const response = await axios.get(route('api.navbar.index'));
                this.navbarItems = response.data;
            } catch (error) {
                console.error('Error loading navbar items:', error);
                // Mock data for development
                this.navbarItems = [];
            }
        },

        showCreateForm() {
            this.editingItem = null;
            this.showForm = true;
        },

        editNavbarItem(item) {
            this.editingItem = { ...item };
            this.showForm = true;
        },

        closeForm() {
            this.showForm = false;
            this.editingItem = null;
        },

        async handleFormSubmit(formData) {
            try {
                if (this.editingItem) {
                    await axios.put(route('api.navbar.update', this.editingItem.id), formData);
                } else {
                    await axios.post(route('api.navbar.store'), formData);
                }

                await this.loadNavbarItems();
                this.closeForm();
            } catch (error) {
                console.error('Error saving navbar item:', error);
            }
        },

        deleteNavbarItem(itemId) {
            this.deletingItemId = itemId;
            this.showDeleteDialog = true;
        },

        async confirmDelete() {
            try {
                await axios.delete(route('api.navbar.destroy', this.deletingItemId));
                await this.loadNavbarItems();
            } catch (error) {
                console.error('Error deleting navbar item:', error);
            }
            this.cancelDelete();
        },

        cancelDelete() {
            this.showDeleteDialog = false;
            this.deletingItemId = null;
        },

        // Drag and drop methods
        dragStart(index) {
            this.draggedIndex = index;
        },

        drop(dropIndex) {
            if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
                const draggedItem = this.navbarItems[this.draggedIndex];

                // Remove dragged item
                this.navbarItems.splice(this.draggedIndex, 1);

                // Insert at new position
                this.navbarItems.splice(dropIndex, 0, draggedItem);

                // Update order and save to API
                this.updateItemsOrder();
            }
            this.draggedIndex = null;
        },

        async updateItemsOrder() {
            try {
                const orderedItems = this.navbarItems.map((item, index) => ({
                    id: item.id,
                    order: index + 1
                }));
                await axios.post(route('api.navbar.reorder'), { items: orderedItems });
            } catch (error) {
                console.error('Error updating items order:', error);
            }
        }
    }
}
</script>

<style scoped>
.navbar-item-row {
    cursor: move;
}

.drag-handle {
    cursor: grab;
}

.drag-handle:active {
    cursor: grabbing;
}

.navbar-item-row:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

@media (max-width: 768px) {
    .d-flex.justify-content-between {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 1rem;
    }

    .btn.btn-success {
        align-self: stretch;
    }

    .table-responsive {
        font-size: 0.9rem;
    }

    .badge {
        font-size: 0.7rem;
    }
}
</style>
