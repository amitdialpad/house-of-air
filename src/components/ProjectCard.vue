<template>
  <router-link
    :to="`/p/${project.slug}`"
    class="project-row"
    :class="project.status"
  >
    <span class="number" aria-hidden="true">{{ paddedIndex }}</span>

    <div class="screenshot">
      <img
        v-if="project.screenshot"
        :src="project.screenshot"
        :alt="project.thumbnailAlt || `Visual preview of ${project.title}`"
        loading="lazy"
      />
      <div v-else class="preview-placeholder" :aria-label="`${project.previewTitle ? 'Graphic preview' : 'No preview available'} for ${project.title}`">
        <span class="preview-label">{{ project.previewLabel || 'Workflow' }}</span>
        <span class="preview-title">{{ project.previewTitle || 'No preview' }}</span>
      </div>
    </div>

    <div class="summary">
      <div class="meta">
        <StatusPill :status="project.status" />
        <span v-if="project.shippedAt" class="date">{{ formatDate(project.shippedAt) }}</span>
      </div>

      <h2 class="title">{{ project.title }}</h2>
      <p class="one-liner">{{ project.oneLiner }}</p>

      <div v-if="project.tags?.length" class="tags">
        <span v-for="t in project.tags.slice(0, 4)" :key="t" class="tag">{{ t }}</span>
      </div>
    </div>

    <span class="open-arrow" aria-hidden="true">↗</span>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import StatusPill from './StatusPill.vue'

const props = defineProps({
  project: { type: Object, required: true },
  index: { type: Number, required: true }
})

const paddedIndex = computed(() => String(props.index).padStart(2, '0'))

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const month = d.toLocaleDateString('en-US', { month: 'short' })
  const year = String(d.getFullYear()).slice(-2)
  return `${month} '${year}`
}
</script>

<style scoped>
.project-row {
  --status-color: var(--status-live);
  display: grid;
  grid-template-columns: 48px minmax(210px, 322px) minmax(0, 1fr) 38px;
  gap: clamp(16px, 2.6vw, 34px);
  align-items: center;
  padding: 14px 18px 14px 14px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: color-mix(in oklch, var(--surface) 92%, transparent);
  box-shadow: 0 1px 0 oklch(26% 0.03 255 / 0.06);
  text-decoration: none;
  color: inherit;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), border-color 180ms ease, box-shadow 220ms ease;
  min-width: 0;
}

.project-row.live { --status-color: var(--status-live); }
.project-row.building { --status-color: var(--status-building); }
.project-row.paused { --status-color: var(--status-paused); }
.project-row.archived { --status-color: var(--status-archived); }
.project-row.idea { --status-color: var(--status-idea); }

.project-row:hover {
  transform: translateY(-3px);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-card);
}

.project-row:hover .title {
  color: var(--accent-dark);
}

.project-row:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 8px;
}

.number {
  align-self: start;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: var(--text);
  background: var(--status-color);
  border-radius: 50%;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 650;
  line-height: 1;
}

.screenshot {
  aspect-ratio: 16 / 10;
  background: var(--surface-raised);
  border-radius: 11px;
  overflow: hidden;
  border: 1px solid var(--line);
  transform-origin: center;
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), border-color 180ms ease;
}

.project-row:hover .screenshot {
  border-color: var(--line-strong);
  transform: scale(1.008);
}

.screenshot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 18px;
  background:
    linear-gradient(135deg, color-mix(in oklch, var(--status-color) 22%, transparent), transparent 58%),
    repeating-linear-gradient(120deg, transparent 0 18px, oklch(31% 0.03 255 / 0.045) 19px, transparent 20px 42px),
    var(--surface-raised);
}

.preview-label,
.preview-title {
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.preview-label {
  color: var(--text-soft);
  font-size: 0.68rem;
}

.preview-title {
  color: var(--text);
  font-size: 0.9rem;
}

.summary {
  min-width: 0;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.date {
  color: var(--text-muted);
  font-size: 0.72rem;
  font-family: var(--font-mono);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.title {
  font-family: var(--font-serif);
  font-size: clamp(1.9rem, 3.4vw, 3.15rem);
  margin: 0 0 10px;
  font-weight: 400;
  letter-spacing: -0.035em;
  line-height: 1;
  color: var(--text);
  text-wrap: balance;
  transition: color 180ms ease;
}

.one-liner {
  max-width: 62ch;
  margin: 0 0 18px;
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 1rem;
  overflow-wrap: anywhere;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--text-muted);
  background: var(--bg);
  padding: 4px 7px;
  border-radius: 4px;
  border: 1px solid var(--line);
}

.open-arrow {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--text-muted);
  font-size: 1rem;
  transition: color 180ms ease, background 180ms ease, transform 220ms ease;
}

.project-row:hover .open-arrow {
  color: var(--surface);
  background: var(--text);
  border-color: var(--text);
  transform: rotate(6deg);
}

@media (max-width: 880px) {
  .project-row {
    grid-template-columns: 44px minmax(0, 1fr) 38px;
    align-items: start;
  }

  .screenshot {
    grid-column: 2 / -1;
    max-width: 420px;
  }

  .summary {
    grid-column: 2;
  }

  .open-arrow { grid-column: 3; }

}

@media (max-width: 560px) {
  .project-row {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 26px 0;
    width: min(100%, 22rem);
    max-width: 22rem;
    overflow-x: clip;
  }

  .number,
  .screenshot,
  .summary,
  .open-arrow {
    grid-column: 1;
    max-width: 100%;
  }

  .number {
    font-size: 0.68rem;
  }

  .open-arrow { display: none; }

  .title {
    font-size: clamp(2rem, 12vw, 3rem);
  }

  .one-liner {
    max-width: 32ch;
  }
}
</style>
