<template>
  <div class="grand-entrance" ref="container" @mousemove="onMouseMove">

    <!-- Background batik kawung paralaks layer jauh -->
    <canvas ref="batikFar" class="batik-layer far"
      :style="{ transform: `translate(${px * 0.012}px, ${py * 0.012}px)` }"></canvas>

    <!-- Background batik kawung paralaks layer dekat -->
    <canvas ref="batikNear" class="batik-layer near"
      :style="{ transform: `translate(${px * 0.028}px, ${py * 0.028}px)` }"></canvas>

    <!-- Vignette -->
    <div class="ge-vignette"></div>

    <!-- Bara api naik dari dasar layar -->
    <FireEmbers class="ge-fire" :visible="showFire" />

    <!-- Wayang kulit mengapit kiri & kanan, ikut paralaks halus -->
    <div class="ge-wayang-wrap"
      :style="{ transform: `translate(${px * 0.02}px, ${py * 0.02}px)` }">
      <WayangKulit side="left"  :width="wayangW" :entered="showWayang" />
      <WayangKulit side="right" :width="wayangW" :entered="showWayang" />
    </div>

    <!-- Topeng Wayang melayang dengan paralaks -->
    <div class="mask-wrap"
      :class="{ visible: showMask }"
      :style="{ transform: `translate(calc(-50% + ${px * 0.045}px), calc(-50% + ${py * 0.045}px))` }">

      <!-- Glow pulsing di belakang topeng -->
      <div class="mask-glow"></div>

      <div class="wayang-float">
        <img class="wayang-mask" src="/wayang-mask.png" alt="Topeng Wayang Pusaka Nusantara" />

        <!-- Mata hidup: nempel persis di lubang mata topeng, iris ngikutin cursor -->
        <svg class="wayang-eyes" :class="{ awake: eyesAwake }" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="irisGrad" cx="38%" cy="32%" r="75%">
              <stop offset="0%"  stop-color="#f3c878"/>
              <stop offset="55%" stop-color="#c8860a"/>
              <stop offset="100%" stop-color="#4a2e06"/>
            </radialGradient>
            <clipPath id="clipEyeL">
              <path d="M32.0,67.5 Q39.5,62.3 46.0,68.6 Q39.5,73.1 32.0,67.5 Z"/>
            </clipPath>
            <clipPath id="clipEyeR">
              <path d="M54.0,68.6 Q60.5,62.3 68.0,67.5 Q60.5,73.1 54.0,68.6 Z"/>
            </clipPath>
          </defs>

          <!-- Mata kiri -->
          <g clip-path="url(#clipEyeL)" class="eye-l">
            <circle class="iris" :cx="39.5 + eyeOffsetX" :cy="67.5 + eyeOffsetY" r="3.3" fill="url(#irisGrad)"/>
            <circle class="pupil" :cx="39.5 + eyeOffsetX" :cy="67.5 + eyeOffsetY" r="1.4" fill="#160c02"/>
            <circle class="glint" :cx="38.3 + eyeOffsetX" :cy="66.2 + eyeOffsetY" r="0.55" fill="#fff8e8" opacity="0.9"/>
          </g>

          <!-- Mata kanan -->
          <g clip-path="url(#clipEyeR)" class="eye-r">
            <circle class="iris" :cx="60.5 + eyeOffsetX" :cy="67.5 + eyeOffsetY" r="3.3" fill="url(#irisGrad)"/>
            <circle class="pupil" :cx="60.5 + eyeOffsetX" :cy="67.5 + eyeOffsetY" r="1.4" fill="#160c02"/>
            <circle class="glint" :cx="59.3 + eyeOffsetX" :cy="66.2 + eyeOffsetY" r="0.55" fill="#fff8e8" opacity="0.9"/>
          </g>
        </svg>
      </div>
    </div>

    <!-- Konten teks -->
    <div class="ge-content">

      <!-- Nama produk -->
      <div class="ge-brand" :class="{ visible: showBrand }">
        <span class="ge-brand-aksara">ꦥꦸꦱꦏ</span>
        <span class="ge-brand-latin">P U S A K A &nbsp; N U S A N T A R A</span>
      </div>

      <!-- Garis dekoratif -->
      <div class="ge-divider" :class="{ visible: showQuote }">
        <span class="ge-divider-line"></span>
        <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="3" fill="#c8860a"/><circle cx="9" cy="9" r="6" fill="none" stroke="#c8860a" stroke-width="0.8" opacity="0.5"/></svg>
        <span class="ge-divider-line"></span>
      </div>

      <!-- Quote filosofis -->
      <p class="ge-quote" :class="{ visible: showQuote }">
        "Selamat datang di Pusaka Nusantara.<br>
        Temukan jejak tradisi yang merajut masa depan."
      </p>

      <!-- Tombol masuk -->
      <button class="ge-enter-btn" :class="{ visible: showBtn }" @click="$emit('done')">
        <span class="ge-btn-text">M A S U K I</span>
        <svg width="20" height="10" viewBox="0 0 20 10">
          <path d="M0,5 L16,5 M12,1 L16,5 L12,9" stroke="#e6a020" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import WayangKulit from './WayangKulit.vue'
