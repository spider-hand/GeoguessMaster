<template>
  <div :class="$style['page']">
    <Overlay
      v-show="
        store.state.gameSettings.selectedMode === 'multiplayer' &&
          (!store.state.inGame.isThisRoundReady ||
            store.state.inGame.isWaitingForOtherPlayers ||
            state.isEndingMultiplayerGame)
      "
      :msg="state.overlayMsg"
    />
    <ResultModal
      v-show="store.state.inGame.isShowingResult"
      :selected-mode="store.state.gameSettings.selectedMode"
      :is-owner="store.state.gameSettings.isOwner"
      :is-showing-result="store.state.inGame.isShowingResult"
      :is-showing-summary="store.state.inGame.isShowingSummary"
      :is-next-round-ready="store.state.inGame.isNextRoundReady"
      :random-lat-lng="store.state.inGame.randomLatLng"
      :selected-lat-lng="store.state.inGame.selectedLatLng"
      :selected-lat-lng-arr="store.state.inGame.selectedLatLngArr"
      :game-history="store.state.inGame.gameHistory"
      :distance="store.getters.distance"
      :distance-by-player-arr="store.state.inGame.distanceByPlayerArr"
      :round="store.state.inGame.round"
      :score="store.state.inGame.score"
      :multiplayer-game-summary="state.multiplayerGameSummary"
      @onClickNextRoundButton="onClickNextRoundButton"
      @onClickViewSummaryButton="onClickViewSummaryButton"
      @onClickPlayAgainButton="onClickPlayAgainButton"
      @onClickExitButton="onClickExitButton"
      @endMultiplayerGame="endMultiplayerGame"
    />
    <StreetView
      :selected-map="store.state.gameSettings.selectedMap"
      :selected-mode="store.state.gameSettings.selectedMode"
      :is-owner="store.state.gameSettings.isOwner"
      :geo-j-s-o-n="store.state.gameSettings.geoJSON"
      :random-lat-lng="store.state.inGame.randomLatLng"
      :round="store.state.inGame.round"
      @updateRandomLatLng="updateRandomLatLng"
      @savePanorama="savePanorama"
      @saveStreetView="saveStreetView"
      @fetchGeoJSON="fetchGeoJSON"
    />
    <ScoreBoard
      :selected-map="store.getters.selectedMapText"
      :selected-mode="store.state.gameSettings.selectedMode"
      :round="store.state.inGame.round"
      :score="store.state.inGame.score"
      :countdown="countdown"
    />
    <RoomNumberDialog
      v-if="
        store.state.gameSettings.selectedMode === 'multiplayer' &&
          store.state.gameSettings.isOwner
      "
      :room-number="store.state.gameSettings.roomNumber"
      :is-game-ready="state.isGameReady"
    />
    <Map
      :selected-mode="store.state.gameSettings.selectedMode"
      :is-owner="store.state.gameSettings.isOwner"
      :random-lat-lng="store.state.inGame.randomLatLng"
      :round="store.state.inGame.round"
      :is-make-guess-button-clicked="
        store.state.inGame.isMakeGuessButtonClicked
      "
      @updateSelectedLatLng="updateSelectedLatLng"
      @onClickHideMapButton="onClickHideMapButton"
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
      v-if="store.state.generalSettings.device <= DeviceTypes.MobilePortrait"
      v-show="!store.state.inGame.isMakeGuessButtonClicked"
      :text="'MAKE GUESS'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        bottom: '12px',
        left: '12px',
      }"
      @click="onClickMakeGuessButton"
    />
    <IconButton
      :icon="'my_location'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        right: '12px',
        bottom: '228px',
      }"
      @click="onClickResetLocationButton"
    />
    <IconButton
      :icon="'zoom_in'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        right: '12px',
        bottom: '164px',
      }"
      @click="onClickZoomInButton"
    />
    <IconButton
      :icon="'zoom_out'"
      :style="{
        zIndex: 1,
        position: 'absolute',
        right: '12px',
        bottom: '100px',
      }"
      @click="onClickZoomOutButton"
    />
  </div>
