import { httpsCallable } from 'firebase/functions'
import { functions, firebaseEnabled } from './firebase'
import type { ExperimentMeta, ExpCSummary } from '@/types/experiment'
import type { Locale } from '@/i18n'

export interface ChatTurn { role: 'user' | 'model'; text: string }

const LANGUAGE_INSTRUCTION: Record<Locale, string> = {
  en: 'Answer in English, in 2–5 sentences, plainly.',
  ja: 'Answer in Japanese (日本語), in 2–5 sentences, plainly. 専門用語は適切な日本語で。',
}

export function buildContext(
  experiments: ExperimentMeta[],
  summary: ExpCSummary | null,
  locale: Locale = 'en',
): string {
  let s =
    'You are a concise research assistant for the ISC (Ingest-time Semantic Compilation) experiments. ' +
    'ISC = compile semantic labour once at ingest into a persistent typed substrate; QSR = query-time ' +
    'semantic reconstruction (re-derive meaning every query, e.g. RAG). ' +
    'Break-even reads R* = (N·c_c + W·c_m)/(c_q − c_r). ' +
    LANGUAGE_INSTRUCTION[locale] + '\n\n'
  for (const e of experiments)
    s += `## ${e.name}\nPurpose: ${e.purpose}\nData: ${e.data}\nEvaluation: ${e.evaluation}\nStatus: ${e.status}\n\n`
  if (summary) s += '## Experiment C measured results (synthetic pilot)\n' + JSON.stringify(summary) + '\n'
  return s
}

// Calls the `geminiChat` Cloud Function, which holds the API key server-side and logs the
// question to Firestore. Never ships an API key to the client.
export async function askGemini(
  context: string,
  history: ChatTurn[],
  question: string,
): Promise<string> {
  if (!firebaseEnabled || !functions)
    throw new Error('Chat needs Firebase configured (set .env and deploy the geminiChat function, or run emulators).')
  const callable = httpsCallable<
    { context: string; history: ChatTurn[]; question: string },
    { text: string }
  >(functions, 'geminiChat')
  const res = await callable({ context, history, question })
  return res.data.text
}
