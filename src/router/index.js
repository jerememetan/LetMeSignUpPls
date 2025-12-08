import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import HomePage from '@/views/HomePage.vue';
import DeletePage from '@/views/DeletePage.vue';
import { useAuthStore } from '@/stores/auth';

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
        component : HomePage,
        meta: { requiresAuth: true } 
        
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/delete',
        name: 'delete',
        component: DeletePage,
        meta : {requiresAuth: true}
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore();

    if(!authStore.initialised){
        await authStore.initAuth();
    }

	// Redirect to login if destination page requires auth and no session is found
	if(to.meta.requiresAuth && !authStore.isAuthenticated){
		next('/login');
	}
	else{
		next();
	}
});

export default router;