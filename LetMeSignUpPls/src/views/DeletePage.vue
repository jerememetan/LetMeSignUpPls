<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import BouncingElement from '@/components/Atoms/BouncingElement.vue'

const authStore = useAuthStore()
const router = useRouter()

const numButtons = 12
const realButtonIndex = ref(Math.floor(Math.random() * numButtons))
const isDeleting = ref(false)

const colors = ['#8a2be2', '#ff1493', '#00ff00', '#ffff00', '#00ffff', '#ff6600', '#ff0000', '#ff69b4']

const handleDeleteClick = async (element) => {
  if (isDeleting.value) return

  if (element.id !== realButtonIndex.value) {
    // Fake button - show error message
    alert('❌ Nice try! That\'s not the real delete button.')
    return
  }

  // Real button - confirm deletion
  const confirmed = confirm('⚠️ Are you absolutely sure you want to delete your account? This action CANNOT be undone!')
  
  if (!confirmed) return

  isDeleting.value = true

  try {
    const userId = authStore.user?.id

    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Call the database function that securely deletes from both tables
    const { error: deleteError } = await supabase.rpc('delete_own_account')

    if (deleteError) {
      throw deleteError
    }

    // Sign out
    await authStore.signOut()

    alert('🗑️ Account successfully deleted. Goodbye!')
    router.push('/login')
  } catch (error) {
    alert('Failed to delete account: ' + error.message)
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="delete-page">
    <div class="instruction-overlay">
      <div class="instruction-box">
        <h2 class="text-danger mb-3">⚠️ Account Deletion Zone ⚠️</h2>
        <p class="mb-2">Changed your mind? Want to escape? <router-link to="/home" class="text-warning text-decoration-none fw-bold">Go Back</router-link></p>
        <p class="mb-3 fw-bold">Find the REAL delete button among the fakes...</p>
      </div>
    </div>

    <!-- Bouncing delete buttons -->
    <BouncingElement
      :numElements="numButtons"
      :elementWidth="200"
      :elementHeight="50"
      :colors="colors"
      @elementClick="handleDeleteClick"
    >
      <template #default="{ element }">
        <button
          class="delete-btn"
          :class="{ 'deleting': isDeleting }"
          :disabled="isDeleting"
        >
          <span class="btn-icon">🗑️</span>
          <span class="btn-text">DELETE ACCOUNT</span>
        </button>
      </template>
    </BouncingElement>

  </div>
</template>

<style scoped>
.delete-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, var(--gradient-bg-1), var(--gradient-bg-2), var(--gradient-bg-3));
  overflow: hidden;
}

.instruction-overlay {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: none;
}

.instruction-box {
  background: rgba(0, 0, 0, 0.95);
  border: 3px solid var(--theme-red);
  border-radius: 15px;
  padding: 20px 40px;
  text-align: center;
  color: white;
  box-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
  animation: pulse-danger 2s infinite;
}

@keyframes pulse-danger {
  0%, 100% {
    box-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 50px rgba(255, 0, 0, 0.8);
  }
}

.delete-btn {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.delete-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 0, 0, 0.2);
}

.delete-btn:active {
  transform: scale(0.95);
}

.delete-btn.deleting {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-text {
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .instruction-box {
    padding: 15px 20px;
    max-width: 90%;
  }
  
  .instruction-box h2 {
    font-size: 1.3rem;
  }
  
  .instruction-box p {
    font-size: 0.85rem;
  }
  
  .delete-btn {
    width: 160px;
    height: 45px;
    font-size: 0.75rem;
  }
}
</style>