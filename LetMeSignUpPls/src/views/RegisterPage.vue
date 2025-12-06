<script setup>
import { ref, computed } from 'vue'
import EmailBoxes from '@/components/Atoms/emailBoxes.vue'
import PhoneNumberSlider from '@/components/Atoms/PhoneNumberSlider.vue'
import AddressCoordinates from '@/components/Atoms/AddressCordinates.vue'
import MovingUserName from '@/components/Atoms/MovingUserName.vue'
import Minigame from '@/components/Organisms/Minigame.vue'
import animatedImage from '@/components/Atoms/animatedImage.vue'

const email = ref('')
const phoneNumber = ref('')
const address = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const wordleGuess = ref()
const isWordleCorrect = ref(false)

// Coin system
const totalCoins = ref(0)
const ADDRESS_COST = 10
const USERNAME_COST = 10
const PASSWORD_COST = 10
const CONFIRM_PASSWORD_COST = 10

// Track unlocked fields
const unlockedFields = ref({
  address: false,
  username: false,
  password: false,
  confirmPassword: false
})

// Computed properties for unlock status
const canUnlockAddress = computed(() => totalCoins.value >= ADDRESS_COST && !unlockedFields.value.address)
const canUnlockUsername = computed(() => totalCoins.value >= USERNAME_COST && !unlockedFields.value.username)
const canUnlockPassword = computed(() => totalCoins.value >= PASSWORD_COST && !unlockedFields.value.password)
const canUnlockConfirmPassword = computed(() => totalCoins.value >= CONFIRM_PASSWORD_COST && !unlockedFields.value.confirmPassword)

const Today = new Date();
const TodayDay = Today.getDate().toLocaleString('en-US',{minimumIntegerDigits : 2});

const TodayMonth = Today.getMonth() + 1;
const TodayYear = Today.getFullYear();

// Unlock functions
const unlockAddress = () => {
  if (canUnlockAddress.value) {
    totalCoins.value -= ADDRESS_COST
    unlockedFields.value.address = true
  }
}

const unlockUsername = () => {
  if (canUnlockUsername.value) {
    totalCoins.value -= USERNAME_COST
    unlockedFields.value.username = true
  }
}

const unlockPassword = () => {
  if (canUnlockPassword.value) {
    totalCoins.value -= PASSWORD_COST
    unlockedFields.value.password = true
  }
}

const unlockConfirmPassword = () => {
  if (canUnlockConfirmPassword.value) {
    totalCoins.value -= CONFIRM_PASSWORD_COST
    unlockedFields.value.confirmPassword = true
  }
}

// Handle coins earned from minigame
const handleCoinsEarned = (coins) => {
  totalCoins.value = coins
}

const handleSubmit = () => {
  console.log('Registration:', { 
    email: email.value, 
    username: username.value,
    password: password.value,
    confirmPassword: confirmPassword.value 
  })
  alert(`Registration successful! Email: ${email.value}`)
}
const verifyCaptcha = async () => {
    const corsProxy = 'https://corsproxy.io/?';
    const nytimesUrl = `https://www.nytimes.com/svc/wordle/v2/${TodayYear}-${TodayMonth}-${TodayDay}.json`;
    const url = corsProxy + encodeURIComponent(nytimesUrl);
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const answer = data.solution;
        // console.log('Today\'s Wordle answer:', answer);
        
        if (answer.toLowerCase() == wordleGuess.value.toLowerCase()) {
            isWordleCorrect.value = true;
            
        } else {
            isWordleCorrect.value = false;
        }
    } catch (error) {
        console.error('Error fetching Wordle answer:', error);
        alert('Error verifying answer. Please try again.');
    }
}

const startFire = () => {

}
</script>

