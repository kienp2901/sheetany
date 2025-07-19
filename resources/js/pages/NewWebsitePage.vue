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

                <button @click="$router.push('/dashboard/websites')" class="btn btn-outline-secondary">
                    <i class="bi bi-x me-1"></i>
                    Exit
                </button>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container py-5">
            <div class="text-center mb-5">
                <h2 class="fw-bold mb-3">Create new website</h2>
                <p class="text-muted">
                    Pick one template to create your website. Don't worry, you can change the template later.
                </p>
            </div>

            <div class="row g-4">
                <div v-for="template in templates" :key="template.id" class="col-md-6 col-lg-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="position-relative">
                            <img :src="template.image" :alt="template.name" class="card-img-top"
                                style="height: 200px; object-fit: cover;">
                            <div class="position-absolute top-0 end-0 m-2">
                                <span class="badge bg-success">{{ template.category }}</span>
                            </div>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title fw-bold">{{ template.id }}. {{ template.name }}</h6>
                            <p class="card-text text-muted small flex-grow-1">{{ template.description }}</p>
                            <div class="d-flex gap-2 mt-auto">
                                <button @click="selectTemplate(template)" class="btn btn-success btn-sm flex-fill">
                                    Use template
                                </button>
                                <button class="btn btn-outline-secondary btn-sm">
                                    Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const templates = ref([
    {
        id: '01',
        name: 'Blog',
        category: 'Blog',
        description: 'Perfect for personal or business blogs with clean design',
        image: '/placeholder.svg?height=200&width=300&text=Blog+Template'
    },
    {
        id: '02',
        name: 'Clean Directory',
        category: 'Directory',
        description: 'Organize and display listings in a clean format',
        image: '/placeholder.svg?height=200&width=300&text=Directory+Template'
    },
    {
        id: '03',
        name: 'Job board',
        category: 'Jobs',
        description: 'Post and manage job listings effectively',
        image: '/placeholder.svg?height=200&width=300&text=Job+Board+Template'
    },
    {
        id: '04',
        name: 'Landing page',
        category: 'Marketing',
        description: 'Convert visitors with beautiful landing pages',
        image: '/placeholder.svg?height=200&width=300&text=Landing+Page+Template'
    },
    {
        id: '05',
        name: 'Store',
        category: 'E-commerce',
        description: 'Sell products online with this store template',
        image: '/placeholder.svg?height=200&width=300&text=Store+Template'
    },
    {
        id: '06',
        name: 'Directory',
        category: 'Directory',
        description: 'List businesses, services, or resources',
        image: '/placeholder.svg?height=200&width=300&text=Directory+Template'
    },
    {
        id: '07',
        name: 'Changelog',
        category: 'Documentation',
        description: 'Keep users updated with product changes',
        image: '/placeholder.svg?height=200&width=300&text=Changelog+Template'
    },
    {
        id: '08',
        name: 'Listing',
        category: 'Listing',
        description: 'Display items in an organized list format',
        image: '/placeholder.svg?height=200&width=300&text=Listing+Template'
    },
    {
        id: '09',
        name: 'Book list',
        category: 'Education',
        description: 'Showcase books and reading lists',
        image: '/placeholder.svg?height=200&width=300&text=Book+List+Template'
    },
    {
        id: '10',
        name: 'Personal',
        category: 'Personal',
        description: 'Create your personal website or portfolio',
        image: '/placeholder.svg?height=200&width=300&text=Personal+Template'
    },
    {
        id: '11',
        name: 'Events',
        category: 'Events',
        description: 'Manage and display events calendar',
        image: '/placeholder.svg?height=200&width=300&text=Events+Template'
    },
    {
        id: '12',
        name: 'Blog box',
        category: 'Blog',
        description: 'Modern blog layout with card-based design',
        image: '/placeholder.svg?height=200&width=300&text=Blog+Box+Template'
    },
    {
        id: '13',
        name: 'Minimalist Directory',
        category: 'Directory',
        description: 'Clean and minimal directory layout',
        image: '/placeholder.svg?height=200&width=300&text=Minimal+Directory'
    },
    {
        id: '14',
        name: 'Fashion Store',
        category: 'E-commerce',
        description: 'Stylish template for fashion retailers',
        image: '/placeholder.svg?height=200&width=300&text=Fashion+Store'
    },
    {
        id: '15',
        name: 'Listing Site',
        category: 'Listing',
        description: 'Professional listing website template',
        image: '/placeholder.svg?height=200&width=300&text=Listing+Site'
    },
    {
        id: '16',
        name: 'Data Table',
        category: 'Data',
        description: 'Display data in organized tables',
        image: '/placeholder.svg?height=200&width=300&text=Data+Table'
    },
    {
        id: '17',
        name: 'Video',
        category: 'Media',
        description: 'Showcase video content beautifully',
        image: '/placeholder.svg?height=200&width=300&text=Video+Template'
    },
    {
        id: '18',
        name: 'Personal Blog',
        category: 'Blog',
        description: 'Personal blogging with modern design',
        image: '/placeholder.svg?height=200&width=300&text=Personal+Blog'
    },
    {
        id: '19',
        name: 'Minimalist Job board',
        category: 'Jobs',
        description: 'Simple and clean job board layout',
        image: '/placeholder.svg?height=200&width=300&text=Minimal+Jobs'
    },
    {
        id: '20',
        name: 'Roadmap',
        category: 'Planning',
        description: 'Display product roadmap and milestones',
        image: '/placeholder.svg?height=200&width=300&text=Roadmap+Template'
    },
    {
        id: '21',
        name: 'Waitlist',
        category: 'Marketing',
        description: 'Collect emails for product launches',
        image: '/placeholder.svg?height=200&width=300&text=Waitlist+Template'
    },
    {
        id: '22',
        name: 'Feature Blog',
        category: 'Blog',
        description: 'Feature-rich blog with advanced layouts',
        image: '/placeholder.svg?height=200&width=300&text=Feature+Blog'
    },
    {
        id: '23',
        name: 'Podcast',
        category: 'Media',
        description: 'Perfect for podcast websites',
        image: '/placeholder.svg?height=200&width=300&text=Podcast+Template'
    },
    {
        id: '24',
        name: 'Documentation',
        category: 'Documentation',
        description: 'Create comprehensive documentation sites',
        image: '/placeholder.svg?height=200&width=300&text=Documentation'
    },
    {
        id: '25',
        name: 'E-commerce',
        category: 'E-commerce',
        description: 'Full-featured online store template',
        image: '/placeholder.svg?height=200&width=300&text=E-commerce'
    },
    {
        id: '26',
        name: 'Affiliate',
        category: 'Marketing',
        description: 'Promote affiliate products effectively',
        image: '/placeholder.svg?height=200&width=300&text=Affiliate+Template'
    }
])

const selectTemplate = (template) => {
    router.push(`/website/add/${template.id}`)
}
</script>