export interface InGameState {
  randomLatLng: google.maps.LatLng | null;
  selectedLatLng: google.maps.LatLng | null;
  score: number;
  round: number;
}

export const inGameStore = {
  state: () => ({
    randomLatLng: null,
    selectedLatLng: null,
    score: 0,
    round: 1,
  }),
  mutations: {
    saveRandomLatLng(state: InGameState, value: google.maps.LatLng) {
      state.randomLatLng = value;
    },
    saveSelectedLatLng(state: InGameState, value: google.maps.LatLng) {
      state.selectedLatLng = value;
    },
    saveScore(state: InGameState, value: number) {
      state.score += value;
    },
    proceedToNextRound(state: InGameState) {
      state.round += 1;
    },
  },
  actions: {
    saveRandomLatLngAction({ commit }: any, payload: any) {
      commit("saveRandomLatLng", payload.randomLatLng);
    },
    saveSelectedLatLngAction({ commit }: any, payload: any) {
      commit("saveSelectedLatLng", payload.selectedLatLng);
    },
    saveScoreAction({ commit }: any, payload: any) {
      commit("saveScore", payload.score);
    },
    proceedToNextRoundAction({ commit }: any) {
      commit("proceedToNextRound");
    },
  },
};
