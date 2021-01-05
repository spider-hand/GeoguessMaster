import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/vuetify'
import router from '@/router'
import firebase from 'firebase/app'
import 'firebase/analytics'
import VueCompositionAPI from '@vue/composition-api'
import './registerServiceWorker'

Vue.config.productionTip = false

// Composition API
Vue.use(VueCompositionAPI)

var firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_PROJECT_ID + ".firebaseapp.com",
  databaseURL: "https://" + process.env.VUE_APP_FIREBASE_PROJECT_ID + ".firebaseio.com",
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_PROJECT_ID + ".appspot.com",
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
}
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
firebaseApp.analytics()

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
