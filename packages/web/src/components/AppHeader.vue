<script setup lang="ts">
import { GITHUB_URL } from '@/data/experiments'
const links = [
  { t: 'Overview', h: '#overview' }, { t: 'Cost model', h: '#expA' },
  { t: 'Maintenance', h: '#expC' }, { t: 'Next run', h: '#next' }, { t: 'Ask the data', h: '#chat' },
]
</script>

<template>
  <v-app-bar flat height="58" class="nav" border>
    <a href="#top" class="brand">
      <span class="bmk">ISC</span>
      <span class="bmt d-none d-sm-inline">Ingest-time Semantic Compilation · Experiments</span>
    </a>
    <v-spacer />
    <a v-for="l in links" :key="l.h" :href="l.h" class="nl d-none d-md-inline">{{ l.t }}</a>
    <a :href="GITHUB_URL" target="_blank" rel="noopener" class="gh">GitHub ↗</a>
  </v-app-bar>
</template>

<style scoped lang="scss">
.nav { background: rgba(251,250,247,.86) !important; backdrop-filter: blur(10px); padding: 0 clamp(1rem,4vw,3rem); }
.brand { display: flex; align-items: center; gap: .6rem; text-decoration: none; }
.bmk { font-family: var(--serif); font-weight: 700; background: var(--navy); color: #fff; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 8px; font-size: .9rem; }
.bmt { font-size: .8rem; color: var(--soft); font-weight: 500; }
.nl { color: var(--soft); font-size: .82rem; text-decoration: none; margin: 0 .55rem; }
.nl:hover { color: var(--teal); }
.gh { font-family: var(--mono); font-size: .74rem; border: 1px solid var(--line); padding: .3rem .6rem; border-radius: 8px; color: var(--navy); text-decoration: none; margin-left: .8rem; }
</style>
