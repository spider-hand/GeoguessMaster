import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

import {
  gameSettingsStore,
  GameSettingsState,
} from "./modules/gameSettingsStore";
import { inGameStore, InGameState } from "./modules/inGameStore";
import {
  generalSettingsStore,
  GeneralSettingsState,
} from "./modules/generalSettingsStore";

export interface MyState {
  generalSettings: GeneralSettingsState;
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
    generalSettings: generalSettingsStore,
    gameSettings: gameSettingsStore,
    inGame: inGameStore,
  },
});

if ((window as any).Cypress) {
  (window as any).__store__ = store;
}
