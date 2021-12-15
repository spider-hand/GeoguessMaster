<template>
  <div class="screen">
    <div class="header">
      <img src="@/assets/logo.png" class="logo" />
      <span class="title">Geoguess Master</span>
      <div class="header-right">
        <a href="https://github.com/spider-hand/Geoguess-Master">
          <GithubIcon
            title="Github repository link here."
            fillColor="#ffffff"
            :size="32"
          />
        </a>
      </div>
    </div>
    <div class="container">
      <div class="game-create-box-container">
        <div class="game-create-box">
          <SelectBox
            title="Map"
            :selectedOption="
              MAP_OPTIONS[
                MAP_OPTIONS.findIndex(
                  (option) =>
                    option.value === store.state.gameSettings.selectedMap
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
                  (option) =>
                    option.value === store.state.gameSettings.selectedMode
                )
              ]
            "
            :options="MODE_OPTIONS"
            @onChangeOption="onChangeSelectedMode"
          />
          <div
            class="start-game-button"
            v-if="store.state.gameSettings.selectedMode === 'single'"
            @click="startSinglePlayerGame"
          >
            <span id="travel-explore-icon" class="material-icons"
              >travel_explore</span
            >
            <span class="create-button-text">START</span>
          </div>
          <div
            class="start-game-button"
            ref="createRoomButtonRef"
            v-if="store.state.gameSettings.selectedMode === 'multiplayer'"
            @click="openCreateRoomDialog"
          >
            <span id="travel-explore-icon" class="material-icons"
              >travel_explore</span
            >
            <span class="create-button-text">CREATE ROOM</span>
          </div>
          <CreateRoomDialog
            :isShowingDialog="state.isShowingRoomCreateDialog"
            :isRoomFound="state.isRoomFound"
            :selectedSize="store.state.gameSettings.selectedSize"
            :selectedTime="store.state.gameSettings.selectedTime"
            :playerName="store.state.gameSettings.playerName"
            :isOwner="store.state.gameSettings.isOwner"
            :roomNumber="store.state.gameSettings.roomNumber.toString()"
            :isReadyForMultiplayerGame="store.getters.isReadyForMultiplayerGame"
            @onChangeSize="onChangeSize"
            @onChangeTime="onChangeTime"
            @onChangePlayerName="onChangePlayerName"
            @onChangeIsOwner="onChangeIsOwner"
            @onChangeRoomNumber="onChangeRoomNumber"
            @onClickStartMultiplayerGameButton="startMultiplayerGame"
          />
        </div>
      </div>
      <div class="map-image-container">
        <img
          :src="require(`@/assets/${store.state.gameSettings.selectedMap}.png`)"
          class="map-image"
        />
      </div>
    </div>
    <div class="footer">
      <div class="copyright-container">
        <span class="copyright-text">
          All rights reserved. Copyright © {{ new Date().getFullYear() }}
          <strong>Spider Hand</strong>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";

import { useStore } from "vuex";
import { useRouter } from "vue-router";
import GithubIcon from "vue-material-design-icons/Github.vue";
import {
  get,
  push,
  ref as dbRef,
  child,
  DataSnapshot,
  update,
} from "firebase/database";

import SelectBox from "@/components/Home/SelectBox.vue";
import CreateRoomDialog from "@/components/Home/CreateRoomDialog.vue";
import { SelectboxOption } from "@/types";
import { key } from "@/store";
import { MAP_OPTIONS, MODE_OPTIONS } from "@/constants";
import { onClickOutside } from "@vueuse/core";
import { database } from "@/firebase";

export default defineComponent({
  components: {
    GithubIcon,
    SelectBox,
    CreateRoomDialog,
  },

  setup() {
    const router = useRouter();

    const createRoomButtonRef = ref(null);
    onClickOutside(createRoomButtonRef, (event) => {
      let isRoomCreateDialogClicked = false;
      const path = event.composedPath();
      path.forEach((el) => {
        if ((el as Element).className === "create-room-dialog") {
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

<style scoped>
.screen {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(#0000ae, #000057);
  overflow-x: hidden;
  overflow-y: auto;
}

.header {
  position: absolute;
  width: 100%;
  height: 64px;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
}

.header-right {
  position: absolute;
  width: 96px;
  height: 100%;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  height: 48px;
  padding-left: 16px;
}

.title {
  color: #ffffff;
  font-family: "Roboto medium";
  font-size: 20px;
}

.container {
  position: absolute;
  width: 100%;
  top: 64px;
  left: 0;
}

.game-create-box-container {
  width: 100%;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-create-box {
  position: relative;
  width: 640px;
  height: 64px;
  background-color: #ffffff;
  border-radius: 64px;
  display: flex;
  align-items: center;
}

.start-game-button {
  width: 172px;
  height: 48px;
  background-color: #ff4343;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.create-button-text {
  font-family: "Roboto medium";
  font-size: 16px;
  color: #ffffff;
}

#travel-explore-icon {
  display: none;
}

.map-image-container {
  width: 100%;
  padding: 24px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-image {
  width: 680px;
  border-radius: 8px;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
}

.copyright-container {
  padding: 0 12px;
}

.copyright-text {
  font-family: "Roboto medium";
  font-size: 12px;
  color: #ffffff;
}

@media only screen and (max-width: 480px) {
  .header {
    height: 48px;
  }

  .header-right {
    width: 64px;
  }

  .title {
    display: none;
  }

  .start-game-button {
    position: absolute;
    right: 4px;
    width: 48px;
    border-radius: 24px;
    background-color: #ffffff;
  }

  .start-game-button .create-button-text {
    display: none;
  }

  #travel-explore-icon {
    display: block;
    color: #ff4343;
  }

  .game-create-box {
    width: 92%;
    height: 48px;
  }

  .map-image {
    height: 100%;
  }
}
</style>
