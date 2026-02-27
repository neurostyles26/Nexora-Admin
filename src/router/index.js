import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/dashboard',
        component: () => import('../layouts/DashboardLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            { path: '', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
            { path: 'integrations', name: 'Integrations', component: () => import('../views/Integrations.vue') },
            { path: 'customers', name: 'Customers', component: () => import('../views/Customers.vue') },
            { path: 'products', name: 'Products', component: () => import('../views/Products.vue') },
            { path: 'orders', name: 'Orders', component: () => import('../views/Orders.vue') },
            { path: 'settings', name: 'Settings', component: () => import('../views/Settings.vue') },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.user) {
        next('/login')
    } else {
        next()
    }
})

export default router
