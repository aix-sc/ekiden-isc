import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, type Locale } from '@/i18n'

// Thin wrapper exposing the current locale + a setter that persists the choice.
export function useLocale() {
  const { locale } = useI18n()
  const current = computed<Locale>(() => locale.value as Locale)
  function change(l: Locale) {
    setLocale(l)
  }
  return { current, change }
}
