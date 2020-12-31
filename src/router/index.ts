import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home.vue'
import StreetView from '@/pages/StreetView.vue'
import StreetViewWithFriends from '@/pages/StreetViewWithFriends.vue'

Vue.use(Router)

export default new Router ({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/street-view',
      name: 'street-view',
      component: StreetView,
    },
    {
      path: '/street-view/with-friends',
      name: 'with-friends',
      component: StreetViewWithFriends,
      props: (route) => {
        return {
          roomName: route.params.roomName,
          playerNumber: Number(route.params.playerNumber),
        }
      },
    },
  ],
})