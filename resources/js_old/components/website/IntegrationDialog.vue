<template>
    <div class="modal fade" :class="{ show: show }" :style="{ display: show ? 'block' : 'none' }" tabindex="-1"
        @click.self="closeDialog">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header border-0 pb-0">
                    <button type="button" class="btn-close" @click="closeDialog"></button>
                </div>
                <div class="modal-body text-center px-4 pb-4">
                    <div class="mb-3">
                        <i class="bi bi-unlock fs-1 text-success"></i>
                    </div>
                    <h5 class="mb-3">Unlock unlimited potential <i class="bi bi-box-arrow-up-right"></i></h5>

                    <div class="alert alert-warning d-flex align-items-center mb-4" role="alert">
                        <i class="bi bi-emoji-smile me-2"></i>
                        <div>
                            <strong>Paid feature 😊</strong>
                        </div>
                    </div>

                    <p class="text-muted mb-4">
                        To experience advanced features, you need to upgrade your account to a package that suits your
                        needs 🚀
                    </p>

                    <button class="btn btn-success w-100" @click="upgradeNow">
                        Upgrade now →
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script>
export default {
    name: 'IntegrationDialog',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        integration: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ['close'],
    methods: {
        closeDialog() {
            this.$emit('close');
        },
        upgradeNow() {
            // Handle upgrade logic here
            console.log('Upgrade now clicked');
            this.closeDialog();
        }
    }
}
</script>
