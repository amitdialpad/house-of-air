<template>
  <router-link :to="`/p/${project.slug}`" class="project-row" :class="project.status">
    <span class="number" aria-hidden="true">{{ paddedIndex }}</span>

    <div class="screenshot" :class="{ empty: !project.screenshot }">
      <img
        v-if="project.screenshot"
        :src="project.screenshot"
        :alt="`Screenshot of ${project.title}`"
        loading="lazy"
      />
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
  grid-template-columns: 56px minmax(220px, 360px) minmax(0, 1fr);
  gap: clamp(18px, 3vw, 34px);
  align-items: center;
  padding: clamp(22px, 4vw, 36px) 0;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
  color: inherit;
  transition: color 180ms ease, background 180ms ease;
  min-width: 0;
}

.project-row.live { --status-color: var(--status-live); }
.project-row.building { --status-color: var(--status-building); }
.project-row.paused { --status-color: var(--status-paused); }
.project-row.archived { --status-color: var(--status-archived); }
.project-row.idea { --status-color: var(--status-idea); }

.project-row:hover {
  background: var(--surface);
}

.project-row:hover .title {
  color: var(--accent-hover);
}

.project-row:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 8px;
}

.number {
  color: var(--status-color);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.3rem);
  font-weight: 800;
  line-height: 0.9;
  opacity: 0.95;
}

.screenshot {
  aspect-ratio: 16 / 10;
  background: var(--surface-raised);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--line);
  transform-origin: center;
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), border-color 180ms ease;
}

.project-row:hover .screenshot {
  border-color: var(--status-color);
  transform: translateY(-2px);
}

.screenshot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.screenshot.empty {
  display: grid;
  place-items: center;
}

.screenshot.empty::after {
  content: "No artifact yet";
  color: var(--text-soft);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
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
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.7rem);
  margin: 0 0 10px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 0.92;
  color: var(--text);
  text-transform: uppercase;
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
  background: var(--surface-raised);
  padding: 4px 7px;
  border-radius: 4px;
  border: 1px solid var(--line);
}

@media (max-width: 880px) {
  .project-row {
    grid-template-columns: 44px minmax(0, 1fr);
    align-items: start;
  }

  .screenshot {
    grid-column: 2;
    max-width: 420px;
  }

  .summary {
    grid-column: 2;
  }

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
  .summary {
    grid-column: 1;
    max-width: 100%;
  }

  .number {
    font-size: 2rem;
  }

  .title {
    font-size: clamp(2rem, 12vw, 3rem);
  }

  .one-liner {
    max-width: 32ch;
  }
}
</style>
