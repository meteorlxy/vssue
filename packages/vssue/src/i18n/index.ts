import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enUS from './lang/en-US'
import zhCN from './lang/zh-CN'

if (!Vue.prototype.hasOwnProperty('$i18n')) {
  Vue.use(VueI18n)
}

const i18n: VueI18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    'en': enUS,
    'en-US': enUS,
    'zh': zhCN,
    'zh-CN': zhCN,
  },
})

export default i18n
