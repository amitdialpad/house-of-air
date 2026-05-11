<template>
  <router-link :to="`/p/${project.slug}`" class="card" :class="project.status">
    <div class="screenshot" :class="{ empty: !project.screenshot }">
      <img v-if="project.screenshot" :src="project.screenshot" :alt="project.title" />
    </div>

    <div class="meta">
      <StatusPill :status="project.status" />
      <span v-if="project.shippedAt" class="date">{{ formatDate(project.shippedAt) }}</span>
    </div>

    <h2 class="title">{{ project.title }}</h2>
    <p class="one-liner">{{ project.oneLiner }}</p>

    <div v-if="project.tags?.length" class="tags">
      <span v-for="t in project.tags.slice(0, 4)" :key="t" class="tag">{{ t }}</span>
    </div>
  </router-link>
</template>

<script setup>
import StatusPill from './StatusPill.vue'

defineProps({ project: { type: Object, required: true } })

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const month = d.toLocaleDateString('en-US', { month: 'short' })
  const year = String(d.getFullYear()).slice(-2)
  return `${month} '${year}`
}
</script>

<style scoped>
.card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  transition: transform 220ms ease, border-color 220ms ease, background 220ms ease;
}

.card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  background: var(--bg-card-hover);
}

.card:focus-visible {
  border-color: var(--accent);
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.card.idea {
  border-style: dashed;
}

.screenshot {
  aspect-ratio: 16 / 10;
  background: var(--bg);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 18px;
  border: 1px solid var(--border);
}

.screenshot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.screenshot.empty {
  background-image:
    repeating-linear-gradient(135deg, transparent 0 12px, rgba(255,255,255,0.02) 12px 13px);
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.date {
  color: var(--text-muted);
  font-size: 11px;
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.title {
  font-family: var(--font-serif);
  font-size: 23px;
  margin: 0 0 8px;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: var(--text);
}

.one-liner {
  margin: 0 0 16px;
  color: var(--text-muted);
  line-height: 1.55;
  font-size: 14.5px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-muted);
  background: var(--bg);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
}
</style>
