<template>
  <div :class="$style['page']">
    <MyOverlay
      v-show="
        gameSettingsState.selectedMode === 'multiplayer' &&
          (!inGameState.isThisRoundReady ||
            inGameState.isWaitingForOtherPlayers ||
            state.isEndingMultiplayerGame)
      "
      :msg="state.overlayMsg"
    />
    <ResultModal
      v-show="inGameState.isShowingResult"
      :selected-mode="gameSettingsState.selectedMode"
      :is-owner="gameSettingsState.isOwner"
      :is-showing-result="inGameState.isShowingResult"
      :is-showing-summary="inGameState.isShowingSummary"
      :is-next-round-ready="inGameState.isNextRoundReady"
      :random-lat-lng="inGameState.randomLatLng"
      :selected-lat-lng="inGameState.selectedLatLng"
      :selected-lat-lng-arr="inGameState.selectedLatLngArr"
      :game-history="inGameState.gameHistory"
      :distance="(distance as number)"
      :distance-by-player-arr="inGameState.distanceByPlayerArr"
      :round="inGameState.round"
      :score="inGameState.score"
      :multiplayer-game-summary="state.multiplayerGameSummary"
      @onClickNextRoundButton="onClickNextRoundButton"
      @onClickViewSummaryButton="saveIsShowingSummary(true)"
      @onClickPlayAgainButton="resetInGameState"
      @onClickExitButton="router.back()"
      @endMultiplayerGame="endMultiplayerGame"
    />
    <StreetView
      :selected-map="gameSettingsState.selectedMap"
      :selected-mode="gameSettingsState.selectedMode"
      :is-owner="gameSettingsState.isOwner"
      :random-lat-lng="inGameState.randomLatLng"
      :round="inGameState.round"
      @updateRandomLatLng="(val) => saveRandomLatLng(val)"
      @savePanorama="savePanorama"
      @saveStreetView="saveStreetView"
    />
    <ScoreBoard
      :selected-map="gameSettingsState.selectedMap"
      :selected-mode="gameSettingsState.selectedMode"
      :round="inGameState.round"
      :score="inGameState.score"
      :countdown="countdown"
    />
    <RoomNumberDialog
      v-if="
        gameSettingsState.selectedMode === 'multiplayer' &&
          gameSettingsState.isOwner
      "
      :room-number="gameSettingsState.roomNumber"
      :is-game-ready="state.isGameReady"
    />
    <MyMap
      :device="deviceState"
      :selected-mode="gameSettingsState.selectedMode"
      :is-owner="gameSettingsState.isOwner"
      :random-lat-lng="inGameState.randomLatLng"
      :round="inGameState.round"
      :is-make-guess-button-clicked="inGameState.isMakeGuessButtonClicked"
      @updateSelectedLatLng="(val) => saveSelectedLatLng(val)"
      @onClickHideMapButton="saveIsMakeGuessButtonClicked(false)"
    />
    <FlatButton
      :text="'GUESS'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        bottom: '12px',
        left: '12px',
      }"
      :disabled="isGuessButtonDisabled"
      @click="onClickGuessButton"
    />
    <FlatButton
      v-if="deviceState <= DEVICE_TYPES.MOBLE_PORTRAIT"
      v-show="!inGameState.isMakeGuessButtonClicked"
      :text="'MAKE GUESS'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        bottom: '12px',
        left: '12px',
      }"
      @click="saveIsMakeGuessButtonClicked(true)"
    />
    <IconButton
      :icon="'my_location'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        right: '12px',
        bottom: '228px',
      }"
      @click="resetPanoramaLocation"
    />
    <IconButton
      :icon="'zoom_in'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        right: '12px',
        bottom: '164px',
      }"
      @click="zoomInPanorama"
    />
    <IconButton
      :icon="'zoom_out'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        right: '12px',
        bottom: '100px',
      }"
      @click="zoomOutPanorama"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  get,
  set,
  ref as dbRef,
  onValue,
  off,
  remove,
  child,
  update,
} from "firebase/database";

import StreetView from "@/components/game/StreetView.vue";
import MyMap from "@/components/game/MyMap.vue";
import ScoreBoard from "@/components/game/ScoreBoard.vue";
import ResultModal from "@/components/game/ResultModal.vue";
import RoomNumberDialog from "@/components/game/RoomNumberDialog.vue";
import MyOverlay from "@/components/game/MyOverlay.vue";
import FlatButton from "@/components/shared/FlatButton.vue";
import IconButton from "@/components/shared/IconButton.vue";
import { database } from "@/firebase";
import { GameHistory, Summary } from "@/types";
import { DEVICE_TYPES } from "@/constants";
import { storeToRefs } from "pinia";
import { useGameSettingsStore } from "@/stores/gameSettings";
import { useInGameStore } from "@/stores/inGame";
import { useDeviceStore } from "@/stores/device";

const deviceStore = useDeviceStore();
const { deviceState } = storeToRefs(deviceStore);

