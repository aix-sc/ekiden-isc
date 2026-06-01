<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { GITHUB_URL } from '@/data/experiments'
import type { ExpCSummary } from '@/types/experiment'
import MetricChip from './MetricChip.vue'

const props = defineProps<{ summary: ExpCSummary | null }>()
const { t } = useI18n()

// Experiment C lives behind a tab in ExperimentsSection, so its #expC anchor only
// exists when that tab is active. Ask the section to activate tab C and scroll —
// reliable from any starting tab, and on repeat clicks.
function seeResults() {
  window.dispatchEvent(new CustomEvent('isc:select-experiment', { detail: 'C' }))
}

const chips = computed(() => {
  const s = props.summary
  return [
    { value: s ? `${s.per_event_speedup_final_x}×` : '—', label: t('hero.chips.cheaperUpdate'), accent: true },
    { value: s ? `${s.cumulative_speedup_x}×` : '—', label: t('hero.chips.cheaperCumulative'), accent: false },
    { value: s ? `${s.max_principal_angle_deg_over_run}°` : '—', label: t('hero.chips.subspaceDrift'), accent: true },
    { value: '0.95', label: t('hero.chips.recovered'), accent: false },
  ]
})
</script>

<template>
  <section id="top" class="hero grid-bg">
    <p class="kicker">{{ t('hero.kicker') }}</p>
    <h1 class="serif" v-html="t('hero.titleHtml')" />
    <p class="lede">{{ t('hero.lede') }}</p>
    <div class="chips">
      <MetricChip v-for="(c, i) in chips" :key="i" :value="c.value" :label="c.label" :accent="c.accent" />
    </div>
    <div class="cta">
      <v-btn color="primary" variant="flat" class="px-5" @click="seeResults">{{ t('hero.seeResults') }}</v-btn>
      <v-btn :href="GITHUB_URL" target="_blank" variant="outlined" class="px-5">{{ t('hero.sourceGithub') }}</v-btn>
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
