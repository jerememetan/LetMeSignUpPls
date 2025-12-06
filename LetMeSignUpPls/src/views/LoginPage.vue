<script setup>
import { ref } from 'vue'
import FakeLoginButton from '@/components/Atoms/FakeLoginButton.vue'
import PayWall from '@/components/Organisms/PayWall.vue'
import CreditCardModal from '@/components/Molecules/CreditCardModal.vue'
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
let isTyping = ref(false)
let typingTimer = null
const showPayWall = ref(false)
const clickCount = ref(0)
const buttonPosition = ref({ x: 0, y: 0 })
const loginClickCount = ref(0)
let loginClickTimer = null
let showCreditCardModal = ref(false)

const handleTyping = () => {
  isTyping.value = true
  clearTimeout(typingTimer)
  typingTimer = setTimeout(() => {
    isTyping.value = false
  }, 100)
}
const handlePay = () => {
    showCreditCardModal.value = true;
}

const addClick = () => {
    clickCount.value++;
}

const paywallRef = ref(null);

const handlePaymentSuccess = () => {
    if (paywallRef.value) {
        paywallRef.value.closePaywall();
    }
    showPayWall.value = false;
    showCreditCardModal.value = false;
}
const moveButton = (event) => {
  // Start timer on first click
  if (loginClickCount.value === 0) {
    loginClickTimer = setTimeout(() => {
      // Reset if 5 seconds passed without reaching 3 clicks
      loginClickCount.value = 0
      alert("Too slow! Try again!")
    }, 7500)
  }

  loginClickCount.value++

  // Check if successfully clicked 3 times within 5 seconds
  if (loginClickCount.value >= 10) {
    clearTimeout(loginClickTimer)
    alert("Success! You caught the button 10 times!")
    handleLogin()
    loginClickCount.value = 0
    return
  }

  // Get the container bounds
  const container = event.target.closest('.image-section')
  if (!container) return
  
  const containerRect = container.getBoundingClientRect()
  const buttonWidth = 200 // approximate button width
  const buttonHeight = 60 // approximate button height
  
  // Calculate max positions to keep button inside container
  const maxX = containerRect.width - buttonWidth - 20 // 20px padding
  const maxY = containerRect.height - buttonHeight - 20
  
  const randomX = GenerateNumber(20, Math.max(20, maxX)); // min 20px from edge
  const randomY = GenerateNumber(20, Math.max(20, maxY));
  console.log(randomX);
  console.log(randomY);
  
  buttonPosition.value = { x: randomX, y: randomY }
}
const GenerateNumber = (min,max) =>{
    return Math.floor(Math.random() * (max - min)) + min;
  }
const handleLogin = () => {
  console.log('Login:', { username: username.value, password: password.value, rememberMe: rememberMe.value })
}
</script>

