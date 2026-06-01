<script setup lang="ts">
import { computed } from 'vue'
import type { ChartConfiguration } from 'chart.js'
import type { ExperimentMeta, ExpCSummary, CostRow } from '@/types/experiment'
import { baseOptions, C } from '@/services/chartTheme'
import BaseChart from './BaseChart.vue'
import ExperimentMeta_ from './ExperimentMeta.vue'

const props = defineProps<{ meta: ExperimentMeta; summary: ExpCSummary | null; costRows: CostRow[] }>()

const band = computed(() => {
  const s = props.summary
  return [
    { v: s ? `${s.per_event_speedup_final_x}×` : '—', l: `cheaper / update (N=${s ? s.final_corpus_N.toLocaleString() : '—'})` },
    { v: s ? `${s.cumulative_speedup_x}×` : '—', l: 'cheaper cumulatively' },
    { v: s ? `${s.max_principal_angle_deg_over_run}°` : '—', l: 'max principal-angle drift' },
    { v: s ? `${s['mean_recall@10']}` : '—', l: 'mean recall@10 vs full' },
  ]
})

const costConfig = computed<ChartConfiguration>(() => ({
  type: 'line',
  data: {
    labels: props.costRows.map((r) => r.n),
    datasets: [
      { label: 'Full re-SVD (O(nd²))', data: props.costRows.map((r) => r.t_full * 1000), borderColor: C.red, borderWidth: 2, pointRadius: 1.5, tension: 0.15 },
      { label: 'Incremental (∝ change)', data: props.costRows.map((r) => r.t_inc * 1000), borderColor: C.teal, borderWidth: 2, pointRadius: 1.5, tension: 0.15 },
    ],
  },
  options: baseOptions('corpus size N', 'ms / update'),
}))

const procConfig = computed<ChartConfiguration>(() => {
  const p = props.summary?.procrustes_virtual_axis_update ?? []
  return {
    type: 'line',
    data: {
      labels: p.map((x) => (x.frac_reembedded * 100).toFixed(1)),
      datasets: [
        { label: 'mean cosine to true', data: p.map((x) => x.mean_cosine_to_true), borderColor: C.teal, backgroundColor: 'rgba(17,124,111,.10)', fill: true, borderWidth: 2.4, pointRadius: 4, tension: 0.25 },
      ],
    },
    options: baseOptions('% of corpus re-embedded', 'cosine to truly re-embedded'),
  }
})

const downloads = [
  { f: 'exp_C_maintenance.py', label: 'Experiment code', ext: 'PY' },
  { f: 'exp_C_results.csv', label: 'Per-event measurements', ext: 'CSV' },
  { f: 'exp_C_summary.json', label: 'Summary', ext: 'JSON' },
  { f: 'exp_C_figure.png', label: 'Figure', ext: 'PNG' },
]
</script>

<template>
  <section id="expC" class="block">
    <p class="kicker">03 · Experiment C — completed (pilot)</p>
    <h2 class="sec-title text-h5 mb-4">Incremental maintenance vs. full re-SVD</h2>
    <ExperimentMeta_ :meta="meta" />

    <v-row dense class="mb-2">
      <v-col v-for="(b, i) in band" :key="i" cols="6" md="3">
        <div class="rb"><b>{{ b.v }}</b><span>{{ b.l }}</span></div>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" md="6">
        <v-card class="pa-4" height="100%">
          <h3>Maintenance cost vs. corpus size</h3>
          <BaseChart :config="costConfig" :height="260" />
          <p class="fig-cap mt-2">Incremental stays flat as the corpus grows; full re-SVD rises with N.</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" height="100%">
          <h3>Virtual axis update (Procrustes)</h3>
          <BaseChart :config="procConfig" :height="260" />
          <p class="fig-cap mt-2">Re-embedding ~10% of the corpus recovers most of the alignment to a re-embedded space.</p>
        </v-card>
      </v-col>
    </v-row>

    <div class="dls">
      <a v-for="d in downloads" :key="d.f" class="dl" :href="`/data/${d.f}`" download>
        {{ d.label }} <span class="ext">{{ d.ext }}</span>
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.block { padding: clamp(2.2rem,5vw,3.6rem) 0; border-top: 1px solid var(--line); }
h3 { font-family: var(--serif); font-weight: 600; font-size: 1.05rem; color: var(--navy); margin-bottom: .3rem; }
.rb { background: #fff; border: 1px solid var(--line); border-left: 3px solid var(--teal); border-radius: 0 11px 11px 0; padding: .9rem 1rem; height: 100%;
  b { font-family: var(--mono); font-size: 1.45rem; font-weight: 700; color: var(--navy); display: block; line-height: 1.1; }
  span { font-size: .76rem; color: var(--soft); } }
.dls { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: 1.2rem; }
.dl { font-family: var(--mono); font-size: .82rem; color: var(--navy); background: #fff; border: 1px solid var(--line); border-radius: 9px; padding: .5rem .8rem; text-decoration: none;
  .ext { color: var(--mute); font-size: .72rem; } }
.dl:hover { border-color: var(--teal); color: var(--teal); }
</style>
