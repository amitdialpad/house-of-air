<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="project" class="overlay" @click.self="$emit('close')">
        <div class="panel" role="dialog" aria-modal="true" :aria-label="project.title">
          <button class="close" type="button" @click="$emit('close')" aria-label="Close">×</button>

          <a
            v-if="project.screenshot && primaryLink"
            :href="primaryLink.url"
            target="_blank"
            rel="noopener"
            class="screenshot screenshot-link"
          >
            <img :src="project.screenshot" :alt="project.title" />
            <div class="screenshot-cta" aria-hidden="true">Open ↗</div>
          </a>
          <div v-else-if="project.screenshot" class="screenshot">
            <img :src="project.screenshot" :alt="project.title" />
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
            {{ primaryLink.label }} <span class="arrow" aria-hidden="true">↗</span>
          </a>

          <article class="body" v-html="project.bodyHtml"></article>

          <footer class="meta-footer" v-if="otherLinks.length || project.tags?.length">
            <section v-if="otherLinks.length">
              <h3>{{ primaryLink ? 'More links' : 'Links' }}</h3>
              <ul>
                <li v-for="l in otherLinks" :key="l.label">
                  <a :href="l.url" target="_blank" rel="noopener">{{ l.label }} ↗</a>
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
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 48px 24px;
}

.panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  max-width: 780px;
  width: 100%;
  padding: 44px 48px 56px;
  position: relative;
  margin: auto;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.6);
}

.close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 22px;
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
  border-color: var(--border-strong);
  color: var(--text);
}

.screenshot,
.screenshot-link {
  display: block;
  aspect-ratio: 16 / 10;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
  margin-bottom: 32px;
  position: relative;
}

.screenshot img,
.screenshot-link img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 480ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.screenshot-link {
  cursor: pointer;
  text-decoration: none;
}

.screenshot-link:hover img {
  transform: scale(1.025);
}

.screenshot-cta {
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--accent);
  padding: 8px 14px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 200ms ease, transform 200ms ease;
  border: 1px solid var(--accent);
}

.screenshot-link:hover .screenshot-cta,
.screenshot-link:focus-visible .screenshot-cta {
  opacity: 1;
  transform: translateY(0);
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
}

.date {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}

h1 {
  font-family: var(--font-serif);
  font-size: 40px;
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.08;
  margin: 0 0 16px;
  color: var(--text);
}

.one-liner {
  font-size: 19px;
  color: var(--text-muted);
  margin: 0 0 28px;
  line-height: 1.55;
  font-family: var(--font-serif);
}

.primary-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--accent);
  color: #0a0a0a;
  padding: 11px 22px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  margin: 0 0 40px;
  border: 1px solid var(--accent);
  transition: transform 160ms ease, background 160ms ease;
  font-family: var(--font-sans);
  letter-spacing: 0.01em;
}

.primary-cta .arrow {
  font-family: var(--font-mono);
  font-size: 14px;
  transition: transform 160ms ease;
}

.primary-cta:hover {
  transform: translateY(-1px);
  background: var(--accent-hover);
}

.primary-cta:hover .arrow {
  transform: translate(2px, -2px);
}

.body {
  font-size: 16.5px;
  line-height: 1.7;
  color: var(--text);
}

.body :deep(h2) {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  margin: 36px 0 16px;
}

.body :deep(p) { margin: 0 0 20px; }

.body :deep(code) {
  background: var(--bg);
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid var(--border);
  font-family: var(--font-mono);
}

.body :deep(a) {
  color: var(--text);
  text-decoration: underline;
  text-decoration-color: var(--border-strong);
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

.body :deep(strong) { color: var(--text); }

.meta-footer {
  margin-top: 48px;
  padding-top: 28px;
  border-top: 1px solid var(--border);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.meta-footer h3 {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin: 0 0 14px;
  font-weight: 600;
}

.meta-footer ul { list-style: none; padding: 0; margin: 0; }
.meta-footer li { margin-bottom: 8px; }
.meta-footer a {
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
}
.meta-footer a:hover { text-decoration: underline; }

.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 220ms ease;
}
.modal-enter-active .panel,
.modal-leave-active .panel {
  transition: transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 220ms ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .panel,
.modal-leave-to .panel {
  opacity: 0;
  transform: translateY(24px) scale(0.985);
}

@media (max-width: 640px) {
  .overlay { padding: 0; }
  .panel {
    padding: 32px 22px 48px;
    border-radius: 0;
    min-height: 100vh;
    box-shadow: none;
  }
  h1 { font-size: 30px; }
  .primary-cta { width: 100%; justify-content: center; }
}
</style>
