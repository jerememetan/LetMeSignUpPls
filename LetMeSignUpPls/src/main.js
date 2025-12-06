import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { Vue3Lottie } from 'vue3-lottie';

const app = createApp(App);

app.use(router); // Make the router available to the entire app
app.component('Vue3Lottie', Vue3Lottie); // Register Lottie globally

app.mount('#app');
