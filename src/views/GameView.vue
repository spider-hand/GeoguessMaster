<template>
  <div :class="$style['page']">
    <OverlayComponent
      v-show="
        gameSettingsState.selectedMode === 'multiplayer' &&
          (!inGameState.isThisRoundReady ||
            inGameState.isWaitingForOtherPlayers ||
            state.isEndingMultiplayerGame)
      "
      :msg="state.overlayMsg"
    />
    <Suspense>
      <MapWrapperComponent>
        <ResultModalComponent
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
          @onClickViewSummaryButton="inGameState.isShowingSummary = true"
          @onClickPlayAgainButton="inGameStore.$reset()"
          @onClickExitButton="router.back()"
          @endMultiplayerGame="endMultiplayerGame"
        />
      </MapWrapperComponent>
    </Suspense>
    <Suspense>
      <StreetViewWrapperComponent>
        <StreetViewComponent
          ref="streetViewRef"
          :selected-map="gameSettingsState.selectedMap"
          :selected-mode="gameSettingsState.selectedMode"
          :is-owner="gameSettingsState.isOwner"
          :random-lat-lng="inGameState.randomLatLng"
          :round="inGameState.round"
          @updateRandomLatLng="saveRandomLatLng"
          @saveStreetView="saveStreetView"
        />
      </StreetViewWrapperComponent>
    </Suspense>
    <ScoreBoardComponent
      ref="scoreBoardRef"
      :key="`${inGameState.timePerRound}#${inGameState.round}`"
      :selected-map="gameSettingsState.selectedMap"
      :selected-mode="gameSettingsState.selectedMode"
      :round="inGameState.round"
      :score="inGameState.score"
      :time-per-round="inGameState.timePerRound"
      @on-countdown-finish="onCountdownFinished"
    />
    <RoomNumberDialogComponent
      v-if="
        gameSettingsState.selectedMode === 'multiplayer' &&
          gameSettingsState.isOwner
      "
      :room-number="gameSettingsState.roomNumber"
      :is-game-ready="state.isGameReady"
    />
    <Suspense>
      <MapWrapperComponent>
        <MapComponent
          ref="mapRef"
          :is-visible="inGameState.isMapVisible"
          @updateSelectedLatLng="(val: google.maps.LatLng) => inGameState.selectedLatLng = val"
        />
      </MapWrapperComponent>
    </Suspense>
    <IconButtonComponent
      v-if="deviceState <= DEVICE_TYPES.MOBLE_PORTRAIT"
      v-show="inGameState.isMapVisible"
      :icon="'close'"
      :style="{
        zIndex: '1',
        position: 'absolute',
        bottom: '280px',
        left: '20px',
      }"
      :size="16"
      @click="inGameState.isMapVisible = false"
    />
    <FlatButtonComponent
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
    <FlatButtonComponent
      v-if="deviceState <= DEVICE_TYPES.MOBLE_PORTRAIT"
      v-show="!inGameState.isMapVisible"
      :text="'MAKE GUESS'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        bottom: '12px',
        left: '12px',
      }"
      @click="inGameState.isMapVisible = true"
    />
    <IconButtonComponent
      :icon="'my_location'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        right: '12px',
        bottom: '228px',
      }"
      @click="streetViewRef?.resetStreetView"
    />
    <IconButtonComponent
      :icon="'zoom_in'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        right: '12px',
        bottom: '164px',
      }"
      @click="streetViewRef?.zoomIn"
    />
    <IconButtonComponent
      :icon="'zoom_out'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        right: '12px',
        bottom: '100px',
      }"
      @click="streetViewRef?.zoomOut"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref, nextTick } from "vue";
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
import StreetViewComponent from "@/components/game/StreetViewComponent.vue";
import MapComponent from "@/components/game/MapComponent.vue";
import ScoreBoardComponent from "@/components/game/ScoreBoardComponent.vue";
import ResultModalComponent from "@/components/game/ResultModalComponent.vue";
import RoomNumberDialogComponent from "@/components/game/RoomNumberDialogComponent.vue";
import OverlayComponent from "@/components/game/OverlayComponent.vue";
import FlatButtonComponent from "@/components/shared/FlatButtonComponent.vue";
import IconButtonComponent from "@/components/shared/IconButtonComponent.vue";
import { database } from "@/firebase";
import { GameHistory, Summary } from "@/types";
import { DEVICE_TYPES } from "@/constants";
import { storeToRefs } from "pinia";
import { useGameSettingsStore } from "@/stores/gameSettings";
import { useInGameStore } from "@/stores/inGame";
import { useDeviceStore } from "@/stores/device";
import StreetViewWrapperComponent from "@/components/game/StreetViewWrapperComponent.vue";
import MapWrapperComponent from "@/components/game/MapWrapperComponent.vue";

