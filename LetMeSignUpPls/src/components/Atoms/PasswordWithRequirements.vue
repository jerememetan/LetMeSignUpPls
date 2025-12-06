<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: String,
  disabled: Boolean,
  username: String
})

const emit = defineEmits(['update:modelValue'])

const password = ref(props.modelValue || '')

const isPrime = num => {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if(num % i === 0) return false;
    }
    return num > 1;
}

const updatePassword = (event) => {
  password.value = event.target.value
  emit('update:modelValue', password.value)
  // update requirements value
  // reset everything to false first
   const specialCharsRegex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
   const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
   let UpperCount = 0;
   let SumOfNums = 0;
    for (let i = 0; i < requirements.value.length; i++){
        requirements.value[i].met = false;
    }
    // id 1 check
    if (password.value.length > 7){
        requirements.value[0].met = true;
    }
    // special character check
    if (specialCharsRegex.test(password.value)){
        requirements.value[4].met = true;

    }
    // emoji check
    if (emojiRegex.test(password.value)){
        requirements.value[6].met = true
    }
    // prime number length check
    if (isPrime(password.value.length)){
        requirements.value[14].met = true;
    }
    // pre set
    requirements.value[5].met = true;
    requirements.value[12].met = true;
    for (let j = 0; j < password.value.length; j++){
        // Lower Case Check
        if (j == 0){
            if (password.value.charAt(j).toUpperCase() !== password.value.charAt(j).toLowerCase()){
                requirements.value[10].met = true;
            }
        }
        if (j == password.value.length -1){
            if (Number(password.value.charAt(j)) == Number(password.value.charAt(j))){
                requirements.value[11].met = true;
            }
        }
        // Lowercase Case check
        if (password.value.charAt(j) === password.value.charAt(j).toLowerCase() && 
            password.value.charAt(j) != password.value.charAt(j).toUpperCase() ){
            requirements.value[2].met = true;
        }
        // Uppercase Case Check
        if (password.value.charAt(j) === password.value.charAt(j).toUpperCase() && 
            password.value.charAt(j) != password.value.charAt(j).toLowerCase()){
            requirements.value[1].met = true;
            UpperCount++;
        }
        if (Number(password.value.charAt(j)) == Number(password.value.charAt(j))){
            requirements.value[3].met = true;
            SumOfNums += Number(password.value.charAt(j));
        }
        // containing letters in "password" check
        if (password.value.charAt(j).toLowerCase() === "p" |
            password.value.charAt(j).toLowerCase() === "a" |
            password.value.charAt(j).toLowerCase() === "s" |
            password.value.charAt(j).toLowerCase() === "w" |
            password.value.charAt(j).toLowerCase() === "o" |
            password.value.charAt(j).toLowerCase() === "r" |
            password.value.charAt(j).toLowerCase() === "d"){
            requirements.value[5].met = false;
        }
        // must contain a vowel followed by a consonant
        // basically check if the letter before is a vowel and the current letter is not a vowel
        if (j > 0){
            // if both are alphabets
            if (password.value.charAt(j).toUpperCase() !== password.value.charAt(j).toLowerCase()
            && password.value.charAt(j-1).toUpperCase() !== password.value.charAt(j-1).toLowerCase()){
                if (/^[aeiou]$/i.test(password.value.charAt(j-1)) == true && 
                    /^[aeiou]$/i.test(password.value.charAt(j)) == false ){
                        requirements.value[8].met = true;
                    }
            }
            // check for back to back special character
            if (specialCharsRegex.test(password.value.charAt(j)) && specialCharsRegex.test(password.value.charAt(j-1))){
                requirements.value[12].met = false;
            }
        }

    }
    // Sum of Numbers Check
    if (SumOfNums == 15){
        requirements.value[7].met = true;
    }
    // UpperCase Letter count check
    if (UpperCount == 3){
        requirements.value[9].met = true;
    }
    // check if password contains at least one character from username
    if (props.username && props.username.length > 0) {
        for (let k = 0; k < props.username.length; k++) {
            if (password.value.toLowerCase().includes(props.username.charAt(k).toLowerCase())) {
                requirements.value[13].met = true;
                break;
            }
        }
    }


}

// Placeholder for validation logic - you'll implement this
const requirements = ref([
  { id: 1, text: 'Must be at least 8 characters', met: false },
  { id: 2, text: 'Must contain at least one uppercase letter', met: false },
  { id: 3, text: 'Must contain at least one lowercase letter', met: false },
  { id: 4, text: 'Must contain at least one number', met: false },
  { id: 5, text: 'Must contain at least one special character (!@#$%^&*)', met: false },
  { id: 6, text: 'Must NOT contain letters in the word "password"', met: false },
  { id: 7, text: 'Must contain at least one emoji', met: false },
  { id: 8, text: 'The sum of all numbers must equal exactly 15', met: false },
  { id: 9, text: 'Must contain a vowel followed by a consonant', met: false },
  { id: 10, text: 'Must have exactly 3 uppercase letters', met: false },
  { id: 11, text: 'Must start with a letter', met: false },
  { id: 12, text: 'Must end with a number', met: false },
  { id: 13, text: 'Special characters must not be adjacent', met: false },
  { id: 14, text: 'Must contain at least one character from your username', met: false },
  { id: 15, text: 'Length must be a prime number (13, 17, 19, 23...)', met: false }
])

