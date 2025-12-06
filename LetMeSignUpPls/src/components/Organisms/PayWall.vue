<script>
import CreditCardModal from '@/components/Molecules/CreditCardModal.vue'

export default {
    components: {
        CreditCardModal
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            paywallCount: 1,
            paywallPositions: [],
        }
    },
    emits: ['close','openCreditCard'],
    methods: {
        closePaywall() {
            this.$emit('close')
            this.paywallCount = 1;
            this.showCreditCardModal = false;
        },
        handlePaymentSuccess() {
            this.closePaywall();
        },
        tryToClose() {
            // Instead of closing, duplicate the paywall
            this.paywallCount++
        },
        GenerateNumber(min,max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
    }
}
</script>

<template>
    <div v-if="show">
        <div 
            v-for="index in paywallCount" 
            :key="index" 
            class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" 
            :style="{ zIndex: 99 + index }"
        >
            <div 
                class="card bg-dark-blue border-purple p-4 position-absolute paywall-slide-in"
                style="max-width: 500px; width: 100%;"
                :style="{ 
                    left: `${( GenerateNumber(index-10,index+10) - 1) *20}px`,
                    top: `${(GenerateNumber(index-10,index+10) - 1) * 20}px`,
                    transition: 'left 0.5s ease, top 0.5s ease'
                }"
            >
                <button class="btn btn-close btn-close-white position-absolute top-0 end-0 m-3" @click="tryToClose"></button>
                
                <div class="text-center">
                    <div class="mb-3 paywall-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="var(--theme-purple)" viewBox="0 0 16 16">
                            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"/>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                        </svg>
                    </div>
                    
                    <h2 class="text-white fw-bold mb-2 fs-1">Premium Feature</h2>
                    <p class="text-light-purple mb-4 fs-5">This feature is for members only!</p>
                    
                    <div class="d-flex align-items-center justify-content-center gap-2 mb-4 text-white">
                        <span class="fs-2 opacity-75">$</span>
                        <span class="display-3 fw-bold text-gradient">69.99</span>
                        <span class="fs-5 opacity-75 align-self-end mb-2">/month</span>
                    </div>
                    
                    <div class="rounded-3 p-3 mb-4 text-start" style="background: rgba(138, 43, 226, 0.1);">
                        <div class="d-flex align-items-center gap-3 text-white py-2 border-bottom" style="border-color: var(--theme-purple-rgba-25) !important;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--theme-purple)" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                            <span>Password Recovery Access</span>
                        </div>
                        <div class="d-flex align-items-center gap-3 text-white py-2 border-bottom" style="border-color: var(--theme-purple-rgba-25) !important;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--theme-purple)" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                            <span>24/7 Slient Support</span>
                        </div>
                        <div class="d-flex align-items-center gap-3 text-white py-2 border-bottom" style="border-color: var(--theme-purple-rgba-25) !important;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--theme-purple)" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                            <span>Wasted Money</span>
                        </div>
                        <div class="d-flex align-items-center gap-3 text-white py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--theme-purple)" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                            <span>Free Disappointment & Regret</span>
                        </div>
                    </div>
                    
                    <button class="btn btn-lg w-100 text-white fw-bold text-uppercase pay-btn" 
                            style="background: linear-gradient(90deg, var(--theme-purple), var(--theme-purple-dark)); letter-spacing: 1px;"
                            @click="$emit('openCreditCard', true)">
                        Subscribe Now
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.text-light-purple {
    color: var(--theme-purple-light);
}

.text-gradient {
    background: var(--theme-purple);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.paywall-slide-in {
    animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}



.paywall-icon {
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.pay-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px var(--theme-purple-rgba-50);
}
</style>