<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExperiments } from '@/composables/useExperiments'
import { GITHUB_URL } from '@/data/experiments'
import type { ExperimentMeta } from '@/types/experiment'
import AppHeader from '@/components/AppHeader.vue'
import HeroSection from '@/components/HeroSection.vue'
import OverviewSection from '@/components/OverviewSection.vue'
import ExperimentsSection from '@/components/ExperimentsSection.vue'
import NextRunSection from '@/components/NextRunSection.vue'
import FaqSection from '@/components/FaqSection.vue'
import ChatDock from '@/components/ChatDock.vue'

const { t } = useI18n()
const { experiments, summary, costRows } = useExperiments()
const byId = (id: string): ExperimentMeta =>
  experiments.value.find((e) => e.id === id) ?? experiments.value[0]
const metaNext = computed(() => byId('NEXT'))
</script>

<template>
  <v-app>
    <AppHeader />
    <v-main class="shell">
      <HeroSection :summary="summary" />
      <v-container class="wrap">
        <OverviewSection />
        <ExperimentsSection :experiments="experiments" :summary="summary" :cost-rows="costRows" />
        <NextRunSection :meta="metaNext" />
        <FaqSection />
      </v-container>
      <footer class="foot">
        <div class="foot-team">
          <p class="foot-team-label">{{ t('footer.team') }}</p>
          <div class="foot-team-grid">
            <article class="foot-person">
              <img class="foot-avatar" src="/team/kyle.jpg" alt="Kyle Wild" width="76" height="76" loading="lazy" />
              <div class="foot-person-meta">
                <p class="foot-person-name serif">Kyle Wild</p>
                <p class="foot-person-role">{{ t('footer.kyleRole') }}</p>
                <p class="foot-person-bio">{{ t('footer.kyleBio') }}</p>
              </div>
            </article>
            <article class="foot-person">
              <img class="foot-avatar" src="/team/yusuke.jpg" alt="Yusuke Takahashi" width="76" height="76" loading="lazy" />
              <div class="foot-person-meta">
                <p class="foot-person-name serif">Yusuke Takahashi</p>
                <p class="foot-person-role">{{ t('footer.yusukeRole') }}</p>
                <p class="foot-person-bio">{{ t('footer.yusukeBio') }}</p>
              </div>
            </article>
          </div>
        </div>
        <div class="foot-inner">
          <p class="foot-title serif">{{ t('footer.title') }}</p>
          <div class="foot-links">
            <a href="https://muds.ac" target="_blank" rel="noopener">{{ t('footer.muds') }}</a>
            <a href="https://github.com/aix-sc" target="_blank" rel="noopener">{{ t('footer.aix') }}</a>
            <a href="#" rel="noopener">{{ t('footer.lab') }}</a>
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
.foot-links { display: flex; flex-direction: column; gap: .45rem; font-size: .88rem;
  a { color: #CFE0F2; text-decoration: none; } }
.foot-fine { max-width: 1080px; margin: 1.6rem auto 0; font-size: .74rem; color: #7E97B6; border-top: 1px solid #2C496E; padding-top: 1rem; }
.foot-team { max-width: 1080px; margin: 0 auto 1.9rem; }
.foot-team-label {
  font-family: var(--mono); font-size: .72rem; letter-spacing: .14em; text-transform: uppercase;
  color: #5BC2B5; display: flex; align-items: center; gap: .8rem; margin: 0 0 1.2rem;
}
.foot-team-label::after { content: ''; flex: 1; height: 1px; background: #2C496E; }
.foot-team-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 2.4rem; }
.foot-person { display: flex; gap: .95rem; align-items: flex-start; }
.foot-avatar {
  flex: 0 0 auto; width: 76px; height: 76px; border-radius: 50%; object-fit: cover; background: #2C496E;
  box-shadow: 0 0 0 1px rgba(255,255,255,.16); transition: box-shadow .25s ease, transform .25s ease;
}
.foot-person:hover .foot-avatar { box-shadow: 0 0 0 2px #5BC2B5; transform: translateY(-2px); }
.foot-person-meta { min-width: 0; }
.foot-person-name { font-size: 1.05rem; font-weight: 600; color: #fff; line-height: 1.2; margin: 0; }
.foot-person-role {
  font-family: var(--mono); font-size: .68rem; letter-spacing: .04em; text-transform: uppercase;
  color: #5BC2B5; margin: .2rem 0 0;
}
.foot-person-bio { font-size: .8rem; line-height: 1.55; color: #B9CAE0; margin: .45rem 0 0; }
@media (max-width: 640px) { .foot-team-grid { grid-template-columns: 1fr; } }
</style>
