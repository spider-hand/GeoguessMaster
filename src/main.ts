import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import i18n from '@/lang'
import firebase from '@/firebase'
import VueCompositionAPI from '@vue/composition-api'
import './registerServiceWorker'

Vue.config.productionTip = false

// Composition API
Vue.use(VueCompositionAPI)

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
