import { DistanceByPlayer, GameHistory } from "@/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface InGameState {
  randomLatLng: google.maps.LatLng | null;
  selectedLatLng: google.maps.LatLng | null;
  selectedLatLngArr: Array<google.maps.LatLng>;
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
  const inGameState = ref<InGameState>({
    randomLatLng: null,
    selectedLatLng: null,
    selectedLatLngArr: [],
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

  return {
    inGameState,
    distance,
  };
});
