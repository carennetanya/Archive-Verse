<template>
  <!--
    Bara api / spark naik dari dasar layar sepanjang lebar, dengan glow oranye
    kuning dan gradient panas di bagian bawah. Canvas dipakai agar ratusan
    partikel tetap smooth. Hormati prefers-reduced-motion (partikel dimatikan).
  -->
  <div class="fire-embers" :class="{ visible }">
    <div class="heat-glow"></div>
    <canvas ref="cv" class="ember-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  visible:   { type: Boolean, default: true },
  density:   { type: Number,  default: 1 },   // pengali jumlah partikel (1 = pekat)
  bandHeight:{ type: Number,  default: 0.55 }, // tinggi area aktif bara (fraksi tinggi layar)
})

const cv = ref(null)
let ctx, raf = null, W = 0, H = 0, dpr = 1
let embers = [], glows = []
let reduceMotion = false
let lastSpawn = 0

const PALETTE = ['#ffd24a', '#ff9a1f', '#ff6a00', '#ffb733', '#ff8c12', '#ffe08a']

function resize() {
  const c = cv.value; if (!c) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  W = c.clientWidth; H = c.clientHeight
  c.width = Math.floor(W * dpr); c.height = Math.floor(H * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

// satu bara (spark kecil yang naik, mengelip, lalu padam)
function spawnEmber() {
  const band = H * props.bandHeight
  const x = Math.random() * W
  const startY = H + 8
  const speed = 0.5 + Math.random() * 2.4        // kecepatan naik
  const sway = (Math.random() - 0.5) * 0.5        // goyang horizontal
  const size = 0.6 + Math.random() * 2.6
  const elongated = Math.random() < 0.35          // sebagian memanjang (streak)
  return {
    x, y: startY,
    vx: sway,
    vy: -speed,
    size,
    elongated,
    len: elongated ? 4 + Math.random() * 14 : 0,
    color: PALETTE[(Math.random() * PALETTE.length) | 0],
    life: 1,
    decay: 0.0016 + Math.random() * 0.004,
    maxRise: band * (0.4 + Math.random() * 0.7),
    risen: 0,
    flicker: Math.random() * Math.PI * 2,
    flickerSpeed: 0.1 + Math.random() * 0.2,
    drag: 0.992 + Math.random() * 0.006,
  }
}

// glow lembut yang sesekali membesar-mengecil di dasar (titik bara besar)
function spawnGlow() {
  return {
    x: Math.random() * W,
    y: H - Math.random() * (H * 0.12),
    r: 12 + Math.random() * 40,
    color: PALETTE[(Math.random() * PALETTE.length) | 0],
    life: 1,
    decay: 0.004 + Math.random() * 0.006,
    maxOpacity: 0.10 + Math.random() * 0.18,
  }
}

function frame(t) {
  raf = requestAnimationFrame(frame)
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)

  // spawn rate tinggi = pekat. Disesuaikan lebar layar & density.
  const targetEmbers = Math.floor((W / 900) * 220 * props.density)
  // tambah beberapa partikel tiap frame sampai mendekati target
  const spawnPerFrame = Math.ceil(4 * props.density)
  if (embers.length < targetEmbers) {
    for (let i = 0; i < spawnPerFrame; i++) embers.push(spawnEmber())
  }
  if (glows.length < Math.floor((W / 900) * 10 * props.density) && Math.random() < 0.2) {
    glows.push(spawnGlow())
  }

  ctx.globalCompositeOperation = 'lighter' // additive = nyala menumpuk seperti api

  // ── glow besar (titik bara) ──
  for (let i = glows.length - 1; i >= 0; i--) {
    const g = glows[i]
    g.life -= g.decay
    if (g.life <= 0) { glows.splice(i, 1); continue }
    const op = Math.sin(g.life * Math.PI) * g.maxOpacity
    const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r)
    grad.addColorStop(0, hexA(g.color, op))
    grad.addColorStop(1, hexA(g.color, 0))
    ctx.fillStyle = grad
    ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.fill()
  }

  // ── bara naik ──
  for (let i = embers.length - 1; i >= 0; i--) {
    const e = embers[i]
    e.x += e.vx
    e.y += e.vy
    e.risen += -e.vy
    e.vy *= e.drag           // melambat saat naik (kehabisan tenaga)
    e.vx += (Math.random() - 0.5) * 0.08
    e.flicker += e.flickerSpeed
    // memudar saat sudah naik tinggi atau life habis
    e.life -= e.decay + (e.risen > e.maxRise ? 0.02 : 0)
    if (e.life <= 0 || e.y < -20) { embers.splice(i, 1); continue }

    const tw = 0.55 + 0.45 * Math.sin(e.flicker) // kelipan
    const alpha = Math.max(0, e.life) * tw
    const s = e.size

    if (e.elongated) {
      // streak: garis pendek mengikuti arah gerak
      const tail = e.len * Math.min(1, Math.abs(e.vy) / 2)
      ctx.strokeStyle = hexA(e.color, alpha)
      ctx.lineWidth = s
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(e.x, e.y)
      ctx.lineTo(e.x - e.vx * 2, e.y + tail)
      ctx.stroke()
    } else {
      // titik bara dengan halo
      ctx.fillStyle = hexA(e.color, alpha)
      ctx.beginPath(); ctx.arc(e.x, e.y, s, 0, Math.PI * 2); ctx.fill()
      // halo lembut
      ctx.fillStyle = hexA(e.color, alpha * 0.25)
      ctx.beginPath(); ctx.arc(e.x, e.y, s * 2.6, 0, Math.PI * 2); ctx.fill()
    }
  }

  ctx.globalCompositeOperation = 'source-over'
}

// helper: hex + alpha -> rgba()
function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`
}

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ctx = cv.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  if (!reduceMotion) raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.fire-embers {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.6s ease;
  overflow: hidden;
}
.fire-embers.visible { opacity: 1; }

/* gradient panas yang naik dari dasar layar */
.heat-glow {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 42%;
  background: linear-gradient(
    to top,
    rgba(255, 110, 0, 0.30) 0%,
    rgba(255, 90, 0, 0.16) 26%,
    rgba(200, 60, 0, 0.07) 52%,
    transparent 100%
  );
  mix-blend-mode: screen;
  filter: blur(2px);
}

.ember-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

@media (prefers-reduced-motion: reduce) {
  .ember-canvas { display: none; }
}
</style>