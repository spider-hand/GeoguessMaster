import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const HomeView = () => import("@/views/HomeView.vue");
const GameView = () => import("@/views/GameView.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/game",
    name: "game",
    component: GameView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