import FireEmbers from './FireEmbers.vue'

defineEmits(['done'])

const container = ref(null)
const batikFar  = ref(null)
const batikNear = ref(null)

const px = ref(0)
const py = ref(0)

const showMask  = ref(false)
const showWayang = ref(false)
const showFire = ref(false)
const wayangW = ref(300)

function updateWayangW() {
  // skala lebar wayang terhadap lebar layar, dibatasi biar gak kegedean/kekecilan
  wayangW.value = Math.max(180, Math.min(340, window.innerWidth * 0.22))
}
const showBrand = ref(false)
const showQuote = ref(false)
const showBtn   = ref(false)
const eyesAwake = ref(false)

// ── Mata ngikutin cursor (radius gerak terbatas, satuan viewBox 0-100) ──
const eyeOffsetX = ref(0)
const eyeOffsetY = ref(0)
const EYE_RANGE  = 1.6 // batas maksimal pergeseran iris dari titik tengah lubang mata

// ── Smooth parallax mouse ──
let targetX = 0, targetY = 0
let currentX = 0, currentY = 0
let rafId = null

function onMouseMove(e) {
  const rect = container.value?.getBoundingClientRect()
  if (!rect) return
  targetX = (e.clientX - rect.left - rect.width  / 2)
  targetY = (e.clientY - rect.top  - rect.height / 2)
}

function lerpParallax() {
  currentX += (targetX - currentX) * 0.06
  currentY += (targetY - currentY) * 0.06
  px.value = currentX
  py.value = currentY

  // Iris ngikutin arah cursor relatif ke tengah topeng, radius dibatasi
  const dist = Math.hypot(currentX, currentY) || 1
  const norm = Math.min(dist, 220) / 220 // 0..1, jenuh di 220px gerakan mouse
  eyeOffsetX.value = (currentX / dist) * norm * EYE_RANGE
  eyeOffsetY.value = (currentY / dist) * norm * EYE_RANGE * 0.7 // gerak vertikal dikit lebih kecil, mata sipit

  rafId = requestAnimationFrame(lerpParallax)
}

