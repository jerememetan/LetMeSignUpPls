<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            paywallCount: 1,
            paywallPositions: []
        }
    },
    emits: ['close'],
    methods: {
        closePaywall() {
            let chance = 0;
            while (chance < 80){
                prompt("Fill up your Credit card Number:");
                prompt("Whats the 3 digit at the back?");
                prompt("What is the expiration date?");
                chance = this.GenerateNumber(0,100);
                if ( chance < 80){
                    alert("Are you trying to trick me? This isn't even a valid credit card!")
                }
            }
            this.$emit('close')
            this.paywallCount = 1;
        },
        handlePay() {
            this.closePaywall()
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
            class="paywall-overlay" 
            :style="{ zIndex: 9999 + index }"
        >
            <div 
                class="paywall-container"
                :style="{ 
                    transform: `translate(${(index - 1) * 20}px, ${(index - 1) * 20}px)` 
                }"
            >
                <button class="close-btn" @click="tryToClose">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                    </svg>
                </button>
                
                <div class="paywall-content">
                    <div class="paywall-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="var(--theme-purple)" viewBox="0 0 16 16">
                            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"/>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                        </svg>
                    </div>
                    
                    <h2 class="paywall-title">Premium Feature</h2>
                    <p class="paywall-subtitle">Oops! You've hit a paywall</p>
                    
                    <div class="price-tag">
                        <span class="currency">$</span>
                        <span class="amount">99.99</span>
                        <span class="period">/month</span>
                    </div>
                    
                    <div class="features-list">
                        <div class="feature-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--theme-purple)" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                            <span>Password Recovery Access</span>
                        </div>
                        <div class="feature-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--theme-purple)" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                            <span>24/7 Not Really Support</span>
                        </div>
                        <div class="feature-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--theme-purple)" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                            <span>Unlimited Frustration</span>
                        </div>
                        <div class="feature-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--theme-purple)" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                            <span>Free Disappointment</span>
                        </div>
                    </div>
                    
                    <button class="pay-btn" @click="handlePay">
                        Subscribe Now
                    </button>
                    
                    <p class="paywall-disclaimer">
                        * By clicking, you agree to give us absolutely nothing
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.paywall-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
}

.paywall-container {
    background: linear-gradient(145deg, rgba(15, 15, 35, 0.98), rgba(25, 25, 60, 0.98));
    border-radius: 24px;
    max-width: 500px;
    width: 100%;
    position: relative;
    padding: 40px 30px;
    border: 2px solid var(--theme-purple-rgba-30);
    box-shadow: 0 20px 60px rgba(138, 43, 226, 0.4);
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

.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: transparent;
    border: none;
    color: var(--theme-purple-light);
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    background: var(--theme-purple-rgba-25);
    color: white;
    transform: rotate(90deg);
}

.paywall-content {
    text-align: center;
}

.paywall-icon {
    margin-bottom: 20px;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.paywall-title {
    color: white;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.paywall-subtitle {
    color: var(--theme-purple-light);
    font-size: 1.1rem;
    margin-bottom: 30px;
}

.price-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-bottom: 30px;
    color: white;
}

.currency {
    font-size: 2rem;
    opacity: 0.7;
}

.amount {
    font-size: 4rem;
    font-weight: bold;
    background: linear-gradient(90deg, var(--theme-purple), var(--theme-purple-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.period {
    font-size: 1.2rem;
    opacity: 0.7;
    align-self: flex-end;
    margin-bottom: 10px;
}

.features-list {
    background: rgba(138, 43, 226, 0.1);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 30px;
    text-align: left;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
    padding: 10px 0;
    border-bottom: 1px solid var(--theme-purple-rgba-25);
}

.feature-item:last-child {
    border-bottom: none;
}

.feature-item span {
    font-size: 1rem;
}

.pay-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(90deg, var(--theme-purple), var(--theme-purple-dark));
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.pay-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px var(--theme-purple-rgba-50);
}

.paywall-disclaimer {
    margin-top: 15px;
    color: var(--theme-purple-light);
    font-size: 0.85rem;
    opacity: 0.7;
}

/* Responsive */
@media (max-width: 576px) {
    .paywall-container {
        padding: 30px 20px;
    }
    
    .paywall-title {
        font-size: 1.5rem;
    }
    
    .amount {
        font-size: 3rem;
    }
}
</style>
