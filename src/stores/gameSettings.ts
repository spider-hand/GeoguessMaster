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
  const gameSettingsState = ref<GameSettingsState>({
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

  return {
    gameSettingsState,
    isReadyForMultiplayerGame,
  };
});
