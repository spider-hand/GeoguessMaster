<template>
  <div :class="$style['page']">
    <OverlayComponent
      v-show="
        gameSettingsState.selectedMode === 'multiplayer' &&
          (!inGameState.isThisRoundReady ||
            inGameState.isWaitingForOtherPlayers ||
            inGameState.isEndingMultiplayerGame)
      "
      :msg="message"
    />
    <ResultModalComponent
      v-show="inGameState.isShowingResult"
      :selected-mode="gameSettingsState.selectedMode"
      :is-owner="gameSettingsState.isOwner"
      :is-showing-summary="inGameState.isShowingSummary"
      :is-next-round-ready="inGameState.isNextRoundReady"
      :distance="(distance as number)"
      :distance-by-player-arr="sortedDistance"
      :round="inGameState.round"
      :score="inGameState.score"
      :multiplayer-game-summary="sortedScore"
      @on-click-next-round-button="onClickNextRoundButton"
      @on-click-view-summary-button="onClickViewSummaryButton"
      @on-click-play-again-button="onClickPlayAgainButton"
      @on-click-exit-button="router.back()"
      @end-multiplayer-game="endMultiplayerGame"
    />
    <Suspense>
      <StreetViewWrapperComponent>
        <StreetViewComponent
          ref="streetViewRef"
          :selected-map="gameSettingsState.selectedMap"
          :selected-mode="gameSettingsState.selectedMode"
          :is-owner="gameSettingsState.isOwner"
          :random-lat-lng="inGameState.randomLatLng"
          :round="inGameState.round"
          @update-random-lat-lng="saveRandomLatLng"
          @save-street-view="saveStreetView"
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
      :is-game-ready="inGameState.isMultiplayerGameReady"
    />
    <Suspense>
      <MapWrapperComponent>
        <MapComponent
          ref="mapRef"
          :is-visible="inGameState.isMapVisible"
          :is-showing-result="inGameState.isShowingResult"
          :selected-mode="gameSettingsState.selectedMode"
          :random-lat-lng="inGameState.randomLatLng"
          :selected-lat-lng="inGameState.selectedLatLng"
          :selected-lat-lng-arr="inGameState.selectedLatLngArr"
          :game-history="inGameState.gameHistory"
          @update-selected-lat-lng="(val: google.maps.LatLng) => inGameState.selectedLatLng = val"
        />
      </MapWrapperComponent>
    </Suspense>
    <IconButtonComponent
      v-if="deviceState <= DEVICE_TYPES.MOBLE_PORTRAIT"
      v-show="inGameState.isMapVisible && !inGameState.isShowingResult"
      :icon="'close'"
      :style="{
        zIndex: '3',
        position: 'absolute',
        bottom: '272px',
        left: '20px',
        padding: '4px',
      }"
      @click="inGameState.isMapVisible = false"
    />
    <button
      :class="$style['page__guess-button']"
      :disabled="
        inGameState.selectedLatLng === null ||
          (gameSettingsState.selectedMode === 'multiplayer' &&
            !inGameState.isThisRoundReady)
      "
      @click="onClickGuessButton"
    >
      GUESS
    </button>
    <button
      v-if="deviceState <= DEVICE_TYPES.MOBLE_PORTRAIT"
      v-show="!inGameState.isMapVisible"
      :class="$style['page__guess-button']"
      @click="inGameState.isMapVisible = true"
    >
      MAKE GUESS
    </button>
    <div :class="$style['page__button-group']">
      <IconButtonComponent
        :icon="'my_location'"
        @click="streetViewRef?.resetStreetView"
      />
      <IconButtonComponent
        :icon="'zoom_in'"
        @click="streetViewRef?.zoomIn"
      />
      <IconButtonComponent
        :icon="'zoom_out'"
        @click="streetViewRef?.zoomOut"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import {
  get,
  set,
  ref as dbRef,
  onValue,
  remove,
  child,
  update,
  onDisconnect,
  Unsubscribe,
  DatabaseReference,
} from "firebase/database";
import StreetViewComponent from "@/components/game/StreetViewComponent.vue";
import MapComponent from "@/components/game/MapComponent.vue";
import ScoreBoardComponent from "@/components/game/ScoreBoardComponent.vue";
import ResultModalComponent from "@/components/game/ResultModalComponent.vue";
import RoomNumberDialogComponent from "@/components/game/RoomNumberDialogComponent.vue";
import OverlayComponent from "@/components/game/OverlayComponent.vue";
import IconButtonComponent from "@/components/shared/IconButtonComponent.vue";
import { database } from "@/firebase";
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
const { inGameState, distance, sortedDistance, sortedScore, message } =
  storeToRefs(inGameStore);

const scoreBoardRef = ref<InstanceType<typeof ScoreBoardComponent> | null>(
  null
);
const mapRef = ref<InstanceType<typeof MapComponent> | null>(null);
const streetViewRef = ref<InstanceType<typeof StreetViewComponent> | null>(
  null
);

const router = useRouter();

let roomRef: DatabaseReference;

if (gameSettingsState.value.selectedMode === "multiplayer") {
  roomRef = dbRef(database, `${gameSettingsState.value.roomNumber}`);
}

