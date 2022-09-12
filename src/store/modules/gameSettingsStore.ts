import axios from "axios";

import { MAP_OPTIONS, MODE_OPTIONS } from "@/constants";

export interface GameSettingsState {
  selectedMap: string;
  selectedMode: string;
  selectedSize: number;
  selectedTime: number;
  playerName: string;
  playerId: string;
  isOwner: boolean;
  roomNumber: string;
  geoJSON: any;
}

const getDefaultState = (): GameSettingsState => ({
  selectedMap: MAP_OPTIONS[0].value,
  selectedMode: MODE_OPTIONS[0].value,
  selectedSize: 2,
  selectedTime: 1,
  playerName: "",
  playerId: "",
  isOwner: true,
  roomNumber: "",
  geoJSON: null,
});

export const gameSettingsStore = {
  state: () => getDefaultState(),
  getters: {
    selectedMapText(state: GameSettingsState) {
      const idx = MAP_OPTIONS.findIndex(
        (option) => option.value === state.selectedMap
      );
      return idx >= 0 ? MAP_OPTIONS[idx].text : "";
    },
    isReadyForMultiplayerGame(state: GameSettingsState) {
      if (state.isOwner) {
        return state.playerName !== "";
      } else {
        return (
          state.playerName !== "" &&
          !isNaN(Number(state.roomNumber)) &&
          state.roomNumber !== ""
        );
      }
    },
  },
  mutations: {
    resetGameSettingsState(state: GameSettingsState) {
      Object.assign(state, getDefaultState());
    },
    changeSelectedMap(state: GameSettingsState, value: string) {
      state.selectedMap = value;
    },
    changeSelectedMode(state: GameSettingsState, value: string) {
      state.selectedMode = value;
    },
    changeSelectedSize(state: GameSettingsState, value: number) {
      state.selectedSize = value;
    },
    changeSelectedTime(state: GameSettingsState, value: number) {
      state.selectedTime = value;
    },
    changePlayerName(state: GameSettingsState, value: string) {
      state.playerName = value;
    },
    savePlayerId(state: GameSettingsState, value: string) {
      state.playerId = value;
    },
    switchIsOwner(state: GameSettingsState, value: boolean) {
      state.isOwner = value;
    },
    changeRoomNumber(state: GameSettingsState, value: string) {
      state.roomNumber = value;
    },
    fetchGeoJSON(state: GameSettingsState, value: any) {
      state.geoJSON = value;
    },
  },
  actions: {
    resetGameSettingsStateAction({ commit }: any) {
      commit("resetGameSettingsState");
    },
    changeSelectedMapAction({ commit }: any, payload: any) {
      commit("changeSelectedMap", payload.selectedMap);
    },
    changeSelectedModeAction({ commit }: any, payload: any) {
      commit("changeSelectedMode", payload.selectedMode);
    },
    changeSelectedSizeAction({ commit }: any, payload: any) {
      commit("changeSelectedSize", payload.selectedSize);
    },
    changeSelectedTimeAction({ commit }: any, payload: any) {
      commit("changeSelectedTime", payload.selectedTime);
    },
    changePlayerNameAction({ commit }: any, payload: any) {
      commit("changePlayerName", payload.playerName);
    },
    savePlayerIdAction({ commit }: any, payload: any) {
      commit("savePlayerId", payload.playerId);
    },
    switchIsOwnerAction({ commit }: any, payload: any) {
      commit("switchIsOwner", payload.isOwner);
    },
    changeRoomNumberAction({ commit }: any, payload: any) {
      commit("changeRoomNumber", payload.roomNumber);
    },
    async fetchGeoJSONAction({ commit }: any, payload: any) {
      try {
        const resp = await axios.get(
          `${process.env.BASE_URL}geoJSON/${payload.countryCode}.json`
        );
        if (resp.status === 200 && resp.data) {
          const json = JSON.parse(JSON.stringify(resp.data));
          commit("fetchGeoJSON", json);
        }
        return resp;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
