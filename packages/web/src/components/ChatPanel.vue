<script setup lang="ts">
import { ref, nextTick, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ExperimentMeta, ExpCSummary } from '@/types/experiment'
import { askGemini, buildContext, type ChatTurn } from '@/services/gemini'
import { firebaseEnabled } from '@/services/firebase'
import { useLocale } from '@/composables/useLocale'
import GeminiStar from '@/components/GeminiStar.vue'

const props = defineProps<{ experiments: ExperimentMeta[]; summary: ExpCSummary | null }>()
defineEmits<{ close: [] }>()
const { t, tm } = useI18n()
const { current } = useLocale()

interface Msg { who: 'user' | 'bot'; text: string; greeting?: boolean }
const messages = ref<Msg[]>([
  { who: 'bot', text: t('chat.greeting'), greeting: true },
])
const input = ref('')
const busy = ref(false)
const history: ChatTurn[] = []
const log = ref<HTMLElement | null>(null)
const suggestions = computed<string[]>(() => tm('chat.suggestions') as string[])

// Keep the initial greeting in sync with the active language (until the user chats).
watch(current, () => {
  if (messages.value.length === 1 && messages.value[0].greeting) {
    messages.value[0].text = t('chat.greeting')
  }
})

async function scrollToEnd() {
  await nextTick()
  if (log.value) log.value.scrollTop = log.value.scrollHeight
}
watch(messages, scrollToEnd, { deep: true })

async function send(text: string) {
  const q = text.trim()
  if (!q || busy.value) return
  messages.value.push({ who: 'user', text: q })
  input.value = ''
  busy.value = true
  try {
    const context = buildContext(props.experiments, props.summary, current.value)
    const answer = await askGemini(context, history, q)
    history.push({ role: 'user', text: q })
    history.push({ role: 'model', text: answer })
    messages.value.push({ who: 'bot', text: answer })
  } catch (e) {
    messages.value.push({ who: 'bot', text: (e as Error).message })
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="panel">
    <header class="head">
      <div class="title">
        <span class="ico"><GeminiStar /></span>
        <div>
          <p class="kicker mb-0">{{ t('chat.kicker') }}</p>
          <p class="name">{{ t('chat.name') }}</p>
        </div>
      </div>
      <v-btn icon="mdi-close" variant="text" size="small" class="close" :aria-label="t('chat.close')"
             @click="$emit('close')" />
    </header>

    <v-alert v-if="!firebaseEnabled" type="info" variant="tonal" class="ma-3" density="comfortable">
      {{ t('chat.notConfigured') }}
    </v-alert>

    <div ref="log" class="log">
      <div v-for="(m, i) in messages" :key="i" class="msg" :class="`msg-${m.who}`">{{ m.text }}</div>
      <div v-if="busy" class="msg msg-bot typing">{{ t('chat.thinking') }}</div>
    </div>

    <div class="sug">
      <v-chip v-for="s in suggestions" :key="s" size="x-small" variant="outlined" @click="send(s)">{{ s }}</v-chip>
    </div>

    <div class="input">
      <v-text-field v-model="input" :placeholder="t('chat.placeholder')" density="compact" hide-details
                    variant="outlined" :disabled="busy" @keyup.enter="send(input)" />
      <v-btn color="primary" :loading="busy" icon="mdi-send" :aria-label="t('chat.send')" @click="send(input)" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.panel { display: flex; flex-direction: column; height: 100%; background: var(--paper); overflow: hidden; }

.head {
  display: flex; align-items: center; justify-content: space-between;
  padding: .8rem 1rem; border-bottom: 1px solid var(--line); background: #fff;
}
.title { display: flex; align-items: center; gap: .65rem; }
.ico { width: 30px; height: 30px; flex: none; }
.name { font-family: var(--serif); font-weight: 600; color: var(--navy); font-size: 1rem; line-height: 1.1; }
.close { margin-right: -.4rem; }

.log { flex: 1 1 auto; padding: 1.1rem; display: flex; flex-direction: column; gap: .7rem; overflow-y: auto; min-height: 0; }
.msg { max-width: 88%; padding: .65rem .95rem; border-radius: 13px; font-size: .9rem; line-height: 1.55; white-space: pre-wrap; }
.msg-bot { align-self: flex-start; background: var(--p2); border: 1px solid var(--line); color: var(--ink); }
.msg-user { align-self: flex-end; background: var(--navy); color: #fff; }
.typing { color: var(--mute); font-style: italic; }

.sug { display: flex; flex-wrap: wrap; gap: .4rem; padding: .2rem 1rem .8rem; flex: none; }
.input {
  display: flex; gap: .5rem; align-items: center; flex: none;
  padding: .8rem 1rem; border-top: 1px solid var(--line); background: var(--paper);
}
</style>
