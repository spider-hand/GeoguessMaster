<template>
  <div :class="$style['create-game-form']">
    <SelectBox
      title="Map"
      :selectedOption="
        MAP_OPTIONS[
          MAP_OPTIONS.findIndex(
            (option) => option.value === store.state.gameSettings.selectedMap
          )
        ]
      "
      :options="MAP_OPTIONS"
      @onChangeOption="onChangeSelectedMap"
    />
    <SelectBox
      title="Mode"
      :selectedOption="
        MODE_OPTIONS[
          MODE_OPTIONS.findIndex(
            (option) => option.value === store.state.gameSettings.selectedMode
          )
        ]
      "
      :options="MODE_OPTIONS"
      @onChangeOption="onChangeSelectedMode"
    />
    <IconButton
      ref="createRoomButtonRef"
      v-if="store.state.generalSettings.device <= DeviceTypes.TabletPortrait"
      :icon="'travel_explore'"
      :style="{ position: 'absolute', right: '12px' }"
      @click="
        store.state.gameSettings.selectedMode === 'single'
          ? startSinglePlayerGame()
          : openCreateRoomDialog()
      "
    />
    <FlatButton
      ref="createRoomButtonRef"
      v-else
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
      :isShowingDialog="state.isShowingRoomCreateDialog"
      :isRoomFound="state.isRoomFound"
      :selectedSize="store.state.gameSettings.selectedSize"
      :selectedTime="store.state.gameSettings.selectedTime"
      :playerName="store.state.gameSettings.playerName"
      :isOwner="store.state.gameSettings.isOwner"
      :roomNumber="store.state.gameSettings.roomNumber"
      :isReadyForMultiplayerGame="store.getters.isReadyForMultiplayerGame"
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
import { SelectboxOption } from "@/types";
import { key } from "@/store";
import { onClickOutside } from "@vueuse/core";
import { database } from "@/firebase";
import { DeviceTypes, MAP_OPTIONS, MODE_OPTIONS } from "@/constants";
import SelectBox from "./SelectBox.vue";
import CreateRoomDialog from "./CreateRoomDialog.vue";
import FlatButton from "../FlatButton.vue";
import IconButton from "../IconButton.vue";

export default defineComponent({
  components: {
    SelectBox,
    CreateRoomDialog,
    FlatButton,
    IconButton,
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
      isShowingRoomCreateDialog: boolean;
      isRoomFound: boolean;
    }>({
      isShowingRoomCreateDialog: false,
      isRoomFound: true,
    });

    const onChangeSelectedMap = (option: SelectboxOption): void => {
      store.dispatch("changeSelectedMapAction", {
        selectedMap: option.value,
      });
    };

    const onChangeSelectedMode = (option: SelectboxOption): void => {
      store.dispatch("changeSelectedModeAction", {
        selectedMode: option.value,
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
      DeviceTypes,
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
</style>