const getProgressPercentage = () => {
  const metCount = requirements.value.filter(r => r.met).length
  return (metCount / requirements.value.length) * 100
}

const getStrengthLabel = () => {
  const percentage = getProgressPercentage()
  if (percentage === 0) return 'Impossible'
  if (percentage < 30) return 'Very Weak'
  if (percentage < 60) return 'Weak'
  if (percentage < 90) return 'Strong'
  if (percentage < 100) return 'Almost There...'
  return 'Unbreakable! 🎉'
}

const getStrengthColor = () => {
  const percentage = getProgressPercentage()
  if (percentage === 0) return 'var(--theme-red)'
  if (percentage < 30) return '#ff4444'
  if (percentage < 60) return '#ffa500'
  if (percentage < 90) return '#ffff00'
  if (percentage < 100) return 'var(--theme-purple-light)'
  return 'var(--theme-gold)'
}
</script>

<template>
  <div class="password-requirements-wrapper">
    <div class="mb-3">
      <input 
        type="password" 
        class="form-control form-control-lg bg-dark-blue border-purple text-white" 
        :value="password"
        @input="updatePassword"
        placeholder="Create a password"
        :disabled="disabled"
        required
      >
    </div>

    <!-- Progress Bar -->
    <div class="mb-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="text-light-purple fw-bold">Password Strength:</span>
        <span class="fw-bold" :style="{ color: getStrengthColor() }">
          {{ getStrengthLabel() }}
        </span>
      </div>
      <div class="progress" style="height: 8px; background: var(--theme-dark-input);">
        <div 
          class="progress-bar strength-bar"
          role="progressbar" 
          :style="{ 
            width: getProgressPercentage() + '%',
            background: getStrengthColor()
          }"
          :aria-valuenow="getProgressPercentage()" 
          aria-valuemin="0" 
          aria-valuemax="100"
        ></div>
      </div>
    </div>

    <!-- Requirements List -->
    <div class="requirements-container p-3 rounded-3 border border-2">
      <h6 class="text-light-purple mb-3 fw-bold">
        📋 Password Requirements ({{ requirements.filter(r => r.met).length }}/{{ requirements.length }})
      </h6>
      
      <div class="requirements-list">
        <div 
          v-for="req in requirements" 
          :key="req.id"
          class="requirement-item d-flex align-items-start gap-2 mb-2 p-2 rounded-2"
          :class="{ 'requirement-met': req.met, 'requirement-unmet': !req.met }"
        >
          <span class="requirement-icon">
            {{ req.met ? '✅' : '❌' }}
          </span>
          <span class="requirement-text flex-grow-1">
            {{ req.text }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.password-requirements-wrapper {
  width: 100%;
}

.requirements-container {
  background: var(--theme-dark-card-bg);
  border-color: var(--theme-purple-rgba-30) !important;
  max-height: 400px;
  overflow-y: auto;
}

.requirements-list {
  display: flex;
  flex-direction: column;
}

.requirement-item {
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.3);
}

.requirement-unmet {
  color: var(--theme-purple-light);
  opacity: 0.6;
}

.requirement-met {
  color: var(--theme-gold);
  opacity: 1;
  background: var(--theme-purple-rgba-10) !important;
  animation: requirement-check 0.4s ease;
}

@keyframes requirement-check {
  0% {
    transform: scale(0.95);
    background: var(--theme-gold-rgba-50);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

.requirement-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.requirement-met .requirement-icon {
  animation: icon-bounce 0.5s ease;
}

@keyframes icon-bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3) rotate(10deg);
  }
}

.requirement-text {
  font-size: 0.9rem;
  line-height: 1.4;
}

.strength-bar {
  transition: width 0.5s ease, background 0.5s ease;
}

/* Custom scrollbar for requirements */
.requirements-container::-webkit-scrollbar {
  width: 8px;
}

.requirements-container::-webkit-scrollbar-track {
  background: var(--theme-dark-input);
  border-radius: 4px;
}

.requirements-container::-webkit-scrollbar-thumb {
  background: var(--theme-purple-rgba-50);
  border-radius: 4px;
}

.requirements-container::-webkit-scrollbar-thumb:hover {
  background: var(--theme-purple);
}
</style>
