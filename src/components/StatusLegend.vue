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
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
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
  background: var(--surface-raised);
  border: 1px solid var(--line);
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: color 160ms ease, border-color 160ms ease, background 160ms ease, transform 160ms ease;
  font-weight: 500;
}

.item:hover:not(.active) {
  color: var(--text);
  border-color: var(--line-strong);
  transform: translateY(-1px);
}

.item.active {
  color: var(--surface);
  background: var(--text);
  border-color: var(--text);
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
  color: var(--surface);
  font-weight: 600;
}

.item.all .label {
  font-weight: 600;
}

@media (max-width: 620px) {
  .legend {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    width: 100%;
    max-width: none;
  }

  .item {
    justify-content: flex-start;
    min-width: 0;
    width: 100%;
    min-height: 38px;
    padding: 7px 10px;
  }

  .count {
    margin-left: auto;
  }
}
</style>
