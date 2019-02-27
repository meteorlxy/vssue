import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enUS from './langs/en-US'
import zhCN from './langs/zh-CN'
import ptBR from './langs/pt-BR'

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
    'pt': ptBR,
    'pt-BR': ptBR,
  },
})

export default i18n