const unsubscribeArr = ref<Unsubscribe[]>([]);

const retrieveRoomConfig = async (): Promise<void> => {
  try {
    const [time, size] = await Promise.all([
      get(child(roomRef, "time")),
      get(child(roomRef, "size")),
    ]);
    inGameState.value.timePerRound = time.val();
    inGameState.value.size = size.val();
  } catch (err) {
    console.log(`retrieveRoomConfig error: ${err}`);
  }
};

const retrievePlayerInfo = async (): Promise<void> => {
  try {
    const playerInfo = await get(child(roomRef, "playerName"));
    playerInfo.forEach((playerName) => {
      inGameState.value.players.set(playerName.key as string, playerName.val());
    });
  } catch (err) {
    console.log(`retrievePlayerInfo error: ${err}`);
  }
};

const saveRandomLatLng = (latLng: google.maps.LatLng) => {
  if (gameSettingsState.value.selectedMode === "single") {
    mapRef.value?.attachListener();
  }
  inGameState.value.randomLatLng = latLng;
};

const saveStreetView = async (latLng: google.maps.LatLng): Promise<void> => {
  try {
    await set(child(roomRef, `streetView/round${inGameState.value.round}`), {
      lat: latLng.lat(),
      lng: latLng.lng(),
    });
  } catch (err) {
    console.log(`saveStreetView error: ${err}`);
  }
};

const listenRoomStatus = () => {
  const unsubscribeRoomStatusVal = onValue(
    child(roomRef, "active"),
    async (snapshot) => {
      if (!snapshot.val()) {
        unsubscribeRoomStatusVal();
        onEndMultiplayerGame();
      }
    }
  );
  unsubscribeArr.value.push(unsubscribeRoomStatusVal);
};

const listenCurrentRound = () => {
  const unsubscribeCurrentRound = onValue(
    child(roomRef, `round${inGameState.value.round}`),
    async (snapshot) => {
      if (snapshot.size === inGameState.value.size) {
        inGameState.value.isMultiplayerGameReady = true;
        inGameState.value.isThisRoundReady = true;

        if (inGameState.value.round === 1) {
          await retrievePlayerInfo();
        }

        if (
          !inGameState.value.hasTimerStarted &&
          !inGameState.value.isWaitingForOtherPlayers
        ) {
          inGameState.value.hasTimerStarted = true;

          await nextTick();

          mapRef.value?.attachListener();
          scoreBoardRef.value?.startCountdown();
        }
        unsubscribeCurrentRound();
      }
    }
  );
  unsubscribeArr.value.push(unsubscribeCurrentRound);
};

const joinCurrentRound = async (): Promise<void> => {
  try {
    const snapshot = await get(
      child(roomRef, `streetView/round${inGameState.value.round}`)
    );

    if (!snapshot.hasChild(gameSettingsState.value.playerId)) {
      await update(child(roomRef, `round${inGameState.value.round}`), {
        [gameSettingsState.value.playerId]: 0,
      });
    }
  } catch (err) {
    console.log(`joinCurrentRound error: ${err}`);
  }
};

const retrieveCurrentRoundStreetView = async (): Promise<void> => {
  try {
    const snapshot = await get(
      child(roomRef, `streetView/round${inGameState.value.round}`)
    );
    const lat = snapshot.child("lat").val();
    const lng = snapshot.child("lng").val();
    const randomLatLng = new google.maps.LatLng(lat, lng);
    inGameState.value.randomLatLng = randomLatLng;
    streetViewRef.value?.loadStreetView(inGameState.value.randomLatLng);
  } catch (err) {
    console.log(`retrieveCurrentRoundStreetView error: ${err}`);
  }
};

const retrieveDistance = async (): Promise<void> => {
  try {
    const distances = await get(
      child(roomRef, `round${inGameState.value.round}`)
    );
    distances.forEach((distance) => {
      const playerName = inGameState.value.players.get(distance.key as string);
      inGameState.value.distanceByPlayerArr.push({
        playerName: playerName as string,
        distance: distance.val(),
      });
    });
  } catch (err) {
    console.log(`retrieveDistance error: ${err}`);
  }
};

const retrieveFinalScore = async (): Promise<void> => {
  try {
    const scores = await get(child(roomRef, "score"));
    scores.forEach((score) => {
      const playerName = inGameState.value.players.get(score.key as string);
      inGameState.value.multiplayerGameSummary.push({
        playerName: playerName as string,
        score: score.val(),
      });
    });
  } catch (err) {
    console.log(`retrieveFinalScore error: ${err}`);
  }
};

const listenGuesses = () => {
  const unsubscribeGuesses = onValue(
    child(roomRef, "guess"),
    async (snapshot) => {
      if (snapshot.size === inGameState.value.size) {
        snapshot.forEach((childSnapshot) => {
          const lat = childSnapshot.child("lat").val();
          const lng = childSnapshot.child("lng").val();
          const latlng = new google.maps.LatLng(lat, lng);
          inGameState.value.selectedLatLngArr.push(latlng);
        });

        await retrieveDistance();

        inGameState.value.isWaitingForOtherPlayers = false;
        inGameState.value.isShowingResult = true;
        mapRef.value?.showResult();
        listenNextStreetView();

        if (inGameState.value.round === 5) {
          await retrieveFinalScore();
          listenPlayerStatus();
        }

        remove(child(roomRef, "guess"));
      }
    }
  );
  unsubscribeArr.value.push(unsubscribeGuesses);
};

