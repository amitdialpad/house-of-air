<template>
  <div class="bg-ambient" aria-hidden="true">
    <span class="orb orb-1"></span>
    <span class="orb orb-2"></span>
    <span class="orb orb-3"></span>
    <span class="orb orb-4"></span>
    <span class="orb orb-5"></span>
  </div>
  <div class="content-layer">
    <router-view />
  </div>
</template>

<style>
.bg-ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.content-layer {
  position: relative;
  z-index: 1;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(54px);
  opacity: 0;
  animation: drift-up linear infinite;
  will-change: transform, opacity;
}

.orb-1 {
  width: 260px; height: 260px;
  left: 8%;
  --drift: 30px;
  background: radial-gradient(circle at 35% 30%, rgba(74, 222, 128, 0.10), rgba(74, 222, 128, 0.03) 55%, transparent 75%);
  animation-duration: 74s;
}

.orb-2 {
  width: 340px; height: 340px;
  left: 70%;
  --drift: -50px;
  background: radial-gradient(circle at 35% 30%, rgba(245, 230, 200, 0.05), rgba(245, 230, 200, 0.015) 55%, transparent 75%);
  animation-duration: 96s;
  animation-delay: -32s;
}

.orb-3 {
  width: 180px; height: 180px;
  left: 38%;
  --drift: 20px;
  background: radial-gradient(circle at 35% 30%, rgba(74, 222, 128, 0.06), rgba(74, 222, 128, 0.015) 55%, transparent 75%);
  animation-duration: 85s;
  animation-delay: -55s;
}

.orb-4 {
  width: 140px; height: 140px;
  left: 88%;
  --drift: -25px;
  background: radial-gradient(circle at 35% 30%, rgba(245, 230, 200, 0.04), rgba(245, 230, 200, 0.01) 55%, transparent 75%);
  animation-duration: 62s;
  animation-delay: -20s;
}

.orb-5 {
  width: 220px; height: 220px;
  left: 22%;
  --drift: 40px;
  background: radial-gradient(circle at 35% 30%, rgba(74, 222, 128, 0.07), rgba(74, 222, 128, 0.02) 55%, transparent 75%);
  animation-duration: 88s;
  animation-delay: -68s;
}

@keyframes drift-up {
  0% {
    transform: translateY(110vh) translateX(0);
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% {
    transform: translateY(-130%) translateX(var(--drift, 0));
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bg-ambient { display: none; }
}
</style>
