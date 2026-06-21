<template>
  <section class="hero" ref="root">
    <!-- Batik kawung halus sebagai tekstur latar -->
    <canvas ref="batik" class="hero-batik"></canvas>

    <!-- Cahaya emas dari bawah (warisan vibe bara api intro) -->
    <div class="hero-glow"></div>

    <!-- Navigasi pilar -->
    <nav class="hero-nav" ref="nav">
      <span class="hero-nav-brand cv-aksara">ꦥꦸꦱꦏ</span>
      <ul>
        <li v-for="p in pilar" :key="p.id">
          <a :href="`#${p.id}`">{{ p.nama }}</a>
        </li>
      </ul>
    </nav>

    <!-- Inti hero -->
    <div class="hero-core">
      <p class="hero-eyebrow" ref="eyebrow">{{ meta.tema }}</p>

      <h1 class="hero-title">
        <span class="hero-aksara cv-aksara" ref="aksara">ꦥꦸꦱꦏ​ꦤꦸꦱꦤ꧀ꦠꦫ</span>
        <span class="hero-latin" ref="latin">Pusaka Nusantara</span>
      </h1>

      <div class="hero-divider cv-divider" ref="divider">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="2.5" fill="var(--cv-gold)"/>
          <circle cx="8" cy="8" r="5.5" fill="none" stroke="var(--cv-gold-soft)" stroke-width="0.7" opacity="0.6"/>
        </svg>
      </div>

      <p class="hero-lead" ref="lead">
        Empat pilar warisan budaya Jawa — batik, wayang, kuliner, dan aksara —
        dirajut dalam satu pengalaman. Telusuri makna di balik tradisi,
        dan temukan kenapa ia layak dijaga.
      </p>

      <button class="hero-cta" ref="cta" @click="scrollToFirst">
        <span>Mulai menjelajah</span>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M7 1 V13 M2.5 8.5 L7 13 L11.5 8.5" stroke="currentColor"
            stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Scroll cue -->
    <div class="hero-scrollcue" ref="cue">
      <span>gulir</span>
      <i></i>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { meta, pilar } from '../data/Budaya.js'

const root = ref(null)
const batik = ref(null)
const nav = ref(null)
const eyebrow = ref(null)
const aksara = ref(null)
const latin = ref(null)
const divider = ref(null)
const lead = ref(null)
const cta = ref(null)
const cue = ref(null)

function scrollToFirst() {
  document.getElementById(pilar[0].id)?.scrollIntoView({ behavior: 'smooth' })
}

// ── Batik kawung halus ──
function drawKawung() {
  const c = batik.value; if (!c) return
  const ctx = c.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const W = c.clientWidth, H = c.clientHeight
  c.width = W * dpr; c.height = H * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, W, H)
  const unit = 58, eRx = 12, eRy = 24, dotR = 2.6
  ctx.strokeStyle = '#c8860a'; ctx.fillStyle = '#c8860a'
  ctx.globalAlpha = 0.06
  const cols = Math.ceil(W / unit) + 2, rows = Math.ceil(H / (unit / 2)) + 2
  for (let r = -1; r < rows; r++) {
    for (let col = -1; col < cols; col++) {
      const cx = col * unit + (r % 2 ? unit / 2 : 0)
      const cy = r * (unit / 2)
      ctx.lineWidth = 0.8
      ctx.beginPath(); ctx.ellipse(cx, cy - eRy/2, eRx, eRy/2, 0, 0, 7); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx, cy - eRy/2, dotR, 0, 7); ctx.fill()
      ctx.beginPath(); ctx.ellipse(cx, cy + eRy/2, eRx, eRy/2, 0, 0, 7); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx, cy + eRy/2, dotR, 0, 7); ctx.fill()
      ctx.beginPath(); ctx.ellipse(cx - eRy/2, cy, eRy/2, eRx, 0, 0, 7); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx - eRy/2, cy, dotR, 0, 7); ctx.fill()
      ctx.beginPath(); ctx.ellipse(cx + eRy/2, cy, eRy/2, eRx, 0, 0, 7); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx + eRy/2, cy, dotR, 0, 7); ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