const gameSettingsStore = useGameSettingsStore();
const { gameSettingsState } = storeToRefs(gameSettingsStore);

const inGameStore = useInGameStore();
const { inGameState, distance } = storeToRefs(inGameStore);
const {
  saveRandomLatLng,
  saveSelectedLatLng,
  savePanorama,
  resetPanoramaLocation,
  zoomInPanorama,
  zoomOutPanorama,
  saveIsMakeGuessButtonClicked,
  saveIsThisRoundReady,
  saveIsNextRoundReady,
  saveScore,
  saveIsShowingResult,
  saveIsShowingSummary,
  saveIsWaitingForOtherPlayers,
  saveHasTimerStarted,
  updateGameHistory,
  proceedToNextRound,
  resetInGameState,
  updateDistanceByPlayerArr,
  updateSelectedLatLngArr,
} = inGameStore;

const router = useRouter();

const state = reactive<{
  isGameReady: boolean;
  isEndingMultiplayerGame: boolean;
  remainingTime: number;
  multiplayerGameSummary: Array<Summary>;
  overlayMsg: string;
}>({
  isGameReady: false,
  isEndingMultiplayerGame: false,
  remainingTime: 0,
  multiplayerGameSummary: [],
  overlayMsg: "Waiting for other players to get ready..",
});

const isGuessButtonDisabled = computed<boolean>(
  () =>
    inGameState.value.selectedLatLng === null ||
    (gameSettingsState.value.selectedMode === "multiplayer" &&
      !inGameState.value.isThisRoundReady)
);

