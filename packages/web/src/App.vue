<script setup lang="ts">
import { computed } from 'vue'
import { useExperiments } from '@/composables/useExperiments'
import { GITHUB_URL } from '@/data/experiments'
import type { ExperimentMeta } from '@/types/experiment'
import AppHeader from '@/components/AppHeader.vue'
import HeroSection from '@/components/HeroSection.vue'
import OverviewSection from '@/components/OverviewSection.vue'
import CostModelSection from '@/components/CostModelSection.vue'
import MaintenanceSection from '@/components/MaintenanceSection.vue'
import NextRunSection from '@/components/NextRunSection.vue'
import ChatSection from '@/components/ChatSection.vue'

const { experiments, summary, costRows } = useExperiments()
const byId = (id: string): ExperimentMeta =>
  experiments.value.find((e) => e.id === id) ?? experiments.value[0]
const metaA = computed(() => byId('A'))
const metaC = computed(() => byId('C'))
const metaNext = computed(() => byId('NEXT'))
</script>

<template>
  <v-app>
    <AppHeader />
    <v-main>
      <HeroSection :summary="summary" />
      <v-container class="wrap">
        <OverviewSection />
        <CostModelSection :meta="metaA" />
        <MaintenanceSection :meta="metaC" :summary="summary" :cost-rows="costRows" />
        <NextRunSection :meta="metaNext" />
        <ChatSection :experiments="experiments" :summary="summary" />
      </v-container>
      <footer class="foot">
        <div class="foot-inner">
          <div>
            <p class="foot-title serif">Ingest-time Semantic Compilation</p>
            <p class="foot-sub">Kyle Wild · Yusuke Takahashi · <span class="mono">Try not to make it better. Try to make a difference.</span></p>
          </div>
          <div class="foot-links">
            <a :href="GITHUB_URL" target="_blank" rel="noopener">GitHub (OSS) ↗</a>
            <a href="https://www.cidrdb.org/cidr2027/" target="_blank" rel="noopener">CIDR 2027 ↗</a>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
        <p class="foot-fine">Open source under the MIT license. Experiment figures are synthetic-data pilots of the harness; the real-corpus run is the next step.</p>
      </footer>
    </v-main>
  </v-app>
</template>

<style scoped lang="scss">
.wrap { max-width: 1080px; }
.foot { background: var(--navy); color: #fff; padding: 2.4rem clamp(1rem,4vw,3rem) 1.6rem; }
.foot-inner { max-width: 1080px; margin: 0 auto; display: flex; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
.foot-title { font-size: 1.3rem; font-weight: 600; }
.foot-sub { color: #B9CAE0; font-size: .85rem; margin-top: .3rem; .mono { font-size: .78rem; color: #8FA9C9; } }
.foot-links { display: flex; flex-direction: column; gap: .45rem; font-size: .88rem;
  a { color: #CFE0F2; text-decoration: none; } }
.foot-fine { max-width: 1080px; margin: 1.6rem auto 0; font-size: .74rem; color: #7E97B6; border-top: 1px solid #2C496E; padding-top: 1rem; }
</style>
