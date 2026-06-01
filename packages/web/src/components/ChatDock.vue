<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import type { ExperimentMeta, ExpCSummary } from '@/types/experiment'
import ChatPanel from '@/components/ChatPanel.vue'
import GeminiStar from '@/components/GeminiStar.vue'

defineProps<{ experiments: ExperimentMeta[]; summary: ExpCSummary | null }>()
const { t } = useI18n()

// mdAndUp (>=960px) → persistent right rail; below → FAB + popup dialog.
// Matches the right-padding media query reserved on <v-main> in App.vue.
const { mdAndUp } = useDisplay()
const open = ref(false)
</script>

<template>
  <!-- Desktop: persistent right-side rail -->
  <aside v-if="mdAndUp" class="rail">
    <ChatPanel :experiments="experiments" :summary="summary" @close="() => {}" />
  </aside>

  <!-- Mobile/tablet: floating Gemini-star button that opens a popup -->
  <template v-else>
    <button v-show="!open" class="fab" :aria-label="t('chat.open')" @click="open = true">
      <span class="fab-star"><GeminiStar /></span>
    </button>

    <v-dialog v-model="open" :scrim="true" transition="dialog-bottom-transition" class="chat-dialog">
      <div class="sheet">
        <ChatPanel :experiments="experiments" :summary="summary" @close="open = false" />
      </div>
    </v-dialog>
  </template>
</template>

<style scoped lang="scss">
$rail-w: 360px;

/* Persistent right rail (desktop). Fixed below the 58px app bar. */
.rail {
  position: fixed;
  top: 58px;
  right: 0;
  width: $rail-w;
  height: calc(100vh - 58px);
  border-left: 1px solid var(--line);
  background: var(--paper);
  z-index: 1004;
  box-shadow: -8px 0 24px -18px rgba(15, 30, 50, .35);
}

/* Floating action button (mobile). */
.fab {
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: 0 8px 22px -6px rgba(15, 30, 50, .4);
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 1004;
  padding: 0;
  transition: transform .15s ease, box-shadow .15s ease;
}
.fab:hover { transform: translateY(-2px); box-shadow: 0 12px 26px -6px rgba(15, 30, 50, .5); }
.fab:active { transform: translateY(0); }
.fab-star { width: 30px; height: 30px; }

/* Popup sheet (mobile). The v-dialog content max-width is constrained here. */
.chat-dialog :deep(.v-overlay__content) {
  margin: 0;
  align-self: flex-end;
  width: 100%;
  max-width: 480px;
}
.sheet {
  height: min(78vh, 620px);
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  background: var(--paper);
}
@media (min-width: 600px) {
  .chat-dialog :deep(.v-overlay__content) { align-self: center; }
  .sheet { border-radius: 16px; height: min(76vh, 640px); }
}
</style>
