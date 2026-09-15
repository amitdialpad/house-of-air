<template>
  <router-link
    :to="`/p/${project.slug}`"
    class="project-row"
    :class="project.status"
  >
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
import StatusPill from './StatusPill.vue'

defineProps({
  project: { type: Object, required: true }
})

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
  display: grid;
  grid-template-columns: minmax(0, 1fr) 38px;
  gap: clamp(20px, 2.6vw, 34px);
  align-items: center;
  padding: clamp(22px, 2.4vw, 28px) clamp(20px, 2.6vw, 30px);
  border: 1px solid var(--line);
  border-radius: 18px;
  background: color-mix(in oklch, var(--surface) 92%, transparent);
  box-shadow: 0 1px 0 oklch(26% 0.03 255 / 0.06);
  text-decoration: none;
  color: inherit;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), border-color 180ms ease, box-shadow 220ms ease;
  min-width: 0;
}

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
    grid-template-columns: minmax(0, 1fr) 38px;
    align-items: start;
  }

  .summary {
    grid-column: 1;
  }

  .open-arrow { grid-column: 2; }

}

@media (max-width: 560px) {
  .project-row {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 22px 18px 24px;
    width: 100%;
    max-width: none;
    border-radius: 16px;
    overflow-x: clip;
  }

  .summary,
  .open-arrow {
    grid-column: 1;
    max-width: 100%;
  }

  .open-arrow { display: none; }

  .title {
    font-size: clamp(1.85rem, 10.5vw, 2.6rem);
    line-height: 1.02;
  }

  .one-liner {
    max-width: none;
    margin-bottom: 16px;
    font-size: 0.96rem;
    line-height: 1.55;
  }

  .meta {
    gap: 10px;
    margin-bottom: 12px;
  }

  .tag {
    overflow-wrap: anywhere;
  }
}
</style>
