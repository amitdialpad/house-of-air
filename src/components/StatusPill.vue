<template>
  <span class="pill" :class="status">
    <span class="dot" aria-hidden="true"></span>
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
  --pill-color: var(--status-live);
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--pill-color);
}

.pill.live     { --pill-color: var(--status-live); }
.pill.building { --pill-color: var(--status-building); }
.pill.paused   { --pill-color: var(--status-paused); }
.pill.archived { --pill-color: var(--status-archived); }
.pill.idea     { --pill-color: var(--status-idea); }
</style>
