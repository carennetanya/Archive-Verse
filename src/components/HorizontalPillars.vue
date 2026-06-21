<template>
  <!--
    Pinned horizontal scroll: section ini "nempel" di layar, dan scroll vertikal
    diterjemahkan menjadi gerakan horizontal antar panel pilar.
    Plus nav dot di bawah untuk lompat langsung ke pilar tertentu.
  -->
  <section class="hpx" ref="root">
    <div class="hpx-track" ref="track">
      <article
        v-for="(p, i) in pilar"
        :key="p.id"
        :id="p.id"
        class="hpx-panel"
        :class="`tone-${p.id}`"
      >
        <!-- nomor babak -->
        <span class="hpx-index">{{ String(i + 1).padStart(2, '0') }}</span>

        <div class="hpx-panel-inner">
          <span class="hpx-aksara cv-aksara">{{ p.aksara }}</span>
          <h2 class="hpx-nama">{{ p.nama }}</h2>
          <div class="hpx-divider cv-divider">
            <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="2" fill="var(--cv-gold)"/></svg>
          </div>
          <p class="hpx-ket">{{ p.ket }}</p>
          <span class="hpx-soon">konten segera diisi</span>
        </div>

        <!-- ornamen pojok tiap panel -->
        <span class="hpx-corner tl"></span>
        <span class="hpx-corner br"></span>
      </article>
    </div>

    <!-- Nav dot + label -->
    <nav class="hpx-nav">
      <button
        v-for="(p, i) in pilar"
        :key="p.id"
        class="hpx-dot"
        :class="{ active: active === i }"
        @click="goTo(i)"
        :aria-label="`Ke pilar ${p.nama}`"
      >
        <span class="hpx-dot-mark"></span>
        <span class="hpx-dot-label">{{ p.nama }}</span>
      </button>
    </nav>

    <!-- Progress bar tipis -->
    <div class="hpx-progress"><span ref="bar"></span></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { pilar } from '../data/budaya.js'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const root = ref(null)
const track = ref(null)
const bar = ref(null)
const active = ref(0)

let st = null
let tween = null

function goTo(i) {
  // hitung posisi scroll yang setara dengan panel ke-i, lalu animasikan scroll
  if (!st) return
  const total = st.end - st.start
  const target = st.start + (total * i) / (pilar.length - 1)
  gsap.to(window, { scrollTo: target, duration: 0.8, ease: 'power2.inOut' })
}

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const panels = gsap.utils.toArray('.hpx-panel', track.value)

  if (reduce) {
    // fallback: tumpuk vertikal biasa, tanpa pin
    track.value.style.transform = 'none'
    track.value.style.flexDirection = 'column'
    return
  }

  // Geser track horizontal sejauh (n-1) layar
  tween = gsap.to(track.value, {
    x: () => -(track.value.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: root.value,
      pin: true,
      scrub: 1,
      // durasi scroll = selebar konten horizontal, biar terasa pas
      end: () => '+=' + (track.value.scrollWidth - window.innerWidth),
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (bar.value) bar.value.style.width = (self.progress * 100) + '%'
        // tentukan panel aktif dari progress
        active.value = Math.round(self.progress * (pilar.length - 1))
      },
    },
  })
  st = tween.scrollTrigger

  // animasi konten tiap panel saat panel itu mendekati tengah layar
  panels.forEach((panel) => {
    const inner = panel.querySelector('.hpx-panel-inner')
    gsap.from(inner.children, {
      y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: {
        trigger: panel,
        containerAnimation: tween,   // kunci: trigger di dalam horizontal scroll
        start: 'left center',
      },
    })
  })

  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  st?.kill()
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped>
.hpx {
  position: relative;
  overflow: hidden;
  background: var(--cv-bg);
}

.hpx-track {
  display: flex;
  width: max-content;       /* lebar = jumlah panel x 100vw */
  height: 100vh;
  will-change: transform;
}

/* ── Panel pilar ── */
.hpx-panel {
  position: relative;
  width: 100vw;
  height: 100vh;
  flex: 0 0 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-right: 1px solid rgba(200, 134, 10, 0.1);
}

/* tiap pilar punya nuansa warna latar berbeda tapi tetap gelap */
.tone-batik   { background: radial-gradient(ellipse at 30% 40%, #1a0f05 0%, var(--cv-bg) 70%); }
.tone-wayang  { background: radial-gradient(ellipse at 70% 50%, #15100a 0%, var(--cv-bg) 70%); }
.tone-kuliner { background: radial-gradient(ellipse at 40% 60%, #1a0d05 0%, var(--cv-bg) 70%); }
.tone-aksara  { background: radial-gradient(ellipse at 60% 35%, #120c06 0%, var(--cv-bg) 70%); }

.hpx-index {
  position: absolute;
  top: 8vh; left: 8vw;
  font-family: var(--cv-font-display);
  font-size: clamp(60px, 12vw, 160px);
  font-weight: 500;
  color: rgba(200, 134, 10, 0.08);
  line-height: 1;
  user-select: none;
}

.hpx-panel-inner {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center;
  gap: 20px; text-align: center; max-width: 560px; padding: 0 24px;
}
.hpx-aksara {
  font-size: clamp(56px, 9vw, 120px);
  color: var(--cv-gold);
  filter: drop-shadow(0 0 28px rgba(230, 160, 32, 0.4));
  line-height: 1;
}
.hpx-nama {
  margin: 0;
  font-family: var(--cv-font-display);
  font-size: clamp(30px, 4vw, 52px);
  letter-spacing: 6px; text-transform: uppercase;
  color: var(--cv-cream); font-weight: 500;
}
.hpx-ket {
  margin: 0; color: var(--cv-text); font-size: 16px; letter-spacing: 1px;
}
.hpx-soon {
  font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
  color: var(--cv-text-dim);
}

/* ornamen pojok */
.hpx-corner {
  position: absolute; width: 40px; height: 40px;
  border-color: rgba(200, 134, 10, 0.4); border-style: solid;
}
.hpx-corner.tl { top: 6vh; left: 6vw; border-width: 1px 0 0 1px; }
.hpx-corner.br { bottom: 6vh; right: 6vw; border-width: 0 1px 1px 0; }

/* ── Nav dot ── */
.hpx-nav {
  position: absolute; bottom: 36px; left: 50%;
  transform: translateX(-50%);
  display: flex; gap: 28px; z-index: 10;
}
.hpx-dot {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  background: none; border: none; cursor: pointer; padding: 4px;
}
.hpx-dot-mark {
  width: 9px; height: 9px; border-radius: 50%;
  border: 1px solid var(--cv-gold-soft);
  background: transparent; transition: all 0.4s var(--cv-ease);
}
.hpx-dot.active .hpx-dot-mark {
  background: var(--cv-gold);
  box-shadow: 0 0 12px var(--cv-amber);
  transform: scale(1.3);
}
.hpx-dot-label {
  font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--cv-text-dim); transition: color 0.4s;
}
.hpx-dot.active .hpx-dot-label { color: var(--cv-gold); }

/* ── Progress bar ── */
.hpx-progress {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 2px; background: rgba(200, 134, 10, 0.12); z-index: 10;
}
.hpx-progress span {
  display: block; height: 100%; width: 0%;
  background: linear-gradient(90deg, var(--cv-gold-soft), var(--cv-amber));
}

@media (prefers-reduced-motion: reduce) {
  .hpx-track { flex-direction: column; width: 100%; height: auto; transform: none; }
  .hpx-panel { width: 100%; }
  .hpx-nav, .hpx-progress { display: none; }
}
</style>