let tl = null
onMounted(() => {
  drawKawung()
  window.addEventListener('resize', drawKawung)

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return

  // Animasi masuk cinematic
  tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(nav.value, { y: -20, opacity: 0, duration: 0.9 })
    .from(eyebrow.value, { y: 16, opacity: 0, duration: 0.8 }, '-=0.4')
    .from(aksara.value, { y: 30, opacity: 0, duration: 1.2 }, '-=0.3')
    .from(latin.value, { y: 20, opacity: 0, duration: 1.0 }, '-=0.7')
    .from(divider.value, { opacity: 0, scaleX: 0, duration: 0.8 }, '-=0.5')
    .from(lead.value, { y: 16, opacity: 0, duration: 1.0 }, '-=0.4')
    .from(cta.value, { y: 14, opacity: 0, duration: 0.8 }, '-=0.5')
    .from(cue.value, { opacity: 0, duration: 0.8 }, '-=0.3')
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', drawKawung)
  tl?.kill()
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0 24px;
  text-align: center;
}

.hero-batik {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}
.hero-glow {
  position: absolute; left: 50%; bottom: -20%;
  width: 120%; height: 70%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center bottom,
    rgba(230,160,32,0.18) 0%,
    rgba(200,134,10,0.08) 35%,
    transparent 70%);
  pointer-events: none;
}

/* ── Nav ── */
.hero-nav {
  position: absolute; top: 0; left: 0; right: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px clamp(24px, 5vw, 64px);
  z-index: 5;
}
.hero-nav-brand {
  font-size: 26px; color: var(--cv-gold);
  filter: drop-shadow(0 0 12px rgba(230,160,32,0.5));
}
.hero-nav ul {
  display: flex; gap: clamp(16px, 3vw, 40px);
  list-style: none; margin: 0; padding: 0;
}
.hero-nav a {
  color: var(--cv-text-dim);
  text-decoration: none;
  font-size: 13px; letter-spacing: 1px;
  transition: color 0.3s;
}
.hero-nav a:hover { color: var(--cv-gold); }

/* ── Core ── */
.hero-core {
  position: relative; z-index: 4;
  max-width: 760px;
  display: flex; flex-direction: column; align-items: center; gap: 24px;
}
.hero-eyebrow {
  margin: 0;
  font-size: 12px; letter-spacing: 6px; text-transform: uppercase;
  color: var(--cv-gold-soft);
}
.hero-title {
  margin: 0; display: flex; flex-direction: column; gap: 10px; align-items: center;
}
.hero-aksara {
  font-size: clamp(40px, 8vw, 86px);
  color: var(--cv-gold);
  line-height: 1.1;
  filter: drop-shadow(0 0 28px rgba(230,160,32,0.4));
}
.hero-latin {
  font-family: var(--cv-font-display);
  font-size: clamp(20px, 3vw, 30px);
  letter-spacing: 10px;
  color: var(--cv-cream);
  font-weight: 500;
  text-transform: uppercase;
}
.hero-lead {
  margin: 0;
  font-size: clamp(15px, 1.4vw, 17px);
  line-height: 1.9;
  color: var(--cv-text);
  max-width: 560px;
}
.hero-cta {
  display: inline-flex; align-items: center; gap: 12px;
  margin-top: 8px;
  padding: 14px 32px;
  background: none;
  border: 1px solid var(--cv-gold-soft);
  border-radius: 2px;
  color: var(--cv-gold);
  font-family: var(--cv-font-body);
  font-size: 13px; letter-spacing: 3px; text-transform: uppercase;
  cursor: pointer;
  transition: background 0.4s, border-color 0.4s, transform 0.3s;
}
.hero-cta:hover {
  background: rgba(230,160,32,0.08);
  border-color: var(--cv-gold);
  transform: translateY(-2px);
}
.hero-cta svg { animation: bob 2s ease-in-out infinite; }
@keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(3px); } }

/* ── Scroll cue ── */
.hero-scrollcue {
  position: absolute; bottom: 28px; left: 50%;
  transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: var(--cv-text-dim);
  font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
  z-index: 4;
}
.hero-scrollcue i {
  width: 1px; height: 40px;
  background: linear-gradient(var(--cv-gold-soft), transparent);
  position: relative; overflow: hidden;
}
.hero-scrollcue i::after {
  content: ''; position: absolute; top: 0; left: 0;
  width: 100%; height: 12px;
  background: var(--cv-gold);
  animation: drip 2s ease-in-out infinite;
}
@keyframes drip {
  0% { transform: translateY(-12px); opacity: 0; }
  40% { opacity: 1; }
  100% { transform: translateY(40px); opacity: 0; }
}

@media (max-width: 640px) {
  .hero-nav ul { display: none; }
}
</style>