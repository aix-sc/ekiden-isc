<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExperiments } from '@/composables/useExperiments'
import { GITHUB_URL } from '@/data/experiments'
import type { ExperimentMeta } from '@/types/experiment'
import AppHeader from '@/components/AppHeader.vue'
import HeroSection from '@/components/HeroSection.vue'
import OverviewSection from '@/components/OverviewSection.vue'
import CostModelSection from '@/components/CostModelSection.vue'
import MaintenanceSection from '@/components/MaintenanceSection.vue'
import NextRunSection from '@/components/NextRunSection.vue'
import ChatDock from '@/components/ChatDock.vue'

const { t } = useI18n()
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
    <v-main class="shell">
      <HeroSection :summary="summary" />
      <v-container class="wrap">
        <OverviewSection />
        <CostModelSection :meta="metaA" />
        <MaintenanceSection :meta="metaC" :summary="summary" :cost-rows="costRows" />
        <NextRunSection :meta="metaNext" />
      </v-container>
      <footer class="foot">
        <div class="foot-inner">
          <div>
            <p class="foot-title serif">{{ t('footer.title') }}</p>
            <p class="foot-sub">{{ t('footer.authors') }}<span class="mono">{{ t('footer.motto') }}</span></p>
          </div>
          <div class="foot-links">
            <a :href="GITHUB_URL" target="_blank" rel="noopener">{{ t('footer.github') }}</a>
            <a href="https://www.cidrdb.org/cidr2027/" target="_blank" rel="noopener">{{ t('footer.cidr') }}</a>
            <a href="#top">{{ t('footer.backToTop') }}</a>
          </div>
        </div>
        <p class="foot-fine">{{ t('footer.fine') }}</p>
      </footer>
    </v-main>
    <ChatDock :experiments="experiments" :summary="summary" />
  </v-app>
</template>

<style scoped lang="scss">
/* Reserve room for the persistent chat rail (ChatDock) on desktop (>=960px). */
@media (min-width: 960px) {
  .shell { padding-right: 360px; }
}
.wrap { max-width: 1080px; }
.foot { background: var(--navy); color: #fff; padding: 2.4rem clamp(1rem,4vw,3rem) 1.6rem; }
.foot-inner { max-width: 1080px; margin: 0 auto; display: flex; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
.foot-title { font-size: 1.3rem; font-weight: 600; }
.foot-sub { color: #B9CAE0; font-size: .85rem; margin-top: .3rem; .mono { font-size: .78rem; color: #8FA9C9; } }
.foot-links { display: flex; flex-direction: column; gap: .45rem; font-size: .88rem;
  a { color: #CFE0F2; text-decoration: none; } }
.foot-fine { max-width: 1080px; margin: 1.6rem auto 0; font-size: .74rem; color: #7E97B6; border-top: 1px solid #2C496E; padding-top: 1rem; }
</style>