// ── Kawung canvas ──
function drawKawung(canvas, alpha, unit) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.offsetWidth  || window.innerWidth
  const H = canvas.offsetHeight || window.innerHeight
  canvas.width = W + 120; canvas.height = H + 120
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const eRx = unit * 0.21, eRy = unit * 0.42, dotR = unit * 0.048
  ctx.strokeStyle = '#c8860a'
  ctx.fillStyle   = '#c8860a'
  ctx.globalAlpha = alpha
  const cols = Math.ceil(canvas.width  / unit) + 2
  const rows = Math.ceil(canvas.height / (unit / 2)) + 2
  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const cx = c * unit + (r % 2 !== 0 ? unit / 2 : 0)
      const cy = r * (unit / 2)
      ctx.lineWidth = 0.7
      ctx.beginPath(); ctx.ellipse(cx, cy - eRy/2, eRx, eRy/2, 0, 0, Math.PI*2); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx, cy - eRy/2, dotR, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(cx, cy + eRy/2, eRx, eRy/2, 0, 0, Math.PI*2); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx, cy + eRy/2, dotR, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(cx - eRy/2, cy, eRy/2, eRx, 0, 0, Math.PI*2); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx - eRy/2, cy, dotR, 0, Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(cx + eRy/2, cy, eRy/2, eRx, 0, 0, Math.PI*2); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx + eRy/2, cy, dotR, 0, Math.PI*2); ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

function drawAll() {
  drawKawung(batikFar.value,  0.07, 72)
  drawKawung(batikNear.value, 0.04, 44)
}

onMounted(() => {
  drawAll()
  updateWayangW()
  window.addEventListener('resize', drawAll)
  window.addEventListener('resize', updateWayangW)
  lerpParallax()

  // Staggered reveal
  setTimeout(() => { showMask.value  = true }, 300)
  setTimeout(() => { showFire.value = true }, 400)
  setTimeout(() => { showWayang.value = true }, 600)
  setTimeout(() => { eyesAwake.value = true }, 1300)
  setTimeout(() => { showBrand.value = true }, 800)
  setTimeout(() => { showQuote.value = true }, 1400)
  setTimeout(() => { showBtn.value   = true }, 2200)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', drawAll)
  window.removeEventListener('resize', updateWayangW)
})
</script>

<style scoped>
/* ── Bara api: di atas batik & vignette, di belakang wayang & teks ── */
.ge-fire {
  z-index: 3;
}

/* ── Wayang kulit pengapit ── */
.ge-wayang-wrap {
  position: absolute;
  inset: 0;
  z-index: 4;            /* di atas bara, di bawah topeng & teks */
  pointer-events: none;
  will-change: transform;
  transition: transform 0.08s linear;
}
/* di layar sempit, sembunyikan biar gak menutupi konten */
@media (max-width: 720px) {
  .ge-wayang-wrap { display: none; }
}

/* ── Base ── */
.grand-entrance {
  position: fixed; inset: 0;
  background: #0d0804;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  z-index: 200;
  cursor: default;
}

/* ── Batik paralaks ── */
.batik-layer {
  position: absolute;
  top: -60px; left: -60px;
  width: calc(100% + 120px);
  height: calc(100% + 120px);
  pointer-events: none;
  will-change: transform;
  transition: transform 0.05s linear;
}

/* ── Vignette ── */
.ge-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center,
    transparent 20%,
    rgba(0,0,0,0.5) 55%,
    rgba(0,0,0,0.88) 100%
  );
  pointer-events: none; z-index: 2;
}

/* ── Topeng Wayang ── */
.mask-wrap {
  position: absolute;
  top: 50%; left: 50%;
  width: min(260px, 38vw);
  opacity: 0;
  filter: drop-shadow(0 0 32px #c8860a55) drop-shadow(0 0 80px #7a3c0033);
  transition: opacity 2s ease, transform 0.08s linear;
  will-change: transform, opacity;
  z-index: 3;
  pointer-events: none;
}
.mask-wrap.visible { opacity: 1; }

/* ── Glow pulsing di belakang topeng ── */
.mask-glow {
  position: absolute;
  left: 50%; top: 50%;
  width: 175%; height: 175%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center,
    #e6a02055 0%,
    #c8860a33 35%,
    #c8860a14 55%,
    transparent 75%
  );
  filter: blur(6px);
  animation: glowPulse 4.5s ease-in-out infinite;
  z-index: -1;
  pointer-events: none;
}
@keyframes glowPulse {
  0%, 100% { opacity: 0.65; transform: translate(-50%, -50%) scale(0.94); }
  50%      { opacity: 1;    transform: translate(-50%, -50%) scale(1.04); }
}

