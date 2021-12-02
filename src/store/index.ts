import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

import { MAP_OPTIONS, MODE_OPTIONS } from "@/constants";

export interface MyState {
  selectedMap: string;
  selectedMode: string;
}

export const key: InjectionKey<Store<MyState>> = Symbol();

export const store = createStore({
  state: {
    selectedMap: MAP_OPTIONS[0].value,
    selectedMode: MODE_OPTIONS[0].value,
  },
  getters: {
    buttonText(state) {
      return state.selectedMode === "single" ? "START" : "CREATE ROOM";
    },
  },
  mutations: {
    changeSelectedMap(state, value) {
      state.selectedMap = value;
    },
    changeSelectedMode(state, value) {
      state.selectedMode = value;
    },
  },
  actions: {
    changeSelectedMapAction({ commit }, payload) {
      commit("changeSelectedMap", payload.selectedMap);
    },
    changeSelectedModeAction({ commit }, payload) {
      commit("changeSelectedMode", payload.selectedMode);
    },
  },
  modules: {},
});