const listenFirstStreetView = () => {
  const unsubscribeFirstStreetView = onValue(
    child(roomRef, "streetView/round1"),
    async (snapshot) => {
      if (snapshot.exists()) {
        await retrieveCurrentRoundStreetView();
        unsubscribeFirstStreetView();
      }
    }
  );
  unsubscribeArr.value.push(unsubscribeFirstStreetView);
};

const listenNextStreetView = () => {
  const unsubscribeNextStreetView = onValue(
    child(roomRef, `streetView/round${inGameState.value.round + 1}`),
    async (snapshot) => {
      if (snapshot.exists()) {
        inGameState.value.isNextRoundReady = true;
        unsubscribeNextStreetView();
      }
    }
  );
  unsubscribeArr.value.push(unsubscribeNextStreetView);
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
  try {
    inGameState.value.score += distance.value as number;
    mapRef.value?.removeListener();

    if (gameSettingsState.value.selectedMode !== "multiplayer") {
      inGameState.value.isShowingResult = true;
      mapRef.value?.showResult();
    } else {
      inGameState.value.isWaitingForOtherPlayers = true;
      scoreBoardRef.value?.stopCountdown();

      await Promise.all([
        update(child(roomRef, `round${inGameState.value.round}`), {
          [gameSettingsState.value.playerId]: distance.value,
        }),
        set(child(roomRef, `guess/${gameSettingsState.value.playerId}`), {
          lat: inGameState.value.selectedLatLng?.lat(),
          lng: inGameState.value.selectedLatLng?.lng(),
        }),
        update(child(roomRef, "score"), {
          [gameSettingsState.value.playerId]: inGameState.value.score,
        }),
      ]);
    }
  } catch (err) {
    console.log(`onClickGuessButton error: ${err}`);
  }
};

const onClickNextRoundButton = async (): Promise<void> => {
  try {
    const gameHistory = {
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
    mapRef.value?.removePolyline();

    if (
      gameSettingsState.value.selectedMode === "multiplayer" &&
      !gameSettingsState.value.isOwner
    ) {
      listenCurrentRound();
      await Promise.all([joinCurrentRound(), retrieveCurrentRoundStreetView()]);
    } else if (gameSettingsState.value.selectedMode === "multiplayer") {
      listenCurrentRound();
      await joinCurrentRound();
      streetViewRef.value?.loadStreetView();
    } else {
      streetViewRef.value?.loadStreetView();
    }
  } catch (err) {
    console.log(`onClickNextButton error: ${err}`);
  }
};

const onClickViewSummaryButton = () => {
  inGameState.value.isShowingSummary = true;
  mapRef.value?.showSummary();
};

const listenPlayerStatus = () => {
  const unsubscribePlayerStatus = onValue(
    child(roomRef, "hasDone"),
    async (snapshot) => {
      if (snapshot.size === inGameState.value.size) {
        await update(roomRef, {
          active: false,
        });
      }
    }
  );
  unsubscribeArr.value.push(unsubscribePlayerStatus);
};

const endMultiplayerGame = async (): Promise<void> => {
  try {
    await update(child(roomRef, "hasDone"), {
      [gameSettingsState.value.playerId]: true,
    });
    inGameState.value.isWaitingForOtherPlayers = true;
  } catch (err) {
    console.log(`endMultiplayerGame error: ${err}`);
  }
};

const onClickPlayAgainButton = (): void => {
  inGameStore.$reset();
  mapRef.value?.removeMarkers();
  mapRef.value?.removePolyline();
  streetViewRef.value?.loadStreetView();
};

const onEndMultiplayerGame = (): void => {
  inGameState.value.isEndingMultiplayerGame = true;

  if (gameSettingsState.value.roomNumber !== "") {
    remove(roomRef);

    setTimeout(() => {
      router.back();
    }, 3000);
  }
};

onMounted(async () => {
  if (gameSettingsState.value.selectedMode === "multiplayer") {
    await retrieveRoomConfig();

    listenRoomStatus();
    listenGuesses();
    listenCurrentRound();

    if (!gameSettingsState.value.isOwner) {
      listenFirstStreetView();
    }

    await joinCurrentRound();

    onDisconnect(child(roomRef, "active")).set(false);
  }
});

onUnmounted(async () => {
  if (roomRef !== undefined) {
    unsubscribeArr.value.forEach((unsubscribe) => {
      unsubscribe();
    });
    await set(child(roomRef, "active"), false);
  }
});
</script>

<style module lang="scss">
.page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.page__guess-button {
  @include flat-button;

  position: absolute;
  bottom: 12px;
  left: 12px;
  z-index: 1;
}

.page__button-group {
  position: absolute;
  right: 12px;
  bottom: 100px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
