<template>
  <!--
    Wayang Kulit hidup — sosok tersusun dari 10 part PNG yang berbagi satu
    sistem koordinat (canvas asli 2048x2048). Tiap part = layer absolut penuh
    canvas, dianimasi independen pada titik sendi (transform-origin) masing2.
    Prop `side` = 'left' | 'right'. Sisi kanan otomatis di-mirror agar
    menghadap ke tengah layar (ke arah topeng).
  -->
  <div class="wayang" :class="[`side-${side}`, { entered }]" :style="rootStyle">
    <div class="wayang-stage">
      <!-- urutan z dari belakang ke depan -->

      <!-- Stick = tongkat dipegang, layer mandiri, tetap tegak (goyang amat halus) -->
      <img class="part stickR" src="/wayang-kulit/stickR.png" alt="" draggable="false"/>

      <!-- LENGAN KANAN (grup ayun di bahu): tangan bawah ikut lengan atas -->
      <div class="arm armR">
        <img class="part hand1R" src="/wayang-kulit/hand1R.png" alt="" draggable="false"/>
        <div class="forearm forearmR">
          <img class="part handR" src="/wayang-kulit/handR.png" alt="" draggable="false"/>
        </div>
      </div>

      <img class="part legR" src="/wayang-kulit/legR.png" alt="" draggable="false"/>
      <img class="part body" src="/wayang-kulit/body.png" alt="" draggable="false"/>
      <img class="part legL" src="/wayang-kulit/legL.png" alt="" draggable="false"/>

      <img class="part stickL" src="/wayang-kulit/stickL.png" alt="" draggable="false"/>

      <!-- LENGAN KIRI (grup ayun di bahu) -->
      <div class="arm armL">
        <img class="part hand1L" src="/wayang-kulit/hand1L.png" alt="" draggable="false"/>
        <div class="forearm forearmL">
          <img class="part handL" src="/wayang-kulit/handL.png" alt="" draggable="false"/>
        </div>
      </div>

      <img class="part head" src="/wayang-kulit/head.png" alt="" draggable="false"/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  side:  { type: String, default: 'left' },      // 'left' | 'right'
  width: { type: Number, default: 300 },          // lebar tampil (px)
  // pergeseran posisi (px) terhadap titik tempel default di tepi bawah
  offsetX: { type: Number, default: 0 },
  offsetY: { type: Number, default: 0 },
  entered: { type: Boolean, default: true },      // true = sudah masuk layar
})

const rootStyle = computed(() => ({
  '--w': props.width + 'px',
  '--ox': props.offsetX + 'px',
  '--oy': props.offsetY + 'px',
}))
</script>

<style scoped>
/* ─── Wadah & posisi di tepi layar ─────────────────────────────────────── */
.wayang {
  position: absolute;
  bottom: 0;
  width: var(--w);
  /* canvas 2048x2048 => aspect 1:1 */
  aspect-ratio: 1 / 1;
  pointer-events: none;
  z-index: 5;
  filter: drop-shadow(0 12px 40px rgba(0,0,0,0.55));
  transition: transform 1.6s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 1.6s ease;
  will-change: transform, opacity;
}
.wayang.side-left  { left:  0; transform: translate(calc(-28% + var(--ox)), calc(6% + var(--oy))); }
.wayang.side-right { right: 0; transform: translate(calc(28%  + var(--ox)), calc(6% + var(--oy))) scaleX(-1); }

/* keadaan belum masuk: meluncur keluar dari tepi + transparan */
.wayang:not(.entered).side-left  { transform: translate(-120%, 8%); opacity: 0; }
.wayang:not(.entered).side-right { transform: translate(120%, 8%) scaleX(-1); opacity: 0; }

/* ayun halus seluruh badan (gantungan wayang) */
.wayang-stage {
  position: absolute; inset: 0;
  transform-origin: 50% 4%;          /* titik gantung di atas */
  animation: bodySway 7s ease-in-out infinite;
  will-change: transform;
}
@keyframes bodySway {
  0%,100% { transform: rotate(-1.1deg) translateY(0); }
  50%     { transform: rotate(1.1deg)  translateY(-0.6%); }
}

