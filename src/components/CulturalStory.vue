<template>
  <div class="story" ref="root" :class="{ ending }">
    <div class="kelir">
      <div class="kelir-light"></div>
      <div class="kelir-texture"></div>
      <canvas ref="dust" class="kelir-dust"></canvas>

      <!-- Gunungan / Kayon: penanda pertunjukan wayang, siluet di kiri -->
      <svg class="gunungan" :class="{ show: showShadows }" viewBox="0 0 280 460" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="#140d05">
          <path d="M140 8 C144 30 150 44 158 60 C150 64 148 72 152 82 C160 96 168 104 176 120 C166 124 164 132 170 144 C182 164 196 178 206 200 C196 206 196 216 204 228 C216 248 226 264 232 288 C236 304 236 320 230 336 L232 360 C222 352 210 348 196 350 C200 360 200 372 194 382 L210 396 C190 396 172 402 158 414 C150 421 146 430 144 440 L140 452 L136 440 C134 430 130 421 122 414 C108 402 90 396 70 396 L86 382 C80 372 80 360 84 350 C70 348 58 352 48 360 L50 336 C44 320 44 304 48 288 C54 264 64 248 76 228 C84 216 84 206 74 200 C84 178 98 164 110 144 C116 132 114 124 104 120 C112 104 120 96 128 82 C132 72 130 64 122 60 C130 44 136 30 140 8 Z"/>
        </g>
        <g fill="#3a2410" opacity="0.55">
          <circle cx="140" cy="120" r="10"/>
          <path d="M140 150 C150 160 150 178 140 190 C130 178 130 160 140 150 Z"/>
          <circle cx="120" cy="230" r="6"/><circle cx="160" cy="230" r="6"/>
          <path d="M140 250 C152 262 152 284 140 298 C128 284 128 262 140 250 Z"/>
          <circle cx="110" cy="320" r="5"/><circle cx="170" cy="320" r="5"/>
        </g>
      </svg>

      <!-- Rumput / tetumbuhan siluet di dasar kelir -->
      <div class="kelir-grass"></div>
    </div>

    <!-- Bingkai panggung (gawangan) berukir emas di atas -->
    <div class="stage-frame">
      <svg viewBox="0 0 1200 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="1200" height="70" fill="#0a0603"/>
        <g fill="none" stroke="#c8860a" stroke-width="1.2" opacity="0.5">
          <path d="M0 58 H1200 M0 12 H1200"/>
          <path d="M30 35 q14 -16 28 0 q14 16 28 0" />
          <path d="M1142 35 q-14 -16 -28 0 q-14 16 -28 0" />
        </g>
        <g fill="#c8860a" opacity="0.35">
          <circle cx="600" cy="35" r="5"/>
          <path d="M560 35 q40 -22 80 0 q-40 22 -80 0Z"/>
        </g>
      </svg>
      <!-- jumbai kain merah tergantung -->
      <div class="stage-fringe"></div>
    </div>

    <div class="shadow-stage" :class="{ show: showShadows, 'text-phase': textPhase }">
      <div class="shadow-figure center">
        <WayangKulit side="center" :width="shadowW" :entered="showShadows" :playing="playing" />
      </div>
    </div>

    <div class="story-stage">
      <p class="story-aksara cv-aksara" ref="aksaraEl"></p>
      <h2 class="story-line" ref="lineEl"></h2>
      <p class="story-sub" ref="subEl"></p>
    </div>

    <button class="story-skip" @click="finish">Lewati &#9205;</button>
    <button class="story-sound" @click="toggleSound" :aria-label="muted ? 'Nyalakan suara' : 'Matikan suara'">
      <svg v-if="!muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
        <path d="M11 5 6 9H2v6h4l5 4V5z" stroke-linejoin="round"/>
        <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" stroke-linecap="round"/>
      </svg>
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
        <path d="M11 5 6 9H2v6h4l5 4V5z" stroke-linejoin="round"/>
        <path d="M22 9l-6 6M16 9l6 6" stroke-linecap="round"/>
      </svg>
    </button>

    <div class="story-progress">
      <span v-for="(b, i) in babak" :key="i" :class="{ on: i <= current }"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import WayangKulit from './WayangKulit.vue'