<template>
  <div class="register-container">
    <div class="register-wrapper d-flex justify-content-center p-3">
      <div class="register-card">
      <div class="card-body p-4 p-md-5">
        <div class="text-center mb-4">
          <h2 class="text-white fw-bold mb-2">Create Your Account</h2>
          <p class="text-light-purple mb-0">Join us today</p>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <!-- Email Field - 10 Boxes -->
          <div class="mb-3">
            <EmailBoxes v-model="email" />
          </div>
          
          <!-- Phone Number Field -->
          <div class="mb-3">
            <PhoneNumberSlider v-model="phoneNumber" />
          </div>
          
          <!-- Address Field -->
          <div class="mb-3 locked-field-container">
            <div v-if="!unlockedFields.address" class="locked-address-overlay">
              <div class="unlock-prompt">
                <h4>🔒 Address Field Locked</h4>
                <p>Cost: {{ ADDRESS_COST }} coins</p>
                <button 
                  type="button"
                  class="unlock-btn-large"
                  :class="{ 'can-unlock': canUnlockAddress }"
                  @click="unlockAddress"
                  :disabled="!canUnlockAddress"
                >
                  {{ canUnlockAddress ? '🔓 Unlock for ' + ADDRESS_COST + ' coins' : '🔒 Need ' + ADDRESS_COST + ' coins' }}
                </button>
              </div>
            </div>
            <div :class="{ 'locked-field': !unlockedFields.address }">
              <AddressCoordinates v-model="address" />
            </div>
          </div>
          
          <!-- Username Field -->
          <div class="mb-3 locked-field-container">
            <div v-if="!unlockedFields.username" class="locked-address-overlay">
              <div class="unlock-prompt">
                <h4>🔒 Username Field Locked</h4>
                <p>Cost: {{ USERNAME_COST }} coins</p>
                <button 
                  type="button"
                  class="unlock-btn-large"
                  :class="{ 'can-unlock': canUnlockUsername }"
                  @click="unlockUsername"
                  :disabled="!canUnlockUsername"
                >
                  {{ canUnlockUsername ? '🔓 Unlock for ' + USERNAME_COST + ' coins' : '🔒 Need ' + USERNAME_COST + ' coins' }}
                </button>
              </div>
            </div>
            <div v-if="unlockedFields.username">
              <MovingUserName v-model="username" />
            </div>
            <div v-else :class="{ 'locked-field': !unlockedFields.username }">
              <label class="form-label text-light">Username</label>
              <div class="bounce-arena-placeholder">
              </div>
            </div>
          </div>
          
          <!-- Password Field -->
          <div class="mb-3 locked-field-container">
            <label for="password" class="form-label text-light">
              Password
              <span v-if="!unlockedFields.password" class="unlock-badge">🔒 {{ PASSWORD_COST }} coins</span>
            </label>
            <div class="field-wrapper">
              <input 
                type="password" 
                class="form-control form-control-lg bg-dark-blue border-purple text-white" 
                :class="{ 'locked-field': !unlockedFields.password }"
                id="password" 
                v-model="password"
                placeholder="Create a password"
                :disabled="!unlockedFields.password"
                required
              >
              <button 
                v-if="!unlockedFields.password"
                type="button"
                class="unlock-btn"
                :class="{ 'can-unlock': canUnlockPassword }"
                @click="unlockPassword"
                :disabled="!canUnlockPassword"
              >
                {{ canUnlockPassword ? '🔓 Unlock' : '🔒 Locked' }}
              </button>
            </div>
          </div>
          
          <!-- Confirm Password Field -->
          <div class="mb-3 locked-field-container">
            <label for="confirmPassword" class="form-label text-light">
              Confirm Password
              <span v-if="!unlockedFields.confirmPassword" class="unlock-badge">🔒 {{ CONFIRM_PASSWORD_COST }} coins</span>
            </label>
            <div class="field-wrapper">
              <input 
                type="password" 
                class="form-control form-control-lg bg-dark-blue border-purple text-white" 
                :class="{ 'locked-field': !unlockedFields.confirmPassword }"
                id="confirmPassword" 
                v-model="confirmPassword"
                placeholder="Confirm your password"
                :disabled="!unlockedFields.confirmPassword"
                required
              >
              <button 
                v-if="!unlockedFields.confirmPassword"
                type="button"
                class="unlock-btn"
                :class="{ 'can-unlock': canUnlockConfirmPassword }"
                @click="unlockConfirmPassword"
                :disabled="!canUnlockConfirmPassword"
              >
                {{ canUnlockConfirmPassword ? '🔓 Unlock' : '🔒 Locked' }}
              </button>
            </div>
          </div>
          <!-- <animatedImage src="../../src/assets/Explosion_Animated.png" :frameWidth="550" :frameHeight="550" :frames="10" :width="100" :height="100" ></animatedImage> -->
          <animatedImage src="../../src/assets/fire_animated.png" :frameWidth="400" :frameHeight="400" :frames="6" :width="100" :height="100" ></animatedImage>
          <!-- Terms and Conditions -->
          <div class="form-check mb-4" @click="startFire">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="terms" 
              v-model="agreeTerms"
              required
            >
            <label class="form-check-label text-light" for="terms">
              I agree to the <a href="#" class="text-light-purple">Terms & Conditions</a>
            </label>
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label text-light">Human Validation</label>
            <input 
              type="text" 
              class="form-control form-control-lg bg-dark-blue border-purple text-white" 
              style="color: white"
              placeholder="Enter today's wordle answer"
              required
              v-model="wordleGuess"
              @keyup="verifyCaptcha">
              <div v-if="isWordleCorrect" class="text-success">You are human :)</div>
              <div v-else class="text-danger">You are NOT human</div>
          </div>
          <!-- Submit Button -->
          <button type="submit" class="btn btn-lg btn-purple w-100" disabled>
            Register Now
          </button>
        </form>
        
        <div class="text-center mt-4">
          <router-link to="/login" class="text-light-purple text-decoration-none">
            Already have an account? Login here
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Minigame with Coin Display -->
    <div class="minigame-section">
      <div class="coin-display">
        <h3>💰 Your Coins: {{ totalCoins }}</h3>
        <p class="text-light-purple">Play the game to earn coins and unlock fields!</p>
      </div>
      <Minigame @coins-updated="handleCoinsEarned" />
    </div>
    </div>
  </div>