/* ─── Layer part: semua menumpuk penuh canvas di koordinat sama ────────── */
.part {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  will-change: transform;
  backface-visibility: hidden;
}

/* ─── Sendi: pivot pakai transform-origin (% dari canvas) ──────────────── */

/* Kepala — angguk + miring halus, pivot di pangkal leher */
.head {
  transform-origin: 60.3% 31.7%;
  animation: headNod 6s ease-in-out infinite;
}
@keyframes headNod {
  0%,100% { transform: rotate(-2.2deg); }
  35%     { transform: rotate(1.4deg); }
  70%     { transform: rotate(-0.6deg); }
}

/* ── Grup lengan: penuh canvas supaya child tetap di koordinat global ── */
.arm, .forearm {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
}

/* LENGAN KANAN — seluruh grup ayun di bahu (lengan atas + tangan + stick ikut) */
.armR {
  transform-origin: 63.5% 29.5%;
  animation: armRSwing 4.6s ease-in-out infinite;
}
@keyframes armRSwing {
  0%,100% { transform: rotate(3.5deg); }
  50%     { transform: rotate(-7deg); }
}
/* Tangan bawah kanan — tekukan tambahan halus di siku (relatif thd lengan atas) */
.forearmR {
  transform-origin: 73.2% 46.9%;
  animation: forearmRBend 4.6s ease-in-out infinite;
}
@keyframes forearmRBend {
  0%,100% { transform: rotate(-1.5deg); }
  50%     { transform: rotate(3deg); }
}

/* LENGAN KIRI — ayun di bahu, ritme beda biar tidak kembar */
.armL {
  transform-origin: 41.0% 30.3%;
  animation: armLSwing 5.4s ease-in-out infinite;
}
@keyframes armLSwing {
  0%,100% { transform: rotate(-3.5deg); }
  50%     { transform: rotate(6.5deg); }
}
.forearmL {
  transform-origin: 30.5% 39.8%;
  animation: forearmLBend 5.4s ease-in-out infinite;
}
@keyframes forearmLBend {
  0%,100% { transform: rotate(1.5deg); }
  50%     { transform: rotate(-3deg); }
}

/* ── Stick / tongkat: tetap tegak, hanya goyang amat halus di titik pegang ── */
.stickR {
  transform-origin: 72.3% 70.8%;
  animation: stickRWobble 4.6s ease-in-out infinite;
}
@keyframes stickRWobble {
  0%,100% { transform: rotate(0.8deg); }
  50%     { transform: rotate(-1.2deg); }
}
.stickL {
  transform-origin: 35.2% 58.6%;
  animation: stickLWobble 5.4s ease-in-out infinite;
}
@keyframes stickLWobble {
  0%,100% { transform: rotate(-0.8deg); }
  50%     { transform: rotate(1.2deg); }
}

/* Kaki — ayun sangat halus di pinggul (wayang gerak kaki minim) */
.legR {
  transform-origin: 63.0% 64.0%;
  animation: legRSwing 8s ease-in-out infinite;
}
@keyframes legRSwing {
  0%,100% { transform: rotate(0.8deg); }
  50%     { transform: rotate(-1.2deg); }
}
.legL {
  transform-origin: 51.5% 70.3%;
  animation: legLSwing 8s ease-in-out infinite;
}
@keyframes legLSwing {
  0%,100% { transform: rotate(-0.8deg); }
  50%     { transform: rotate(1.2deg); }
}

/* Body — "napas" naik turun halus */
.body {
  transform-origin: 60% 35%;
  animation: bodyBreath 5s ease-in-out infinite;
}
@keyframes bodyBreath {
  0%,100% { transform: scale(1) translateY(0); }
  50%     { transform: scale(1.006) translateY(-0.25%); }
}

/* ─── Aksesibilitas: hormati prefers-reduced-motion ────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .wayang-stage, .part { animation: none !important; }
}
</style>