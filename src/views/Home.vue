<template>
  <a href="#main-grid" class="skip-link">Skip to projects</a>
  <div class="home" :inert="!!modalProject">
    <header class="hero">
      <div class="hero-lockup">
        <div class="kicker">
          <span>Personal utility archive</span>
          <span>Est. whenever</span>
        </div>

        <div class="identity">
          <h1 aria-label="AIR">
            <span>A</span><span>I</span><span>R</span><i aria-hidden="true"></i>
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

    <main id="main-grid" class="project-board" :aria-label="boardLabel">
      <TransitionGroup name="card">
        <ProjectCard
          v-for="(p, index) in filteredProjects"
          :key="p.slug"
          :project="p"
          :index="index + 1"
        />

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
import { ref, computed } from 'vue'
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

function setFilter(status) {
  activeFilter.value = status
}
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
  pointer-events: none;
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
  width: 0.16em;
  height: 0.16em;
  margin-left: 0.08em;
  border-radius: 50%;
  background: var(--accent);
  flex: 0 0 auto;
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
    padding: 16px 12px 44px;
    max-width: 100vw;
    overflow-x: clip;
  }

  .hero {
    gap: 36px;
    padding: 22px 18px 24px;
    margin-bottom: 16px;
    border-radius: 20px;
  }

  .hero h1 {
    display: block;
    font-size: clamp(6.2rem, 33vw, 9rem);
    line-height: 0.78;
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
    margin: 20px 0 0;
    font-size: 0.78rem;
  }

  .expansion span:not(:last-child)::after {
    content: " /";
    color: var(--accent);
  }
  .kicker span:last-child { display: none; }
  .hero-copy { display: block; }

  .tagline {
    font-size: clamp(1.4rem, 7vw, 1.8rem);
    margin-bottom: 34px;
  }

  .drawer-tools { grid-template-columns: 1fr; }
  .drawer-label { width: 210px; }
  .footer { flex-direction: column; }

}
</style>
