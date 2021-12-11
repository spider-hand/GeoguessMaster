import { GameHistory } from "@/types";

export interface InGameState {
  randomLatLng: google.maps.LatLng | null;
  selectedLatLng: google.maps.LatLng | null;
  gameHistory: Array<GameHistory>;
  score: number;
  round: number;
  isShowingResult: boolean;
  isShowingSummary: boolean;
}

const getDefaultState = (): InGameState => ({
  randomLatLng: null,
  selectedLatLng: null,
  gameHistory: [],
  score: 0,
  round: 1,
  isShowingResult: false,
  isShowingSummary: false,
});

export const inGameStore = {
  state: () => getDefaultState(),
  getters: {
    distance(state: InGameState) {
      if (state.randomLatLng && state.selectedLatLng) {
        return Math.floor(
          google.maps.geometry.spherical.computeDistanceBetween(
            state.randomLatLng,
            state.selectedLatLng
          ) / 1000
        );
      } else {
        return null;
      }
    },
  },
  mutations: {
    resetInGameState(state: InGameState) {
      Object.assign(state, getDefaultState());
    },
    saveRandomLatLng(state: InGameState, value: google.maps.LatLng) {
      state.randomLatLng = value;
    },
    saveSelectedLatLng(state: InGameState, value: google.maps.LatLng) {
      state.selectedLatLng = value;
    },
    updateGameHistory(state: InGameState, value: GameHistory) {
      state.gameHistory.push(value);
    },
    saveScore(state: InGameState, value: number) {
      state.score += value;
    },
    saveIsShowingResult(state: InGameState, value: boolean) {
      state.isShowingResult = value;
    },
    saveIsShowingSummary(sttae: InGameState, value: boolean) {
      sttae.isShowingSummary = value;
    },
    proceedToNextRound(state: InGameState) {
      state.round += 1;
    },
  },
  actions: {
    resetInGameStateAction({ commit }: any) {
      commit("resetInGameState");
    },
    saveRandomLatLngAction({ commit }: any, payload: any) {
      commit("saveRandomLatLng", payload.randomLatLng);
    },
    saveSelectedLatLngAction({ commit }: any, payload: any) {
      commit("saveSelectedLatLng", payload.selectedLatLng);
    },
    updateGameHistoryAction({ commit }: any, payload: any) {
      commit("updateGameHistory", payload.gameHistory);
    },
    saveScoreAction({ commit }: any, payload: any) {
      commit("saveScore", payload.score);
    },
    saveIsShowingResultAction({ commit }: any, payload: any) {
      commit("saveIsShowingResult", payload.isShowingResult);
    },
    saveIsShowingSummaryAction({ commit }: any, payload: any) {
      commit("saveIsShowingSummary", payload.isShowingSummary);
    },
    proceedToNextRoundAction({ commit }: any) {
      commit("proceedToNextRound");
      commit("saveIsShowingResult", false);
      commit("saveRandomLatLng", null);
      commit("saveSelectedLatLng", null);
    },
  },
};