<template>
<div class="row g-0">
    
    <CreditCardModal 
      :show="showCreditCardModal" 
      @close="showCreditCardModal = false"
      @success="handlePaymentSuccess"
  />
    <!-- login portion -->
  <div class="login-container min-vh-100 d-flex align-items-center justify-content-center p-3 col-12 col-lg-7">
    <!-- Centered Card with Gradient Border -->
    <div class="login-card">
      <div class="card-body p-4 p-md-5">
        <div class="text-center mb-4">
          <h2 class="text-white fw-bold mb-2">Let me Log in!</h2>
          <p class="text-light-purple mb-0">Don't have an account? You should probably register an account.</p>
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="username1" class="form-label text-light">Username</label>
            <input 
              type="password" 
              class="form-control form-control-lg bg-dark-blue border-purple text-white" 
              id="username1" 
              v-model="username"
              placeholder="Enter your username"
              @keydown="handleTyping"
              @keyup="handleTyping">
          </div>
          
          <div class="mb-4">
            <label for="password1" class="form-label text-light">Password</label>
            <input 
              type="password" 
              class="form-control form-control-lg bg-dark-blue border-purple text-white" 
              id="password1" 
              v-model="password"
              placeholder="Enter your password"
              @keydown="handleTyping"
              @keyup="handleTyping"              
            >
          </div>
          
          <div class="form-check mb-4">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="remember1" 
              v-model="rememberMe"
            >
            <label class="form-check-label text-light" for="remember1">
              Remember me
            </label>
          </div>
          <FakeLoginButton text="Login"></FakeLoginButton>
        </form>
        
        <div class="text-center mt-4">
          <a href="#" class="text-light-purple text-decoration-none" @click.prevent="showPayWall = true">Forgot password?</a>
          <PayWall ref="paywallRef" :show="showPayWall" @close="showPayWall = false" @openCreditCard="handlePay"></PayWall>
        </div>
      </div>
    </div>
  </div>
  <!-- This is image portion -->
  <div class="image-section col-12 col-lg-5 d-none d-lg-flex align-items-center justify-content-center">
    <div class="lottie-container">
      <Vue3Lottie
        animationLink="https://lottie.host/2f3b3dc2-4bfa-4fd7-9885-0a7391e48217/FWeJXhcPjh.json"
        :height="900"
        :loop="true"
        :pauseAnimation="!isTyping"
        :autoPlay="false"
        @click="addClick"
        v-show="clickCount <= 10"
        :speed="5"
      />

    </div>
            <button 
        v-show="clickCount > 10" 
        class="btn btn-danger moving-button" 
        @click="moveButton"
        :style="{ 
          position: 'absolute', 
          left: buttonPosition.x + 'px', 
          top: buttonPosition.y + 'px',
          transition: 'all 0.3s ease'
        }"
      >
        Log in? ({{ loginClickCount }}/10)
      </button>
  </div>

</div>
</template>

<style scoped>
/* Base Styles */
.login-container {
background-color: var(--theme-blue-dark);
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--theme-purple-rgba-10) 0%, transparent 70%);
  animation: pulse 15s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

/* Login Card */
.login-card {
  max-width: 900px;
  width: 100%;
  background: linear-gradient(145deg, var(--theme-purple-rgba-30), var(--theme-blue-dark));
  padding: 3px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px var(--theme-purple-rgba-30);
  position: relative;
  z-index: 1;
}

.login-card .card-body {
  background: var(--theme-dark-bg);
  border-radius: 18px;
}

/* Form Styles */
.bg-dark-blue {
  background-color: var(--theme-dark-input) !important;
}

.border-purple {
  border: 2px solid var(--theme-purple-rgba-50) !important;
}

.border-purple:focus {
  border-color: var(--theme-purple) !important;
  box-shadow: 0 0 0 0.2rem var(--theme-purple-rgba-25) !important;
  outline: none;
}

.text-light-purple {
  color: var(--theme-purple-light);
}



/* Common Form Styles */
.form-control:focus,
.form-check-input:focus {
  box-shadow: 0 0 0 0.2rem var(--theme-purple-rgba-25);
}

.form-check-input:checked {
  background-color: var(--theme-purple);
  border-color: var(--theme-purple);
}

/* Image Section */
.image-section {
    background-color: var(--theme-blue-dark);
    position: relative;
    overflow: hidden;
}

/* Lottie Container */
.lottie-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  transform-style: preserve-3d;
  filter: drop-shadow(0 10px 30px rgba(138, 43, 226, 0.3));
}

/* Moving Button */
.moving-button {
  z-index: 100;
  font-size: 1.2rem;
  padding: 15px 30px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.5);
  animation: buttonPulse 1s infinite;

}

.moving-button:hover {
  transform: scale(1.05);
}

@keyframes buttonPulse {
  0%, 100% { box-shadow: 0 4px 15px rgba(220, 53, 69, 0.5); }
  50% { box-shadow: 0 4px 25px rgba(220, 53, 69, 0.8); }
}

/* Responsive */
@media (max-width: 991px) {
  .login-container {
    background: linear-gradient(135deg, var(--gradient-bg-1) 0%, var(--gradient-bg-2) 50%, var(--gradient-bg-3) 100%);
  }
  
  .login-card {
    max-width: 500px;
  }
}

@media (max-width: 576px) {
  .login-card {
    max-width: 100%;
  }
  
  .login-card .card-body {
    padding: 2rem !important;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}
</style>