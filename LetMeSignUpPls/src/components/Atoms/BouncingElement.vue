<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  numElements: {
    type: Number,
    default: 1
  },
  elementWidth: {
    type: Number,
    default: 300
  },
  elementHeight: {
    type: Number,
    default: 50
  },
  colors: {
    type: Array,
    default: () => ['#8a2be2', '#ff1493', '#00ff00', '#ffff00', '#00ffff', '#ff6600', '#ff0000']
  }
})

const emit = defineEmits(['elementClick'])

const elements = ref([])
const containerWidth = ref(window.innerWidth)
const containerHeight = ref(window.innerHeight)

let animationFrame = null

// Initialize elements with random positions and velocities
const initializeElements = () => {
  elements.value = []
  for (let i = 0; i < props.numElements; i++) {
    elements.value.push({
      id: i,
      position: {
        x: Math.random() * (containerWidth.value - props.elementWidth),
        y: Math.random() * (containerHeight.value - props.elementHeight)
      },
      velocity: {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10
      },
      color: props.colors[Math.floor(Math.random() * props.colors.length)]
    })
  }
}

// Update element positions
const updatePositions = () => {
  elements.value.forEach(element => {
    // Update position
    element.position.x += element.velocity.x
    element.position.y += element.velocity.y

    // Bounce off walls
    if (element.position.x <= 0 || element.position.x + props.elementWidth >= containerWidth.value) {
      element.velocity.x *= -1
      element.color = props.colors[Math.floor(Math.random() * props.colors.length)]
    }
    
    if (element.position.y <= 0 || element.position.y + props.elementHeight >= containerHeight.value) {
      element.velocity.y *= -1
      element.color = props.colors[Math.floor(Math.random() * props.colors.length)]
    }

    // Keep within bounds
    element.position.x = Math.max(0, Math.min(element.position.x, containerWidth.value - props.elementWidth))
    element.position.y = Math.max(0, Math.min(element.position.y, containerHeight.value - props.elementHeight))
  })
}

const startAnimation = () => {
  const animate = () => {
    updatePositions()
    animationFrame = requestAnimationFrame(animate)
  }
  animate()
}

const updateContainerSize = () => {
  containerWidth.value = window.innerWidth
  containerHeight.value = window.innerHeight
}

const handleElementClick = (element) => {
  emit('elementClick', element)
}

// Watch for numElements changes
watch(() => props.numElements, () => {
  initializeElements()
})

onMounted(() => {
  window.addEventListener('resize', updateContainerSize)
  initializeElements()
  startAnimation()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerSize)
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div class="bounce-arena">
    <div
      v-for="element in elements"
      :key="element.id"
      class="bouncing-element"
      :style="{
        left: element.position.x + 'px',
        top: element.position.y + 'px',
        width: elementWidth + 'px',
        height: elementHeight + 'px',
        borderColor: element.color,
        boxShadow: `0 0 20px ${element.color}`
      }"
      @click="handleElementClick(element)"
    >
      <slot :element="element" :index="element.id"></slot>
    </div>
  </div>
</template>

<style scoped>
.bounce-arena {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.bouncing-element {
  position: absolute;
  transition: border-color 0.3s;
  border: 3px solid;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.95);
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
