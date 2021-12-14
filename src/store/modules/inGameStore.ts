import { GameHistory } from "@/types";

declare interface DistanceByPlayer {
  playerName: string;
  distance: number;
}

export interface InGameState {
  randomLatLng: google.maps.LatLng | null;
  selectedLatLng: google.maps.LatLng | null;
  selectedLatLngArr: Array<google.maps.LatLng>;
  gameHistory: Array<GameHistory>;
  distanceByPlayerArr: Array<DistanceByPlayer>;
  score: number;
  round: number;
  isThisRoundReady: boolean;
  isNextRoundReady: boolean;
  isWaitingForOtherPlayers: boolean;
  isShowingResult: boolean;
  isShowingSummary: boolean;
}

const getDefaultState = (): InGameState => ({
  randomLatLng: null,
  selectedLatLng: null,
  selectedLatLngArr: [],
  gameHistory: [],
  distanceByPlayerArr: [],
  score: 0,
  round: 1,
  isThisRoundReady: false,
  isNextRoundReady: false,
  isWaitingForOtherPlayers: false,
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
    updateSelectedLatLngArr(state: InGameState, value: google.maps.LatLng) {
      state.selectedLatLngArr.push(value);
    },
    resetSelectedLatLngArr(state: InGameState) {
      state.selectedLatLngArr = [];
    },
    updateGameHistory(state: InGameState, value: GameHistory) {
      state.gameHistory.push(value);
    },
    updateDistanceByPlayerArr(state: InGameState, value: DistanceByPlayer) {
      state.distanceByPlayerArr.push(value);
    },
    resetDistanceByPlayerArr(state: InGameState) {
      state.distanceByPlayerArr = [];
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
    saveIsThisRoundReady(state: InGameState, value: boolean) {
      state.isThisRoundReady = value;
    },
    saveIsNextRoundReady(state: InGameState, value: boolean) {
      state.isNextRoundReady = value;
    },
    saveIsWaitingForOtherPlayers(state: InGameState, value: boolean) {
      state.isWaitingForOtherPlayers = value;
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
    updateSelectedLatLngArrAction({ commit }: any, payload: any) {
      commit("updateSelectedLatLngArr", payload.selectedLatLng);
    },
    updateGameHistoryAction({ commit }: any, payload: any) {
      commit("updateGameHistory", payload.gameHistory);
    },
    updateDistanceByPlayerArrAction({ commit }: any, payload: any) {
      commit("updateDistanceByPlayerArr", payload.distanceByPlayer);
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
      commit("saveIsThisRoundReady", false);
      commit("saveIsNextRoundReady", false);
      commit("saveIsShowingResult", false);
      commit("saveRandomLatLng", null);
      commit("saveSelectedLatLng", null);
      commit("resetSelectedLatLngArr");
      commit("resetDistanceByPlayerArr");
    },
    saveIsThisRoundReadyAction({ commit }: any, payload: any) {
      commit("saveIsThisRoundReady", payload.isThisRoundReady);
    },
    saveIsNextRoundReadyAction({ commit }: any, payload: any) {
      commit("saveIsNextRoundReady", payload.isNextRoundReady);
    },
    saveIsWaitingForOtherPlayersAction({ commit }: any, payload: any) {
      commit("saveIsWaitingForOtherPlayers", payload.isWaitingForOtherPlayers);
    },
  },
};
