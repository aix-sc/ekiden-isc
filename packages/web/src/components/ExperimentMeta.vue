<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ExperimentMeta } from '@/types/experiment'
defineProps<{ meta: ExperimentMeta }>()
const { t } = useI18n()
</script>

<template>
  <v-row class="meta-grid" dense>
    <v-col cols="12" md="4"><div class="m"><h4>{{ t('meta.purpose') }}</h4><p>{{ meta.purpose }}</p></div></v-col>
    <v-col cols="12" md="4"><div class="m"><h4>{{ t('meta.data') }}</h4><p>{{ meta.data }}</p></div></v-col>
    <v-col cols="12" md="4"><div class="m"><h4>{{ t('meta.evaluation') }}</h4><p>{{ meta.evaluation }}</p></div></v-col>
  </v-row>
</template>

<style scoped lang="scss">
.meta-grid { margin-bottom: 1rem; }
.m {
  background: var(--p2); border: 1px solid var(--line); border-radius: 11px; padding: .95rem 1.05rem; height: 100%;
  h4 { font-family: var(--mono); font-size: .66rem; text-transform: uppercase; letter-spacing: .1em; color: var(--teal); margin-bottom: .4rem; }
  p { font-size: .86rem; color: var(--soft); line-height: 1.5; }
}
</style>
