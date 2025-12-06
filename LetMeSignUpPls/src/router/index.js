import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import HomePage from '@/views/HomePage.vue';

const routes = [
    {
        path: '/login',
        name: 'login',
        component : LoginPage
    },
    {
        path: '/register',
        name: 'register',
        component : RegisterPage
    },
    {
        path: '/home',
        name: 'home',
        component : HomePage
        // requires user to be logged in
    }

]
const router = createRouter(
    {
    history: createWebHistory(),
    routes,
    }

)

export default router;