import { MapTypes, ModeTypes } from "@/types";

export interface GameSettingsState {
  selectedMap: MapTypes;
  selectedMode: ModeTypes;
  selectedSize: number;
  selectedTime: number;
  playerName: string;
  playerId: string;
  isOwner: boolean;
  roomNumber: string;
  isStartingGame: boolean;
}

const getDefaultState = (): GameSettingsState => ({
  selectedMap: "world",
  selectedMode: "single",
  selectedSize: 2,
  selectedTime: 5,
  playerName: "",
  playerId: "",
  isOwner: true,
  roomNumber: "",
  isStartingGame: false,
});

export const gameSettingsStore = {
  state: () => getDefaultState(),
  getters: {
    isReadyForMultiplayerGame(state: GameSettingsState) {
      if (state.isStartingGame) return false;

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
    changeSelectedMap(state: GameSettingsState, value: MapTypes) {
      state.selectedMap = value;
    },
    changeSelectedMode(state: GameSettingsState, value: ModeTypes) {
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
    clickStartButton(state: GameSettingsState) {
      state.isStartingGame = true;
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
    onClickStartButtonAction({ commit }: any) {
      commit("clickStartButton");
    },
  },
};
