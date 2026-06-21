<template>
  <div class="loading-screen">
    <canvas ref="batikCanvas" class="batik-bg" :style="{ opacity: batikOpacity }"></canvas>
    <div class="vignette"></div>

    <!-- Overlay hitam untuk fade out -->
    <Transition name="blackout">
      <div v-if="blackOverlay" class="black-overlay"></div>
    </Transition>

    <!-- Sun screen: matahari + partikel + wiwara -->
    <div v-if="showSunScreen" class="sun-screen">

      <!-- tsParticles container -->
      <div id="tsparticles" class="particles-container"></div>

      <!-- Glow burst radial saat matahari membesar -->
      <div class="sun-burst" :class="{ active: sunBurst }"></div>

      <!-- Matahari + teks Surya -->
      <div class="sun-center-wrap" :class="{ exploding: sunExplode }">
        <div class="surya-aksara" :class="{ visible: showSuryaText, hidden: sunExplode }">ꦱꦸꦂꦪ</div>
        <div class="surya-latin"  :class="{ visible: showSuryaText, hidden: sunExplode }">S U R Y A</div>
        <div class="sun-spinning-wrap">
          <svg :class="['sun-rotate-slow', { 'sun-exploding': sunExplode }]"
               width="120" height="120" viewBox="0 0 120 120">
            <g transform="translate(60,60)">
              <ellipse v-for="a in anglesLarge" :key="'rl'+a"
                rx="5" ry="18" :transform="`rotate(${a}) translate(0,-43)`"
                fill="#e6a020" opacity="0.9"/>
              <g transform="rotate(22.5)">
                <ellipse v-for="a in anglesLarge" :key="'rl2'+a"
                  rx="3.5" ry="12" :transform="`rotate(${a}) translate(0,-30)`"
                  fill="#c8860a" opacity="0.7"/>
              </g>
              <circle r="20" fill="#e6a020"/>
              <circle r="11" fill="#b87a10" opacity="0.5"/>
              <circle r="5"  fill="#e6a020"/>
            </g>
          </svg>
        </div>
      </div>

      <!-- Wiwara — gerbang kayu -->
      <div v-if="showWiwara" class="wiwara-overlay">

        <!-- Ambang atas gerbang -->
        <div class="wiwara-lintel" :class="{ closed: wiwararClosed, open: wiwaraOpen }">
          <svg width="100%" height="100%" viewBox="0 0 800 64" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="woodH" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stop-color="#7a3c00"/>
                <stop offset="40%"  stop-color="#5a2800"/>
                <stop offset="100%" stop-color="#3a1800"/>
              </linearGradient>
              <pattern id="grainH" x="0" y="0" width="4" height="64" patternUnits="userSpaceOnUse">
                <line x1="2" y1="0" x2="2" y2="64" stroke="#00000022" stroke-width="0.6"/>
              </pattern>
            </defs>
            <rect width="800" height="64" fill="url(#woodH)"/>
            <rect width="800" height="64" fill="url(#grainH)"/>
            <path d="M0,56 Q100,44 200,56 Q300,44 400,56 Q500,44 600,56 Q700,44 800,56 L800,64 L0,64 Z" fill="#3a1800" opacity="0.6"/>
            <line x1="0" y1="58" x2="800" y2="58" stroke="#e6a020" stroke-width="0.8" opacity="0.4"/>
          </svg>
        </div>

        <!-- Panel kiri -->
        <div class="wiwara-panel left" :class="{ closed: wiwararClosed, open: wiwaraOpen, blurred: wiwaraBlurred }">
          <svg class="gate-svg" viewBox="0 0 400 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="woodL" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stop-color="#3a1800"/>
                <stop offset="30%"  stop-color="#6b3010"/>
                <stop offset="60%"  stop-color="#7a3c00"/>
                <stop offset="100%" stop-color="#5a2800"/>
              </linearGradient>
              <linearGradient id="plankL" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stop-color="#4a2000"/>
                <stop offset="50%"  stop-color="#7a3c00"/>
                <stop offset="100%" stop-color="#5a2800"/>
              </linearGradient>
              <pattern id="grainV" x="0" y="0" width="400" height="8" patternUnits="userSpaceOnUse">
                <line x1="0" y1="4" x2="400" y2="4" stroke="#00000018" stroke-width="0.5"/>
              </pattern>
              <filter id="woodShadow">
                <feDropShadow dx="-4" dy="0" stdDeviation="6" flood-color="#00000088"/>
              </filter>
            </defs>
            <rect width="400" height="800" fill="url(#woodL)" filter="url(#woodShadow)"/>
            <rect width="400" height="800" fill="url(#grainV)"/>
            <line x1="80"  y1="0" x2="80"  y2="800" stroke="#00000030" stroke-width="1.5"/>
            <line x1="160" y1="0" x2="160" y2="800" stroke="#00000030" stroke-width="1.5"/>
            <line x1="240" y1="0" x2="240" y2="800" stroke="#00000030" stroke-width="1.5"/>
            <line x1="320" y1="0" x2="320" y2="800" stroke="#00000030" stroke-width="1.5"/>
            <rect x="10" y="60"  width="380" height="38" rx="3" fill="url(#plankL)" stroke="#3a1800" stroke-width="1.5"/>
            <rect x="10" y="63"  width="380" height="4"  fill="#ffffff18"/>
            <rect x="10" y="200" width="380" height="32" rx="3" fill="url(#plankL)" stroke="#3a1800" stroke-width="1.5"/>
            <rect x="10" y="203" width="380" height="3"  fill="#ffffff18"/>
            <rect x="10" y="560" width="380" height="32" rx="3" fill="url(#plankL)" stroke="#3a1800" stroke-width="1.5"/>
            <rect x="10" y="563" width="380" height="3"  fill="#ffffff18"/>
            <rect x="10" y="700" width="380" height="38" rx="3" fill="url(#plankL)" stroke="#3a1800" stroke-width="1.5"/>
            <rect x="10" y="703" width="380" height="4"  fill="#ffffff18"/>
            <rect x="30" y="250" width="340" height="290" rx="6" fill="#3a1800" stroke="#c8860a" stroke-width="1.5" opacity="0.8"/>
            <rect x="38" y="258" width="324" height="274" rx="4" fill="none" stroke="#e6a020" stroke-width="0.8" opacity="0.5"/>
            <g transform="translate(200,395)" opacity="0.6">
              <ellipse rx="16" ry="28" fill="none" stroke="#c8860a" stroke-width="1.2"/>
              <ellipse rx="16" ry="28" transform="rotate(90)" fill="none" stroke="#c8860a" stroke-width="1.2"/>
              <circle r="8" fill="none" stroke="#e6a020" stroke-width="1"/>
              <circle r="3" fill="#c8860a" opacity="0.8"/>
            </g>
            <g transform="translate(100,395)" opacity="0.4">
              <ellipse rx="10" ry="18" fill="none" stroke="#c8860a" stroke-width="0.8"/>
              <ellipse rx="10" ry="18" transform="rotate(90)" fill="none" stroke="#c8860a" stroke-width="0.8"/>
              <circle r="4" fill="#c8860a" opacity="0.6"/>
            </g>
            <g transform="translate(300,395)" opacity="0.4">
              <ellipse rx="10" ry="18" fill="none" stroke="#c8860a" stroke-width="0.8"/>
              <ellipse rx="10" ry="18" transform="rotate(90)" fill="none" stroke="#c8860a" stroke-width="0.8"/>
              <circle r="4" fill="#c8860a" opacity="0.6"/>
            </g>
            <g fill="#1a0a00" stroke="#8b6914" stroke-width="1">
              <rect x="350" y="80"  width="40" height="60" rx="4"/>
              <rect x="358" y="85"  width="24" height="50" rx="2" fill="#2a1400"/>
              <circle cx="370" cy="110" r="6" fill="#8b6914"/>
              <circle cx="370" cy="110" r="3" fill="#c8a020"/>
              <rect x="350" y="360" width="40" height="60" rx="4"/>
              <rect x="358" y="365" width="24" height="50" rx="2" fill="#2a1400"/>
              <circle cx="370" cy="390" r="6" fill="#8b6914"/>
              <circle cx="370" cy="390" r="3" fill="#c8a020"/>
              <rect x="350" y="640" width="40" height="60" rx="4"/>
              <rect x="358" y="645" width="24" height="50" rx="2" fill="#2a1400"/>
              <circle cx="370" cy="670" r="6" fill="#8b6914"/>
              <circle cx="370" cy="670" r="3" fill="#c8a020"/>
            </g>
            <rect x="390" y="0" width="10" height="800" fill="#1a0800" opacity="0.8"/>
            <rect x="0" y="0" width="6" height="800" fill="#ffffff08"/>
          </svg>
        </div>

        <!-- Panel kanan -->
        <div class="wiwara-panel right" :class="{ closed: wiwararClosed, open: wiwaraOpen, blurred: wiwaraBlurred }">
          <svg class="gate-svg" viewBox="0 0 400 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="woodR" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stop-color="#5a2800"/>
                <stop offset="40%"  stop-color="#7a3c00"/>
                <stop offset="70%"  stop-color="#6b3010"/>
                <stop offset="100%" stop-color="#3a1800"/>
              </linearGradient>
              <linearGradient id="plankR" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stop-color="#5a2800"/>
                <stop offset="50%"  stop-color="#7a3c00"/>
                <stop offset="100%" stop-color="#4a2000"/>
              </linearGradient>
              <filter id="woodShadowR">
                <feDropShadow dx="4" dy="0" stdDeviation="6" flood-color="#00000088"/>
              </filter>
            </defs>
            <rect width="400" height="800" fill="url(#woodR)" filter="url(#woodShadowR)"/>
            <rect width="400" height="800" fill="url(#grainV)"/>
            <line x1="80"  y1="0" x2="80"  y2="800" stroke="#00000030" stroke-width="1.5"/>
            <line x1="160" y1="0" x2="160" y2="800" stroke="#00000030" stroke-width="1.5"/>
            <line x1="240" y1="0" x2="240" y2="800" stroke="#00000030" stroke-width="1.5"/>
            <line x1="320" y1="0" x2="320" y2="800" stroke="#00000030" stroke-width="1.5"/>
            <rect x="10" y="60"  width="380" height="38" rx="3" fill="url(#plankR)" stroke="#3a1800" stroke-width="1.5"/>
            <rect x="10" y="63"  width="380" height="4"  fill="#ffffff18"/>
            <rect x="10" y="200" width="380" height="32" rx="3" fill="url(#plankR)" stroke="#3a1800" stroke-width="1.5"/>
            <rect x="10" y="203" width="380" height="3"  fill="#ffffff18"/>
            <rect x="10" y="560" width="380" height="32" rx="3" fill="url(#plankR)" stroke="#3a1800" stroke-width="1.5"/>
            <rect x="10" y="563" width="380" height="3"  fill="#ffffff18"/>
            <rect x="10" y="700" width="380" height="38" rx="3" fill="url(#plankR)" stroke="#3a1800" stroke-width="1.5"/>
            <rect x="10" y="703" width="380" height="4"  fill="#ffffff18"/>
            <rect x="30" y="250" width="340" height="290" rx="6" fill="#3a1800" stroke="#c8860a" stroke-width="1.5" opacity="0.8"/>
            <rect x="38" y="258" width="324" height="274" rx="4" fill="none" stroke="#e6a020" stroke-width="0.8" opacity="0.5"/>
            <g transform="translate(200,395)" opacity="0.6">
              <ellipse rx="16" ry="28" fill="none" stroke="#c8860a" stroke-width="1.2"/>
              <ellipse rx="16" ry="28" transform="rotate(90)" fill="none" stroke="#c8860a" stroke-width="1.2"/>
              <circle r="8" fill="none" stroke="#e6a020" stroke-width="1"/>
              <circle r="3" fill="#c8860a" opacity="0.8"/>
            </g>
            <g transform="translate(100,395)" opacity="0.4">
              <ellipse rx="10" ry="18" fill="none" stroke="#c8860a" stroke-width="0.8"/>
              <ellipse rx="10" ry="18" transform="rotate(90)" fill="none" stroke="#c8860a" stroke-width="0.8"/>
              <circle r="4" fill="#c8860a" opacity="0.6"/>
            </g>
            <g transform="translate(300,395)" opacity="0.4">
              <ellipse rx="10" ry="18" fill="none" stroke="#c8860a" stroke-width="0.8"/>
              <ellipse rx="10" ry="18" transform="rotate(90)" fill="none" stroke="#c8860a" stroke-width="0.8"/>
              <circle r="4" fill="#c8860a" opacity="0.6"/>
            </g>
            <g fill="#1a0a00" stroke="#8b6914" stroke-width="1">
              <rect x="10" y="80"  width="40" height="60" rx="4"/>
              <rect x="18" y="85"  width="24" height="50" rx="2" fill="#2a1400"/>
              <circle cx="30" cy="110" r="6" fill="#8b6914"/>
              <circle cx="30" cy="110" r="3" fill="#c8a020"/>
              <rect x="10" y="360" width="40" height="60" rx="4"/>
              <rect x="18" y="365" width="24" height="50" rx="2" fill="#2a1400"/>
              <circle cx="30" cy="390" r="6" fill="#8b6914"/>
              <circle cx="30" cy="390" r="3" fill="#c8a020"/>
              <rect x="10" y="640" width="40" height="60" rx="4"/>
              <rect x="18" y="645" width="24" height="50" rx="2" fill="#2a1400"/>
              <circle cx="30" cy="670" r="6" fill="#8b6914"/>
              <circle cx="30" cy="670" r="3" fill="#c8a020"/>
            </g>
            <rect x="0" y="0" width="10" height="800" fill="#1a0800" opacity="0.8"/>
            <rect x="394" y="0" width="6" height="800" fill="#ffffff08"/>
          </svg>
        </div>

        <!-- Vignette gelap di tengah saat gerbang tertutup -->
        <div class="wiwara-vignette" :class="{ visible: wiwaraLabelVisible, hidden: wiwaraOpen }"></div>

        <!-- Teks Wiwara di tengah gerbang tertutup -->
        <div class="wiwara-label" :class="{ visible: wiwaraLabelVisible }">
          <span class="wiwara-aksara">ꦮꦶꦮꦫ</span>
          <span class="wiwara-latin">W I W A R A</span>
          <span class="wiwara-divider"></span>
          <span class="wiwara-arti">gerbang · pintu masuk</span>
        </div>

      </div>
    </div>

    <!-- Loading UI utama -->
    <div class="loading-container" v-show="!showSunScreen">
      <div class="title-aksara fade-in" :class="{ visible: show }">ꦥꦸꦱꦏ</div>
      <div class="subtitle-top  fade-in delay-1" :class="{ visible: show }">N U S A N T A R A</div>

      <div class="scanline-box fade-in delay-2" :class="{ visible: show }">
        <span class="corner tl"></span><span class="corner tr"></span>
        <span class="corner bl"></span><span class="corner br"></span>
        <span class="loading-text">LOADING</span>
        <span class="cursor">█</span>
      </div>

      <div class="progress-wrap fade-in delay-3" :class="{ visible: show }">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>

      <div class="status-text fade-in delay-4" :class="{ visible: show }">{{ statusMsg }}</div>

      <Transition name="sun-enter">
        <button v-if="showSunBtn" class="sun-btn" @click="handleEnter" :disabled="entering">
          <svg width="64" height="64" viewBox="0 0 64 64" :class="{ 'sun-spin': entering }">
            <g transform="translate(32,32)">
              <ellipse v-for="a in angles" :key="'ray'+a"
                rx="3" ry="9" :transform="`rotate(${a}) translate(0,-23)`" fill="#e6a020" opacity="0.9"/>
              <g transform="rotate(22.5)">
                <ellipse v-for="a in angles" :key="'ray2'+a"
                  rx="2" ry="6" :transform="`rotate(${a}) translate(0,-16)`" fill="#c8860a" opacity="0.7"/>
              </g>
              <circle r="10" fill="#e6a020"/>
              <circle r="5.5" fill="#b87a10" opacity="0.5"/>
              <circle r="2.5" fill="#e6a020"/>
            </g>
          </svg>
          <span class="sun-label">M A S U K</span>
        </button>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const emit = defineEmits(['done'])

