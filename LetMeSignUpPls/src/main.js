import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { Vue3Lottie } from 'vue3-lottie';
import { createPinia } from 'pinia';
const app = createApp(App);
const pinia = createPinia();
app.use(router); // Make the router available to the entire app
app.component('Vue3Lottie', Vue3Lottie); // Register Lottie globally
app.use(pinia);
app.mount('#app');