const emit = defineEmits(['done'])

const root = ref(null)
const dust = ref(null)
const aksaraEl = ref(null)
const lineEl = ref(null)
const subEl = ref(null)

const current = ref(0)
const ending = ref(false)
const muted = ref(false)
const showShadows = ref(false)
const playing = ref(false)
const textPhase = ref(false)
const shadowW = ref(360)

const babak = [
  { aksara: 'ꦠꦤꦃꦗꦮ', line: 'Di tanah Jawa, waktu tak pernah benar-benar berlalu.', sub: 'Ia mengendap dalam motif, suara, rasa, dan aksara.' },
  { aksara: 'ꦏꦺꦭꦶꦂ', line: 'Di balik kelir, bayang-bayang mulai menari.', sub: 'Tangan dalang menuntun kisah yang berusia ratusan tahun.' },
  { aksara: 'ꦮꦪꦁ', line: 'Setiap gerak menuturkan tentang menjadi manusia.', sub: 'Tentang kebaikan, keberanian, dan jalan pulang ke diri.' },
  { aksara: 'ꦮꦫꦶꦱ꧀', line: 'Kini, warisan itu menunggu untuk dijaga.', sub: 'Bukan untuk dikenang &mdash; melainkan untuk diteruskan.' },
]

let ctx, W, H, rafId, motes = []
function setupDust() {
  const c = dust.value; if (!c) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  W = c.clientWidth; H = c.clientHeight
  c.width = W * dpr; c.height = H * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}
function initDust() {
  motes = Array.from({ length: 60 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: 0.4 + Math.random() * 1.6,
    vx: (Math.random() - 0.5) * 0.3, vy: -(0.1 + Math.random() * 0.4),
    a: 0.1 + Math.random() * 0.4, ph: Math.random() * 6.28,
  }))
}
function renderDust() {
  rafId = requestAnimationFrame(renderDust)
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  ctx.globalCompositeOperation = 'lighter'
  for (const m of motes) {
    m.x += m.vx; m.y += m.vy; m.ph += 0.02
    if (m.y < -5) { m.y = H + 5; m.x = Math.random() * W }
    const tw = 0.6 + 0.4 * Math.sin(m.ph)
    ctx.fillStyle = `rgba(255,210,120,${m.a * tw})`
    ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 7); ctx.fill()
  }
  ctx.globalCompositeOperation = 'source-over'
}

let audio = null
function toggleSound() {
  muted.value = !muted.value
  if (audio) audio.muted = muted.value
}

let tl = null
const DUR = 4.8
function playBabak(i) {
  const b = babak[i]
  const t = gsap.timeline({ onStart: () => { current.value = i } })
  const els = [aksaraEl.value, lineEl.value, subEl.value]
  t.call(() => {
    aksaraEl.value.textContent = b.aksara
    lineEl.value.innerHTML = b.line
    subEl.value.innerHTML = b.sub
  })
   .set(els, { opacity: 0, y: 24 })
   .to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.25, ease: 'power3.out' })
   .to(els, { opacity: 0, y: -18, duration: 0.9, stagger: 0.12, ease: 'power2.in' }, `+=${DUR - 2.2}`)
  return t
}
function buildStory() {
  tl = gsap.timeline({ onComplete: finish })
  babak.forEach((_, i) => { tl.add(playBabak(i)) })
}
function finish() {
  if (ending.value) return
  ending.value = true
  tl?.kill()
  if (audio) gsap.to(audio, { volume: 0, duration: 1.2, onComplete: () => audio?.pause() })
  gsap.to(root.value, { opacity: 0, duration: 1.2, ease: 'power2.inOut', onComplete: () => emit('done') })
}

