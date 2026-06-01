<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ChartConfiguration } from 'chart.js'
import type { ExperimentMeta } from '@/types/experiment'
import { useCostModel } from '@/composables/useCostModel'
import { baseOptions, C } from '@/services/chartTheme'
import BaseChart from './BaseChart.vue'
import ExperimentMeta_ from './ExperimentMeta.vue'

defineProps<{ meta: ExperimentMeta }>()
const { t } = useI18n()
const { state, rStar, amortisedRatio, curves } = useCostModel()

// log-scale sliders for the large/small magnitudes; linear for the per-query costs
const logCtrls = computed(() => [
  { key: 'N', label: t('cost.ctrls.N'), min: 4, max: 7, desc: t('cost.units.items') },
  { key: 'W', label: t('cost.ctrls.W'), min: 2, max: 6, desc: t('cost.units.changes') },
  { key: 'cc', label: t('cost.ctrls.cc'), min: -5, max: -2, desc: t('cost.units.perItem') },
  { key: 'cm', label: t('cost.ctrls.cm'), min: -5, max: -2, desc: t('cost.units.perChange') },
] as const)
const linCtrls = computed(() => [
  { key: 'cq', label: t('cost.ctrls.cq'), min: 0.005, max: 0.2, step: 0.005, desc: t('cost.units.perQuery') },
  { key: 'cr', label: t('cost.ctrls.cr'), min: 0.0005, max: 0.02, step: 0.0005, desc: t('cost.units.perQuery') },
] as const)

type LogKey = 'N' | 'W' | 'cc' | 'cm'
function logVal(key: LogKey) {
  return Math.log10(state[key])
}
function setLog(key: LogKey, v: number) {
  state[key] = Math.pow(10, v)
}
const fmtSci = (x: number) => x.toExponential(1)
const fmtInt = (x: number) =>
  isFinite(x) && x > 0 ? Math.round(x).toLocaleString() : '—'

const chartConfig = computed<ChartConfiguration>(() => ({
  type: 'line',
  data: {
    labels: curves.value.labels,
    datasets: [
      { label: t('cost.series.qsr'), data: curves.value.qsr, borderColor: C.red, borderWidth: 2.4, pointRadius: 0, tension: 0.05 },
      { label: t('cost.series.isc'), data: curves.value.isc, borderColor: C.teal, borderWidth: 2.4, pointRadius: 0, tension: 0.05 },
    ],
  },
  options: baseOptions(t('cost.axes.x'), t('cost.axes.y')),
}))
</script>

<template>
  <section id="expA" class="block">
    <p class="kicker">{{ t('cost.kicker') }}</p>
    <h2 class="sec-title text-h5 mb-4">{{ t('cost.title') }}</h2>
    <ExperimentMeta_ :meta="meta" />
    <v-card class="pa-5">
      <v-row dense>
        <v-col v-for="c in logCtrls" :key="c.key" cols="12" sm="6" md="3">
          <div class="ctrl-label">{{ c.label }}: <span class="v">{{ fmtSci(state[c.key]) }}</span> <small>{{ c.desc }}</small></div>
          <v-slider :model-value="logVal(c.key)" :min="c.min" :max="c.max" :step="0.05"
                    color="primary" hide-details density="compact"
                    @update:model-value="(v: number) => setLog(c.key, v)" />
        </v-col>
        <v-col v-for="c in linCtrls" :key="c.key" cols="12" sm="6" md="3">
          <div class="ctrl-label">{{ c.label }}: <span class="v">${{ state[c.key] }}</span> <small>{{ c.desc }}</small></div>
          <v-slider v-model="state[c.key]" :min="c.min" :max="c.max" :step="c.step"
                    color="primary" hide-details density="compact" />
        </v-col>
      </v-row>

      <div class="readout">
        <div class="big"><span class="rl">{{ t('cost.breakEven') }}</span><span class="rv">{{ fmtInt(rStar) }}</span></div>
        <div class="rs">{{ t('cost.readout', { cr: state.cr, cq: state.cq, ratio: amortisedRatio }) }}</div>
      </div>

      <BaseChart :config="chartConfig" :height="300" />
      <p class="fig-cap mt-3">{{ t('cost.caption') }}</p>
    </v-card>
  </section>
</template>

<style scoped lang="scss">
.block { padding: clamp(2.2rem,5vw,3.6rem) 0; border-top: 1px solid var(--line); }
.ctrl-label { font-size: .8rem; font-weight: 600; color: var(--ink);
  .v { font-family: var(--mono); color: var(--teal); font-weight: 700; }
  small { color: var(--mute); font-weight: 400; } }
.readout { display: flex; align-items: baseline; gap: 1.2rem; flex-wrap: wrap; background: var(--ts);
  border: 1px solid #BFE0DA; border-radius: 11px; padding: .9rem 1.2rem; margin: .6rem 0 1.1rem; }
.big { display: flex; flex-direction: column; }
.rl { font-family: var(--mono); font-size: .68rem; text-transform: uppercase; letter-spacing: .1em; color: var(--teal); }
.rv { font-family: var(--mono); font-size: 2rem; font-weight: 700; color: var(--navy); line-height: 1.1; }
.rs { font-size: .86rem; color: var(--soft); }
</style>
