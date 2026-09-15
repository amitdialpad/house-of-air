<template>
  <a href="#main-grid" class="skip-link">Skip to projects</a>
  <div class="home" :inert="!!modalProject">
    <header class="hero">
      <svg class="hero-air-map" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path class="hero-air-current" d="M-120 128 C 126 36 288 188 492 116 S 826 42 1018 126 S 1264 196 1370 70" />
        <path class="hero-air-current hero-air-current-b" d="M-160 278 C 92 202 252 354 470 270 S 824 182 1038 276 S 1270 358 1390 232" />
        <path class="hero-air-current hero-air-current-c" d="M-140 432 C 116 346 290 496 510 414 S 842 330 1054 424 S 1278 496 1400 380" />
      </svg>

      <div class="hero-lockup">
        <div class="kicker">
          <span>Personal utility archive</span>
          <span>Est. whenever</span>
        </div>

        <div class="identity">
          <h1 aria-label="AIR">
            <span>A</span><span>I</span><span>R</span><i :class="{ 'is-reacting': airDotReacting }" aria-hidden="true"></i>
          </h1>
          <p class="expansion" aria-label="Amit's Intelligent Resources">
            <span>Amit’s</span>
            <span>Intelligent</span>
            <span>Resources</span>
          </p>
        </div>
      </div>

      <div class="hero-copy">
        <p class="tagline">
          A digital desk drawer full of small, useful tools—ready whenever you need one.
        </p>
        <p class="personality">
          Useful things,<br />
          <em>made anyway.</em>
        </p>
      </div>

      <div class="drawer-tools">
        <div class="drawer-label" aria-hidden="true">
          <span class="drawer-number">Drawer 01</span>
          <span class="drawer-title">Things worth keeping</span>
        </div>
        <StatusLegend :counts="counts" :active="activeFilter" @filter="setFilter" />
      </div>
    </header>

    <main id="main-grid" class="project-board" :aria-label="boardLabel" @pointerdown="acknowledgeProjectPress">
      <TransitionGroup name="card">
        <ProjectCard v-for="p in filteredProjects" :key="p.slug" :project="p" />

        <div v-if="activeFilter === 'all'" key="empty-card" class="card-empty">
          <div class="empty-inner">
            <span class="plus" aria-hidden="true">+</span>
            <span class="label">More on the way</span>
          </div>
        </div>
      </TransitionGroup>
    </main>

    <footer class="footer">
      <p><strong>AIR</strong> · Amit’s Intelligent Resources · {{ currentYear }}</p>
      <p>Useful things, made anyway.</p>
    </footer>

    <ProjectModal :project="modalProject" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projects, STATUSES, getProject } from '../projects.js'
import ProjectCard from '../components/ProjectCard.vue'
import StatusLegend from '../components/StatusLegend.vue'
import ProjectModal from '../components/ProjectModal.vue'

const route = useRoute()
const router = useRouter()
const currentYear = new Date().getFullYear()

const modalProject = computed(() => {
  const slug = route.params.slug
  return slug ? getProject(slug) : null
})

function closeModal() {
  router.push({ name: 'home' })
}

const activeFilter = ref('all')
const airDotReacting = ref(false)
let airDotResetTimer

const counts = computed(() => {
  const c = Object.fromEntries(Object.keys(STATUSES).map(k => [k, 0]))
  for (const p of projects) {
    if (c[p.status] !== undefined) c[p.status]++
  }
  return c
})

const filteredProjects = computed(() =>
  activeFilter.value === 'all'
    ? projects
    : projects.filter(p => p.status === activeFilter.value)
)

const boardLabel = computed(() => {
  if (activeFilter.value === 'all') return 'All projects'
  return `${STATUSES[activeFilter.value]?.label || activeFilter.value} projects`
})

function acknowledgeAirDot() {
  window.clearTimeout(airDotResetTimer)
  airDotReacting.value = true
  airDotResetTimer = window.setTimeout(() => {
    airDotReacting.value = false
  }, 160)
}

function acknowledgeProjectPress(event) {
  if (event.target.closest('.project-row')) acknowledgeAirDot()
}

function setFilter(status, event) {
  activeFilter.value = status
  if (event?.detail > 0) acknowledgeAirDot()
}

