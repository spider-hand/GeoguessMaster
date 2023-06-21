import { DistanceByPlayer, GameHistory } from "@/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface InGameState {
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

export const useInGameStore = defineStore("inGame", () => {
  const defaultState: InGameState = {
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
  };
  const inGameState = ref<InGameState>(defaultState);

  const distance = computed<number | null>(() => {
    if (inGameState.value.randomLatLng && inGameState.value.selectedLatLng) {
      return Math.floor(
        google.maps.geometry.spherical.computeDistanceBetween(
          inGameState.value.randomLatLng,
          inGameState.value.selectedLatLng
        ) / 1000
      );
    } else {
      return null;
    }
  });

  const resetInGameState = () => {
    inGameState.value = { ...defaultState };
  };

  const saveRandomLatLng = (val: google.maps.LatLng) => {
    inGameState.value.randomLatLng = val;
  };

  const saveSelectedLatLng = (val: google.maps.LatLng) => {
    inGameState.value.selectedLatLng = val;
  };

  const updateSelectedLatLngArr = (val: google.maps.LatLng) => {
    inGameState.value.selectedLatLngArr.push(val);
  };

  const resetSelectedLatLngArr = () => {
    inGameState.value.selectedLatLngArr = [];
  };

  const savePanorama = (val: google.maps.StreetViewPanorama) => {
    inGameState.value.panorama = val;
  };

  const resetPanoramaLocation = () => {
    if (inGameState.value.panorama !== null) {
      inGameState.value.panorama.setPosition(inGameState.value.randomLatLng);
    }
  };

  const zoomInPanorama = () => {
    if (inGameState.value.panorama !== null) {
      const current = inGameState.value.panorama.getZoom();
      inGameState.value.panorama.setZoom(current + 1);
    }
  };

  const zoomOutPanorama = () => {
    if (inGameState.value.panorama !== null) {
      const current = inGameState.value.panorama.getZoom();
      inGameState.value.panorama.setZoom(current - 1);
    }
  };

  const updateGameHistory = (val: GameHistory) => {
    inGameState.value.gameHistory.push(val);
  };

  const updateDistanceByPlayerArr = (val: DistanceByPlayer) => {
    inGameState.value.distanceByPlayerArr.push(val);
  };

  const resetDistanceByPlayerArr = () => {
    inGameState.value.distanceByPlayerArr = [];
  };

  const saveScore = (val: number) => {
    inGameState.value.score += val;
  };

  const saveHasTimerStarted = (val: boolean) => {
    inGameState.value.hasTimerStarted = val;
  };

  const saveIsShowingResult = (val: boolean) => {
    inGameState.value.isShowingResult = val;
  };

  const saveIsShowingSummary = (val: boolean) => {
    inGameState.value.isShowingSummary = val;
  };

  const proceedToNextRound = () => {
    inGameState.value.round += 1;
    inGameState.value.isThisRoundReady = false;
    inGameState.value.isNextRoundReady = false;
    inGameState.value.hasTimerStarted = false;
    inGameState.value.isShowingResult = false;
    inGameState.value.isMakeGuessButtonClicked = false;
    inGameState.value.randomLatLng = null;
    inGameState.value.selectedLatLng = null;
    inGameState.value.selectedLatLngArr = [];
    inGameState.value.distanceByPlayerArr = [];
  };

  const saveIsThisRoundReady = (val: boolean) => {
    inGameState.value.isThisRoundReady = val;
  };

  const saveIsNextRoundReady = (val: boolean) => {
    inGameState.value.isNextRoundReady = val;
  };

  const saveIsWaitingForOtherPlayers = (val: boolean) => {
    inGameState.value.isWaitingForOtherPlayers = val;
  };

  const saveIsMakeGuessButtonClicked = (val: boolean) => {
    inGameState.value.isMakeGuessButtonClicked = val;
  };

  return {
    inGameState,
    distance,
    resetInGameState,
    saveRandomLatLng,
    saveSelectedLatLng,
    updateSelectedLatLngArr,
    resetSelectedLatLngArr,
    savePanorama,
    resetPanoramaLocation,
    zoomInPanorama,
    zoomOutPanorama,
    updateGameHistory,
    updateDistanceByPlayerArr,
    resetDistanceByPlayerArr,
    saveScore,
    saveHasTimerStarted,
    saveIsShowingResult,
    saveIsShowingSummary,
    proceedToNextRound,
    saveIsThisRoundReady,
    saveIsNextRoundReady,
    saveIsWaitingForOtherPlayers,
    saveIsMakeGuessButtonClicked,
  };
});