const countdown = computed<string>(() => {
  let min: string | number = Math.floor(state.remainingTime / 60);
  let sec: string | number = state.remainingTime % 60;
  if (min < 10) {
    min = `0${min}`;
  }
  if (sec < 10) {
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;
});

const saveStreetView = async (latLng: google.maps.LatLng): Promise<void> => {
  return await set(
    dbRef(
      database,
      `${gameSettingsState.value.roomNumber}/streetView/round${inGameState.value.round}`
    ),
    {
      lat: latLng.lat(),
      lng: latLng.lng(),
    }
  );
};

const startTimer = (): void => {
  if (!inGameState.value.isWaitingForOtherPlayers) {
    if (state.remainingTime > 0) {
      setTimeout(() => {
        state.remainingTime -= 1;
        startTimer();
      }, 1000);
    } else {
      if (!inGameState.value.selectedLatLng) {
        const latLng = new google.maps.LatLng({
          lat: 37.86926,
          lng: -122.254811,
        });
        saveSelectedLatLng(latLng);
      }
      onClickGuessButton();
    }
  }
};

const onClickGuessButton = async (): Promise<void> => {
  saveScore(distance.value as number);
  if (gameSettingsState.value.selectedMode !== "multiplayer") {
    saveIsShowingResult(true);
  } else {
    // Multiplayer game
    saveIsWaitingForOtherPlayers(true);
    try {
      await update(
        dbRef(
          database,
          `${gameSettingsState.value.roomNumber}/round${inGameState.value.round}`
        ),
        {
          [gameSettingsState.value.playerId]: distance.value,
        }
      );
      await set(
        dbRef(
          database,
          `${gameSettingsState.value.roomNumber}/guess/${gameSettingsState.value.playerId}`
        ),
        {
          lat: inGameState.value.selectedLatLng?.lat(),
          lng: inGameState.value.selectedLatLng?.lng(),
        }
      );
      await update(
        dbRef(database, `${gameSettingsState.value.roomNumber}/score`),
        {
          [gameSettingsState.value.playerId]: inGameState.value.score,
        }
      );
    } catch (err) {
      console.log(`onClickGuessButton error: ${err}`);
    }
  }
};

const onClickNextRoundButton = async (): Promise<void> => {
  if (inGameState.value.isMakeGuessButtonClicked) {
    // Hide map for mobile devices
    saveIsMakeGuessButtonClicked(false);
  }

  const gameHistory: GameHistory = {
    randomLatLng: inGameState.value.randomLatLng as google.maps.LatLng,
    selectedLatLng: inGameState.value.selectedLatLng as google.maps.LatLng,
  };
  updateGameHistory(gameHistory);
  proceedToNextRound();

  // Multiplayer game
  if (
    gameSettingsState.value.selectedMode === "multiplayer" &&
    !gameSettingsState.value.isOwner
  ) {
    try {
      await set(
        dbRef(
          database,
          `/${gameSettingsState.value.roomNumber}/round${inGameState.value.round}`
        ),
        {
          [gameSettingsState.value.playerId]: 0,
        }
      );
      const snapshot = await get(
        child(
          dbRef(database),
          `/${gameSettingsState.value.roomNumber}/streetView/round${inGameState.value.round}`
        )
      );
      const randomLat = snapshot.child("lat").val();
      const randomLng = snapshot.child("lng").val();
      const randomLatLng = new google.maps.LatLng(randomLat, randomLng);
      saveRandomLatLng(randomLatLng);
    } catch (err) {
      console.log(`onClickNextRoundButton error: ${err}`);
    }
  }
};

const endMultiplayerGame = async (): Promise<void> => {
  try {
    await update(
      dbRef(database, `/${gameSettingsState.value.roomNumber}/hasDone`),
      {
        [gameSettingsState.value.playerId]: true,
      }
    );
    saveIsWaitingForOtherPlayers(true);
  } catch (err) {
    console.log(`endMultiplayerGame error: ${err}`);
  }
};

const onEndMultiplayerGame = (): void => {
  // Multiplayer game
  state.overlayMsg = "Disconnecting from this game..";
  state.isEndingMultiplayerGame = true;
  off(dbRef(database, `/${gameSettingsState.value.roomNumber}`));

  if (gameSettingsState.value.roomNumber !== "") {
    remove(dbRef(database, `/${gameSettingsState.value.roomNumber}`));

    setTimeout(() => {
      router.back();
    }, 3000);
  }
};

onMounted(() => {
  const { roomNumber, playerId } = gameSettingsState.value;

  if (gameSettingsState.value.selectedMode === "multiplayer") {
    onValue(dbRef(database, `/${roomNumber}`), async (snapshot) => {
      try {
        if (
          !snapshot.child("active").exists() ||
          !snapshot.child("active").val()
        ) {
          // Exit the game when the game finished
          onEndMultiplayerGame();
        } else {
          // Put the player into the current round's node
          if (
            !snapshot
              .child(`round${inGameState.value.round}`)
              .hasChild(playerId)
          ) {
            await update(
              dbRef(database, `/${roomNumber}/round${inGameState.value.round}`),
              {
                [playerId]: 0,
              }
            );
            if (!gameSettingsState.value.isOwner) {
              const randomLat = snapshot
                .child(`streetView/round${inGameState.value.round}/lat`)
                .val();
              const randomLng = snapshot
                .child(`streetView/round${inGameState.value.round}/lng`)
                .val();
              const randomLatLng = new google.maps.LatLng(randomLat, randomLng);
              saveRandomLatLng(randomLatLng);
            }
          }
          if (
            snapshot.child(`round${inGameState.value.round}`).size ===
            snapshot.child("size").val()
          ) {
            // Hide RoomNumberDialog when all players proceed to this round
            state.isGameReady = true;
            // Enable guess button when all players are put into the current round's node
            saveIsThisRoundReady(true);

            // Start a timer
            if (!inGameState.value.hasTimerStarted) {
              saveHasTimerStarted(true);

              state.remainingTime = snapshot.child("time").val() * 60;
              startTimer();
            }
          }
          if (
            snapshot.child("streetView").size ===
            inGameState.value.round + 1
          ) {
            // Allow other players to proceed to the next round after the owner load a StreetView first
            saveIsNextRoundReady(true);
          }

          if (snapshot.child("guess").size === snapshot.child("size").val()) {
            // Show the result when all players finished guessing locations
            snapshot.child("guess").forEach((childSnapshot) => {
              const lat = childSnapshot.child("lat").val();
              const lng = childSnapshot.child("lng").val();
              const latlng = new google.maps.LatLng(lat, lng);
              const playerName = snapshot
                .child("playerName")
                .child(childSnapshot.key as string)
                .val();
              const distance = snapshot
                .child(
                  `round${inGameState.value.round}/${
                    childSnapshot.key as string
                  }`
                )
                .val();
              updateSelectedLatLngArr(latlng);
              updateDistanceByPlayerArr({
                playerName: playerName,
                distance: distance,
              });
            });
            saveIsWaitingForOtherPlayers(false);
            saveIsShowingResult(true);

            if (inGameState.value.round === 5) {
              // Summary
              snapshot.child("score").forEach((childSnapshot) => {
                const playerName = snapshot
                  .child("playerName")
                  .child(childSnapshot.key as string)
                  .val();
                const score = childSnapshot.val();
                state.multiplayerGameSummary.push({
                  playerName: playerName,
                  score: score,
                });
              });
            }
            // Remove guess node every time the round is done
            remove(dbRef(database, `/${roomNumber}/guess`));
          }

          if (snapshot.child("hasDone").size === snapshot.child("size").val()) {
            update(dbRef(database, `${roomNumber}`), {
              active: false,
            });
          }
          // Disconnect the game when the player pressed the back button
          window.addEventListener("popstate", () => {
            update(dbRef(database, `${roomNumber}`), {
              active: false,
            });
            off(dbRef(database, `${roomNumber}`));
          });
          // Disconnect the game when the player refreshed the window
          window.addEventListener("beforeunload", () => {
            update(dbRef(database, `${roomNumber}`), {
              active: false,
            });
            off(dbRef(database, `${roomNumber}`));
          });
        }
      } catch (err) {
        console.log(`onValue error: ${err}`);
      }
    });
  }
});
</script>

<style module lang="scss">
.page {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  top: 0;
  left: 0;
}
</style>
