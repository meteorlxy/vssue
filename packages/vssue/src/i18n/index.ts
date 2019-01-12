import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enUS from './lang/en-US'
import zhCN from './lang/zh-CN'

if (!Vue.prototype.hasOwnProperty('$i18n')) {
  Vue.use(VueI18n)
}

const messages = {
  'en': enUS,
  'en-US': enUS,
  'zh': zhCN,
  'zh-CN': zhCN,
}

const locales = Object.keys(messages)
const navLangs = window.navigator.languages
const defaultLocale = navLangs.filter(item => locales.includes(item)).shift() || 'en'

const i18n: VueI18n = new VueI18n({
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages,
})

export default i18n
