import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('../views/Portfolio.vue') },
    { path: '/register', component: () => import('../views/Register.vue') },
    { path: '/login', component: () => import('../views/Login.vue') },
    { path: '/markets', component: () => import('../views/Markets.vue') },
    { path: '/stockList', component: () => import('../views/Search.vue') },
    { name: 'stockpage', path: '/stockpage/:symbol/', component: () => import('../views/StockPage.vue') }
  ]
})

export default router
