<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ExperimentMeta, ExpCSummary, CostRow } from '@/types/experiment'
import CostModelSection from './CostModelSection.vue'
import MaintenanceSection from './MaintenanceSection.vue'
import PlannedExperiment from './PlannedExperiment.vue'

const props = defineProps<{
  experiments: ExperimentMeta[]
  summary: ExpCSummary | null
  costRows: CostRow[]
}>()

const { t } = useI18n()
type ExpId = 'A' | 'Aprime' | 'B' | 'C' | 'D' | 'E' | 'F'
const IDS: ExpId[] = ['A', 'Aprime', 'B', 'C', 'D', 'E', 'F']
const STATUS: Record<ExpId, 'interactive' | 'completed' | 'planned'> = {
  A: 'interactive', Aprime: 'planned', B: 'planned', C: 'completed', D: 'planned', E: 'planned', F: 'planned',
}
const sel = ref<ExpId>('A')

// Deep links like #expA / #expAprime / #expB … select the matching experiment.
function syncFromHash() {
  const m = /^#exp([A-Za-z]+)$/.exec(window.location.hash)
  if (!m) return
  const id = m[1] as ExpId
  if (IDS.includes(id)) {
    sel.value = id
    void nextTick(() => {
      document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

onMounted(() => {
  syncFromHash()
  window.addEventListener('hashchange', syncFromHash)
})
onBeforeUnmount(() => window.removeEventListener('hashchange', syncFromHash))

const byId = (id: string): ExperimentMeta =>
  props.experiments.find((e) => e.id === id) ?? props.experiments[0]
const metaA = computed(() => byId('A'))
const metaAprime = computed(() => byId('Aprime'))
const metaB = computed(() => byId('B'))
const metaC = computed(() => byId('C'))
const metaD = computed(() => byId('D'))
const metaE = computed(() => byId('E'))
const metaF = computed(() => byId('F'))

const items = computed(() =>
  IDS.map((id) => ({
    value: id,
    title: t(`experiments.tabs.${id}`),
    subtitle: t(`experiments.status.${STATUS[id]}`),
  })),
)
</script>

<template>
  <section id="experiments" class="block">
    <p class="kicker">{{ t('experiments.kicker') }}</p>
    <h2 class="sec-title text-h5 mb-4">{{ t('experiments.title') }}</h2>

    <v-select
      v-model="sel"
      :items="items"
      item-title="title"
      item-value="value"
      :label="t('experiments.choose')"
      variant="outlined"
      density="comfortable"
      hide-details
      class="exp-select mb-6"
    >
      <template #item="{ props: itemProps, item }">
        <v-list-item v-bind="itemProps" :title="item.raw.title" :subtitle="item.raw.subtitle" />
      </template>
    </v-select>

    <v-window v-model="sel">
      <v-window-item value="A"><CostModelSection :meta="metaA" /></v-window-item>
      <v-window-item value="Aprime"><PlannedExperiment :meta="metaAprime" /></v-window-item>
      <v-window-item value="B"><PlannedExperiment :meta="metaB" /></v-window-item>
      <v-window-item value="C"><MaintenanceSection :meta="metaC" :summary="summary" :cost-rows="costRows" /></v-window-item>
      <v-window-item value="D"><PlannedExperiment :meta="metaD" /></v-window-item>
      <v-window-item value="E"><PlannedExperiment :meta="metaE" /></v-window-item>
      <v-window-item value="F"><PlannedExperiment :meta="metaF" /></v-window-item>
    </v-window>
  </section>
</template>

<style scoped lang="scss">
.block { padding: clamp(2.2rem,5vw,3.6rem) 0; border-top: 1px solid var(--line); }
.exp-select { max-width: 560px; }
.exp-select :deep(.v-field__input) { font-family: var(--serif); font-weight: 600; }
/* Inner experiment sections carry their own top border/padding; neutralize it
   inside the window so the select owns the separation. */
.v-window :deep(.block) { border-top: none; padding-top: .5rem; }
</style>
