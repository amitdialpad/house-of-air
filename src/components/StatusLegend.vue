<template>
  <div class="legend">
    <button
      type="button"
      class="item all"
      :class="{ active: active === 'all' }"
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
      :disabled="!counts[key]"
      @click="counts[key] && $emit('filter', active === key ? 'all' : key)"
    >
      <span class="dot" :style="{ color: s.color }">{{ s.icon }}</span>
      <span class="label">{{ s.label }}</span>
      <span class="count">{{ counts[key] || 0 }}</span>
    </button>
  </div>
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
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 22px;
  border-top: 1px solid var(--border);
}

.item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid transparent;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: color 160ms ease, background 160ms ease, border-color 160ms ease, opacity 160ms ease;
  font-weight: 500;
}

.item:hover:not(:disabled):not(.active) {
  color: var(--text);
  border-color: var(--border);
}

.item.active {
  color: var(--text);
  background: var(--bg-card);
  border-color: var(--accent);
}

.item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.dot {
  font-size: 14px;
  line-height: 1;
  transform: translateY(-1px);
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
</style>
