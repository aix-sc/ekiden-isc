import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

const iscLight = {
  dark: false,
  colors: {
    background: '#FBFAF7',
    surface: '#FFFFFF',
    primary: '#1F3A5F',   // navy
    secondary: '#117C6F', // teal
    error: '#C0392B',     // QSR red
    info: '#1F3A5F',
    'on-background': '#16263B',
    'on-surface': '#16263B',
  },
}

export const vuetify = createVuetify({
  theme: { defaultTheme: 'iscLight', themes: { iscLight } },
  defaults: {
    VCard: { rounded: 'lg', flat: true, border: true },
    VBtn: { rounded: 'lg', flat: true },
  },
})