onUnmounted(() => window.clearTimeout(airDotResetTimer))
</script>

<style scoped>
.home {
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(28px, 5vw, 68px) clamp(18px, 4vw, 48px) 64px;
  min-width: 0;
}

.hero {
  display: grid;
  grid-template-columns: minmax(380px, 1.28fr) minmax(300px, 0.72fr);
  column-gap: clamp(36px, 7vw, 112px);
  row-gap: clamp(32px, 5vw, 64px);
  align-items: end;
  padding: clamp(22px, 4vw, 48px);
  margin-bottom: clamp(20px, 3vw, 36px);
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: 28px;
  box-shadow: var(--shadow-soft);
  min-width: 0;
  overflow: hidden;
  position: relative;
}

.hero::after {
  content: "";
  position: absolute;
  width: 220px;
  height: 220px;
  right: -102px;
  top: -116px;
  border-radius: 50%;
  border: 34px solid var(--sun);
  opacity: 0.9;
  z-index: 0;
  pointer-events: none;
}

.hero-air-map {
  position: absolute;
  inset: -2% -8%;
  z-index: 0;
  width: 116%;
  height: 104%;
  opacity: 0.2;
  pointer-events: none;
  animation: hero-air-drift 14s linear infinite alternate;
}

.hero-air-current {
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-dasharray: 2 18;
  vector-effect: non-scaling-stroke;
}

.hero-air-current-b {
  stroke-dasharray: 1 25;
  opacity: 0.8;
}

.hero-air-current-c {
  stroke-dasharray: 2 31;
  opacity: 0.65;
}

@keyframes hero-air-drift {
  from {
    opacity: 0.18;
    transform: translate3d(-4%, -1.5%, 0);
  }
  to {
    opacity: 0.34;
    transform: translate3d(4%, 1.5%, 0);
  }
}

.hero-lockup,
.hero-copy,
.drawer-tools {
  position: relative;
  z-index: 1;
}

.hero-lockup { min-width: 0; }

.kicker {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  margin-bottom: clamp(30px, 5vw, 64px);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  line-height: 1.2;
  text-transform: uppercase;
}

.identity {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(112px, 0.28fr);
  gap: clamp(18px, 3vw, 40px);
  align-items: end;
}

.hero h1 {
  display: flex;
  align-items: baseline;
  margin: 0;
  color: var(--text);
  font-family: var(--font-display);
  font-size: clamp(7rem, 18vw, 14.5rem);
  font-weight: 700;
  line-height: 0.66;
  letter-spacing: -0.095em;
  text-transform: uppercase;
}

.hero h1 i {
  position: relative;
  isolation: isolate;
  width: 0.16em;
  height: 0.16em;
  margin-left: 0.08em;
  border-radius: 50%;
  background: var(--accent);
  flex: 0 0 auto;
  animation: air-dot-breathe 6s var(--ease-in-out) infinite;
}

.hero h1 i::before,
.hero h1 i::after {
  content: "";
  position: absolute;
  inset: -8%;
  z-index: -1;
  border: 1px solid var(--accent);
  border-radius: inherit;
  pointer-events: none;
}

.hero h1 i::before {
  opacity: 0;
  transform: scale(0.92);
  transition: opacity 160ms var(--ease-out), transform 160ms var(--ease-out);
}

.hero h1 i.is-reacting::before {
  opacity: 0.24;
  transform: scale(1.45);
}

.hero h1 i::after {
  opacity: 0;
  transform: scale(0.92);
  animation: air-dot-halo 6s var(--ease-in-out) infinite;
}

@keyframes air-dot-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.07); }
}

@keyframes air-dot-halo {
  0%, 100% {
    opacity: 0;
    transform: scale(0.92);
  }
  50% {
    opacity: 0.22;
    transform: scale(1.48);
  }
}

.expansion {
  display: flex;
  flex-direction: column;
  gap: 0.16em;
  margin: 0 0 -0.15em;
  color: var(--text);
  font-family: var(--font-sans);
  font-size: clamp(0.74rem, 1.25vw, 0.94rem);
  font-weight: 650;
  letter-spacing: -0.01em;
  line-height: 1.12;
}

.hero-copy { min-width: 0; }

