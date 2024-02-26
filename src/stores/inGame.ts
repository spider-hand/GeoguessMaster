import { DistanceByPlayer, GameHistory, Summary } from "@/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface InGameState {
  randomLatLng: google.maps.LatLng | null;
  selectedLatLng: google.maps.LatLng | null;
  selectedLatLngArr: Array<google.maps.LatLng>;
  gameHistory: Array<GameHistory>;
  distanceByPlayerArr: Array<DistanceByPlayer>;
  multiplayerGameSummary: Array<Summary>;
  score: number;
  round: number;
  timePerRound: number;
  size: number;
  hasTimerStarted: boolean;
  isMultiplayerGameReady: boolean;
  isThisRoundReady: boolean;
  isNextRoundReady: boolean;
  isWaitingForOtherPlayers: boolean;
  isShowingResult: boolean;
  isShowingSummary: boolean;
  isEndingMultiplayerGame: boolean;
  isMapVisible: boolean;
}

export const useInGameStore = defineStore("inGame", () => {
  const inGameState = ref<InGameState>({
    randomLatLng: null,
    selectedLatLng: null,
    selectedLatLngArr: [],
    gameHistory: [],
    distanceByPlayerArr: [],
    multiplayerGameSummary: [],
    score: 0,
    round: 1,
    timePerRound: 5,
    size: 0,
    hasTimerStarted: false,
    isMultiplayerGameReady: false,
    isThisRoundReady: false,
    isNextRoundReady: false,
    isWaitingForOtherPlayers: false,
    isShowingResult: false,
    isShowingSummary: false,
    isEndingMultiplayerGame: false,
    isMapVisible: false,
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

  const sortedDistance = computed<Array<DistanceByPlayer>>(() => {
    return [...inGameState.value.distanceByPlayerArr].sort(
      (x, y) => x.distance - y.distance
    );
  });

  const sortedScore = computed<Array<Summary>>(() => {
    return [...inGameState.value.multiplayerGameSummary].sort(
      (x, y) => x.score - y.score
    );
  });

  const message = computed<string>(() => {
    if (inGameState.value.isEndingMultiplayerGame) {
      return "Disconnecting from this game..";
    } else if (inGameState.value.isWaitingForOtherPlayers) {
      return "Waiting for other players to make a guess..";
    } else if (!inGameState.value.isThisRoundReady) {
      return "Waiting for other players to get ready..";
    } else {
      return "";
    }
  });

  return {
    inGameState,
    distance,
    sortedDistance,
    sortedScore,
    message,
  };
});
