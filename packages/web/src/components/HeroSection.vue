<script setup lang="ts">
import { computed } from 'vue'
import { GITHUB_URL } from '@/data/experiments'
import type { ExpCSummary } from '@/types/experiment'
import MetricChip from './MetricChip.vue'

const props = defineProps<{ summary: ExpCSummary | null }>()

const chips = computed(() => {
  const s = props.summary
  return [
    { value: s ? `${s.per_event_speedup_final_x}×` : '—', label: 'cheaper / update', accent: true },
    { value: s ? `${s.cumulative_speedup_x}×` : '—', label: 'cheaper cumulative', accent: false },
    { value: s ? `${s.max_principal_angle_deg_over_run}°` : '—', label: 'subspace drift', accent: true },
    { value: '0.95', label: 'recovered @ ~10%', accent: false },
  ]
})
</script>

<template>
  <section id="top" class="hero grid-bg">
    <p class="kicker">Reproducible research · Wild–Takahashi · target venue CIDR 2027</p>
    <h1 class="serif">Pay semantic labour <em>once.</em><br />Then just look it up.</h1>
    <p class="lede">
      An interactive companion to the ISC paper. Re-run the cost model, explore the
      incremental-maintenance results, inspect the data behind every number, and ask questions
      in plain language. Everything here is open source.
    </p>
    <div class="chips">
      <MetricChip v-for="(c, i) in chips" :key="i" :value="c.value" :label="c.label" :accent="c.accent" />
    </div>
    <div class="cta">
      <v-btn color="primary" href="#expC" variant="flat" class="px-5">See the results</v-btn>
      <v-btn :href="GITHUB_URL" target="_blank" variant="outlined" class="px-5">Source on GitHub</v-btn>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero { padding: clamp(3rem,8vw,6rem) clamp(1rem,4vw,3rem) clamp(2.2rem,5vw,3.5rem); }
h1 { font-weight: 600; font-size: clamp(2.2rem,6vw,4rem); line-height: 1.02; letter-spacing: -.015em; color: var(--navy); margin-bottom: 1rem;
  em { color: var(--teal); font-style: italic; } }
.lede { font-size: clamp(1rem,1.5vw,1.15rem); max-width: 60ch; color: var(--soft); }
.chips { display: flex; flex-wrap: wrap; gap: .6rem; margin: 1.6rem 0 1.4rem; }
.cta { display: flex; flex-wrap: wrap; gap: .7rem; }
</style>
