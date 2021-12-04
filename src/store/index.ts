import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

import { MAP_OPTIONS, MODE_OPTIONS } from "@/constants";

export interface MyState {
  selectedMap: string;
  selectedMode: string;
  selectedSize: number;
  selectedTime: number | null;
  playerName: string;
  isOwner: boolean;
  roomNumber: string;
}

export const key: InjectionKey<Store<MyState>> = Symbol();

export const store = createStore({
  state: {
    selectedMap: MAP_OPTIONS[0].value,
    selectedMode: MODE_OPTIONS[0].value,
    selectedSize: 2,
    selectedTime: 1,
    playerName: "",
    isOwner: true,
    roomNumber: "",
  },
  getters: {
    isReadyForMultiplayerGame(state) {
      if (state.isOwner) {
        return state.playerName !== "";
      } else {
        return state.playerName !== "" && state.roomNumber !== "";
      }
    },
  },
  mutations: {
    changeSelectedMap(state, value) {
      state.selectedMap = value;
    },
    changeSelectedMode(state, value) {
      state.selectedMode = value;
    },
    changeSelectedSize(state, value) {
      state.selectedSize = value;
    },
    changeSelectedTime(state, value) {
      state.selectedTime = value;
    },
    changePlayerName(state, value) {
      state.playerName = value;
    },
    switchIsOwner(state, value) {
      state.isOwner = value;
    },
    changeRoomNumber(state, value) {
      state.roomNumber = value;
    },
  },
  actions: {
    changeSelectedMapAction({ commit }, payload) {
      commit("changeSelectedMap", payload.selectedMap);
    },
    changeSelectedModeAction({ commit }, payload) {
      commit("changeSelectedMode", payload.selectedMode);
    },
    changeSelectedSizeAction({ commit }, payload) {
      commit("changeSelectedSize", payload.selectedSize);
    },
    changeSelectedTimeAction({ commit }, payload) {
      commit("changeSelectedTime", payload.selectedTime);
    },
    changePlayerNameAction({ commit }, payload) {
      commit("changePlayerName", payload.playerName);
    },
    switchIsOwnerAction({ commit }, payload) {
      commit("switchIsOwner", payload.isOwner);
    },
    changeRoomNumberAction({ commit }, payload) {
      commit("changeRoomNumber", payload.roomNumber);
    },
  },
  modules: {},
});
