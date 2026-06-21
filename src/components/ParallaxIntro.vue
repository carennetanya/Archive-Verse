<template>
  <!--
    Section transisi parallax antara Hero dan pilar.
    Beberapa layer bergerak beda kecepatan saat scroll => kesan kedalaman.
    Sekaligus jadi "pengantar" naratif (storytelling + SDG 11).
  -->
  <section class="parallax" ref="root">
    <!-- Layer paling jauh: batik kawung redup, gerak paling lambat -->
    <canvas ref="lBatik" class="px-layer px-batik" data-depth="0.15"></canvas>

    <!-- Layer ornamen melingkar besar, gerak sedang -->
    <div ref="lRing" class="px-layer px-ring" data-depth="0.4">
      <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="var(--cv-gold-soft)" stroke-width="0.6" opacity="0.25">
          <circle cx="300" cy="300" r="280"/>
          <circle cx="300" cy="300" r="230"/>
          <circle cx="300" cy="300" r="180" stroke-dasharray="3 8"/>
        </g>
        <g fill="var(--cv-gold-soft)" opacity="0.3">
          <circle v-for="n in 24" :key="n"
            :cx="300 + 255 * Math.cos((n/24)*6.283)"
            :cy="300 + 255 * Math.sin((n/24)*6.283)" r="2"/>
        </g>
      </svg>
    </div>

    <!-- Bara emas mengambang, gerak cepat (paling dekat) -->
    <div ref="lEmber" class="px-layer px-ember" data-depth="0.85">
      <span v-for="n in 18" :key="n" class="ember"
        :style="emberStyle(n)"></span>
    </div>

    <!-- Konten teks pengantar di tengah -->
    <div class="px-content" ref="content">
      <span class="px-aksara cv-aksara">ꦮꦫꦶꦱ꧀ꦤ꧀</span>
      <h2 class="px-title">Warisan yang Hidup</h2>
      <div class="px-divider cv-divider">
        <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="2" fill="var(--cv-gold)"/></svg>
      </div>
      <p class="px-lead">
        Setiap motif, tokoh, rasa, dan aksara adalah memori kolektif —
        dirawat lintas generasi. Melestarikannya bukan menahan masa lalu,
        melainkan merajutnya ke masa depan.
      </p>
      <p class="px-sdg">
        Sejalan dengan <strong>SDG 11</strong> — menjaga warisan budaya
        sebagai bagian dari kota dan peradaban yang berkelanjutan.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const root = ref(null)
const lBatik = ref(null)
const lRing = ref(null)
const lEmber = ref(null)
const content = ref(null)

// posisi bara acak tapi stabil
const emberSeeds = Array.from({ length: 18 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  s: 2 + Math.random() * 4,
  d: 3 + Math.random() * 4,
  delay: Math.random() * 4,
}))
function emberStyle(n) {
  const e = emberSeeds[n - 1]
  return {
    left: e.x + '%', top: e.y + '%',
    width: e.s + 'px', height: e.s + 'px',
    animationDuration: e.d + 's',
    animationDelay: e.delay + 's',
  }
}

function drawKawung() {
  const c = lBatik.value; if (!c) return
  const ctx = c.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const W = c.clientWidth, H = c.clientHeight
  c.width = W * dpr; c.height = H * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, W, H)
  const unit = 64, eRx = 13, eRy = 26, dotR = 2.8
  ctx.strokeStyle = '#c8860a'; ctx.fillStyle = '#c8860a'; ctx.globalAlpha = 0.05
  const cols = Math.ceil(W / unit) + 2, rows = Math.ceil(H / (unit / 2)) + 2
  for (let r = -1; r < rows; r++) {
    for (let col = -1; col < cols; col++) {
      const cx = col * unit + (r % 2 ? unit / 2 : 0), cy = r * (unit / 2)
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

let triggers = []
onMounted(() => {
  drawKawung()
  window.addEventListener('resize', drawKawung)

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return

  // ── PARALLAX: tiap layer gerak beda kecepatan sesuai data-depth ──
  const layers = [lBatik.value, lRing.value, lEmber.value]
  layers.forEach((el) => {
    const depth = parseFloat(el.dataset.depth)
    // layer jauh (depth kecil) gerak sedikit; layer dekat (depth besar) gerak banyak
    gsap.fromTo(el,
      { yPercent: -depth * 30 },
      {
        yPercent: depth * 30,
        ease: 'none',
        scrollTrigger: {
          trigger: root.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,   // gerak mengikuti scroll, bukan durasi tetap
        },
      }
    )
  })

  // Konten teks: muncul saat section masuk layar
  gsap.from(content.value.children, {
    y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: {
      trigger: content.value,
      start: 'top 75%',
    },
  })

  // ring berputar pelan saat discroll (bonus kedalaman)
  gsap.to(lRing.value.querySelector('svg'), {
    rotate: 40, ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
  })

  triggers = ScrollTrigger.getAll()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', drawKawung)
  triggers.forEach(t => t.kill())
})
</script>

<style scoped>
.parallax {
  position: relative;
  min-height: 120vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 80px 24px;
  background: linear-gradient(180deg, var(--cv-bg) 0%, #120a04 50%, var(--cv-bg) 100%);
}

.px-layer {
  position: absolute;
  inset: -15% 0;             /* lebih tinggi dari section biar ada ruang gerak */
  width: 100%; height: 130%;
  pointer-events: none;
  will-change: transform;
}
.px-batik { z-index: 1; }
.px-ring {
  z-index: 2;
  display: flex; align-items: center; justify-content: center;
}
.px-ring svg {
  width: min(680px, 90vw); height: auto;
  filter: drop-shadow(0 0 30px rgba(200,134,10,0.15));
}
.px-ember { z-index: 3; }

.ember {
  position: absolute;
  border-radius: 50%;
  background: var(--cv-gold);
  box-shadow: 0 0 8px var(--cv-amber), 0 0 16px var(--cv-gold-soft);
  opacity: 0;
  animation-name: emberFloat;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
@keyframes emberFloat {
  0%   { opacity: 0; transform: translateY(20px) scale(0.6); }
  30%  { opacity: 0.9; }
  100% { opacity: 0; transform: translateY(-60px) scale(1); }
}

/* ── Konten ── */
.px-content {
  position: relative; z-index: 4;
  max-width: 620px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
}
.px-aksara {
  font-size: clamp(40px, 6vw, 68px);
  color: var(--cv-gold);
  filter: drop-shadow(0 0 24px rgba(230,160,32,0.4));
}
.px-title {
  margin: 0;
  font-family: var(--cv-font-display);
  font-size: clamp(28px, 4vw, 46px);
  font-weight: 500; letter-spacing: 2px;
  color: var(--cv-cream);
}
.px-lead {
  margin: 0;
  font-size: clamp(15px, 1.4vw, 18px);
  line-height: 2; color: var(--cv-text);
}
.px-sdg {
  margin: 0;
  font-size: 13px; letter-spacing: 0.5px;
  color: var(--cv-text-dim);
  line-height: 1.8;
}
.px-sdg strong { color: var(--cv-gold-soft); font-weight: 600; }
</style>