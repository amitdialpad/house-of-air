<template>
  <a href="#main-grid" class="skip-link">Skip to projects</a>
  <div class="home" :inert="!!modalProject">
    <header class="hero">
      <h1>House of <span class="surname">Ayre</span></h1>
      <p class="pron">rhymes with <em>air</em></p>
      <p class="tagline">Things I made for myself first.</p>
      <p class="byline">
        By <a href="https://dialpadhq.com/user/amit.ayre" target="_blank" rel="noopener">Amit</a>
        · Staff Designer, India · always something half-built
      </p>
      <StatusLegend :counts="counts" :active="activeFilter" @filter="setFilter" />
    </header>

    <main id="main-grid" class="grid">
      <TransitionGroup name="card">
        <ProjectCard v-for="p in filteredProjects" :key="p.slug" :project="p" />

        <div v-if="activeFilter === 'all'" key="empty-card" class="card-empty">
          <div class="empty-inner">
            <span class="plus">+</span>
            <span class="label">more on the way</span>
          </div>
        </div>
      </TransitionGroup>
    </main>

    <footer class="footer">
      <p>built quietly · {{ new Date().getFullYear() }}</p>
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

function setFilter(status) {
  activeFilter.value = status
}
</script>

<style scoped>
.home {
  max-width: 1180px;
  margin: 0 auto;
  padding: 88px 32px 64px;
}

.hero {
  margin-bottom: 64px;
}

.hero h1 {
  font-family: var(--font-serif);
  font-size: 64px;
  font-weight: 500;
  letter-spacing: -0.025em;
  margin: 0 0 6px;
  line-height: 1;
}

.hero h1 .surname {
  font-style: italic;
  font-weight: 500;
}

.pron {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  margin: 0 0 24px;
  text-transform: lowercase;
}

.pron em {
  font-style: italic;
  color: var(--text);
}

.tagline {
  font-family: var(--font-serif);
  font-size: 22px;
  font-style: italic;
  color: var(--text);
  margin: 0 0 8px;
  font-weight: 400;
  max-width: 640px;
}

.byline {
  color: var(--text-muted);
  font-size: 13.5px;
  margin: 0 0 36px;
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}

.byline a {
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--border-strong);
  padding-bottom: 1px;
  transition: border-color 160ms ease;
}

.byline a:hover {
  border-bottom-color: var(--accent);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.card-move,
.card-enter-active,
.card-leave-active {
  transition: opacity 280ms ease, transform 280ms ease;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.card-leave-active {
  position: absolute;
  width: calc(50% - 14px);
}

.card-empty {
  border: 1px dashed var(--border-strong);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  color: var(--text-muted);
}

.empty-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.plus {
  font-family: var(--font-serif);
  font-size: 36px;
  color: var(--border-strong);
  line-height: 1;
}

.empty-inner .label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.footer {
  margin-top: 96px;
  padding-top: 28px;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 12px;
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
}

@media (max-width: 760px) {
  .home { padding: 56px 20px; }
  .hero h1 { font-size: 44px; }
  .grid { grid-template-columns: 1fr; }
}
</style>
