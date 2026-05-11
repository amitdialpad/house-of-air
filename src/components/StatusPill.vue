<template>
  <span class="pill" :class="status">
    <span class="dot">{{ meta?.icon }}</span>
    <span class="label">{{ meta?.label }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { STATUSES } from '../projects.js'

const props = defineProps({ status: { type: String, required: true } })
const meta = computed(() => STATUSES[props.status])
</script>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.dot {
  font-size: 15px;
  line-height: 1;
  transform: translateY(-1px);
}

.pill.live .dot     { color: #4ade80; }
.pill.building .dot { color: #fbbf24; }
.pill.paused .dot   { color: #94a3b8; }
.pill.archived .dot { color: #737373; }
.pill.idea .dot     { color: #c4b5fd; }
</style>
