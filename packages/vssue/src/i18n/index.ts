import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enUS from './langs/en-US';
import zhCN from './langs/zh-CN';
import zhTW from './langs/zh-TW';
import ptBR from './langs/pt-BR';
import jaJP from './langs/ja-JP';
import heIL from './langs/he-IL';
import koKR from './langs/ko-KR';
import frFR from './langs/fr-FR';
import idID from './langs/id-ID';

if (!Object.prototype.hasOwnProperty.call(Vue, '$i18n')) {
  Vue.use(VueI18n);
}

const i18n: VueI18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: enUS,
    'en-US': enUS,
    zh: zhCN,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    pt: ptBR,
    'pt-BR': ptBR,
    ja: jaJP,
    'ja-JP': jaJP,
    he: heIL,
    'he-IL': heIL,
    ko: koKR,
    'ko-KR': koKR,
    fr: frFR,
    'fr-FR': frFR,
    id: idID,
    'id-ID': idID,
  },
});

export default i18n;
