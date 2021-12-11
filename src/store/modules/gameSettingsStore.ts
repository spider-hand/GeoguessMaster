import { MAP_OPTIONS, MODE_OPTIONS } from "@/constants";

export interface GameSettingsState {
  selectedMap: string;
  selectedMode: string;
  selectedSize: number;
  selectedTime: number | null;
  playerName: string;
  isOwner: boolean;
  roomNumber: string;
}

const getDefaultState = (): GameSettingsState => ({
  selectedMap: MAP_OPTIONS[0].value,
  selectedMode: MODE_OPTIONS[0].value,
  selectedSize: 2,
  selectedTime: 1,
  playerName: "",
  isOwner: true,
  roomNumber: "",
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
        return state.playerName !== "" && state.roomNumber !== "";
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
    switchIsOwner(state: GameSettingsState, value: boolean) {
      state.isOwner = value;
    },
    changeRoomNumber(state: GameSettingsState, value: string) {
      state.roomNumber = value;
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
    switchIsOwnerAction({ commit }: any, payload: any) {
      commit("switchIsOwner", payload.isOwner);
    },
    changeRoomNumberAction({ commit }: any, payload: any) {
      commit("changeRoomNumber", payload.roomNumber);
    },
  },
};
