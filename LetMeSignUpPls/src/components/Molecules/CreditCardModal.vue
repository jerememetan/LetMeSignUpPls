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
            cardNumber: '',
            cvv: '',
            expirationDate: '',
            attemptCount: 0,
            isShaking: false
        }
    },
    emits: ['close', 'success'],
    methods: {
        validateCard() {
            this.attemptCount++
            
            // Random chance to accept (20% success rate)
            const chance = Math.floor(Math.random() * 100)
            
            if (chance >= 80) {
                // Success!
                this.$emit('success')
                this.resetForm()
            } else {
                // Rejection - shake animation
                this.isShaking = true
                setTimeout(() => {
                    this.isShaking = false
                }, 500)
                
                // Show error message
                setTimeout(() => {
                    alert("Are you trying to trick me? This isn't even a valid credit card!")
                }, 300)
                
                // Reset form
                this.cardNumber = ''
                this.cvv = ''
                this.expirationDate = ''
            }
        },
        resetForm() {
            this.cardNumber = ''
            this.cvv = ''
            this.expirationDate = ''
            this.attemptCount = 0
        },
        formatCardNumber() {
            // Remove non-digits
            let value = this.cardNumber.replace(/\D/g, '')
            // Limit to 16 digits
            value = value.substring(0, 16)
            // Add spaces every 4 digits
            this.cardNumber = value.replace(/(\d{4})/g, '$1 ').trim()
        },
        formatExpiration() {
            // Remove non-digits
            let value = this.expirationDate.replace(/\D/g, '')
            // Limit to 4 digits
            value = value.substring(0, 4)
            // Add slash after 2 digits
            if (value.length >= 2) {
                this.expirationDate = value.substring(0, 2) + '/' + value.substring(2)
            } else {
                this.expirationDate = value
            }
        },
        formatCVV() {
            // Remove non-digits and limit to 3
            this.cvv = this.cvv.replace(/\D/g, '').substring(0, 3)
        }
    },
    watch: {
        show(newVal) {
            if (!newVal) {
                this.resetForm()
            }
        }
    }
}
</script>

<template>
    <Transition name="fade">
        <div v-if="show" class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" 
             style="z-index: 10000; backdrop-filter: blur(5px);" @click.self="$emit('close')">
            <div class="card bg-dark-blue border-purple p-4" :class="{ 'shake': isShaking }" style="max-width: 450px; width: 100%;">
                <button class="btn-close btn-close-white position-absolute top-0 end-0 m-3" @click="$emit('close')"></button>

                <div class="text-center mb-4">
                    <div class="mb-3 credit-card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="var(--theme-purple)" viewBox="0 0 16 16">
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"/>
                        </svg>
                    </div>
                    <h2 class="text-white fw-bold mb-2">Payment Information</h2>
                    <p class="text-light-purple mb-0">Please enter your credit card details</p>
                    <p v-if="attemptCount > 0" class="text-danger fw-bold mt-2 mb-0">Attempts: {{ attemptCount }}</p>
                </div>

                <form @submit.prevent="validateCard">
                    <div class="mb-3">
                        <label for="cardNumber" class="form-label text-light-purple">Card Number</label>
                        <input 
                            type="text" 
                            id="cardNumber"
                            v-model="cardNumber"
                            @input="formatCardNumber"
                            placeholder="1234 5678 9012 3456"
                            class="form-control bg-dark-blue border-purple text-white"
                            maxlength="19"
                            required
                        >
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-6">
                            <label for="expirationDate" class="form-label text-light-purple">Expiration Date</label>
                            <input 
                                type="text" 
                                id="expirationDate"
                                v-model="expirationDate"
                                @input="formatExpiration"
                                placeholder="MM/YY"
                                class="form-control bg-dark-blue border-purple text-white"
                                maxlength="5"
                                required
                            >
                        </div>

                        <div class="col-6">
                            <label for="cvv" class="form-label text-light-purple">CVV</label>
                            <input 
                                type="text" 
                                id="cvv"
                                v-model="cvv"
                                @input="formatCVV"
                                placeholder="123"
                                class="form-control bg-dark-blue border-purple text-white"
                                maxlength="3"
                                required
                            >
                        </div>
                    </div>

                    <button type="submit" class="btn btn-lg w-100 text-white fw-bold" 
                            style="background: linear-gradient(90deg, var(--theme-purple), var(--theme-purple-dark));">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="me-2">
                            <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7z"/>
                        </svg>
                        Confirm Payment
                    </button>
                </form>

                <div class="d-flex align-items-center justify-content-center gap-2 mt-3 p-3 rounded text-light-purple" 
                     style="background: rgba(138, 43, 226, 0.1); font-size: 0.85rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                        <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    <span>Totally Secure Payment (Trust me bro)</span>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.credit-card-icon {
    animation: cardFloat 3s ease-in-out infinite;
}

@keyframes cardFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.shake {
    animation: shake 0.5s;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.text-light-purple {
    color: var(--theme-purple-light);
}
</style>
