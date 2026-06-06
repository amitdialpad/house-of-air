<template>
  <nav class="legend" aria-label="Filter projects by status">
    <button
      type="button"
      class="item all"
      :class="{ active: active === 'all' }"
      :aria-pressed="active === 'all'"
      @click="$emit('filter', 'all')"
    >
      <span class="label">All</span>
      <span class="count">{{ total }}</span>
    </button>

    <button
      v-for="(s, key) in STATUSES"
      :key="key"
      type="button"
      class="item"
      :class="{
        active: active === key,
        empty: !counts[key]
      }"
      :aria-pressed="active === key"
      :disabled="!counts[key]"
      @click="counts[key] && $emit('filter', active === key ? 'all' : key)"
    >
      <span class="dot" :style="{ backgroundColor: s.color }" aria-hidden="true"></span>
      <span class="label">{{ s.label }}</span>
      <span class="count">{{ counts[key] || 0 }}</span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { STATUSES } from '../projects.js'

const props = defineProps({
  counts: { type: Object, default: () => ({}) },
  active: { type: String, default: 'all' }
})

defineEmits(['filter'])

const total = computed(() => Object.values(props.counts).reduce((a, b) => a + b, 0))
</script>

<style scoped>
.legend {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  border: 1px solid var(--line);
  border-bottom: 0;
}

.item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  background: var(--bg);
  border: 0;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 10px 14px;
  border-radius: 0;
  cursor: pointer;
  transition: color 160ms ease, background 160ms ease, border-color 160ms ease, opacity 160ms ease;
  font-weight: 500;
}

.item:hover:not(:disabled):not(.active) {
  color: var(--text);
  background: var(--surface);
}

.item.active {
  color: var(--accent-ink);
  background: var(--accent);
}

.item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--bg);
}

.item.active .dot {
  background: var(--accent-ink) !important;
}

.count {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}

.item.active .count {
  color: var(--accent-ink);
  font-weight: 600;
}

.item.all .label {
  font-weight: 600;
}

@media (max-width: 620px) {
  .legend {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .item {
    justify-content: space-between;
  }
}
</style>
