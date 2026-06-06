<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="project" class="overlay" @click.self="$emit('close')">
        <div class="panel" role="dialog" aria-modal="true" :aria-label="project.title">
          <button class="close" type="button" @click="$emit('close')" aria-label="Close project">×</button>

          <a
            v-if="project.screenshot && primaryLink"
            :href="primaryLink.url"
            target="_blank"
            rel="noopener"
            class="screenshot screenshot-link"
          >
            <img :src="project.screenshot" :alt="`Screenshot of ${project.title}`" />
            <div class="screenshot-cta" aria-hidden="true">Open link</div>
          </a>
          <div v-else-if="project.screenshot" class="screenshot">
            <img :src="project.screenshot" :alt="`Screenshot of ${project.title}`" />
          </div>

          <div class="hero-meta">
            <StatusPill :status="project.status" />
            <span v-if="project.shippedAt" class="date">{{ dateFraming }}</span>
          </div>

          <h1>{{ project.title }}</h1>
          <p class="one-liner">{{ project.oneLiner }}</p>

          <a
            v-if="primaryLink"
            :href="primaryLink.url"
            target="_blank"
            rel="noopener"
            class="primary-cta"
          >
            {{ primaryLink.label }} <span class="arrow" aria-hidden="true">→</span>
          </a>

          <article class="body" v-html="project.bodyHtml"></article>

          <footer class="meta-footer" v-if="otherLinks.length || project.tags?.length">
            <section v-if="otherLinks.length">
              <h3>{{ primaryLink ? 'More links' : 'Links' }}</h3>
              <ul>
                <li v-for="l in otherLinks" :key="l.label">
                  <a :href="l.url" target="_blank" rel="noopener">{{ l.label }}</a>
                </li>
              </ul>
            </section>

            <section v-if="project.tags?.length">
              <h3>Tags</h3>
              <div class="tags">
                <span v-for="t in project.tags" :key="t" class="tag">{{ t }}</span>
              </div>
            </section>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import StatusPill from './StatusPill.vue'

const props = defineProps({ project: Object })
const emit = defineEmits(['close'])

function isRealUrl(u) {
  return u && u !== '#' && !u.startsWith('javascript:')
}

const primaryLink = computed(() => {
  const links = props.project?.links || []
  const first = links[0]
  return first && isRealUrl(first.url) ? first : null
})

const otherLinks = computed(() => {
  const links = props.project?.links || []
  const sliced = primaryLink.value ? links.slice(1) : links
  return sliced.filter(l => isRealUrl(l.url))
})

function handleKey(e) {
  if (e.key === 'Escape' && props.project) emit('close')
}

watch(() => props.project, (p) => {
  document.body.style.overflow = p ? 'hidden' : ''
}, { immediate: true })

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
  document.body.style.overflow = ''
})

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const month = d.toLocaleDateString('en-US', { month: 'short' })
  const year = String(d.getFullYear()).slice(-2)
  return `${month} '${year}`
}

const dateFraming = computed(() => {
  if (!props.project?.shippedAt) return ''
  const date = formatDate(props.project.shippedAt)
  const status = props.project.status
  if (status === 'live') return `Live since ${date}`
  if (status === 'building') return `Building since ${date}`
  if (status === 'paused') return `Paused, ${date}`
  if (status === 'archived') return `Archived, ${date}`
  if (status === 'idea') return `Idea, ${date}`
  return date
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: var(--backdrop);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 40;
  overflow-y: auto;
  padding: clamp(18px, 4vw, 52px) 20px;
}

.panel {
  background: var(--surface-raised);
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  max-width: 920px;
  width: 100%;
  padding: clamp(28px, 5vw, 54px);
  position: relative;
  margin: auto;
}

.close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 44px;
  height: 44px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid var(--line);
  color: var(--text-muted);
  font-size: 1.35rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: color 160ms ease, background 160ms ease, border-color 160ms ease;
  font-family: var(--font-sans);
}

