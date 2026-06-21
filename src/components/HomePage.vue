<template>
  <div class="home">
    <!-- ═══ HERO ═══ -->
    <HeroSection />

    <!-- ═══ PENGANTAR PARALLAX ═══ -->
    <ParallaxIntro />

    <!-- ═══ PILAR — geser horizontal ═══ -->
    <HorizontalPillars />
  </div>
</template>

<script setup>
import HeroSection from './HeroSection.vue'
import ParallaxIntro from './ParallaxIntro.vue'
import HorizontalPillars from './HorizontalPillars.vue'
</script>

<style scoped>
.home {
  background: var(--cv-bg);
  color: var(--cv-text);
}
</style>