<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref(props.modelValue || '')
const position = ref({ x: 50, y: 50 })
const velocity = ref({ x: 15, y: 15 })
const isDisabled = ref(false)
const containerWidth = ref(800)
const containerHeight = ref(400)
const inputWidth = 300
const inputHeight = 50

let animationFrame = null
let disableInterval = null

const updatePosition = () => {
  // Update position
  position.value.x += velocity.value.x
  position.value.y += velocity.value.y

  // Bounce off walls
  if (position.value.x <= 0 || position.value.x + inputWidth >= containerWidth.value) {
    velocity.value.x *= -1
    // Change color when bouncing (DVD style)
    changeColor()
  }
  
  if (position.value.y <= 0 || position.value.y + inputHeight >= containerHeight.value) {
    velocity.value.y *= -1
    changeColor()
  }

  // Keep within bounds
  position.value.x = Math.max(0, Math.min(position.value.x, containerWidth.value - inputWidth))
  position.value.y = Math.max(0, Math.min(position.value.y, containerHeight.value - inputHeight))
}

const borderColor = ref('#8a2be2')
const colors = ['#8a2be2', '#ff1493', '#00ff00', '#ffff00', '#00ffff', '#ff6600', '#ff0000']

const changeColor = () => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  borderColor.value = randomColor
}

const startAnimation = () => {
  const animate = () => {
    updatePosition()
    animationFrame = requestAnimationFrame(animate)
  }
  animate()
}

const randomlyDisable = () => {
  disableInterval = setInterval(() => {
    isDisabled.value = true
    setTimeout(() => {
      isDisabled.value = false
    }, Math.random() * 2000 + 1000) // Disabled for 1-3 seconds
  }, Math.random() * 5000 + 3000) // Every 3-8 seconds
}

const handleInput = (event) => {
  inputValue.value = event.target.value
  emit('update:modelValue', inputValue.value)
}

onMounted(() => {
  // Update container size to full viewport
  const updateContainerSize = () => {
    const element = document.getElementById("bounce_area");
    if (element) {
      const rect = element.getBoundingClientRect();
      containerWidth.value = rect.width;
      containerHeight.value = rect.height;
    } else {
      // Fallback to viewport dimensions
      containerWidth.value = window.innerWidth;
      containerHeight.value = window.innerHeight;
    }
  }
  
  // Wait for next tick to ensure DOM is ready
  setTimeout(() => {
    updateContainerSize()
  }, 0)
  
  window.addEventListener('resize', updateContainerSize)

  startAnimation()
  randomlyDisable()

  return () => {
    window.removeEventListener('resize', updateContainerSize)
  }
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  if (disableInterval) {
    clearInterval(disableInterval)
  }
})
</script>

<template>
  <div class="moving-username-container">
    <label class="form-label text-light">Username </label>
    <p class="instruction-text">Uhhhh... where did it go?</p>
    
    <!-- Fullscreen bounce arena -->
    <div class="bounce-arena-fullscreen" id="bounce_area">
      <div 
        class="moving-input-wrapper"
        :style="{ 
          left: position.x + 'px', 
          top: position.y + 'px',
          borderColor: borderColor
        }"
      >
        <input 
          type="text" 
          class="form-control form-control-lg bg-dark-blue text-white moving-input"
          :class="{ 'input-disabled': isDisabled }"
          :style="{ borderColor: borderColor }"
          v-model="inputValue"
          @input="handleInput"
          placeholder="Type your username..."
          :disabled="isDisabled"
          required
        >
        <div v-if="isDisabled" class="disabled-overlay">
          🔒 Field Locked!
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.moving-username-container {
  width: 100%;
  margin-bottom: 20px;
}

.instruction-text {
  font-size: 0.9rem;
  color: var(--theme-purple-light);
  margin-bottom: 15px;
  font-style: italic;
}

.bounce-arena-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
}

.moving-input-wrapper {
  position: absolute;
  width: 300px;
  transition: border-color 0.3s;
  border: 3px solid;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.95);
  box-shadow: 0 0 30px currentColor;
  pointer-events: auto;
  z-index: 10000;
}

.moving-input {
  border: none !important;
  background: transparent !important;
  color: white !important;
  font-size: 1rem;
  padding: 12px;
  width: 100%;
  outline: none;
  box-shadow: none !important;
}

.moving-input:focus {
  box-shadow: none !important;
}

.input-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.disabled-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 0, 0, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  pointer-events: none;
  animation: pulse-red 1s infinite;
}

@keyframes pulse-red {
  0%, 100% { 
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
  }
  50% { 
    box-shadow: 0 0 25px rgba(255, 0, 0, 1);
  }
}

.arena-hint {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  background: rgba(0, 0, 0, 0.9);
  padding: 15px 30px;
  border-radius: 10px;
  border: 2px solid var(--theme-purple);
  pointer-events: none;
  z-index: 10001;
  box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
}

.arena-hint p {
  margin: 5px 0;
  color: var(--theme-purple-light);
  font-size: 0.9rem;
}

.bounce-counter {
  color: gold;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
}

@media (max-width: 576px) {
  .moving-input-wrapper {
    width: 250px;
  }
  
  .arena-hint {
    bottom: 10px;
    padding: 10px 15px;
  }
  
  .arena-hint p {
    font-size: 0.75rem;
  }
}
</style>
