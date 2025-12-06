<script setup>
import { ref, computed, watch } from 'vue'
import animatedImage from '@/components/Atoms/animatedImage.vue'

const props = defineProps({
  modelValue: String,
  disabled: Boolean,
  originalPassword: String
})

const emit = defineEmits(['update:modelValue'])

const confirmPassword = ref(props.modelValue || '')

const passwordsMatch = computed(() => {
  return confirmPassword.value === props.originalPassword && confirmPassword.value.length > 0
})

const showFire = computed(() => {
  return confirmPassword.value.length > 0 && !passwordsMatch.value
})

const updatePassword = (event) => {
  confirmPassword.value = event.target.value
  emit('update:modelValue', confirmPassword.value)
}

const GenerateNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

let burnInterval = null
let burnTime = 5000

const startBurning = () => {
  // Clear any existing interval
  if (burnInterval) {
    clearInterval(burnInterval)
  }
  
  burnInterval = setInterval(() => {
    if (confirmPassword.value.length > 0 && !passwordsMatch.value) {
      // Random deletion - remove 1-3 characters
      const deleteCount = GenerateNumber(1, 4)
      const startPos = GenerateNumber(0, Math.max(0, confirmPassword.value.length - deleteCount))
      
      confirmPassword.value = 
        confirmPassword.value.substring(0, startPos) + 
        confirmPassword.value.substring(startPos + deleteCount)
      
      emit('update:modelValue', confirmPassword.value)
    }
  }, burnTime) // Burn every 4 seconds
}

const stopBurning = () => {
  if (burnInterval) {
    clearInterval(burnInterval)
    burnInterval = null
  }
}

// Watch for when fire should start/stop
watch(showFire, (isShowing) => {
  if (isShowing) {
    startBurning()
  } else {
    stopBurning()
  }
})
</script>

<template>
  <div class="burning-password-wrapper position-relative">
    <div class="mb-2">
      <input 
        type="password" 
        class="form-control form-control-lg bg-dark-blue border-purple text-white" 
        :class="{ 
          'border-danger shake-animation': showFire,
          'border-success': passwordsMatch
        }"
        :value="confirmPassword"
        @input="updatePassword"
        placeholder="Confirm your password"
        :disabled="disabled"
        required
      >
    </div>

    <!-- Fire Animation Overlay -->

    <!-- Success Indicator -->
    <transition name="fade">
      <div v-if="passwordsMatch" class="success-message text-center mt-2">
        <span class="text-success fw-bold">✅ Passwords Match!</span>
      </div>
    </transition>

    <!-- Mismatch Warning -->
    <transition name="fade">
      <div v-if="!passwordsMatch && confirmPassword.length > 0" class="mismatch-message text-center mt-2">
        <span class="text-danger fw-bold">
        <animatedImage src="../../src/assets/fire_animated.png" :frameWidth="400" :frameHeight="400" :frames="6" :width="50" :height="50" ></animatedImage>    
            ❌ Passwords Don't Match
        <animatedImage src="../../src/assets/fire_animated.png" :frameWidth="400" :frameHeight="400" :frames="6" :width="50" :height="50" ></animatedImage>
        </span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.burning-password-wrapper {
  width: 100%;
}

.fire-overlay {
  pointer-events: none;
  z-index: 5;
  animation: fire-flicker 0.3s infinite;
}

.fire-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}


@keyframes fire-flicker {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}



@keyframes warning-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.shake-animation {
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
}

.border-danger {
  border-color: var(--theme-red) !important;
  box-shadow: 0 0 15px var(--theme-red-rgba-50) !important;
}

.border-success {
  border-color: var(--theme-green) !important;
  box-shadow: 0 0 15px rgba(40, 167, 69, 0.5) !important;
}

.success-message {
  animation: success-fade-in 0.5s ease;
}

.mismatch-message {
  animation: mismatch-shake 0.3s ease;
}

@keyframes success-fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes mismatch-shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* Transitions */
.fire-fade-enter-active, .fire-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fire-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.fire-fade-leave-to {
  opacity: 0;
  transform: scale(1.2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
