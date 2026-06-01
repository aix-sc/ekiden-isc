import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

initializeApp()

const GEMINI_KEY = defineSecret('GEMINI_KEY')
const MODEL = 'gemini-2.5-flash'

interface ChatTurn { role: 'user' | 'model'; text: string }
interface ChatRequest { context?: string; history?: ChatTurn[]; question?: string }

interface GeminiPart { text?: string }
interface GeminiResponse {
  error?: { message?: string }
  candidates?: { content?: { parts?: GeminiPart[] } }[]
}

// Server-side Gemini proxy: keeps the API key in a Secret, never on the client.
// Grounds answers in the experiment context, and logs the question to Firestore.
export const geminiChat = onCall(
  { secrets: [GEMINI_KEY], cors: true, region: 'us-central1' },
  async (req): Promise<{ text: string }> => {
    const { context, history, question } = (req.data ?? {}) as ChatRequest
    if (!question || typeof question !== 'string')
      throw new HttpsError('invalid-argument', 'A "question" string is required.')

    const turns = Array.isArray(history) ? history : []
    const contents = [
      ...turns.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: question }] },
    ]
    const body = {
      systemInstruction: { parts: [{ text: String(context ?? '') }] },
      contents,
      generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY.value()}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    )
    const data = (await res.json()) as GeminiResponse
    if (data.error) throw new HttpsError('internal', data.error.message ?? 'Gemini API error')

    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') || '(no response)'

    await getFirestore()
      .collection('questions')
      .add({ question, answerChars: text.length, at: FieldValue.serverTimestamp() })

    return { text }
  },
)
