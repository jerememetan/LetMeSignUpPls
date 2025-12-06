<script setup>
import { ref, computed } from 'vue'
import EmailBoxes from '@/components/Atoms/emailBoxes.vue'
import PhoneNumberSlider from '@/components/Atoms/PhoneNumberSlider.vue'
import AddressCoordinates from '@/components/Atoms/AddressCordinates.vue'
import MovingUserName from '@/components/Atoms/MovingUserName.vue'
import Minigame from '@/components/Organisms/Minigame.vue'
import animatedImage from '@/components/Atoms/animatedImage.vue'
import PasswordWithRequirements from '@/components/Atoms/PasswordWithRequirements.vue'
import BurningPasswordConfirm from '@/components/Atoms/BurningPasswordConfirm.vue'

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
            <div v-if="!unlockedFields.address" class="locked-address-overlay d-flex">
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
            <div :class="{ 'locked-field': !unlockedFields.address }" v-if="unlockedFields.address">
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
            <div v-if="unlockedFields.username" >
              <MovingUserName v-model="username" />
            </div>
          </div>
          
          <!-- Password Field -->
          <div class="mb-3 locked-field-container">
            <div v-if="!unlockedFields.password" class="locked-address-overlay">
              <div class="unlock-prompt">
                <h4>🔒 Password Field Locked</h4>
                <p>Cost: {{ PASSWORD_COST }} coins</p>
                <button 
                  type="button"
                  class="unlock-btn-large"
                  :class="{ 'can-unlock': canUnlockPassword }"
                  @click="unlockPassword"
                  :disabled="!canUnlockPassword"
                >
                  {{ canUnlockPassword ? '🔓 Unlock for ' + PASSWORD_COST + ' coins' : '🔒 Need ' + PASSWORD_COST + ' coins' }}
                </button>
              </div>
            </div>
            <div v-if="unlockedFields.password">
              <label for="password" class="form-label text-light">Password</label>
              <PasswordWithRequirements v-model="password" :username="username" :disabled="!unlockedFields.password"></PasswordWithRequirements>
              
            </div>
            <div v-else :class="{ 'locked-field': !unlockedFields.password }">
              <label v-if="unlockedFields.password" class="form-label text-light">Password</label>
            </div>
          </div>
          
          <!-- Confirm Password Field -->
          <div class="mb-3 locked-field-container">
            <div v-if="!unlockedFields.confirmPassword" class="locked-address-overlay">
              <div class="unlock-prompt">
                <h4>🔒 Confirm Password Field Locked</h4>
                <p>Cost: {{ CONFIRM_PASSWORD_COST }} coins</p>
                <button 
                  type="button"
                  class="unlock-btn-large"
                  :class="{ 'can-unlock': canUnlockConfirmPassword }"
                  @click="unlockConfirmPassword"
                  :disabled="!canUnlockConfirmPassword"
                >
                  {{ canUnlockConfirmPassword ? '🔓 Unlock for ' + CONFIRM_PASSWORD_COST + ' coins' : '🔒 Need ' + CONFIRM_PASSWORD_COST + ' coins' }}
                </button>
              </div>
            </div>
            <div v-if="unlockedFields.confirmPassword">
              <label for="confirmPassword" class="form-label text-light">Confirm Password</label>
              <BurningPasswordConfirm 
                v-model="confirmPassword" 
                :originalPassword="password"
                :disabled="!unlockedFields.confirmPassword"
              />
            </div>
            <div v-else :class="{ 'locked-field': !unlockedFields.confirmPassword }">
              <label class="form-label text-light">Confirm Password</label>
            </div>
          </div>
          <!-- <animatedImage src="../../src/assets/Explosion_Animated.png" :frameWidth="550" :frameHeight="550" :frames="10" :width="100" :height="100" ></animatedImage> -->
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
    <div class="minigame-section mx-2">
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
.register-container {
  background-color: var(--theme-blue-dark);
  position: relative;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.register-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  background: radial-gradient(circle, var(--theme-purple-rgba-10) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.register-wrapper {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 20px 0;
}

.register-card {

  max-width: 900px;
  background: linear-gradient(145deg, var(--theme-purple-rgba-30), var(--theme-blue-dark));
  padding: 3px;
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--theme-purple-rgba-30);
}

.register-card .card-body {
  background: var(--theme-dark-bg);
  border-radius: 18px;
}

.form-control::placeholder {
  color: var(--theme-purple-light);
  opacity: 0.6;
}

.btn-purple {
  background: var(--gradient-purple);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-purple:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px var(--theme-purple-rgba-50);
}

.locked-address-overlay {
  position: relative;
  background: var(--theme-dark-overlay);
  border: 2px solid var(--theme-purple);
  border-radius: 10px;
  z-index: 10;
  backdrop-filter: blur(5px);
  padding: 2% 4%;
  justify-content: center;
  text-align: center;
}

.unlock-btn-large {
  padding: 15px 30px;
  font-size: 1.1rem;
  border: 2px solid var(--theme-purple-rgba-30);
  border-radius: 10px;
  background: var(--theme-dark-card-bg);
  color: var(--theme-purple-light);
  cursor: not-allowed;
}

.unlock-btn-large.can-unlock {
  background: var(--gradient-gold);
  color: black;
  border-color: var(--theme-gold);
  cursor: pointer;
  animation: glow-pulse 2s ease-in-out infinite;
}

.unlock-btn-large.can-unlock:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px var(--theme-gold-rgba-80);
}

.unlock-badge {
  margin-left: 10px;
  font-size: 0.85rem;
  color: var(--theme-gold);
}

.locked-field {
  filter: blur(5px);
  pointer-events: none;
  opacity: 0.3;
}

.unlock-btn {
  position:relative;
  padding: 8px 16px;
  border: 2px solid var(--theme-purple-rgba-30);
  border-radius: 8px;
  background: var(--theme-dark-card-bg);
  color: var(--theme-purple-light);
  cursor: not-allowed;
  z-index: 2;
}

.unlock-btn.can-unlock {
  background: var(--gradient-gold);
  color: black;
  border-color: var(--theme-gold);
  cursor: pointer;
  animation: glow-pulse 2s ease-in-out infinite;
}

.unlock-btn.can-unlock:hover {
  transform: translateY(-20%) scale(1.05);
  box-shadow: 0 0 20px var(--theme-gold-rgba-80);
}

@keyframes glow-pulse {
  0%, 100% { 
    box-shadow: 0 0 10px var(--theme-gold-rgba-50);
  }
  50% { 
    box-shadow: 0 0 25px var(--theme-gold-rgba-90);
  }
}

.coin-display {
  background: var(--theme-dark-card-bg);
  border-radius: 10px;
  border: 2px solid var(--theme-purple);
  padding: 3%;
  margin-bottom: 2%;
}

.coin-display h3 {
  color: var(--theme-gold);
  font-size: 1.8rem;
  text-shadow: 0 0 10px var(--theme-gold-rgba-50);
}

@media (max-width: 576px) {
  .register-card {
    max-width: 100%;
  }
  
  .register-card .card-body {
    padding: 2rem !important;
  }
  
  .unlock-btn {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}
</style>

