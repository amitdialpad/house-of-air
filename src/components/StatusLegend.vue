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
      v-for="{ key, status } in visibleStatuses"
      :key="key"
      type="button"
      class="item"
      :class="{ active: active === key }"
      :aria-pressed="active === key"
      @click="$emit('filter', active === key ? 'all' : key)"
    >
      <span class="dot" :style="{ backgroundColor: status.color }" aria-hidden="true"></span>
      <span class="label">{{ status.label }}</span>
      <span class="count">{{ counts[key] }}</span>
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
const visibleStatuses = computed(() =>
  Object.entries(STATUSES)
    .filter(([key]) => props.counts[key] > 0)
    .map(([key, status]) => ({ key, status }))
)
</script>

<style scoped>
.legend {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  padding-top: 18px;
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
  background: transparent;
  border: 0;
  padding: 8px 0 8px 12px;
  border-radius: 0;
  cursor: pointer;
  border-left: 1px solid transparent;
  transition: color 160ms ease, border-color 160ms ease, opacity 160ms ease;
  font-weight: 500;
}

.item:hover:not(.active) {
  color: var(--text);
  border-left-color: var(--line-strong);
}

.item.active {
  color: var(--text);
  border-left-color: var(--accent);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--bg);
}

.item.active .dot {
  background: var(--accent) !important;
}

.count {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}

.item.active .count {
  color: var(--text);
  font-weight: 600;
}

.item.all .label {
  font-weight: 600;
}

@media (max-width: 620px) {
  .legend {
    display: flex;
    gap: 4px 14px;
    max-width: 22rem;
  }

  .item {
    justify-content: flex-start;
    min-height: 34px;
    padding: 6px 0 6px 10px;
  }
}
</style>
