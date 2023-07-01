import { useGameSettingsStore } from "@/stores/gameSettings";
import { useInGameStore } from "@/stores/inGame";
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

router.beforeEach((to) => {
  if (to.path === "/") {
    const gameSettingsStore = useGameSettingsStore();
    gameSettingsStore.resetGameSettingsState();

    const inGameStore = useInGameStore();
    inGameStore.resetInGameState();
  }
});

export default router;
