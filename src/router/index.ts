import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Home from "@/views/Home.vue";
import Game from "@/views/Game.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/game",
    name: "game",
    component: Game,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