</template>

<style scoped>
/* Base Styles */
.register-container {
  background-color: var(--theme-blue-dark);
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.register-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, var(--theme-purple-rgba-10) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* Disabled for performance */
/* @keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
} */

.register-wrapper {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 20px;
  contain: layout style;
}

/* Register Card */
.register-card {
  width: 80%;
  max-width: 900px;
  background: linear-gradient(145deg, var(--theme-purple-rgba-30), var(--theme-blue-dark));
  padding: 3px;
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--theme-purple-rgba-30);
  position: relative;
}

.register-card .card-body {
  background: var(--theme-dark-bg);
  border-radius: 18px;
}

/* Form Styles */


/* Placeholder text color */
.form-control::placeholder {
  color: var(--theme-purple-light);
  opacity: 0.6;
}



.text-light-purple {
  color: var(--theme-purple-light);
}

/* Button */
.btn-purple {
  background: linear-gradient(90deg, var(--theme-purple), var(--theme-purple-dark));
  border: none;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s;
}

.btn-purple:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px var(--theme-purple-rgba-50);
}

/* Form Check */
.form-check-input:focus {
  box-shadow: 0 0 0 0.2rem var(--theme-purple-rgba-25);
}

.form-check-input:checked {
  background-color: var(--theme-purple);
  border-color: var(--theme-purple);
}

/* Locked Field Styles */
.locked-field-container {
  position: relative;
}

.locked-address-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid var(--theme-purple);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(5px);
}

.unlock-prompt {
  text-align: center;
  padding: 30px;
}

.unlock-prompt h4 {
  color: gold;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.unlock-prompt p {
  color: var(--theme-purple-light);
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.unlock-btn-large {
  padding: 15px 30px;
  font-size: 1.1rem;
  border: 2px solid #666;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #999;
  font-weight: bold;
  cursor: not-allowed;
  transition: all 0.3s;
}

.unlock-btn-large.can-unlock {
  background: linear-gradient(90deg, gold, orange);
  color: black;
  border-color: gold;
  cursor: pointer;
  animation: glow-pulse 2s ease-in-out infinite;
}

.unlock-btn-large.can-unlock:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
}

.unlock-badge {
  margin-left: 10px;
  font-size: 0.85rem;
  color: gold;
  font-weight: bold;
}

.field-wrapper {
  position: relative;
}

.locked-field {
  filter: blur(5px);
  pointer-events: none;
  opacity: 0.3;
}

.unlock-btn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  padding: 8px 16px;
  border: 2px solid #666;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #999;
  font-weight: bold;
  cursor: not-allowed;
  transition: all 0.3s;
  z-index: 2;
}

.unlock-btn.can-unlock {
  background: linear-gradient(90deg, gold, orange);
  color: black;
  border-color: gold;
  cursor: pointer;
  animation: glow-pulse 2s ease-in-out infinite;
}

.unlock-btn.can-unlock:hover {
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
}

@keyframes glow-pulse {
  0%, 100% { 
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  50% { 
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.9);
  }
}

/* Bounce Arena Placeholder */
.bounce-arena-placeholder {
  width: 100%;
  max-width: 200px;
  height: 200px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(26, 26, 46, 0.6));
  border: 3px dashed var(--theme-purple-rgba-50);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.bounce-arena-placeholder p {
  margin: 0;
  color: var(--theme-purple-light);
  font-size: 1.2rem;
  text-align: center;
}

.bounce-arena-placeholder .small-text {
  font-size: 0.9rem;
  opacity: 0.7;
}

/* Minigame Section */
.minigame-section {
  width: 100%;
  max-width: 500px;
  margin-top: 20px;
}

.coin-display {
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  border: 2px solid var(--theme-purple);
}

.coin-display h3 {
  margin: 0;
  color: gold;
  font-size: 1.8rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.coin-display p {
  margin: 5px 0 0 0;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 576px) {
  .register-card {
    max-width: 100%;
  }
  
  .register-card .card-body {
    padding: 2rem !important;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .minigame-section {
    max-width: 100%;
  }
  
  .unlock-btn {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}
</style>

