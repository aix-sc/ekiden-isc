import { createApp } from 'vue'
import App from './App.vue'
import { vuetify } from './plugins/vuetify'
import { i18n } from './i18n'
import './styles/main.scss'

document.documentElement.lang = i18n.global.locale.value

createApp(App).use(vuetify).use(i18n).mount('#app')
