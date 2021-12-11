import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

import {
  gameSettingsStore,
  GameSettingsState,
} from "./modules/gameSettingsStore";
import { inGameStore, InGameState } from "./modules/inGameStore";

export interface MyState {
  gameSettings: GameSettingsState;
  inGame: InGameState;
}

export const key: InjectionKey<Store<MyState>> = Symbol();

export const store = createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    gameSettings: gameSettingsStore,
    inGame: inGameStore,
  },
});
