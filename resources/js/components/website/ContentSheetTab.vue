<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Content sheet</h4>
                <p class="text-muted mb-0">Content sheet mapped from your Google Sheets</p>
            </div>
        </div>

        <div class="card border-1">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="px-3 py-3 text-muted small">#</th>
                                <th class="px-3 py-3 text-muted small">SKU</th>
                                <th class="px-3 py-3 text-muted small">NAME</th>
                                <th class="px-3 py-3 text-muted small">INVENTORY</th>
                                <th class="px-3 py-3 text-muted small">PRICE</th>
                                <th class="px-3 py-3 text-muted small">OLD PRICE</th>
                                <th class="px-3 py-3 text-muted small">LINK</th>
                                <th class="px-3 py-3 text-muted small">SIZE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in contentData" :key="index">
                                <td class="px-3 py-3">{{ index + 1 }}</td>
                                <td class="px-3 py-3">{{ item.sku }}</td>
                                <td class="px-3 py-3">{{ item.name }}</td>
                                <td class="px-3 py-3">{{ item.inventory }}</td>
                                <td class="px-3 py-3">{{ item.price }}</td>
                                <td class="px-3 py-3">{{ item.oldPrice }}</td>
                                <td class="px-3 py-3">
                                    <a v-if="item.link" :href="item.link" class="text-decoration-none" target="_blank">
                                        {{ item.link }}
                                    </a>
                                </td>
                                <td class="px-3 py-3">{{ item.size }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const contentData = ref([
    { sku: '789-02', name: 'Cat Photographs Ut', inventory: 30, price: '400.00', oldPrice: '500.00', link: '', size: 'L' },
    { sku: '789-03', name: 'Sesame Street Ut', inventory: 35, price: '200.33', oldPrice: '300.00', link: 'https://www.amazon.com', size: 'M' },
    { sku: '789-01', name: 'Sesame Street Ut', inventory: 100, price: '359.00', oldPrice: '400.00', link: 'https://www.amazon.com', size: 'X' },
    { sku: '789-04', name: 'Sesame Street Ut', inventory: 40, price: '200.00', oldPrice: '400.00', link: '', size: 'XL' },
    { sku: '789-05', name: 'Sesame Street Ut', inventory: 45, price: '250.00', oldPrice: '400.00', link: 'https://www.amazon.com', size: 'L' },
    { sku: '789-06', name: 'Sesame Street Ut', inventory: 50, price: '600.00', oldPrice: '900.00', link: 'https://www.amazon.com', size: 'X' },
    { sku: '789-07', name: 'Sesame Street Ut', inventory: 55, price: '200.00', oldPrice: '250.00', link: '', size: 'L' },
    { sku: '789-08', name: 'Sesame Street Ut', inventory: 0, price: '700.00', oldPrice: '900.00', link: 'https://www.amazon.com', size: 'M' },
    { sku: '789-09', name: 'Sesame Street Ut', inventory: 65, price: '200.00', oldPrice: '400.00', link: 'https://www.amazon.com', size: 'XL' },
    { sku: '789-10', name: 'Sesame Street Ut', inventory: 70, price: '440.00', oldPrice: '700.00', link: '', size: 'X' },
    { sku: '789-11', name: 'Sesame Street Ut', inventory: 75, price: '250.00', oldPrice: '400.00', link: 'https://www.amazon.com', size: 'L' },
    { sku: '789-12', name: 'Sesame Street Ut', inventory: 80, price: '600.00', oldPrice: '900.00', link: 'https://www.amazon.com', size: 'X' },
    { sku: '789-13', name: 'Sesame Street Ut', inventory: 85, price: '200.00', oldPrice: '250.00', link: 'https://www.amazon.com', size: 'L' },
    { sku: '789-14', name: 'Sesame Street Ut', inventory: 90, price: '700.00', oldPrice: '900.00', link: '', size: 'M' },
    { sku: '789-15', name: 'Sesame Street Ut', inventory: 95, price: '200.00', oldPrice: '400.00', link: 'https://www.amazon.com', size: 'XXL' },
    { sku: '789-16', name: 'Sesame Street Ut', inventory: 100, price: '440.00', oldPrice: '700.00', link: 'https://www.amazon.com', size: 'X' }
])
</script>