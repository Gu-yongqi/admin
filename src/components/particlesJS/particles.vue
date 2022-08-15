<template>
  <div id="particles-js"></div>
</template>

<script setup>
import particlesJS from './particles.js';
import particlesJSON from './particles.json';
import { onMounted } from 'vue';

onMounted(() => {
  particlesJS('particles-js', particlesJSON);
})
</script>

<style>
#particles-js {
  width: 100%;
  height: 100vh;
  background-color: rgba(64, 158, 255, 0.7);
  overflow: hidden;
}
</style>