.close:hover {
  background: var(--bg);
  border-color: var(--accent);
  color: var(--text);
}

.screenshot,
.screenshot-link {
  display: block;
  aspect-ratio: 16 / 10;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--line);
  margin-bottom: 32px;
  position: relative;
  background: var(--bg);
}

.screenshot img,
.screenshot-link img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.screenshot-link {
  cursor: pointer;
  text-decoration: none;
}

.screenshot-link:hover img {
  transform: scale(1.018);
}

.screenshot-cta {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: var(--accent);
  color: var(--accent-ink);
  padding: 8px 12px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 200ms ease, transform 200ms ease;
}

.screenshot-link:hover .screenshot-cta,
.screenshot-link:focus-visible .screenshot-cta {
  opacity: 1;
  transform: translateY(0);
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.date {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 500;
}

h1 {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 7vw, 5rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 0.9;
  margin: 0 0 16px;
  color: var(--text);
  text-transform: uppercase;
  text-wrap: balance;
}

.one-liner {
  max-width: 66ch;
  font-size: clamp(1.08rem, 2vw, 1.3rem);
  color: var(--text-muted);
  margin: 0 0 28px;
  line-height: 1.6;
}

.primary-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--accent);
  color: var(--accent-ink);
  padding: 12px 18px;
  border-radius: 5px;
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
  margin: 0 0 40px;
  border: 1px solid var(--accent);
  transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
  font-family: var(--font-sans);
}

.primary-cta .arrow {
  font-family: var(--font-mono);
  font-size: 1rem;
  transition: transform 160ms ease;
}

.primary-cta:hover {
  transform: translateY(-1px);
  background: var(--accent-hover);
}

.primary-cta:hover .arrow {
  transform: translateX(3px);
}

.body {
  max-width: 72ch;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text);
}

.body :deep(h2) {
  color: var(--accent);
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 3vw, 2.2rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 0.95;
  margin: 42px 0 16px;
  text-wrap: balance;
}

.body :deep(p) { margin: 0 0 20px; }

.body :deep(code) {
  background: var(--bg);
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 0.88rem;
  border: 1px solid var(--line);
  font-family: var(--font-mono);
}

.body :deep(a) {
  color: var(--text);
  text-decoration: underline;
  text-decoration-color: var(--line-strong);
  text-underline-offset: 3px;
}

.body :deep(a:hover) {
  text-decoration-color: var(--accent);
}

.body :deep(ul),
.body :deep(ol) {
  padding-left: 22px;
  margin: 0 0 20px;
}

.body :deep(li) {
  margin-bottom: 10px;
}

.body :deep(strong) { color: var(--text); }

.meta-footer {
  margin-top: 48px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.meta-footer h3 {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  margin: 0 0 14px;
  font-weight: 600;
}

.meta-footer ul { list-style: none; padding: 0; margin: 0; }
.meta-footer li { margin-bottom: 8px; }
.meta-footer a {
  color: var(--text);
  text-decoration: underline;
  text-decoration-color: var(--line-strong);
  text-underline-offset: 3px;
  font-size: 0.92rem;
}
.meta-footer a:hover { text-decoration-color: var(--accent); }

.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  background: var(--bg);
  padding: 4px 7px;
  border-radius: 4px;
  border: 1px solid var(--line);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-enter-active .panel,
.modal-leave-active .panel {
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .panel,
.modal-leave-to .panel {
  opacity: 0;
  transform: translateY(18px);
}

@media (max-width: 640px) {
  .overlay {
    padding: 0;
  }

  .panel {
    padding: 72px 20px 44px;
    border-radius: 0;
    min-height: 100vh;
    border-left: 0;
    border-right: 0;
  }

  .screenshot,
  .screenshot-link {
    margin-bottom: 26px;
  }

  .primary-cta {
    width: 100%;
    justify-content: center;
  }
}
</style>