/* ── Sparkle di sekeliling topeng (dihapus) ── */

.wayang-float {
  position: relative;
  width: 100%;
  animation: floatMask 6s ease-in-out infinite;
}
@keyframes floatMask {
  0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
  50%       { transform: translateY(-14px) rotate(0.5deg); }
}

.wayang-mask {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.6));
}

/* ── Mata hidup ── */
.wayang-eyes {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: scaleY(0.15);
  transform-origin: 50% 67.5%;
  transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.wayang-eyes.awake {
  opacity: 1;
  transform: scaleY(1);
}
.wayang-eyes .iris,
.wayang-eyes .pupil,
.wayang-eyes .glint {
  transition: cx 0.18s ease-out, cy 0.18s ease-out;
}
.wayang-eyes .glint {
  transition: cx 0.12s ease-out, cy 0.12s ease-out;
}

/* ── Konten teks ── */
.ge-content {
  position: relative; z-index: 10;
  display: flex; flex-direction: column;
  align-items: center; gap: 18px;
  text-align: center;
  padding: 32px;
  margin-top: 52vh; /* geser ke bawah biar ga nutup topeng */
}

/* ── Brand ── */
.ge-brand {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  opacity: 0; transform: translateY(16px);
  transition: opacity 1.2s ease, transform 1.2s ease;
}
.ge-brand.visible { opacity: 1; transform: translateY(0); }

.ge-brand-aksara {
  font-family: 'Noto Serif Javanese', serif;
  font-size: 28px; letter-spacing: 8px; color: #e6a020;
  filter: drop-shadow(0 0 14px #e6a020aa);
}
.ge-brand-latin {
  font-family: 'Courier New', monospace;
  font-size: 9px; letter-spacing: 7px; color: #d4a04a;
  filter: drop-shadow(0 0 6px #c8860a55);
}

/* ── Divider ── */
.ge-divider {
  display: flex; align-items: center; gap: 10px;
  opacity: 0; transition: opacity 1s ease 0.3s;
}
.ge-divider.visible { opacity: 1; }
.ge-divider-line {
  display: block; width: 60px; height: 1px;
  background: linear-gradient(90deg, transparent, #c8860a66, transparent);
}

/* ── Quote ── */
.ge-quote {
  font-family: 'Courier New', monospace;
  font-size: 11px; line-height: 2.1;
  letter-spacing: 1.5px; color: #a07840;
  max-width: 420px;
  opacity: 0; transform: translateY(12px);
  transition: opacity 1.4s ease, transform 1.4s ease;
  margin: 0;
}
.ge-quote.visible { opacity: 1; transform: translateY(0); }

/* ── Tombol masuk ── */
.ge-enter-btn {
  display: flex; align-items: center; gap: 10px;
  background: none; border: 1px solid #c8860a55;
  padding: 10px 28px; cursor: pointer;
  opacity: 0; transform: translateY(10px);
  transition: opacity 1s ease, transform 1s ease,
              border-color 0.3s, background 0.3s;
  position: relative;
}
.ge-enter-btn::before,
.ge-enter-btn::after {
  content: '';
  position: absolute;
  width: 8px; height: 8px;
  border-color: #e6a020;
  border-style: solid;
  transition: all 0.3s ease;
}
.ge-enter-btn::before { top: -1px; left: -1px; border-width: 1.5px 0 0 1.5px; }
.ge-enter-btn::after  { bottom: -1px; right: -1px; border-width: 0 1.5px 1.5px 0; }
.ge-enter-btn.visible { opacity: 1; transform: translateY(0); }
.ge-enter-btn:hover {
  border-color: #c8860a99;
  background: rgba(200, 134, 10, 0.06);
}
.ge-enter-btn:hover::before { top: -3px; left: -3px; }
.ge-enter-btn:hover::after  { bottom: -3px; right: -3px; }

.ge-btn-text {
  font-family: 'Courier New', monospace;
  font-size: 10px; letter-spacing: 6px; color: #e6a020;
}
</style>