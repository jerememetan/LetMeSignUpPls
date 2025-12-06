<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Props and emits
const emit = defineEmits(['update:modelValue'])
let FinalEmail = '';
// Email split into 10 boxes
const emailBoxes = ref(['', '', '', '', '', '', '', '', '', ''])
let shuffleInterval = null

// Shuffle email boxes every 5 seconds
const shuffleEmailBoxes = () => {
  // Create a copy and shuffle it
  const shuffled = [...emailBoxes.value]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  emailBoxes.value = shuffled
  updateEmail();
}

// Watch for changes and emit the joined email
const updateEmail = () => {
  const fullEmail = emailBoxes.value.join('');
  FinalEmail = fullEmail;
  emit('update:modelValue', fullEmail)
}

// Start shuffling on mount
onMounted(() => {
  shuffleInterval = setInterval(shuffleEmailBoxes, 2500)
  
})

// Clear interval on unmount
onUnmounted(() => {
  if (shuffleInterval) {
    clearInterval(shuffleInterval)
  }
})
</script>

<template>
  <div>
    <label class="form-label text-light">Email (max 5 characters per box)</label>
    <div class="email-boxes-container">
      <input 
        v-for="(box, index) in emailBoxes"
        :key="index"
        type="text" 
        class="form-control bg-dark-blue border-purple text-white email-box" 
        v-model="emailBoxes[index]"
        :placeholder="`Box ${index + 1}`"
        maxlength="5"
        @input="updateEmail"
      >
    </div>
    <label class="form-label text-light">Your Email:</label>
    <div class="bg-dark-blue border-purple text-success text-center w-100 fw-bold fs-3" >
      {{ FinalEmail }}
    </div>

  </div>
</template>

<style scoped>
/* Email Boxes */
.email-boxes-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 10px;
}

.email-box {
  text-align: center;
  font-size: 0.9rem;
  padding: 10px 5px;
  will-change: border-color;
}

.text-light-purple {
  color: var(--theme-purple-light);
}

.form-label {
  margin-bottom: 0.5rem;
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

@media (max-width: 768px) {
  .email-boxes-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
