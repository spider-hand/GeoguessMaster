<template>
  <div :class="$style['create-game-form']">
    <div :class="$style['create-game-form__section']">
      <button
        :class="$style['create-game-form__select']"
        @click="state.isSelectingMap = true"
      >
        <span :class="$style['create-game-form__select-label']">Map</span>
        <span :class="$style['create-game-form__select-value']">{{
          MAP_OPTIONS.get(gameSettingsState.selectedMap)
        }}</span>
      </button>
      <SelectBoxDialog
        v-show="state.isSelectingMap"
        :options="MAP_OPTIONS"
        @onChangeOption="onChangeSelectedMap"
        @close="state.isSelectingMap = false"
      />
    </div>
    <div :class="$style['create-game-form__section']">
      <button
        :class="$style['create-game-form__select']"
        @click="state.isSelectingMode = true"
      >
        <span :class="$style['create-game-form__select-label']">Mode</span>
        <span :class="$style['create-game-form__select-value']">{{
          MODE_OPTIONS.get(gameSettingsState.selectedMode)
        }}</span>
      </button>
      <SelectBoxDialog
        v-show="state.isSelectingMode"
        :options="MODE_OPTIONS"
        @onChangeOption="onChangeSelectedMode"
        @close="state.isSelectingMode = false"
      />
    </div>
    <IconButton
      v-if="deviceState <= DEVICE_TYPES.TABLET_PORTRAIT"
      ref="createRoomButtonRef"
      :icon="'travel_explore'"
      :style="{ position: 'absolute', right: '12px' }"
      @click="
        gameSettingsState.selectedMode === 'single'
          ? router.push('game')
          : (state.isShowingRoomCreateDialog = true)
      "
    />
    <FlatButton
      v-else
      ref="createRoomButtonRef"
      :style="{ position: 'absolute', right: '12px' }"
      :text="
        gameSettingsState.selectedMode === 'single' ? 'START' : 'CREATE ROOM'
      "
      @click="
        gameSettingsState.selectedMode === 'single'
          ? router.push('game')
          : (state.isShowingRoomCreateDialog = true)
      "
    />
    <CreateRoomDialog
      :is-showing-dialog="state.isShowingRoomCreateDialog"
      :is-room-found="state.isRoomFound"
      :selected-size="gameSettingsState.selectedSize"
      :selected-time="gameSettingsState.selectedTime"
      :player-name="gameSettingsState.playerName"
      :is-owner="gameSettingsState.isOwner"
      :room-number="gameSettingsState.roomNumber"
      :is-ready-for-multiplayer-game="isReadyForMultiplayerGame"
      @onChangeSize="(val) => (gameSettingsState.selectedSize = val)"
      @onChangeTime="(val) => (gameSettingsState.selectedTime = val)"
      @onChangePlayerName="(val) => (gameSettingsState.playerName = val)"
      @onChangeIsOwner="(val) => (gameSettingsState.isOwner = val)"
      @onChangeRoomNumber="(val) => (gameSettingsState.roomNumber = val)"
      @onClickStartMultiplayerGameButton="startMultiplayerGame"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useGameSettingsStore } from "@/stores/gameSettings";
import { useRouter } from "vue-router";
import {
  get,
  push,
  ref as dbRef,
  child,
  DataSnapshot,
  update,
  serverTimestamp,
} from "firebase/database";
import { onClickOutside } from "@vueuse/core";
import { database } from "@/firebase";
import { DEVICE_TYPES, MAP_OPTIONS, MODE_OPTIONS } from "@/constants";
import CreateRoomDialog from "./CreateRoomDialog.vue";
import FlatButton from "@/components/shared/FlatButton.vue";
import IconButton from "@/components/shared/IconButton.vue";
import SelectBoxDialog from "./SelectBoxDialog.vue";
import { MapTypes, ModeTypes } from "@/types";
import { storeToRefs } from "pinia";
import { useDeviceStore } from "@/stores/device";

const deviceStore = useDeviceStore();
const { deviceState } = storeToRefs(deviceStore);

const gameSettingsStore = useGameSettingsStore();
const { gameSettingsState, isReadyForMultiplayerGame } =
  storeToRefs(gameSettingsStore);

const router = useRouter();

const createRoomButtonRef = ref(null);
onClickOutside(createRoomButtonRef, (event) => {
  let isRoomCreateDialogClicked = false;
  const path = event.composedPath();
  path.forEach((el) => {
    if ((el as Element).id === "create-room-dialog") {
      isRoomCreateDialogClicked = true;
      return;
    }
  });
  if (!isRoomCreateDialogClicked) {
    state.isShowingRoomCreateDialog = false;
  }
});

const state = reactive<{
  isSelectingMap: boolean;
  isSelectingMode: boolean;
  isShowingRoomCreateDialog: boolean;
  isRoomFound: boolean;
}>({
  isSelectingMap: false,
  isSelectingMode: false,
  isShowingRoomCreateDialog: false,
  isRoomFound: true,
});

const onChangeSelectedMap = (option: string): void => {
  state.isSelectingMap = false;
  gameSettingsState.value.selectedMap = option as MapTypes;
};

const onChangeSelectedMode = (option: string): void => {
  state.isSelectingMode = false;
  gameSettingsState.value.selectedMode = option as ModeTypes;
};

const startMultiplayerGame = async (): Promise<void> => {
  try {
    gameSettingsState.value.isStartingGame = true;

    if (gameSettingsState.value.isOwner) {
      let randomNumber: number;
      let snapshot: DataSnapshot;
      do {
        randomNumber = Math.floor(Math.random() * 9999);
        snapshot = await get(child(dbRef(database), `${randomNumber}`));
      } while (snapshot.exists());
      gameSettingsState.value.roomNumber = randomNumber.toString();

      const playerNameRef = await push(
        dbRef(database, `${randomNumber}/playerName`),
        gameSettingsState.value.playerName
      );

      gameSettingsState.value.playerId = playerNameRef.key as string;

      await update(dbRef(database, `${randomNumber}`), {
        active: true,
        size: gameSettingsState.value.selectedSize,
        time: gameSettingsState.value.selectedTime,
        createdAt: serverTimestamp(),
      });
      router.push("game");
    } else {
      const roomNumber = gameSettingsState.value.roomNumber;
      const snapshot = await get(child(dbRef(database), `${roomNumber}`));
      if (snapshot.exists()) {
        const playerNameRef = await push(
          dbRef(database, `${roomNumber}/playerName`),
          gameSettingsState.value.playerName
        );
        gameSettingsState.value.playerId = playerNameRef.key as string;
        gameSettingsState.value.selectedTime = snapshot.child("time").val();

        router.push("game");
      } else {
        state.isRoomFound = false;
      }
    }
  } catch (err) {
    console.log(`StartMultiplayerGame error: ${err}`);
  }
};
</script>

<style module lang="scss">
.create-game-form {
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: var(--color-shadow-bold);
  border-radius: 100px;
  width: 100%;
  height: 64px;
  background-color: #ffffff;

  @media #{$mobile-landscape} {
    width: 640px;
  }
}

.create-game-form__section {
  height: 100%;
}

.create-game-form__select {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  border: none;
  border-radius: 32px;
  padding: 0 24px;
  height: 100%;
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: var(--color-surface-superlight);
  }

  @media #{$tablet-landscape} {
    padding: 0 48px;
  }
}

.create-game-form__select-label {
  width: 100%;
  font-size: 12px;
  color: var(--color-surface-secondary);
  text-align: left;
}

.create-game-form__select-value {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-surface-primary);
}
</style>
