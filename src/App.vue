<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

</script>

<template>
  <main>
    <div class="app-container w-100 h-100">
      <video  src="./assets/background.mp4" autoplay loop muted class="background-video"></video>
      <div>
        <router-view></router-view>
      </div>
    </div>

  </main>
</template>

<style scoped>
.background-video{
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;

}
.app-container{
  position: relative;
}
</style>
