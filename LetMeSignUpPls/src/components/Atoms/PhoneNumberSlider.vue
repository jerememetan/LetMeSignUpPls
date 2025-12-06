<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

// Color picker for country code
const selectedColor = ref('#000000')

// Single slider for phone number (0 to 9,999,999,999)
const phoneSlider = ref(0)
const maxPhoneNumber = 9999999999

// Throttle timer
let throttleTimer = null

// Convert hex color to country code (cached)
const colorToCountryCode = computed(() => {
  const hex = selectedColor.value.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return ((r + g + b) % 999) + 1
})

// Format phone number (direct value, no formatting)
const formattedPhoneNumber = computed(() => phoneSlider.value)

// Throttled update
const throttledUpdate = () => {
  if (throttleTimer) return
  
  throttleTimer = setTimeout(() => {
    const fullPhone = `+${colorToCountryCode.value}${formattedPhoneNumber.value}`
    emit('update:modelValue', fullPhone)
    throttleTimer = null
  }, 100)
}

// Watch for changes
const handleColorChange = () => {
  throttledUpdate()
}

const handleSliderChange = () => {
  throttledUpdate()
}
</script>

<template>
  <div>
    <label class="form-label text-light">Phone Number</label>
    
    <!-- Country Code via Color Picker -->
    <div class="mb-3">
      <label for="colorPicker" class="form-label text-light-purple small">
        Pick a color for country code: +{{ colorToCountryCode }}
      </label>
      <div class="color-picker-container">
        <input 
          type="color" 
          id="colorPicker"
          class="color-picker" 
          v-model="selectedColor"
          @input="handleColorChange"
        >
        <div class="color-display" :style="{ backgroundColor: selectedColor }"></div>
        <span class="country-code-display">+{{ colorToCountryCode }}</span>
      </div>
    </div>
    
    <!-- Phone Number via Single Slider -->
    <div class="sliders-container">
      <p class="text-light-purple small mb-2">Slide to set phone number (0 - 9,999,999,999):</p>
      <div class="single-slider-group">
        <div class="slider-value-display">
          <span class="current-value">{{ formattedPhoneNumber }}</span>
          <span class="max-value text-light-purple small">Max: {{ maxPhoneNumber.toLocaleString() }}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          :max="maxPhoneNumber" 
          step="1"
          v-model.number="phoneSlider"
          @input="handleSliderChange"
          class="slider slider-large"
        >
        <div class="slider-marks">
          <span>0</span>
          <span>{{ maxPhoneNumber }}</span>
        </div>
      </div>
    </div>
    
    <!-- Preview -->
    <div class="phone-preview">
      <span class="text-light-purple small">Your Phone Number: </span>
      <span class="text-white">+{{ colorToCountryCode }} {{ formattedPhoneNumber }}</span>
    </div>
  </div>
</template>

<style scoped>
.form-label {
  margin-bottom: 0.5rem;
}

.text-light-purple {
  color: var(--theme-purple-light);
}

.text-light {
  color: #f8f9fa;
}

.text-white {
  color: white;
}

/* Color Picker */
.color-picker-container {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: var(--theme-dark-input);
  border: 2px solid var(--theme-purple-rgba-50);
  border-radius: 10px;
}

.color-picker {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.color-display {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid var(--theme-purple-light);
}

.country-code-display {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--theme-purple-light);
  margin-left: auto;
}

/* Sliders */
.sliders-container {
  margin-top: 20px;
  padding: 20px;
  background: var(--theme-dark-input);
  border: 2px solid var(--theme-purple-rgba-50);
  border-radius: 10px;
}

.single-slider-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.slider-value-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: var(--theme-purple-rgba-15);
  border-radius: 8px;
}

.current-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--theme-purple-light);
  letter-spacing: 2px;
}

.max-value {
  font-size: 0.85rem;
  opacity: 0.7;
}

.slider {
  width: 100%;
  height: 8px;
  background: var(--theme-dark-bg);
  outline: none;
  border-radius: 5px;
  -webkit-appearance: none;
  appearance: none;
}

.slider-large {
  height: 12px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: var(--theme-purple);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(138, 43, 226, 0.5);
}

.slider::-webkit-slider-thumb:hover {
  background: var(--theme-purple-light);
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(138, 43, 226, 0.8);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: var(--theme-purple);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(138, 43, 226, 0.5);
}

.slider::-moz-range-thumb:hover {
  background: var(--theme-purple-light);
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(138, 43, 226, 0.8);
}

.slider-marks {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--theme-purple-light);
  opacity: 0.6;
  margin-top: 5px;
}

/* Preview */
.phone-preview {
  margin-top: 15px;
  padding: 12px;
  background: var(--theme-purple-rgba-15);
  border-radius: 8px;
  text-align: center;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .color-picker-container {
    flex-wrap: wrap;
  }
  
  .current-value {
    font-size: 1.4rem;
  }
}

@media (max-width: 576px) {
  .current-value {
    font-size: 1.2rem;
    letter-spacing: 1px;
  }
  
  .slider-value-display {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
