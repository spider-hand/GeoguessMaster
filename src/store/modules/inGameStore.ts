import { GameHistory } from "@/types";

declare interface DistanceByPlayer {
  playerName: string;
  distance: number;
}

export interface InGameState {
  randomLatLng: google.maps.LatLng | null;
  selectedLatLng: google.maps.LatLng | null;
  selectedLatLngArr: Array<google.maps.LatLng>;
  panorama: google.maps.StreetViewPanorama | null;
  gameHistory: Array<GameHistory>;
  distanceByPlayerArr: Array<DistanceByPlayer>;
  score: number;
  round: number;
  hasTimerStarted: boolean;
  isThisRoundReady: boolean;
  isNextRoundReady: boolean;
  isWaitingForOtherPlayers: boolean;
  isShowingResult: boolean;
  isShowingSummary: boolean;
  isMakeGuessButtonClicked: boolean;
}

const getDefaultState = (): InGameState => ({
  randomLatLng: null,
  selectedLatLng: null,
  selectedLatLngArr: [],
  panorama: null,
  gameHistory: [],
  distanceByPlayerArr: [],
  score: 0,
  round: 1,
  hasTimerStarted: false,
  isThisRoundReady: false,
  isNextRoundReady: false,
  isWaitingForOtherPlayers: false,
  isShowingResult: false,
  isShowingSummary: false,
  isMakeGuessButtonClicked: false,
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
    savePanorama(state: InGameState, value: google.maps.StreetViewPanorama) {
      state.panorama = value;
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
    saveHasTimerStarted(state: InGameState, value: boolean) {
      state.hasTimerStarted = value;
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
    saveIsMakeGuessButtonClicked(state: InGameState, value: boolean) {
      state.isMakeGuessButtonClicked = value;
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
    savePanoramaAction({ commit }: any, payload: any) {
      commit("savePanorama", payload.panorama);
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
    saveHasTimerStartedAction({ commit }: any, payload: any) {
      commit("saveHasTimerStarted", payload.hasTimerStarted);
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
      commit("saveHasTimerStarted", false);
      commit("saveIsShowingResult", false);
      commit("saveIsMakeGuessButtonClicked", false);
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
    saveIsMakeGuessButtonClickedAction({ commit }: any, payload: any) {
      commit("saveIsMakeGuessButtonClicked", payload.isMakeGuessButtonClicked);
    },
  },
};