// ─── Refs ──────────────────────────────────────────────────────────────────────
const batikCanvas       = ref(null)
const show              = ref(false)
const progress          = ref(0)
const statusMsg         = ref('Memuat warisan budaya...')
const showSunBtn        = ref(false)
const entering          = ref(false)
const blackOverlay      = ref(false)
const showSunScreen     = ref(false)
const showSuryaText     = ref(false)
const sunExplode        = ref(false)
const sunBurst          = ref(false)
const showWiwara        = ref(false)
const wiwaraOpen        = ref(false)
const wiwararClosed     = ref(false)
const wiwaraBlurred     = ref(false)
const wiwaraLabelVisible= ref(false)

const angles      = [0, 45, 90, 135, 180, 225, 270, 315]
const anglesLarge = [0, 45, 90, 135, 180, 225, 270, 315]

// ─── Kayon cursor ──────────────────────────────────────────────────────────────
const kayonSvgEncoded = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='56' viewBox='0 0 40 56'%3E%3Cpolygon points='20,2 38,50 2,50' fill='%23c8860a' stroke='%23e6a020' stroke-width='1.5'/%3E%3Cpolygon points='20,8 34,47 6,47' fill='%230a0a0a' stroke='%23e6a020' stroke-width='0.8'/%3E%3Cellipse cx='20' cy='18' rx='5' ry='6' fill='%23e6a020'/%3E%3Cellipse cx='20' cy='18' rx='2.5' ry='3' fill='%230a0a0a'/%3E%3Cpath d='M6,47 Q10,38 14,30 Q10,35 6,47' fill='%23c8860a' opacity='0.7'/%3E%3Cpath d='M34,47 Q30,38 26,30 Q30,35 34,47' fill='%23c8860a' opacity='0.7'/%3E%3Cline x1='20' y1='26' x2='20' y2='46' stroke='%23e6a020' stroke-width='0.8' opacity='0.6'/%3E%3Crect x='17' y='50' width='6' height='6' rx='1' fill='%23c8860a'/%3E%3Crect x='18.5' y='48' width='3' height='4' fill='%23c8860a'/%3E%3C/svg%3E`
function applyKayonCursor() {
  document.body.style.setProperty('cursor', `url("${kayonSvgEncoded}") 20 2, auto`, 'important')
}

// ─── batikOpacity ──────────────────────────────────────────────────────────────
const batikOpacity = computed(() => {
  const p = progress.value
  if (p < 20) return 0
  return Math.min((p - 20) / 80, 1) * 0.75
})

const messages = [
  'Memuat warisan budaya...',
  'Menganyam motif kawung...',
  'Menggali kearifan lokal...',
  'Mempersiapkan pengalaman...',
  'Siap! Klik matahari untuk masuk.',
]

let interval = null
let tsParticlesInstance = null

// ─── tsParticles helpers ───────────────────────────────────────────────────────
// Bara/abu emas halus yang mengambang NAIK pelan — nuansa sakral, sabar, hangat.
// Disebar dari area bawah-tengah biar terasa "menghidupi" matahari dari bawah.
const emberCfg = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  emitters: [
    {
      position: { x: 50, y: 62 },
      rate: { delay: 0.3, quantity: 1 },
      size: { width: 36, height: 8 },
    },
  ],
  particles: {
    number: { value: 0 },
    color: { value: ['#e6a020', '#fff8c0', '#c8860a', '#ffe066', '#ffd27a'] },
    shape: { type: 'circle' },
    opacity: {
      value: { min: 0, max: 0.85 },
      animation: { enable: true, speed: 0.6, startValue: 'min', count: 1, destroy: 'min' },
    },
    size: {
      value: { min: 0.6, max: 2.6 },
      animation: { enable: true, speed: 1.2, minimumValue: 0.3, sync: false },
    },
    move: {
      enable: true,
      speed: { min: 0.3, max: 0.9 },
      direction: 'top',           // mengambang naik, bukan menyebar acak
      random: true,
      straight: false,
      outModes: { default: 'destroy' },
      gravity: { enable: true, acceleration: -0.25 }, // gravitasi negatif tipis = naik lembut
      drift: { min: -0.4, max: 0.4 },
    },
    wobble: { enable: true, distance: 3, speed: 2 },
    life: { duration: { value: { min: 3.5, max: 6 } }, count: 1 },
    shadow: { enable: true, color: '#e6a020', blur: 5 },
  },
  detectRetina: true,
}

// Saat matahari MEKAR: cahaya keemasan mengalir keluar dengan lembut & melambat.
// Bukan letusan keras — partikel besar pelan, opacity fade halus, gravitasi ringan.
const bloomCfg = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  emitters: [
    {
      // satu gelombang lembut mengembang keluar — secukupnya, tidak lebay
      position: { x: 50, y: 50 },
      rate: { delay: 0.1, quantity: 2 },
      size: { width: 0, height: 0 },
      life: { duration: 1.2, count: 1 },
    },
  ],
  particles: {
    number: { value: 0 },
    color: { value: ['#e6a020', '#fff8c0', '#ffe066', '#ffd27a', '#ffffff'] },
    shape: { type: ['circle', 'star'] },
    opacity: {
      value: { min: 0.5, max: 1 },
      animation: { enable: true, speed: 0.45, minimumValue: 0, destroy: 'min', startValue: 'max' },
    },
    size: {
      value: { min: 1.5, max: 5 },
      animation: { enable: true, speed: 2, minimumValue: 0.4, startValue: 'max', destroy: 'min', sync: false },
    },
    move: {
      enable: true,
      speed: { min: 2, max: 8 },          // jauh lebih pelan dari sebelumnya (6–20)
      direction: 'none', random: true, straight: false,
      outModes: { default: 'destroy' },
      gravity: { enable: true, acceleration: 0.6 }, // ringan, melayang turun lembut
      drift: { min: -0.6, max: 0.6 },
      decay: 0.04,                          // melambat seiring waktu = terasa "mengendap"
    },
    rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 6 } },
    tilt:   { value: { min: 0, max: 360 }, animation: { enable: true, speed: 5 } },
    wobble: { enable: true, distance: 4, speed: 3 },
    life: { duration: { value: { min: 1.6, max: 3.4 } }, count: 1 },
    shadow: { enable: true, color: '#e6a020', blur: 10 },
  },
  detectRetina: true,
}

async function loadTsParticles(cfg) {
  try {
    if (!window.tsParticles) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/npm/@tsparticles/all@3.7.1/tsparticles.all.min.js'
        s.onload = resolve
        s.onerror = reject
        document.head.appendChild(s)
      })
      await window.tsParticles.loadAll()
    }
    if (tsParticlesInstance) {
      await tsParticlesInstance.destroy()
      tsParticlesInstance = null
    }
    tsParticlesInstance = await window.tsParticles.load({ id: 'tsparticles', options: cfg })
  } catch (e) {
    console.warn('tsParticles gagal dimuat, fallback canvas:', e)
    fallbackBurst()
  }
}

let fbRAF = null, fbParticles = []
function fallbackBurst() {
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2'
  canvas.width = window.innerWidth; canvas.height = window.innerHeight
  document.querySelector('.sun-screen')?.appendChild(canvas)
  const cx = canvas.width/2, cy = canvas.height/2
  for (let i = 0; i < 300; i++) {
    const a = Math.random()*Math.PI*2, s = Math.random()*16+4
    fbParticles.push({ x:cx, y:cy, vx:Math.cos(a)*s, vy:Math.sin(a)*s,
      r:Math.random()*4+1.5, alpha:1, decay:Math.random()*0.012+0.006,
      color:['#e6a020','#fff8c0','#ffe066','#ffcc00'][Math.floor(Math.random()*4)] })
  }
  const ctx = canvas.getContext('2d')
  const draw = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    fbParticles = fbParticles.filter(p=>p.alpha>0)
    for(const p of fbParticles){
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.15; p.alpha-=p.decay
      ctx.save(); ctx.globalAlpha=Math.max(0,p.alpha)
      ctx.fillStyle=p.color; ctx.shadowBlur=8; ctx.shadowColor='#e6a020'
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.restore()
    }
    if(fbParticles.length>0) fbRAF=requestAnimationFrame(draw)
  }
  draw()
}

// ─── Kawung ────────────────────────────────────────────────────────────────────
function drawKawung() {
  const canvas = batikCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.offsetWidth || window.innerWidth
  const H = canvas.offsetHeight || window.innerHeight
  canvas.width = W; canvas.height = H; ctx.clearRect(0,0,W,H)
  const unit=52,eRx=11,eRy=22,dotR=2.5
  ctx.strokeStyle='#c8860a'; ctx.fillStyle='#c8860a'
  const cols=Math.ceil(W/unit)+2, rows=Math.ceil(H/(unit/2))+2
  for(let r=-1;r<rows;r++){
    for(let c=-1;c<cols;c++){
      const cx=c*unit+(r%2!==0?unit/2:0), cy=r*(unit/2)
      ctx.lineWidth=0.8; ctx.globalAlpha=1
      ctx.beginPath(); ctx.ellipse(cx,cy-eRy/2,eRx,eRy/2,0,0,Math.PI*2); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx,cy-eRy/2,dotR,0,Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(cx,cy+eRy/2,eRx,eRy/2,0,0,Math.PI*2); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx,cy+eRy/2,dotR,0,Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(cx-eRy/2,cy,eRy/2,eRx,0,0,Math.PI*2); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx-eRy/2,cy,dotR,0,Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(cx+eRy/2,cy,eRy/2,eRx,0,0,Math.PI*2); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx+eRy/2,cy,dotR,0,Math.PI*2); ctx.fill()
    }
  }
  ctx.globalAlpha=1
}

// ─── Main enter sequence ───────────────────────────────────────────────────────
function handleEnter() {
  if (entering.value) return
  entering.value = true
  applyKayonCursor()

  const audio = new Audio('/main.mp3')
  audio.loop=true; audio.volume=0.7; audio.play().catch(()=>{})

  // 0ms — fade ke hitam
  blackOverlay.value = true

  // 900ms — layar matahari muncul + bara halus mengambang naik pelan
  setTimeout(async () => {
    showSunScreen.value = true
    await nextTick()
    loadTsParticles(emberCfg)
  }, 900)

  // 2000ms — aksara Surya muncul perlahan (fade lebih lama, dibiarkan bernapas)
  setTimeout(() => { showSuryaText.value = true }, 2000)

  // 5400ms — matahari mulai "tarik napas" mengecil sedikit (anticipation) lalu mekar
  //           class .sun-exploding memicu animasi sunGrow yang sudah multi-stage
  setTimeout(async () => {
    sunExplode.value = true
    // bara dipekatkan jadi nyala lembut mengalir keluar, bukan letusan
    await loadTsParticles(bloomCfg)
  }, 5400)

  // 6100ms — glow burst radial menyusul puncak mekar (telat dikit biar terasa "mengalir")
  setTimeout(() => { sunBurst.value = true }, 6100)

  // 7600ms — wiwara overlay muncul (panel masih di luar layar / hidden)
  setTimeout(() => { showWiwara.value = true }, 7600)

  // 8000ms — gerbang MENUTUP (panel meluncur masuk dari kiri & kanan ke tengah)
  setTimeout(() => { wiwararClosed.value = true }, 8000)

  // 9700ms — teks Wiwara muncul di tengah gerbang tertutup
  setTimeout(() => { wiwaraLabelVisible.value = true }, 9700)

  // 9800ms — panel kayu blur + vignette gelap muncul (sedikit delay biar teks keliatan jelas)
  setTimeout(() => { wiwaraBlurred.value = true }, 9800)

  // 12400ms — blur & vignette mulai hilang (gerbang mau buka) — diperpanjang biar teks kebaca
  setTimeout(() => {
    wiwaraBlurred.value = false
    wiwaraLabelVisible.value = false
  }, 12400)

  // 12800ms — gerbang TERBUKA (panel meluncur keluar)
  setTimeout(() => {
    wiwaraOpen.value = true
  }, 12800)

  // 14900ms — masuk halaman
  setTimeout(() => { emit('done') }, 14900)
}

onMounted(() => {
  drawKawung()
  window.addEventListener('resize', drawKawung)
  setTimeout(() => { show.value = true }, 100)

  interval = setInterval(() => {
    if (progress.value >= 100) return
    progress.value = Math.min(progress.value + Math.random()*4+1, 100)
    const idx = Math.min(Math.floor((progress.value/100)*(messages.length-1)), messages.length-2)
    statusMsg.value = messages[idx]
    if (progress.value >= 100) {
      clearInterval(interval)
      statusMsg.value = messages[messages.length-1]
      setTimeout(() => { showSunBtn.value = true }, 300)
    }
  }, 80)
})

onBeforeUnmount(() => {
  clearInterval(interval)
  cancelAnimationFrame(fbRAF)
  window.removeEventListener('resize', drawKawung)
  tsParticlesInstance?.destroy()
})
</script>

<style scoped>
.loading-screen {
  position: fixed; inset: 0; background: #0a0a0a;
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; font-family: 'Courier New', monospace; overflow: hidden;
}

/* ── Overlay hitam ── */
.black-overlay { position: absolute; inset: 0; background: #000; z-index: 100; pointer-events: none; }
.blackout-enter-active { transition: opacity 0.6s ease; }
.blackout-enter-from { opacity: 0; }
.blackout-enter-to   { opacity: 1; }

/* ── Sun screen ── */
.sun-screen {
  position: absolute; inset: 0; background: #000;
  display: flex; align-items: center; justify-content: center;
  z-index: 101; overflow: hidden;
}

/* ── tsParticles container ── */
.particles-container {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none; z-index: 2;
}

/* ── Glow burst ── */
.sun-burst {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; border-radius: 50%;
  background: radial-gradient(circle, #fffbe0 0%, #e6a020 25%, #c8860a 55%, transparent 78%);
  opacity: 0; pointer-events: none; z-index: 3;
}
.sun-burst.active {
  animation: burstExpand 2.6s cubic-bezier(0.25, 0.4, 0.3, 1) forwards;
}
@keyframes burstExpand {
  0%   { width: 120px;   height: 120px;   opacity: 0;   }
  18%  { opacity: 0.85; }
  55%  { opacity: 0.9;  }
  100% { width: 500vmax; height: 500vmax; opacity: 1;   }
}

/* ── Sun center wrap ── */
.sun-center-wrap {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  position: relative; z-index: 4;
  transition: opacity 0.4s ease;
}
.sun-center-wrap.exploding { opacity: 0; transition: opacity 0.9s ease 0.5s; }

/* ── Matahari SVG ── */
/* Rotasi ditaruh di wrapper supaya tidak bentrok dgn scale di SVG (dua-duanya transform) */
.sun-spinning-wrap {
  display: inline-flex;
  animation: spinSlow 8s linear infinite;
  will-change: transform;
}
/* Saat mekar, putaran tetap konstan (tidak di-reset) supaya tidak patah —
   rotasi mulus sambil SVG di dalamnya membesar & glow naik. */
.sun-rotate-slow {
  filter: drop-shadow(0 0 18px #e6a02066);
  will-change: transform, filter;
}
.sun-rotate-slow.sun-exploding {
  animation:
    sunGrow 3s cubic-bezier(0.45, 0.02, 0.35, 1) forwards,
    sunGlow 3s ease-in forwards;
}
/* Anticipation: mengecil & meredup sedikit (tarik napas), lalu mekar besar dengan tenang */
@keyframes sunGrow {
  0%   { transform: scale(1);    }
  14%  { transform: scale(0.93); }   /* tarik napas */
  100% { transform: scale(34);   }   /* mekar penuh, ease nyatu tanpa lompatan */
}
@keyframes sunGlow {
  0%   { filter: drop-shadow(0 0 18px #e6a02066); }
  14%  { filter: drop-shadow(0 0 10px #e6a02044); }   /* meredup pas tarik napas */
  45%  { filter: drop-shadow(0 0 60px #ffe9b0cc) drop-shadow(0 0 120px #e6a02099); }
  100% { filter: drop-shadow(0 0 90px #fff8c0) drop-shadow(0 0 200px #e6a020); }
}

/* ── Aksara Surya ── */
.surya-aksara {
  font-family: 'Noto Serif Javanese', serif;
  font-size: 32px; color: #e6a020; letter-spacing: 6px;
  opacity: 0; transform: translateY(8px);
  transition: opacity 1s ease, transform 1s ease;
  filter: drop-shadow(0 0 10px #e6a02088);
}
.surya-aksara.visible { opacity: 1; transform: translateY(0); }
.surya-aksara.hidden  { opacity: 0; transition: opacity 0.3s ease; }

.surya-latin {
  font-family: 'Courier New', monospace;
  font-size: 10px; letter-spacing: 8px; color: #c8a060;
  opacity: 0; transform: translateY(8px);
  transition: opacity 1s ease 0.2s, transform 1s ease 0.2s;
  filter: drop-shadow(0 0 8px #c8860a88);
}
.surya-latin.visible { opacity: 1; transform: translateY(0); }
.surya-latin.hidden  { opacity: 0; transition: opacity 0.3s ease; }

/* ── Wiwara overlay (full screen, covers everything) ── */
.wiwara-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  overflow: hidden;
}

/* ── Ambang atas (lintel) ── */
.wiwara-lintel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  /* Mulai dari atas layar (tersembunyi) */
  transform: translateY(-100%);
  transition: transform 1.8s cubic-bezier(0.76, 0, 0.24, 1);
  z-index: 12;
}
.wiwara-lintel.closed { transform: translateY(0); }
.wiwara-lintel.open   { transform: translateY(-100%); }

/* ── Panel gerbang ── */
.wiwara-panel {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  transition: transform 1.8s cubic-bezier(0.76, 0, 0.24, 1);
  overflow: hidden;
}

/* Panel kiri — mulai off-screen ke kiri */
.wiwara-panel.left {
  left: 0;
  transform: translateX(-100%);
}
/* Panel kiri MENUTUP — masuk ke tengah */
.wiwara-panel.left.closed {
  transform: translateX(0);
}
/* Panel kiri TERBUKA — balik off-screen ke kiri */
.wiwara-panel.left.open {
  transform: translateX(-100%);
  transition: transform 1.8s cubic-bezier(0.76, 0, 0.24, 1);
}

/* Panel kanan — mulai off-screen ke kanan */
.wiwara-panel.right {
  right: 0;
  transform: translateX(100%);
}
/* Panel kanan MENUTUP — masuk ke tengah */
.wiwara-panel.right.closed {
  transform: translateX(0);
}
/* Panel kanan TERBUKA — balik off-screen ke kanan */
.wiwara-panel.right.open {
  transform: translateX(100%);
  transition: transform 1.8s cubic-bezier(0.76, 0, 0.24, 1);
}

.gate-svg {
  width: 100%;
  height: 100%;
  display: block;
  transition: filter 1s ease;
}

/* Blur panel kayu saat gerbang tertutup & ada teks */
.wiwara-panel.left.closed .gate-svg,
.wiwara-panel.right.closed .gate-svg {
  filter: blur(0px);
  transition: filter 1s ease;
}
.wiwara-panel.left.closed.blurred .gate-svg,
.wiwara-panel.right.closed.blurred .gate-svg {
  filter: blur(6px) brightness(0.6);
}
/* Saat open, lepas blur */
.wiwara-panel.left.open .gate-svg,
.wiwara-panel.right.open .gate-svg {
  filter: blur(0px) brightness(1);
  transition: filter 0.6s ease;
}

/* ── Vignette gelap di tengah gerbang ── */
.wiwara-vignette {
  position: absolute;
  inset: 0;
  z-index: 13;
  pointer-events: none;
  background: radial-gradient(ellipse at center,
    rgba(0,0,0,0.82) 0%,
    rgba(0,0,0,0.55) 30%,
    rgba(0,0,0,0.15) 60%,
    transparent 80%
  );
  opacity: 0;
  transition: opacity 1s ease;
}
.wiwara-vignette.visible { opacity: 1; }
.wiwara-vignette.hidden  { opacity: 0; transition: opacity 0.5s ease; }

/* ── Label Wiwara di tengah gerbang ── */
.wiwara-label {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.8s ease;
  white-space: nowrap;
  z-index: 15;
}
.wiwara-label.visible { opacity: 1; }

.wiwara-aksara {
  font-family: 'Noto Serif Javanese', serif;
  font-size: 42px; color: #e6a020; letter-spacing: 6px;
  filter: drop-shadow(0 0 18px #e6a020cc) drop-shadow(0 0 40px #c8860a88);
}
.wiwara-latin {
  font-family: 'Courier New', monospace;
  font-size: 11px; letter-spacing: 9px; color: #d4a04a;
  filter: drop-shadow(0 0 8px #c8860a99);
}
.wiwara-divider {
  display: block;
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c8860a88, transparent);
  margin: 2px auto;
}
.wiwara-arti {
  font-family: 'Courier New', monospace;
  font-size: 10px; letter-spacing: 4px;
  color: #c8a060;
  filter: drop-shadow(0 0 6px #c8860a77);
  font-style: italic;
}

/* ── Lainnya ── */
.vignette {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.75) 35%,rgba(0,0,0,0.3) 65%,transparent 100%);
  pointer-events: none; z-index: 1;
}
.batik-bg { position:absolute;inset:0;width:100%;height:100%;pointer-events:none;transition:opacity 0.4s ease; }
.loading-container {
  display:flex;flex-direction:column;align-items:center;gap:14px;
  z-index:10;position:relative;text-align:center;padding:32px;
}
.title-aksara  { font-size:36px;letter-spacing:10px;font-weight:900;color:#c8860a;font-family:'Noto Serif Javanese',serif; }
.subtitle-top  { font-size:11px;letter-spacing:6px;color:#7a5c2e;margin-top:-4px; }
.scanline-box  { position:relative;border:1px solid #c8860a;padding:8px 24px;margin-top:4px; }
.corner        { position:absolute;width:10px;height:10px; }
.corner.tl { top:-1px;left:-1px;border-top:2px solid #e6a020;border-left:2px solid #e6a020; }
.corner.tr { top:-1px;right:-1px;border-top:2px solid #e6a020;border-right:2px solid #e6a020; }
.corner.bl { bottom:-1px;left:-1px;border-bottom:2px solid #e6a020;border-left:2px solid #e6a020; }
.corner.br { bottom:-1px;right:-1px;border-bottom:2px solid #e6a020;border-right:2px solid #e6a020; }
.loading-text  { font-size:13px;letter-spacing:4px;color:#e6a020; }
.cursor        { color:#e6a020;animation:blink 0.8s step-end infinite; }
.progress-wrap { width:240px;height:2px;background:rgba(200,134,10,0.2); }
.progress-bar  { height:100%;background:linear-gradient(90deg,#7a5c2e,#e6a020);transition:width 0.15s linear; }
.status-text   { font-size:9px;letter-spacing:2px;color:#a07840;min-height:14px; }
.sun-btn       { display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:none;cursor:pointer;padding:8px;animation:pulse 2s ease-in-out infinite;transition:transform 0.2s ease;margin-top:4px; }
.sun-btn:hover { transform:scale(1.12);animation:none; }
.sun-btn:disabled { cursor:default;opacity:0.7; }
.sun-label     { font-size:10px;letter-spacing:5px;color:#e6a020;font-family:'Courier New',monospace; }
.sun-spin      { animation:spinFast 1s linear infinite !important; }
.sun-enter-enter-active { transition:opacity 0.6s ease,transform 0.6s ease; }
.sun-enter-enter-from   { opacity:0;transform:scale(0.4) rotate(-120deg); }
.fade-in       { opacity:0;transform:translateY(-8px);transition:opacity 0.5s ease,transform 0.5s ease; }
.fade-in.visible { opacity:1;transform:translateY(0); }
.delay-1 { transition-delay:0.15s; } .delay-2 { transition-delay:0.3s; }
.delay-3 { transition-delay:0.45s; } .delay-4 { transition-delay:0.6s; }

@keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes spinFast { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes pulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.8} }
</style>