import { MapTypes, ModeTypes } from "@/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface GameSettingsState {
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

export const useGameSettingsStore = defineStore("gameSettings", () => {
  const defaultState: GameSettingsState = {
    selectedMap: "world",
    selectedMode: "single",
    selectedSize: 2,
    selectedTime: 5,
    playerName: "",
    playerId: "",
    isOwner: true,
    roomNumber: "",
    isStartingGame: false,
  };
  const gameSettingsState = ref<GameSettingsState>(defaultState);

  const isReadyForMultiplayerGame = computed<boolean>(() => {
    if (gameSettingsState.value.isStartingGame) return false;

    if (gameSettingsState.value.isOwner) {
      return gameSettingsState.value.playerName !== "";
    } else {
      return (
        gameSettingsState.value.playerName !== "" &&
        !isNaN(Number(gameSettingsState.value.roomNumber)) &&
        gameSettingsState.value.roomNumber !== ""
      );
    }
  });

  const resetGameSettingsState = () => {
    gameSettingsState.value = { ...defaultState };
  };

  const changeSelectedMap = (val: MapTypes) => {
    gameSettingsState.value.selectedMap = val;
  };

  const changeSelectedMode = (val: ModeTypes) => {
    gameSettingsState.value.selectedMode = val;
  };

  const changeSelectedSize = (val: number) => {
    gameSettingsState.value.selectedSize = val;
  };

  const changeSelectedTime = (val: number) => {
    gameSettingsState.value.selectedTime = val;
  };

  const changePlayerName = (val: string) => {
    gameSettingsState.value.playerName = val;
  };

  const savePlayerId = (val: string) => {
    gameSettingsState.value.playerId = val;
  };

  const switchIsOwner = (val: boolean) => {
    gameSettingsState.value.isOwner = val;
  };

  const changeRoomNumber = (val: string) => {
    gameSettingsState.value.roomNumber = val;
  };

  const clickStartButton = () => {
    gameSettingsState.value.isStartingGame = true;
  };

  return {
    gameSettingsState,
    isReadyForMultiplayerGame,
    resetGameSettingsState,
    changeSelectedMap,
    changeSelectedMode,
    changeSelectedSize,
    changeSelectedTime,
    changePlayerName,
    savePlayerId,
    switchIsOwner,
    changeRoomNumber,
    clickStartButton,
  };
});
