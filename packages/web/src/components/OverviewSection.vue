<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section id="overview" class="block">
    <p class="kicker">{{ t('overview.kicker') }}</p>
    <h2 class="sec-title text-h5 mb-4">{{ t('overview.title') }}</h2>
    <v-row dense>
      <v-col cols="12" md="6">
        <v-card class="pa-4 pole pole-qsr" height="100%">
          <h3>{{ t('overview.qsrHead') }}</h3>
          <p v-html="t('overview.qsrBodyHtml')" />
          <p class="note">{{ t('overview.qsrNote') }}</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 pole pole-isc" height="100%">
          <h3>{{ t('overview.iscHead') }}</h3>
          <p>{{ t('overview.iscBody') }}</p>
          <p class="note">{{ t('overview.iscNote') }}</p>
        </v-card>
      </v-col>
    </v-row>
    <div class="eqbar">
      <span class="eql">{{ t('overview.eqLabel') }}</span>
      <span class="eqf">R* = ( N·c<sub>c</sub> + W·c<sub>m</sub> ) / ( c<sub>q</sub> − c<sub>r</sub> )</span>
      <span class="eqn">{{ t('overview.eqNote') }}</span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.block { padding: clamp(2.2rem,5vw,3.6rem) 0; border-top: 1px solid var(--line); }
.pole { border-top: 3px solid var(--line); }
.pole h3 { font-family: var(--serif); font-weight: 600; font-size: 1.1rem; margin-bottom: .5rem; }
.pole p { color: var(--soft); font-size: .95rem; }
.pole-qsr { border-top-color: var(--red); h3 { color: var(--red); } }
.pole-isc { border-top-color: var(--teal); h3 { color: var(--teal); } }
.note { font-family: var(--mono); font-size: .8rem; color: var(--mute) !important; margin-top: .7rem; padding-top: .6rem; border-top: 1px dashed var(--line); }
.eqbar { margin-top: 1.2rem; background: var(--navy); color: #fff; border-radius: 12px; padding: 1rem 1.3rem; display: flex; flex-wrap: wrap; align-items: center; gap: .4rem 1rem; }
.eql { font-family: var(--mono); font-size: .7rem; text-transform: uppercase; letter-spacing: .1em; color: #9DB8D6; }
.eqf { font-family: var(--mono); font-size: clamp(1rem,2.4vw,1.3rem); font-weight: 700; }
.eqn { font-size: .82rem; color: #C7D6E8; margin-left: auto; }
</style>
