import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import LandingPage from "../pages/LandingPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import NewWebsitePage from "../pages/NewWebsitePage.vue";
import WebsiteAddPage from "../pages/WebsiteAddPage.vue";

const routes = [
    {
        path: "/",
        name: "Landing",
        component: LandingPage,
    },
    {
        path: "/login",
        name: "Login",
        component: LoginPage,
        meta: { requiresGuest: true },
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../pages/RegisterPage.vue"),
        meta: { requiresGuest: true },
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: DashboardPage,
        meta: { requiresAuth: true },
        children: [
            {
                path: "",
                redirect: "/dashboard/websites",
            },
            {
                path: "profile",
                name: "DashboardProfile",
                component: DashboardPage,
                meta: { tab: "profile" },
            },
            {
                path: "websites",
                name: "DashboardWebsites",
                component: DashboardPage,
                meta: { tab: "websites" },
            },
            {
                path: "files",
                name: "DashboardFiles",
                component: DashboardPage,
                meta: { tab: "files" },
            },
            {
                path: "pricing",
                name: "DashboardPricing",
                component: DashboardPage,
                meta: { tab: "pricing" },
            },
            {
                path: "workspaces",
                name: "DashboardWorkspaces",
                component: DashboardPage,
                meta: { tab: "workspaces" },
            },
            {
                path: "api",
                name: "DashboardAPI",
                component: DashboardPage,
                meta: { tab: "api" },
            },
        ],
    },
    {
        path: "/new-website",
        name: "NewWebsite",
        component: NewWebsitePage,
        meta: { requiresAuth: true },
    },
    {
        path: "/website/add/:templateId",
        name: "WebsiteAdd",
        component: WebsiteAddPage,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (!authStore.isAuthChecked) {
        await authStore.checkAuth(); // Đợi xác thực
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next("/login");
    } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next("/dashboard");
    } else {
        next();
    }
});

export default router;
