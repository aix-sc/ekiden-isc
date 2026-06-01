<script setup lang="ts">
import type { ExperimentMeta } from '@/types/experiment'
import { ROADMAP } from '@/data/experiments'
import ExperimentMeta_ from './ExperimentMeta.vue'
defineProps<{ meta: ExperimentMeta }>()
</script>

<template>
  <section id="next" class="block">
    <p class="kicker">04 · The next step</p>
    <h2 class="sec-title text-h5 mb-4">Real-corpus run — embedding APIs + Wikipedia revision history</h2>
    <ExperimentMeta_ :meta="meta" />
    <v-card class="pa-4">
      <ol class="roadmap">
        <li v-for="(r, i) in ROADMAP" :key="i">
          <span class="when">{{ r.when }}</span><br />
          <b>{{ r.title }}</b><br />{{ r.detail }}
        </li>
      </ol>
    </v-card>
  </section>
</template>

<style scoped lang="scss">
.block { padding: clamp(2.2rem,5vw,3.6rem) 0; border-top: 1px solid var(--line); }
.roadmap { list-style: none; counter-reset: step; padding: 0; }
.roadmap li { counter-increment: step; position: relative; padding: .6rem 0 .6rem 2.4rem; border-bottom: 1px dashed var(--line); }
.roadmap li:last-child { border-bottom: none; }
.roadmap li::before { content: counter(step); position: absolute; left: 0; top: .55rem; width: 1.7rem; height: 1.7rem; background: var(--navy); color: #fff; border-radius: 7px; display: grid; place-items: center; font-family: var(--mono); font-size: .8rem; font-weight: 700; }
.roadmap b { color: var(--navy); }
.when { font-family: var(--mono); font-size: .72rem; color: var(--teal); text-transform: uppercase; letter-spacing: .06em; }
</style>
