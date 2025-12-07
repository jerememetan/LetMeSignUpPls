<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

</script>

<template>
  <main>
    <div class="app-container w-100 h-100">
      <video  src="./assets/background.mp4" autoplay loop muted class="background-video"></video>
      <div>
        <nav class="d-flex justify-content-around w-100 bg-opacity-50 py-2 border-purple bg-dark-purple">
          <router-link to="/login" class="btn text-white ">Login</router-link>
          <router-link to="/register" class="btn text-white ">Register</router-link>
        </nav>
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