.tagline {
  max-width: 24ch;
  margin: 0 0 clamp(40px, 7vw, 84px);
  color: var(--text);
  font-family: var(--font-serif);
  font-size: clamp(1.45rem, 2.4vw, 2.1rem);
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.18;
  text-wrap: balance;
}

.personality {
  margin: 0;
  color: var(--text-muted);
  font-size: clamp(0.9rem, 1.25vw, 1rem);
  line-height: 1.35;
}

.personality em {
  color: var(--accent-dark);
  font-family: var(--font-serif);
  font-size: 1.26em;
}

.drawer-tools {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(190px, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(24px, 5vw, 72px);
  align-items: end;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.drawer-label {
  display: flex;
  flex-direction: column;
  width: min(100%, 300px);
  padding: 13px 16px 15px;
  color: var(--text);
  background: var(--sun);
  border-radius: 4px 4px 10px 10px;
  transform: rotate(-1deg);
  box-shadow: 0 2px 0 oklch(26% 0.03 255 / 0.14);
}

.drawer-number {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.drawer-title {
  margin-top: 3px;
  font-family: var(--font-serif);
  font-size: 1rem;
  font-style: italic;
}

.project-board {
  display: grid;
  gap: 14px;
}

.card-move,
.card-enter-active,
.card-leave-active {
  transition: opacity 240ms cubic-bezier(0.22, 1, 0.36, 1), transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.card-leave-active {
  position: absolute;
  width: 100%;
}

.card-empty {
  border: 1px dashed var(--line-strong);
  border-radius: 18px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.empty-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.plus {
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--accent);
  line-height: 1;
}

.empty-inner .label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.footer {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 64px;
  padding: 26px 2px 0;
  border-top: 1px solid var(--line);
  color: var(--text-muted);
  font-size: 0.8rem;
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}

.footer p { margin: 0; }
.footer strong { color: var(--text); }

@media (max-width: 840px) {
  .hero {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .identity {
    grid-template-columns: 1fr;
  }

  .expansion {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.35em;
    margin: 20px 0 0;
  }

  .expansion span:not(:last-child)::after {
    content: " /";
    color: var(--accent);
  }

  .hero-copy {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 28px;
    align-items: end;
  }

  .tagline { margin-bottom: 0; }
}

@media (max-width: 620px) {
  .home {
    padding: 12px 12px 40px;
    max-width: 100vw;
    overflow-x: clip;
  }

  .hero {
    gap: 28px;
    padding: 20px 18px 22px;
    margin-bottom: 16px;
    border-radius: 20px;
  }

  .hero::after {
    width: 150px;
    height: 150px;
    right: -72px;
    top: -68px;
    border-width: 24px;
  }

  .kicker {
    margin-bottom: 26px;
    font-size: 0.64rem;
  }

  .hero h1 {
    display: block;
    font-size: clamp(5rem, 28vw, 8rem);
    line-height: 0.76;
    white-space: nowrap;
  }

  .hero h1 i {
    display: inline-block;
    vertical-align: 0.08em;
  }

  .identity {
    display: block;
  }

  .expansion {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.35em;
    margin: 16px 0 0;
    font-size: 0.78rem;
  }

  .kicker span:last-child { display: none; }
  .hero-copy { display: block; }

  .tagline {
    font-size: clamp(1.32rem, 6.5vw, 1.72rem);
    margin-bottom: 28px;
  }

  .drawer-tools {
    grid-template-columns: 1fr;
    gap: 20px;
    padding-top: 20px;
  }
  .drawer-label { width: 210px; }
  .footer { flex-direction: column; }

}

@media (max-width: 360px) {
  .home {
    padding-right: 8px;
    padding-left: 8px;
  }

  .hero {
    padding-right: 14px;
    padding-left: 14px;
  }

  .hero::after {
    width: 132px;
    height: 132px;
    right: -64px;
    top: -58px;
    border-width: 20px;
  }

  .expansion {
    font-size: 0.73rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-air-map,
  .hero h1 i,
  .hero h1 i::after {
    animation: none;
  }

  .hero-air-map {
    opacity: 0.2;
    transform: none;
  }

  .hero h1 i::before {
    transform: none;
  }

  .hero h1 i.is-reacting::before {
    opacity: 0.18;
    transform: none;
  }
}
</style>
