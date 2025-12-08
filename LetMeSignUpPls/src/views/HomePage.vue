<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Vue3Lottie } from 'vue3-lottie'
import Certificate from '@/components/Molecules/Certificate.vue'
const authStore = useAuthStore()
const username = computed(() => authStore.user?.user_metadata?.username || 'Champion')

const downloadCertificate = () => {
    // Create a temporary link to download/share
    const certificateElement = document.querySelector('.certificate-card')
    // You could integrate html2canvas here for actual image generation
    alert('Certificate download feature! (Would generate PNG with html2canvas)')
}

const copyShareText = () => {
    const text = `🏆 I JUST SURVIVED "LetMeSignUpPls" 🏆

The world's most BRUTAL registration form couldn't stop me!
I am now part of the ELITE 1% who made it through!
Think you have what it takes? Prove it:
[Your URL here]`
    
    navigator.clipboard.writeText(text)
    alert('Epic share text copied to clipboard! 🎉 Paste it anywhere and let the world know of your achievement!')
}

onMounted(async () => {
    if (!authStore.user) {
        await authStore.fetchUser()
    }
})
</script>


<template>
    <div class="container-fluid min-vh-100 py-5">
        <!-- Header with celebration -->
        <div class="row justify-content-center mb-4">
            <div class="col-12 col-md-10 col-lg-8">
                <div class="text-center row d-flex align-items-center">
                    <div class="col-3">
                        <Vue3Lottie
                            animationLink="https://lottie.host/66c2e220-119c-4745-8eb9-6f7ef8f78118/HYpAczEBOP.json"
                            :loop="true"
                            :autoPlay="true"
                            :height="120"
                        />
                    </div>
                    <div class="col-6 animated-Text border-purple py-3 border rounded-5">
                        <h1 class="mb-0">You Did It!</h1>
                    </div>
                    <div class="col-3">
                        <Vue3Lottie
                            animationLink="https://lottie.host/66c2e220-119c-4745-8eb9-6f7ef8f78118/HYpAczEBOP.json"
                            :loop="true"
                            :autoPlay="true"
                            :height="120"
                        />
                    </div>
                </div>
            </div>
        </div>
        <!-- Certificate Display -->
         <certificate :username="username"></certificate>

        <!-- Action Buttons -->
        <div class="row justify-content-center">
            <div class="col-12 col-md-10 col-lg-8">
                <div class="d-flex gap-3 justify-content-center flex-wrap">
                    <button class="btn btn-lg text-light-purple border-purple bg-dark-blue px-5" @click="downloadCertificate">
                        📥 Download Certificate
                    </button>
                    <button class="btn btn-lg text-light-purple border-purple bg-dark-blue px-5" @click="copyShareText">
                        📤 Copy Share Text
                    </button>
                </div>
            </div>
        </div>

        <div class=" text-center footing">
            Psst! If you don't want your information to be stored in this website, you can delete your existence
             <router-link to="/delete" class="text-danger text-decoration-none fw-bold">here</router-link>
        </div>
    </div>
</template>
<style scoped>


/* Header Animation */
@keyframes pulseEffect {
    0%, 100% {
        color: var(--theme-gold);
        transform: translateX(-10%);
        box-shadow: 0 4px 15px var(--theme-purple-light);
    }
    50% {
        color: var(--theme-gold-dark);
        transform: translateX(10%);
        box-shadow: 0 4px 25px var(--theme-purple-rgba-25);
    }
}

.animated-Text {
    animation: pulseEffect 3s ease-in-out infinite;
    background: var(--theme-dark-input);
}
.footing {
    position: relative;
    margin-top: 50vh;
}


</style>