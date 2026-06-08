<template>
  <a href="#main-grid" class="skip-link">Skip to projects</a>
  <div class="home" :inert="!!modalProject">
    <header class="hero">
      <div class="hero-lockup">
        <h1 aria-label="House of Air">
          <span class="title-row">
            <span class="word">House</span>
            <span class="word of">of</span>
          </span>
          <span class="word air">Air</span>
        </h1>
      </div>

      <div class="hero-copy">
        <p class="tagline">Small systems that remove drag from design work.</p>
        <p class="byline">
          By <a href="https://dialpadhq.com/user/amit.ayre" target="_blank" rel="noopener">Amit Ayre</a>,
          Staff Designer from India. Air rhymes with Ayre.
        </p>
      </div>

      <StatusLegend :counts="counts" :active="activeFilter" @filter="setFilter" />
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
      <p>Built quietly · {{ currentYear }}</p>
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
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(48px, 7vw, 96px) clamp(20px, 4vw, 44px) 64px;
  min-width: 0;
}

.hero {
  display: grid;
  grid-template-columns: minmax(280px, 0.72fr) minmax(320px, 1fr);
  column-gap: clamp(28px, 5vw, 80px);
  row-gap: clamp(24px, 3vw, 36px);
  align-items: center;
  padding-bottom: clamp(28px, 4vw, 44px);
  margin-bottom: clamp(32px, 5vw, 56px);
  border-bottom: 1px solid var(--line);
  min-width: 0;
}

.hero-lockup {
  display: grid;
  gap: 20px;
}

.hero h1 {
  display: flex;
  flex-direction: column;
  gap: 0.08em;
  width: max-content;
  max-width: 100%;
  margin: 0;
  color: var(--text);
  font-family: var(--font-display);
  font-size: clamp(3.25rem, 7.4vw, 5rem);
  font-weight: 800;
  line-height: 0.82;
  letter-spacing: -0.025em;
  text-transform: uppercase;
}

.hero h1 .word {
  display: block;
}

.hero h1 .title-row {
  display: inline-flex;
  align-items: baseline;
  gap: 0.18em;
  line-height: 0.82;
}

.hero h1 .of {
  color: var(--text);
  font-family: var(--font-display);
  font-size: 1em;
  font-style: normal;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 0.82;
  text-transform: uppercase;
}

.hero h1 .air {
  line-height: 0.82;
}

.hero-copy {
  max-width: 58ch;
  min-width: 0;
}

.tagline {
  max-width: 30ch;
  margin: 0 0 16px;
  color: var(--text);
  font-family: var(--font-serif);
  font-size: clamp(1.45rem, 2.5vw, 2rem);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.25;
  text-transform: none;
  text-wrap: balance;
}

.byline {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.65;
  margin: 0;
  overflow-wrap: anywhere;
}

.byline a {
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--line-strong);
  transition: border-color 160ms ease;
}

.byline a:hover {
  border-bottom-color: var(--accent);
}

.project-board {
  display: block;
  border-top: 1px solid var(--line-strong);
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
  border-bottom: 1px solid var(--line);
  padding: 42px 0;
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
  color: var(--line-strong);
  line-height: 1;
}

.empty-inner .label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.footer {
  margin-top: 72px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
  color: var(--text-muted);
  font-size: 0.8rem;
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}

@media (max-width: 840px) {
  .hero {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .tagline {
    max-width: 13ch;
  }
}

@media (max-width: 620px) {
  .home {
    padding: 40px 18px 52px;
    max-width: 100vw;
    overflow-x: clip;
  }

  .hero {
    gap: 28px;
    margin-bottom: 40px;
  }

  .hero h1 {
    font-size: clamp(3.3rem, 16vw, 4.6rem);
    gap: 0.08em;
  }

  .tagline {
    font-size: clamp(1.35rem, 7vw, 1.75rem);
    max-width: 22ch;
  }

  .byline {
    max-width: min(34ch, calc(100vw - 36px));
  }

}
</style>
