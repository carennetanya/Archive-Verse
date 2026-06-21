<template>
  <Transition name="splash-fade">
    <div v-if="visible" class="splash">
      <div class="splash-content" :class="{ show: contentShow }">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <path d="M36 10C21.6 10 10 21.6 10 36v16a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6V38a6 6 0 0 0-6-6h-2.3C17.1 22.5 25.8 15 36 15s18.9 7.5 20.3 17H54a6 6 0 0 0-6 6v14a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6V36C62 21.6 50.4 10 36 10z"
            fill="#c8860a" opacity="0.9"/>
        </svg>
        <p class="splash-title">USE HEADPHONES</p>
        <p class="splash-sub">for the best experience</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['done'])
const visible = ref(true)
const contentShow = ref(false)

onMounted(() => {
  setTimeout(() => { contentShow.value = true }, 200)
  setTimeout(() => { visible.value = false }, 3200)
  setTimeout(() => { emit('done') }, 3800)
})
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.splash-content.show {
  opacity: 1;
  transform: translateY(0);
}

.splash-title {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  letter-spacing: 6px;
  color: #c8860a;
  margin: 0;
}

.splash-sub {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 3px;
  color: #c8860a;
  opacity: 0.85;
  margin: 0;
}

.splash-fade-leave-active { transition: opacity 0.6s ease; }
.splash-fade-leave-to { opacity: 0; }
</style>