const deviceStore = useDeviceStore();
const { deviceState } = storeToRefs(deviceStore);
const gameSettingsStore = useGameSettingsStore();
const { gameSettingsState } = storeToRefs(gameSettingsStore);
const inGameStore = useInGameStore();
const { inGameState, distance } = storeToRefs(inGameStore);

const scoreBoardRef = ref<InstanceType<typeof ScoreBoardComponent> | null>(
  null
);
const mapRef = ref<InstanceType<typeof MapComponent> | null>(null);
const streetViewRef = ref<InstanceType<typeof StreetViewComponent> | null>(
  null
);

const router = useRouter();

const state = reactive<{
  isGameReady: boolean;
  isEndingMultiplayerGame: boolean;
  multiplayerGameSummary: Array<Summary>;
  overlayMsg: string;
}>({
  isGameReady: false,
  isEndingMultiplayerGame: false,
  multiplayerGameSummary: [],
  overlayMsg: "Waiting for other players to get ready..",
});

const isGuessButtonDisabled = computed<boolean>(
  () =>
    inGameState.value.selectedLatLng === null ||
    (gameSettingsState.value.selectedMode === "multiplayer" &&
      !inGameState.value.isThisRoundReady)
);

const saveRandomLatLng = (latLng: google.maps.LatLng) => {
  if (gameSettingsState.value.selectedMode === "single") {
    mapRef.value?.attachListener();
  }
  inGameState.value.randomLatLng = latLng;
};

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

const onCountdownFinished = () => {
  if (!inGameState.value.selectedLatLng) {
    const latLng = new google.maps.LatLng({
      lat: 37.86926,
      lng: -122.254811,
    });
    inGameState.value.selectedLatLng = latLng;
  }
  onClickGuessButton();
};

const onClickGuessButton = async (): Promise<void> => {
  inGameState.value.score += distance.value as number;
  mapRef.value?.removeListener();

  if (gameSettingsState.value.selectedMode !== "multiplayer") {
    inGameState.value.isShowingResult = true;
  } else {
    inGameState.value.isWaitingForOtherPlayers = true;
    scoreBoardRef.value?.stopCountdown();

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
  const gameHistory: GameHistory = {
    randomLatLng: inGameState.value.randomLatLng as google.maps.LatLng,
    selectedLatLng: inGameState.value.selectedLatLng as google.maps.LatLng,
  };
  inGameState.value.gameHistory.push(gameHistory);
  inGameState.value.round++;
  inGameState.value.isThisRoundReady = false;
  inGameState.value.isNextRoundReady = false;
  inGameState.value.hasTimerStarted = false;
  inGameState.value.isShowingResult = false;
  inGameState.value.isMapVisible = false;
  inGameState.value.randomLatLng = null;
  inGameState.value.selectedLatLng = null;
  inGameState.value.selectedLatLngArr = [];
  inGameState.value.distanceByPlayerArr = [];

  mapRef.value?.removeMarkers();

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
      inGameState.value.randomLatLng = randomLatLng;
      streetViewRef.value?.loadStreetView(inGameState.value.randomLatLng);
    } catch (err) {
      console.log(`onClickNextRoundButton error: ${err}`);
    }
  } else {
    streetViewRef.value?.loadStreetView();
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
    inGameState.value.isWaitingForOtherPlayers = true;
  } catch (err) {
    console.log(`endMultiplayerGame error: ${err}`);
  }
};

const onEndMultiplayerGame = (): void => {
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
              inGameState.value.randomLatLng = randomLatLng;
              streetViewRef.value?.loadStreetView(inGameState.value.randomLatLng);
            }
          }
          if (
            snapshot.child(`round${inGameState.value.round}`).size ===
            snapshot.child("size").val()
          ) {
            // Hide RoomNumberDialog when all players proceed to this round
            state.isGameReady = true;
            // Enable guess button when all players are put into the current round's node
            inGameState.value.isThisRoundReady = true;

            if (
              !inGameState.value.hasTimerStarted &&
              !inGameState.value.isWaitingForOtherPlayers
            ) {
              inGameState.value.timePerRound = snapshot.child("time").val();
              inGameState.value.hasTimerStarted = true;

              await nextTick();

              mapRef.value?.attachListener();
              scoreBoardRef.value?.startCountdown();
            }
          }
          if (
            snapshot.child("streetView").size ===
            inGameState.value.round + 1
          ) {
            // Allow other players to proceed to the next round after the owner load a StreetView first
            inGameState.value.isNextRoundReady = true;
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
              inGameState.value.selectedLatLngArr.push(latlng);
              inGameState.value.distanceByPlayerArr.push({
                playerName: playerName,
                distance: distance,
              });
            });
            inGameState.value.isWaitingForOtherPlayers = false;
            inGameState.value.isShowingResult = true;

            if (inGameState.value.round === 5) {
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