onMounted(() => {
  ctx = dust.value.getContext('2d')
  setupDust(); initDust(); renderDust()
  window.addEventListener('resize', setupDust)
  // wayang tengah dibuat lebih besar (jadi fokus)
  shadowW.value = Math.max(320, Math.min(560, window.innerWidth * 0.34))

  // musik gamelan (file: /public/audio/gamelan.mp3)
  try {
    audio = new Audio('/audio/gamelan.mp3')
    audio.loop = true; audio.volume = 0
    audio.play().then(() => gsap.to(audio, { volume: 0.5, duration: 2 })).catch(() => {})
  } catch (e) {}

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) { showShadows.value = true; finish(); return }

  // ── URUTAN PEMBUKA ──
  // 0.6s  — wayang muncul di tengah (fade-in)
  gsap.delayedCall(0.6, () => { showShadows.value = true })
  // 1.4s  — dalang mulai "memainkan" wayang: tangan naik-turun ekspresif
  gsap.delayedCall(1.4, () => { playing.value = true })
  // 4.8s  — setelah dimainkan beberapa detik, gerakan kembali tenang lalu teks muncul
  gsap.delayedCall(4.8, () => { playing.value = false })
  // 5.0s  — wayang bergeser naik memberi ruang untuk teks
  gsap.delayedCall(5.0, () => { textPhase.value = true })
  // 5.2s  — barulah cerita teks dimulai
  gsap.delayedCall(5.2, () => { buildStory() })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', setupDust)
  tl?.kill()
  audio?.pause()
})
</script>

