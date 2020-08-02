import Vue from 'vue'
import VueI18n from 'vue-i18n'

import cs from './TranslationsCS'
import en from './TranslationsEN'
import ja from './TranslationsJA'

Vue.use(VueI18n)

const translations = Object.assign(cs, en, ja)

var languages = ['cs', 'en', 'ja',]

function checkLanguage(language: string) {
  return navigator.language.split('-')[0] == language
}

export default new VueI18n({
  locale: localStorage.getItem('languages') != null
    ? localStorage.getItem('language') as string
    : (languages.some(checkLanguage) 
      ? navigator.language.split('-')[0] 
      : 'en'),
  fallbackLocale: 'en',
  messages: translations,
})