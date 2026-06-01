import { createI18n } from 'vue-i18n'
import { en, ja } from './messages'

export type Locale = 'en' | 'ja'
const STORAGE_KEY = 'isc-locale'

// Saved choice wins; otherwise auto-detect from the browser (ja* → Japanese).
export function resolveInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'ja') return saved
  } catch {
    /* ignore storage errors */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'en'
  return nav?.toLowerCase().startsWith('ja') ? 'ja' : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: resolveInitialLocale(),
  fallbackLocale: 'en',
  messages: { en, ja },
})

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* ignore storage errors */
  }
  if (typeof document !== 'undefined') document.documentElement.lang = locale
}