<style scoped>
.story {
  position: fixed; inset: 0; z-index: 9999;
  background: #0a0603;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.kelir { position: absolute; inset: 0; overflow: hidden; }
.kelir-light {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 60% 52% at 52% 40%,
      rgba(255, 214, 130, 0.98) 0%,
      rgba(248, 168, 60, 0.85) 18%,
      rgba(214, 104, 28, 0.7) 38%,
      rgba(150, 56, 14, 0.6) 58%,
      rgba(70, 24, 8, 0.7) 80%,
      #160803 100%);
  animation: kelirBreath 7s ease-in-out infinite;
}
@keyframes kelirBreath {
  0%, 100% { filter: brightness(1); }
  50%      { filter: brightness(1.1); }
}
.kelir-texture {
  position: absolute; inset: 0; opacity: 0.55; mix-blend-mode: multiply;
  background-image:
    repeating-linear-gradient(90deg, rgba(40,18,6,0.14) 0 1px, transparent 1px 3px),
    repeating-linear-gradient(0deg, rgba(40,18,6,0.1) 0 1px, transparent 1px 4px);
}
.kelir-dust { position: absolute; inset: 0; width: 100%; height: 100%; }

/* Gunungan / kayon siluet di kiri */
.gunungan {
  position: absolute;
  left: clamp(12px, 6vw, 90px);
  bottom: 8%;
  height: 64%; width: auto;
  z-index: 2;
  filter: drop-shadow(0 6px 18px rgba(0,0,0,0.5));
  opacity: 0;
  transform: translateY(18px) scale(0.96);
  transition: opacity 1.6s ease, transform 1.8s var(--cv-ease, ease);
}
.gunungan.show { opacity: 1; transform: translateY(0) scale(1); }

/* Rumput/tetumbuhan siluet di dasar */
.kelir-grass {
  position: absolute; left: 0; right: 0; bottom: 0;
  height: 16%; z-index: 2; pointer-events: none;
  background:
    radial-gradient(ellipse 30px 60px at 6% 100%, #140d05 60%, transparent 62%),
    radial-gradient(ellipse 24px 48px at 12% 100%, #140d05 60%, transparent 62%),
    radial-gradient(ellipse 36px 70px at 90% 100%, #140d05 60%, transparent 62%),
    radial-gradient(ellipse 26px 52px at 96% 100%, #140d05 60%, transparent 62%),
    linear-gradient(to top, #160803 0%, transparent 100%);
}

/* Bingkai panggung (gawangan) di atas */
.stage-frame {
  position: absolute; top: 0; left: 0; right: 0;
  z-index: 6; height: 70px; pointer-events: none;
}
.stage-frame svg { display: block; width: 100%; height: 70px; }
.stage-fringe {
  height: 18px;
  background: repeating-linear-gradient(90deg, #5a1208 0 8px, #7a1c0a 8px 16px);
  -webkit-mask-image: repeating-linear-gradient(90deg, #000 0 6px, transparent 6px 16px);
  mask-image: repeating-linear-gradient(90deg, #000 0 6px, transparent 6px 16px);
  opacity: 0.85;
}

.shadow-stage {
  position: absolute; inset: 0; z-index: 2;
  opacity: 0; transition: opacity 1.6s ease, transform 1.6s var(--cv-ease, ease);
}
.shadow-stage.show { opacity: 1; }
/* saat fase teks: wayang naik & sedikit mengecil supaya teks punya ruang di tengah */
.shadow-stage.text-phase {
  transform: translateY(-40%) scale(0.6);
  opacity: 0.9;
}
.shadow-figure {
  position: absolute; inset: 0;
  filter: brightness(0) drop-shadow(0 0 2px rgba(0,0,0,0.6));
}
.shadow-figure.center { z-index: 2; }
.shadow-figure :deep(.wayang) { filter: blur(0.4px); }

.story-stage {
  position: relative; z-index: 4;
  max-width: 760px; padding: 48px 56px; text-align: center;
  margin-top: 16vh;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  /* halo gelap lembut di belakang teks agar teks gelap tetap kontras
     di atas cahaya kelir yang terang */
  background: radial-gradient(ellipse 80% 90% at 50% 50%,
    rgba(255, 226, 160, 0.55) 0%,
    rgba(255, 216, 140, 0.3) 45%,
    transparent 75%);
  border-radius: 50%;
}
.story-aksara {
  margin: 0; font-size: clamp(34px, 5.5vw, 60px);
  color: #1a0f04;
  filter: drop-shadow(0 1px 8px rgba(255,230,170,0.6));
}
.story-line {
  margin: 0;
  font-family: var(--cv-font-display);
  font-size: clamp(24px, 3.6vw, 42px);
  font-weight: 700; line-height: 1.4;
  color: #140b03;
  text-shadow: 0 1px 18px rgba(255,226,160,0.7);
}
.story-sub {
  margin: 0;
  font-size: clamp(14px, 1.6vw, 18px);
  line-height: 1.8; letter-spacing: 0.5px;
  color: #2e1d0a; font-style: italic;
  text-shadow: 0 1px 12px rgba(255,226,160,0.6);
}
.story-skip {
  position: absolute; bottom: 32px; right: 32px; z-index: 5;
  background: rgba(0,0,0,0.25); border: 1px solid rgba(40,24,8,0.4);
  color: #2a1a08; padding: 9px 20px; border-radius: 2px;
  font-size: 12px; letter-spacing: 2px; cursor: pointer; transition: background 0.3s;
}
.story-skip:hover { background: rgba(0,0,0,0.4); }
.story-sound {
  position: absolute; bottom: 32px; left: 32px; z-index: 5;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(0,0,0,0.25); border: 1px solid rgba(40,24,8,0.4);
  color: #2a1a08; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.story-progress {
  position: absolute; top: 32px; left: 50%; transform: translateX(-50%);
  z-index: 5; display: flex; gap: 10px;
}
.story-progress span { width: 28px; height: 2px; background: rgba(40,24,8,0.3); transition: background 0.5s; }
.story-progress span.on { background: #2a1a08; }

@media (max-width: 640px) {
  .story-skip, .story-sound { bottom: 20px; }
  .story-skip { right: 20px; }
  .story-sound { left: 20px; }
}
</style>