</template>

<script lang="ts">
/*global google*/
import { defineComponent, reactive, computed, onMounted } from "vue";

import { useStore } from "vuex";
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

import { key } from "@/store";
import StreetView from "@/components/Game/StreetView.vue";
import Map from "@/components/Game/Map.vue";
import ScoreBoard from "@/components/Game/ScoreBoard.vue";
import ResultModal from "@/components/Game/ResultModal.vue";
import RoomNumberDialog from "@/components/Game/RoomNumberDialog.vue";
import Overlay from "@/components/Game/Overlay.vue";
import FlatButton from "@/components/FlatButton.vue";
import IconButton from "@/components/IconButton.vue";
import { database } from "@/firebase";
import { Summary } from "@/types";
import { DeviceTypes } from "@/constants";

export default defineComponent({
  components: {
    StreetView,
    Map,
    ScoreBoard,
    ResultModal,
    RoomNumberDialog,
    Overlay,
    FlatButton,
    IconButton,
  },

  setup() {
    const store = useStore(key);
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
        store.state.inGame.selectedLatLng === null ||
        (store.state.gameSettings.selectedMode === "multiplayer" &&
          !store.state.inGame.isThisRoundReady)
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

    const fetchGeoJSON = async (callback: () => void): Promise<void> => {
      try {
        await store.dispatch("fetchGeoJSONAction", {
          countryCode: store.state.gameSettings.selectedMap,
        });
        callback();
      } catch (err) {
        console.log(`fetchGeoJSON error: ${err}`);
      }
    };

    const updateRandomLatLng = (latLng: google.maps.LatLng): void => {
      store.dispatch("saveRandomLatLngAction", {
        randomLatLng: latLng,
      });
    };

    const updateSelectedLatLng = (latLng: google.maps.LatLng): void => {
      store.dispatch("saveSelectedLatLngAction", {
        selectedLatLng: latLng,
      });
    };

    const savePanorama = (panorama: google.maps.StreetViewPanorama): void => {
      store.dispatch("savePanoramaAction", {
        panorama: panorama,
      });
    };

    const saveStreetView = async (
      latLng: google.maps.LatLng
    ): Promise<void> => {
      return await set(
        dbRef(
          database,
          `${store.state.gameSettings.roomNumber}/streetView/round${store.state.inGame.round}`
        ),
        {
          lat: latLng.lat(),
          lng: latLng.lng(),
        }
      );
    };

    const startTimer = (): void => {
      if (!store.state.inGame.isWaitingForOtherPlayers) {
        if (state.remainingTime > 0) {
          setTimeout(() => {
            state.remainingTime -= 1;
            startTimer();
          }, 1000);
        } else {
          if (!store.state.inGame.selectedLatLng) {
            const latLng = new google.maps.LatLng({
              lat: 37.86926,
              lng: -122.254811,
            });
            updateSelectedLatLng(latLng);
          }
          onClickGuessButton();
        }
      }
    };

    const onClickMakeGuessButton = (): void => {
      store.dispatch("saveIsMakeGuessButtonClickedAction", {
        isMakeGuessButtonClicked: true,
      });
    };

    const onClickHideMapButton = (): void => {
      store.dispatch("saveIsMakeGuessButtonClickedAction", {
        isMakeGuessButtonClicked: false,
      });
    };

    const onClickGuessButton = async (): Promise<void> => {
      store.dispatch("saveScoreAction", {
        score: store.getters.distance,
      });
      if (store.state.gameSettings.selectedMode !== "multiplayer") {
        store.dispatch("saveIsShowingResultAction", {
          isShowingResult: true,
        });
      } else {
        // Multiplayer game
        store.dispatch("saveIsWaitingForOtherPlayersAction", {
          isWaitingForOtherPlayers: true,
        });
        try {
          await update(
            dbRef(
              database,
              `${store.state.gameSettings.roomNumber}/round${store.state.inGame.round}`
            ),
            {
              [store.state.gameSettings.playerId]: store.getters.distance,
            }
          );
          await set(
            dbRef(
              database,
              `${store.state.gameSettings.roomNumber}/guess/${store.state.gameSettings.playerId}`
            ),
            {
              lat: store.state.inGame.selectedLatLng?.lat(),
              lng: store.state.inGame.selectedLatLng?.lng(),
            }
          );
          await update(
            dbRef(database, `${store.state.gameSettings.roomNumber}/score`),
            {
              [store.state.gameSettings.playerId]: store.state.inGame.score,
            }
          );
        } catch (err) {
          console.log(`onClickGuessButton error: ${err}`);
        }
      }
    };

    const onClickNextRoundButton = async (): Promise<void> => {
      if (store.state.inGame.isMakeGuessButtonClicked) {
        // Hide map for mobile devices
        onClickHideMapButton();
      }

      const gameHistory = {
        randomLatLng: store.state.inGame.randomLatLng,
        selectedLatLng: store.state.inGame.selectedLatLng,
      };
      store.dispatch("updateGameHistoryAction", {
        gameHistory: gameHistory,
      });
      store.dispatch("proceedToNextRoundAction");

      // Multiplayer game
      if (
        store.state.gameSettings.selectedMode === "multiplayer" &&
        !store.state.gameSettings.isOwner
      ) {
        try {
          await set(
            dbRef(
              database,
              `/${store.state.gameSettings.roomNumber}/round${store.state.inGame.round}`
            ),
            {
              [store.state.gameSettings.playerId]: 0,
            }
          );
          const snapshot = await get(
            child(
              dbRef(database),
              `/${store.state.gameSettings.roomNumber}/streetView/round${store.state.inGame.round}`
            )
          );
          const randomLat = snapshot.child("lat").val();
          const randomLng = snapshot.child("lng").val();
          const randomLatLng = new google.maps.LatLng(randomLat, randomLng);
          updateRandomLatLng(randomLatLng);
        } catch (err) {
          console.log(`onClickNextRoundButton error: ${err}`);
        }
      }
    };

    const onClickResetLocationButton = (): void => {
      store.state.inGame.panorama?.setPosition(store.state.inGame.randomLatLng);
    };

    const onClickZoomInButton = (): void => {
      let current = store.state.inGame.panorama?.getZoom();
      if (current) {
        current++;
        store.state.inGame.panorama?.setZoom(current);
      }
    };

    const onClickZoomOutButton = (): void => {
      let current = store.state.inGame.panorama?.getZoom();
      if (current) {
        current--;
        store.state.inGame.panorama?.setZoom(current);
      }
    };

    const onClickViewSummaryButton = (): void => {
      store.dispatch("saveIsShowingSummaryAction", {
        isShowingSummary: true,
      });
    };

    const onClickPlayAgainButton = (): void => {
      store.dispatch("resetInGameStateAction");
    };

    const endMultiplayerGame = async (): Promise<void> => {
      try {
        await update(
          dbRef(database, `/${store.state.gameSettings.roomNumber}/hasDone`),
          {
            [store.state.gameSettings.playerId]: true,
          }
        );
        store.dispatch("saveIsWaitingForOtherPlayersAction", {
          isWaitingForOtherPlayers: true,
        });
      } catch (err) {
        console.log(`endMultiplayerGame error: ${err}`);
      }
    };

    const onClickExitButton = (): void => {
      router.back();
    };

    const onEndMultiplayerGame = (): void => {
      // Multiplayer game
      state.overlayMsg = "Disconnecting from this game..";
      state.isEndingMultiplayerGame = true;
      off(dbRef(database, `/${store.state.gameSettings.roomNumber}`));

      if (store.state.gameSettings.roomNumber !== "") {
        remove(dbRef(database, `/${store.state.gameSettings.roomNumber}`));

        setTimeout(() => {
          router.back();
        }, 3000);
      }
    };

    onMounted(() => {
      const roomNumber = store.state.gameSettings.roomNumber;
      const playerId = store.state.gameSettings.playerId;

      if (store.state.gameSettings.selectedMode === "multiplayer") {
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
                  .child(`round${store.state.inGame.round}`)
                  .hasChild(playerId)
              ) {
                await update(
                  dbRef(
                    database,
                    `/${roomNumber}/round${store.state.inGame.round}`
                  ),
                  {
                    [playerId]: 0,
                  }
                );
                if (!store.state.gameSettings.isOwner) {
                  const randomLat = snapshot
                    .child(`streetView/round${store.state.inGame.round}/lat`)
                    .val();
                  const randomLng = snapshot
                    .child(`streetView/round${store.state.inGame.round}/lng`)
                    .val();
                  const randomLatLng = new google.maps.LatLng(
                    randomLat,
                    randomLng
                  );
                  updateRandomLatLng(randomLatLng);
                }
              }
              if (
                snapshot.child(`round${store.state.inGame.round}`).size ===
                snapshot.child("size").val()
              ) {
                // Hide RoomNumberDialog when all players proceed to this round
                state.isGameReady = true;
                // Enable guess button when all players are put into the current round's node
                store.dispatch("saveIsThisRoundReadyAction", {
                  isThisRoundReady: true,
                });
                // Start a timer
                if (!store.state.inGame.hasTimerStarted) {
                  store.dispatch("saveHasTimerStartedAction", {
                    hasTimerStarted: true,
                  });
                  state.remainingTime = snapshot.child("time").val() * 60;
                  startTimer();
                }
              }
              if (
                snapshot.child("streetView").size ===
                store.state.inGame.round + 1
              ) {
                // Allow other players to proceed to the next round after the owner load a StreetView first
                store.dispatch("saveIsNextRoundReadyAction", {
                  isNextRoundReady: true,
                });
              }

              if (
                snapshot.child("guess").size === snapshot.child("size").val()
              ) {
                // Show the result when all players finished guessing locations
                snapshot.child("guess").forEach((childSnapshot) => {
                  const lat = childSnapshot.child("lat").val();
                  const lng = childSnapshot.child("lng").val();
                  const latlng = new google.maps.LatLng(lat, lng);
                  const playerName = snapshot
                    .child("playerName")
                    .child(childSnapshot.key!)
                    .val();
                  const distance = snapshot
                    .child(
                      `round${store.state.inGame.round}/${childSnapshot.key!}`
                    )
                    .val();
                  store.dispatch("updateSelectedLatLngArrAction", {
                    selectedLatLng: latlng,
                  });
                  store.dispatch("updateDistanceByPlayerArrAction", {
                    distanceByPlayer: {
                      playerName: playerName,
                      distance: distance,
                    },
                  });
                });
                store.dispatch("saveIsWaitingForOtherPlayersAction", {
                  isWaitingForOtherPlayers: false,
                });
                store.dispatch("saveIsShowingResultAction", {
                  isShowingResult: true,
                });

                if (store.state.inGame.round === 5) {
                  // Summary
                  snapshot.child("score").forEach((childSnapshot) => {
                    const playerName = snapshot
                      .child("playerName")
                      .child(childSnapshot.key!)
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

              if (
                snapshot.child("hasDone").size === snapshot.child("size").val()
              ) {
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

    return {
      store,
      state,
      isGuessButtonDisabled,
      countdown,
      DeviceTypes,
      fetchGeoJSON,
      updateRandomLatLng,
      updateSelectedLatLng,
      savePanorama,
      saveStreetView,
      onClickGuessButton,
      onClickMakeGuessButton,
      onClickHideMapButton,
      onClickNextRoundButton,
      onClickResetLocationButton,
      onClickZoomInButton,
      onClickZoomOutButton,
      onClickViewSummaryButton,
      onClickPlayAgainButton,
      onClickExitButton,
      endMultiplayerGame,
    };
  },
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
