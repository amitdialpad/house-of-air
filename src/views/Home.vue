<template>
  <a href="#main-grid" class="skip-link">Skip to projects</a>
  <div class="home" :inert="!!modalProject">
    <header class="hero">
      <div class="hero-lockup">
        <p class="site-note">Personal tools, shipped out of hours</p>
        <h1>
          <span>House</span>
          <span class="of">of</span>
          <span>Ayre</span>
        </h1>
      </div>

      <div class="hero-copy">
        <p class="tagline">Small systems that remove drag from design work.</p>
        <p class="byline">
          By <a href="https://dialpadhq.com/user/amit.ayre" target="_blank" rel="noopener">Amit</a>,
          Staff Designer in India. Ayre rhymes with air.
        </p>
      </div>

      <dl class="hero-stats" aria-label="Project summary">
        <div>
          <dt>Projects</dt>
          <dd>{{ projectTotal }}</dd>
        </div>
        <div>
          <dt>Live</dt>
          <dd>{{ liveCount }}</dd>
        </div>
        <div>
          <dt>Latest</dt>
          <dd>{{ latestDate }}</dd>
        </div>
      </dl>

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

const projectTotal = computed(() => projects.length)
const liveCount = computed(() => counts.value.live || 0)

const latestProject = computed(() => {
  return projects
    .filter(p => p.shippedAt)
    .sort((a, b) => b.shippedAt.localeCompare(a.shippedAt))[0]
})

const latestDate = computed(() => {
  if (!latestProject.value?.shippedAt) return 'TBD'
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
    .format(new Date(latestProject.value.shippedAt))
})

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
  grid-template-columns: minmax(280px, 0.9fr) minmax(320px, 1fr);
  gap: clamp(28px, 5vw, 72px);
  align-items: end;
  padding-bottom: 28px;
  margin-bottom: clamp(36px, 6vw, 72px);
  border-bottom: 1px solid var(--line);
  min-width: 0;
}

.hero-lockup {
  display: grid;
  gap: 18px;
}

.site-note {
  width: fit-content;
  margin: 0;
  padding: 6px 10px;
  border: 1px solid var(--line-strong);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero h1 {
  display: grid;
  gap: 0;
  margin: 0;
  color: var(--text);
  font-family: var(--font-display);
  font-size: clamp(4.25rem, 12vw, 6rem);
  font-weight: 800;
  line-height: 0.78;
  letter-spacing: -0.025em;
  text-transform: uppercase;
  text-wrap: balance;
}

.hero h1 .of {
  color: var(--signal);
  font-family: var(--font-serif);
  font-size: 0.34em;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1;
  text-transform: lowercase;
  transform: translateX(0.08em);
}

.hero-copy {
  max-width: 58ch;
  min-width: 0;
}

.tagline {
  max-width: 15ch;
  margin: 0 0 18px;
  color: var(--text);
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 4.8vw, 4.2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 0.95;
  text-transform: uppercase;
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

.hero-stats {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 6px 0 0;
  border: 1px solid var(--line);
}

.hero-stats div {
  padding: 16px 18px;
}

.hero-stats div + div {
  border-left: 1px solid var(--line);
}

.hero-stats dt {
  color: var(--text-soft);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero-stats dd {
  margin: 8px 0 0;
  color: var(--text);
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 0.95;
  text-transform: uppercase;
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
    font-size: clamp(3.4rem, 18vw, 5rem);
  }

  .tagline {
    font-size: clamp(2rem, 11vw, 3.2rem);
    max-width: 8.6ch;
  }

  .byline {
    max-width: min(34ch, calc(100vw - 36px));
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .hero-stats div + div {
    border-left: 0;
    border-top: 1px solid var(--line);
  }
}
</style>
