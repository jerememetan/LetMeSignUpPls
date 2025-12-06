<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const latitude = ref('')
const longitude = ref('')
const isMapVisible = ref(false)
const mapZoom = ref(10)
const zoomTimer = ref(null)

// Random zoom chaos
const startZoomChaos = () => {
  if (zoomTimer.value) return
  
  zoomTimer.value = setInterval(() => {
    // Random zoom between 5 and 18
    mapZoom.value = Math.floor(Math.random() * 14) + 5
  }, 2000)
}

const stopZoomChaos = () => {
  if (zoomTimer.value) {
    clearInterval(zoomTimer.value)
    zoomTimer.value = null
  }
}

const toggleMap = () => {
  isMapVisible.value = !isMapVisible.value
  if (isMapVisible.value) {
    startZoomChaos()
  } else {
    stopZoomChaos()
  }
}

const handleLatChange = () => {
  updateAddress()
}

const handleLongChange = () => {
  updateAddress()
}

const updateAddress = () => {
  if (latitude.value && longitude.value) {
    const coordString = `${latitude.value}, ${longitude.value}`
    emit('update:modelValue', coordString)
  }
}

// Validate coordinates
const isValidLat = computed(() => {
  const lat = parseFloat(latitude.value)
  return !isNaN(lat) && lat >= -90 && lat <= 90
})

const isValidLong = computed(() => {
  const long = parseFloat(longitude.value)
  return !isNaN(long) && long >= -180 && long <= 180
})

const coordinatesComplete = computed(() => {
  return isValidLat.value && isValidLong.value
})

// Cleanup on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  stopZoomChaos()
})
</script>

<template>
  <div class="coordinates-container">
    <label class="form-label text-light">Address (GPS Coordinates Required)</label>
    <p class="instruction-text">Enter your address as latitude and longitude coordinates</p>
    
    <div class="coordinates-inputs">
      <div class="coordinate-group">
        <label class="coord-label">Latitude</label>
        <input 
          type="number" 
          step="0.000001"
          class="form-control form-control-lg bg-dark-blue border-purple text-white"
          :class="{ 'invalid-coord': latitude && !isValidLat }"
          v-model="latitude"
          @input="handleLatChange"
          placeholder="e.g., 40.7128"
          min="-90"
          max="90"
          required
        >
        <span v-if="latitude && !isValidLat" class="error-text">Invalid latitude!</span>
      </div>
      
      <div class="coordinate-group">
        <label class="coord-label">Longitude</label>
        <input 
          type="number" 
          step="0.000001"
          class="form-control form-control-lg bg-dark-blue border-purple text-white"
          :class="{ 'invalid-coord': longitude && !isValidLong }"
          v-model="longitude"
          @input="handleLongChange"
          placeholder="e.g., -74.0060"
          min="-180"
          max="180"
          required
        >
        <span v-if="longitude && !isValidLong" class="error-text">Invalid longitude!</span>
      </div>
    </div>
    
    <div class="help-section">
      <button 
        type="button"
        class="btn btn-sm btn-purple-outline"
        @click="toggleMap"
      >
        {{ isMapVisible ? '🗺️ Hide Map' : '🗺️ Show Map' }}
      </button>
      
      <div v-if="coordinatesComplete" class="success-badge">
        ✅ Coordinates Valid!
      </div>
    </div>
    
    <!-- Chaotic Map -->
    <div v-if="isMapVisible" class="map-container">
      <div class="map-overlay">
        <div class="fake-map" :class="'zoom-' + mapZoom">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2711.2800575294327!2d-52.839760973290346!3d47.191530766547444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4b0cefffaaf42c2b%3A0xb5a68c9cd0b5205d!2sPee%20Pee%20Island!5e0!3m2!1sen!2ssg!4v1764925182096!5m2!1sen!2ssg"
             width="100%" height="100%" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coordinates-container {
  width: 100%;
}

.instruction-text {
  font-size: 0.9rem;
  color: var(--theme-purple-light);
  margin-bottom: 15px;
  font-style: italic;
}

.coordinates-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.coordinate-group {
  display: flex;
  flex-direction: column;
}

.coord-label {
  font-size: 0.85rem;
  color: var(--theme-purple-light);
  margin-bottom: 5px;
}

.form-control {
  font-family: 'Courier New', monospace;
}

.invalid-coord {
  border-color: #dc3545 !important;
  animation: shake 0.3s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-text {
  font-size: 0.75rem;
  color: #dc3545;
  margin-top: 5px;
}

.help-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.btn-purple-outline {
  background: transparent;
  border: 2px solid var(--theme-purple);
  color: var(--theme-purple-light);
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s;
}

.btn-purple-outline:hover {
  background: var(--theme-purple-rgba-25);
  transform: scale(1.05);
}

.success-badge {
  background: linear-gradient(90deg, #28a745, #20c997);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.map-container {
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid var(--theme-purple);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  position: relative;
  overflow: hidden;
}

.map-overlay {
  position: relative;
}

.zoom-indicator {
  text-align: center;
  color: gold;
  font-weight: bold;
  margin-bottom: 10px;
  animation: pulse-color 1s infinite;
}

@keyframes pulse-color {
  0%, 100% { color: gold; }
  50% { color: orange; }
}

.fake-map {
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #1a4d2e, #2d5f3f);
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.5s ease-in-out;
}

.fake-map.zoom-5 { transform: scale(0.3) rotate(0deg); }
.fake-map.zoom-6 { transform: scale(0.4) rotate(5deg); }
.fake-map.zoom-7 { transform: scale(0.5) rotate(-5deg); }
.fake-map.zoom-8 { transform: scale(0.6) rotate(10deg); }
.fake-map.zoom-9 { transform: scale(0.7) rotate(-10deg); }
.fake-map.zoom-10 { transform: scale(0.8) rotate(0deg); }
.fake-map.zoom-11 { transform: scale(0.9) rotate(5deg); }
.fake-map.zoom-12 { transform: scale(1) rotate(-5deg); }
.fake-map.zoom-13 { transform: scale(1.2) rotate(10deg); }
.fake-map.zoom-14 { transform: scale(1.5) rotate(-10deg); }
.fake-map.zoom-15 { transform: scale(2) rotate(15deg); }
.fake-map.zoom-16 { transform: scale(2.5) rotate(-15deg); }
.fake-map.zoom-17 { transform: scale(3) rotate(20deg); }
.fake-map.zoom-18 { transform: scale(4) rotate(-20deg); }

.map-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
}

.grid-line {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translate(-50%, -50%); }
  50% { transform: translate(-50%, -60%); }
}

.map-hint {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: rgba(0, 0, 0, 0.7);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.hint-box {
  background: rgba(138, 43, 226, 0.1);
  border: 1px solid var(--theme-purple-rgba-50);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.hint-text {
  margin: 0;
  color: var(--theme-purple-light);
  font-size: 0.9rem;
}

.hint-subtext {
  margin: 5px 0 0 0;
  color: var(--theme-purple-light);
  font-size: 0.75rem;
  opacity: 0.7;
}

@media (max-width: 576px) {
  .coordinates-inputs {
    grid-template-columns: 1fr;
  }
  
  .help-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .fake-map {
    height: 200px;
  }
}
</style>
