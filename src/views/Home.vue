<template>
  <div :class="$style['page']">
    <header :class="$style['page__header']">
      <img
        src="@/assets/images/logo.png"
        :class="$style['page__logo']"
        alt="Geoguess Master Logo"
      />
      <span :class="$style['page__title']">Geoguess Master</span>
      <div :class="$style['page__header-container']">
        <a href="https://github.com/spider-hand/Geoguess-Master">
          <GithubIcon
            title="Github repository link here."
            fillColor="#ffffff"
            :size="32"
          />
        </a>
      </div>
    </header>
    <div :class="$style['page__container']">
      <div :class="$style['page__game-create-box-container']">
        <div :class="$style['page__game-create-box']">
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
          <button
            :class="$style['page__button']"
            v-if="store.state.gameSettings.selectedMode === 'single'"
            @click="startSinglePlayerGame"
          >
            <span :class="$style['page__button-icon']" class="material-icons"
              >travel_explore</span
            >
            <div :class="$style['page__button-text']">START</div>
          </button>
          <button
            :class="$style['page__button']"
            ref="createRoomButtonRef"
            v-if="store.state.gameSettings.selectedMode === 'multiplayer'"
            @click="openCreateRoomDialog"
          >
            <span :class="$style['page__button-icon']" class="material-icons"
              >travel_explore</span
            >
            <div :class="$style['page__button-text']">CREATE ROOM</div>
          </button>
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
      </div>
      <div :class="$style['page__image-wrapper']">
        <img
          :src="
            require(`@/assets/images/${store.state.gameSettings.selectedMap}.png`)
          "
          :class="$style['page__image']"
          alt="Selected Map Image"
        />
      </div>
    </div>
    <footer :class="$style['page__footer']">
      <span :class="$style['page__copyright']">
        All rights reserved. Copyright © {{ new Date().getFullYear() }}
        <strong>Spider Hand</strong>
      </span>
    </footer>
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
  serverTimestamp,
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
.page {
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  background: linear-gradient(#0000ae, #000057);
  overflow-x: hidden;
  overflow-y: auto;
}

.page__header {
  position: relative;
  width: 100%;
  height: 64px;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
}

.page__header-container {
  position: absolute;
  width: 96px;
  height: 100%;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page__logo {
  height: 48px;
  padding-left: 16px;
}

.page__title {
  color: white;
  font-size: 20px;
}

.page__container {
  width: 100%;
  height: calc(100% - 64px);
  top: 0;
  left: 0;
}

.page__game-create-box-container {
  width: 100%;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page__game-create-box {
  position: relative;
  width: 640px;
  height: 64px;
  background-color: #ffffff;
  border-radius: 64px;
  display: flex;
  align-items: center;
}

.page__button {
  width: 172px;
  height: 48px;
  background-color: $color-red-primary;
  border: none;
  border-radius: 32px;
  font-size: 16px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.page__button-icon {
  display: none;
}

.page__image-wrapper {
  width: 100%;
  padding: 24px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page__image {
  width: 680px;
  border-radius: 8px;
}

.page__footer {
  top: 0;
  left: 0;
  width: 100%;
  height: 24px;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
.page__copyright {
  font-size: 12px;
  color: white;
}

@media only screen and (max-width: 480px) {
  .page__header {
    height: 48px;
  }

  .page__header-container {
    width: 64px;
  }

  .page__title {
    display: none;
  }

  .page__container {
    height: calc(100% - 72px);
  }

  .page__button {
    position: absolute;
    right: 4px;
    width: 48px;
    border-radius: 24px;
    background-color: white;
  }

  .page__button-text {
    display: none;
  }

  .page__button-icon {
    display: block;
    color: $color-red-primary;
  }

  .page__game-create-box {
    width: 92%;
    height: 48px;
  }
}
</style>
