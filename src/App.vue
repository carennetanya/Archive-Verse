<template>
  <div>
    <!-- 1. Splash headphone -->
    <SplashScreen v-if="phase === 'splash'" @done="phase = 'loading'" />

    <!-- 2. Loading screen kawung -->
    <Transition name="fadein">
      <LoadingScreen v-if="phase === 'loading'" @done="phase = 'entrance'" />
    </Transition>

    <!-- 3. Grand Entrance -->
    <Transition name="fadein">
      <GrandEntrance v-if="phase === 'entrance'" @done="phase = 'home'" />
    </Transition>

    <!-- 4. Home Page -->
    <Transition name="fadein">
      <HomePage v-if="phase === 'home'" />
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SplashScreen  from './components/SplashScreen.vue'
import LoadingScreen from './components/LoadingScreen.vue'
import GrandEntrance from './components/GrandEnterance.vue'
import HomePage      from './components/HomePage.vue'

const phase = ref('splash')
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

.fadein-enter-active { transition: opacity 1s ease; }
.fadein-enter-from   { opacity: 0; }
</style>