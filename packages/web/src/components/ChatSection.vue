<script setup lang="ts">
import { ref } from 'vue'
import type { ExperimentMeta, ExpCSummary } from '@/types/experiment'
import { askGemini, buildContext, type ChatTurn } from '@/services/gemini'
import { firebaseEnabled } from '@/services/firebase'

const props = defineProps<{ experiments: ExperimentMeta[]; summary: ExpCSummary | null }>()

interface Msg { who: 'user' | 'bot'; text: string }
const messages = ref<Msg[]>([
  { who: 'bot', text: 'Hi — I can answer questions about these ISC experiments. Try: “Why is incremental maintenance cheaper as the corpus grows?”' },
])
const input = ref('')
const busy = ref(false)
const history: ChatTurn[] = []
const suggestions = [
  'What does R* mean and how is it computed?',
  'Why is incremental maintenance cheaper as the corpus grows?',
  'What is the virtual axis update?',
  'How does ISC differ from RAG?',
]

async function send(text: string) {
  const q = text.trim()
  if (!q || busy.value) return
  messages.value.push({ who: 'user', text: q })
  input.value = ''
  busy.value = true
  try {
    const context = buildContext(props.experiments, props.summary)
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
  <section id="chat" class="block">
    <p class="kicker">05 · Ask the data</p>
    <h2 class="sec-title text-h5 mb-3">Chat with the results (Gemini)</h2>
    <p class="lede mb-4">Ask anything about the experiments — purpose, data, methods, the numbers.
      The assistant is grounded in this page's experiment context; the API key stays server-side in a Cloud Function.</p>

    <v-alert v-if="!firebaseEnabled" type="info" variant="tonal" class="mb-4" density="comfortable">
      Configure Firebase (<code>.env</code>) and deploy the <code>geminiChat</code> function — or run
      <code>firebase emulators:start</code> — to enable the chat. The rest of the page works offline.
    </v-alert>

    <v-card class="chat">
      <div class="log">
        <div v-for="(m, i) in messages" :key="i" class="msg" :class="`msg-${m.who}`">{{ m.text }}</div>
        <div v-if="busy" class="msg msg-bot typing">thinking…</div>
      </div>
      <div class="sug">
        <v-chip v-for="s in suggestions" :key="s" size="small" variant="outlined" @click="send(s)">{{ s }}</v-chip>
      </div>
      <div class="input">
        <v-text-field v-model="input" placeholder="Ask about the results…" density="compact" hide-details
                      variant="outlined" :disabled="busy" @keyup.enter="send(input)" />
        <v-btn color="primary" :loading="busy" @click="send(input)">Send</v-btn>
      </div>
    </v-card>
  </section>
</template>

<style scoped lang="scss">
.block { padding: clamp(2.2rem,5vw,3.6rem) 0; border-top: 1px solid var(--line); }
.lede { max-width: 62ch; color: var(--soft); }
.chat { overflow: hidden; }
.log { padding: 1.2rem; display: flex; flex-direction: column; gap: .8rem; max-height: 440px; overflow-y: auto; }
.msg { max-width: 82%; padding: .7rem 1rem; border-radius: 13px; font-size: .92rem; line-height: 1.55; white-space: pre-wrap; }
.msg-bot { align-self: flex-start; background: var(--p2); border: 1px solid var(--line); color: var(--ink); }
.msg-user { align-self: flex-end; background: var(--navy); color: #fff; }
.typing { color: var(--mute); font-style: italic; }
.sug { display: flex; flex-wrap: wrap; gap: .5rem; padding: 0 1.2rem 1rem; }
.input { display: flex; gap: .6rem; align-items: center; padding: 1rem 1.2rem; border-top: 1px solid var(--line); background: var(--paper); }
</style>
