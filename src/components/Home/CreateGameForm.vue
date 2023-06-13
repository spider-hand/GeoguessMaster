<template>
  <div :class="$style['create-game-form']">
    <div :class="$style['create-game-form__section']">
      <button
        :class="$style['create-game-form__select']"
        @click="openSelectMapDialog"
      >
        <span :class="$style['create-game-form__select-label']">Map</span>
        <span :class="$style['create-game-form__select-value']">{{
          MAP_OPTIONS.get(store.state.gameSettings.selectedMap)
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
        @click="openSelectModeDialog"
      >
        <span :class="$style['create-game-form__select-label']">Mode</span>
        <span :class="$style['create-game-form__select-value']">{{
          MODE_OPTIONS.get(store.state.gameSettings.selectedMode)
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
      v-if="store.state.generalSettings.device <= DEVICE_TYPES.TABLET_PORTRAIT"
      ref="createRoomButtonRef"
      :icon="'travel_explore'"
      :style="{ position: 'absolute', right: '12px' }"
      @click="
        store.state.gameSettings.selectedMode === 'single'
          ? startSinglePlayerGame()
          : openCreateRoomDialog()
      "
    />
    <FlatButton
      v-else
      ref="createRoomButtonRef"
      :style="{ position: 'absolute', right: '12px' }"
      :text="
        store.state.gameSettings.selectedMode === 'single'
          ? 'START'
          : 'CREATE ROOM'
      "
      @click="
        store.state.gameSettings.selectedMode === 'single'
          ? startSinglePlayerGame()
          : openCreateRoomDialog()
      "
    />
    <CreateRoomDialog
      :is-showing-dialog="state.isShowingRoomCreateDialog"
      :is-room-found="state.isRoomFound"
      :selected-size="store.state.gameSettings.selectedSize"
      :selected-time="store.state.gameSettings.selectedTime"
      :player-name="store.state.gameSettings.playerName"
      :is-owner="store.state.gameSettings.isOwner"
      :room-number="store.state.gameSettings.roomNumber"
      :is-ready-for-multiplayer-game="store.getters.isReadyForMultiplayerGame"
      @onChangeSize="onChangeSize"
      @onChangeTime="onChangeTime"
      @onChangePlayerName="onChangePlayerName"
      @onChangeIsOwner="onChangeIsOwner"
      @onChangeRoomNumber="onChangeRoomNumber"
      @onClickStartMultiplayerGameButton="startMultiplayerGame"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
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
import { key } from "@/store";
import { onClickOutside } from "@vueuse/core";
import { database } from "@/firebase";
import { DEVICE_TYPES, MAP_OPTIONS, MODE_OPTIONS } from "@/constants";
import CreateRoomDialog from "./CreateRoomDialog.vue";
import FlatButton from "@/components/shared/FlatButton.vue";
import IconButton from "@/components/shared/IconButton.vue";
import SelectBoxDialog from "./SelectBoxDialog.vue";
import { MapTypes, ModeTypes } from "@/types";

export default defineComponent({
  components: {
    CreateRoomDialog,
    FlatButton,
    IconButton,
    SelectBoxDialog,
  },

  setup() {
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

    const store = useStore(key);

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

    const openSelectMapDialog = (): void => {
      state.isSelectingMap = true;
    };

    const openSelectModeDialog = (): void => {
      state.isSelectingMode = true;
    };

    const onChangeSelectedMap = (option: string): void => {
      state.isSelectingMap = false;
      store.dispatch("changeSelectedMapAction", {
        selectedMap: option as MapTypes,
      });
    };

    const onChangeSelectedMode = (option: string): void => {
      state.isSelectingMode = false;
      store.dispatch("changeSelectedModeAction", {
        selectedMode: option as ModeTypes,
      });
    };

    const openCreateRoomDialog = (): void => {
      state.isShowingRoomCreateDialog = true;
    };

    const onChangeSize = (newVal: number): void => {
      store.dispatch("changeSelectedSizeAction", {
        selectedSize: newVal,
      });
    };

    const onChangeTime = (newVal: number): void => {
      store.dispatch("changeSelectedTimeAction", {
        selectedTime: newVal,
      });
    };

    const onChangePlayerName = (newVal: string): void => {
      store.dispatch("changePlayerNameAction", {
        playerName: newVal,
      });
    };

    const onChangeIsOwner = (newVal: boolean): void => {
      store.dispatch("switchIsOwnerAction", {
        isOwner: newVal,
      });
    };

    const onChangeRoomNumber = (newVal: string): void => {
      store.dispatch("changeRoomNumberAction", {
        roomNumber: newVal,
      });
    };

    const startSinglePlayerGame = (): void => {
      router.push("game");
    };

    const startMultiplayerGame = async (): Promise<void> => {
      try {
        store.dispatch("onClickStartButtonAction");

        if (store.state.gameSettings.isOwner) {
          let randomNumber: number;
          let snapshot: DataSnapshot;
          do {
            randomNumber = Math.floor(Math.random() * 9999);
            snapshot = await get(child(dbRef(database), `${randomNumber}`));
          } while (snapshot.exists());
          store.dispatch("changeRoomNumberAction", {
            roomNumber: randomNumber,
          });
          const playerNameRef = await push(
            dbRef(database, `${randomNumber}/playerName`),
            store.state.gameSettings.playerName
          );
          store.dispatch("savePlayerIdAction", {
            playerId: playerNameRef.key,
          });
          await update(dbRef(database, `${randomNumber}`), {
            active: true,
            size: store.state.gameSettings.selectedSize,
            time: store.state.gameSettings.selectedTime,
            createdAt: serverTimestamp(),
          });
          router.push("game");
        } else {
          const roomNumber = store.state.gameSettings.roomNumber;
          const snapshot = await get(child(dbRef(database), `${roomNumber}`));
          if (snapshot.exists()) {
            const playerNameRef = await push(
              dbRef(database, `${roomNumber}/playerName`),
              store.state.gameSettings.playerName
            );
            store.dispatch("savePlayerIdAction", {
              playerId: playerNameRef.key,
            });
            store.dispatch("changeSelectedTimeAction", {
              selectedTime: snapshot.child("time").val(),
            });
            router.push("game");
          } else {
            state.isRoomFound = false;
          }
        }
      } catch (err) {
        console.log(`StartMultiplayerGame error: ${err}`);
      }
    };

    onMounted(() => {
      store.dispatch("resetGameSettingsStateAction");
      store.dispatch("resetInGameStateAction");
    });

    return {
      store,
      createRoomButtonRef,
      state,
      MAP_OPTIONS,
      MODE_OPTIONS,
      DEVICE_TYPES,
      openSelectMapDialog,
      openSelectModeDialog,
      onChangeSelectedMap,
      onChangeSelectedMode,
      openCreateRoomDialog,
      onChangeSize,
      onChangeTime,
      onChangePlayerName,
      onChangeIsOwner,
      onChangeRoomNumber,
      startSinglePlayerGame,
      startMultiplayerGame,
    };
  },
});
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
