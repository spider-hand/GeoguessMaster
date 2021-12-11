<template>
  <div class="create-room-dialog" v-if="isShowingDialog">
    <div class="form-container">
      <div>
        <span class="form-title">Size</span>
        <br />
        <span class="form-helper-text">2-5 people</span>
      </div>
      <Counter
        :min="2"
        :max="5"
        :count="store.state.gameSettings.selectedSize"
        @onChangeValue="onChangeSize"
      />
    </div>
    <div class="form-container">
      <div>
        <span class="form-title">Time per round</span>
        <br />
        <span class="form-helper-text">1-10 minutes</span>
      </div>
      <Counter
        :min="1"
        :max="10"
        :count="store.state.gameSettings.selectedTime"
        @onChangeValue="onChangeTime"
      />
    </div>
    <div class="form-container">
      <TextInput
        label="Player Name"
        name="player-name"
        placeholder="Your Player Name"
        :inputValue="store.state.gameSettings.playerName"
        @onChangeValue="onChangePlayerName"
      />
    </div>
    <div class="form-container">
      <span class="form-title">Are you an owner?</span>
      <Switch
        :ans="store.state.gameSettings.isOwner"
        @onChangeValue="onChangeIsOwner"
      />
    </div>
    <div class="form-container">
      <TextInput
        label="Room Number"
        name="room-number"
        placeholder="Room Number"
        :inputValue="store.state.gameSettings.roomNumber"
        @onChangeValue="onChangeRoomNumber"
        :disabled="store.state.gameSettings.isOwner"
      />
    </div>
    <div class="button-container">
      <button
        class="start-game-button"
        :class="[
          !store.getters.isReadyForMultiplayerGame ? 'cursor-not-allowed' : '',
        ]"
        :style="{ opacity: store.getters.isReadyForMultiplayerGame ? 1 : 0.7 }"
        :disabled="!store.getters.isReadyForMultiplayerGame"
      >
        <span class="button-text">START</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useStore } from "vuex";

import { key } from "@/store";
import Counter from "@/components/Home/Counter.vue";
import Switch from "@/components/Home/Switch.vue";
import TextInput from "@/components/Home/TextInput.vue";

export default defineComponent({
  props: {
    isShowingDialog: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  components: {
    Counter,
    Switch,
    TextInput,
  },

  setup() {
    const store = useStore(key);

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

    return {
      store,
      onChangeSize,
      onChangeTime,
      onChangePlayerName,
      onChangeIsOwner,
      onChangeRoomNumber,
    };
  },
});
</script>

<style scoped>
.create-room-dialog {
  position: absolute;
  bottom: -393px;
  right: 0;
  width: 320px;
  height: 377px;
  padding: 0 32px;
  background: #ffffff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.form-container {
  width: 100%;
  height: 48px;
  padding: 8px 16px;
  flex-direction: row;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dcdcdc;
}

.form-title {
  font-family: "Roboto medium";
  font-size: 16px;
  color: #3c3c3c;
}

.form-helper-text {
  font-family: "Roboto medium";
  font-size: 12px;
  color: #5f5f5f;
}

.button-container {
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
}

.start-game-button {
  width: 129px;
  height: 36px;
  background-color: #ff4343;
  border: none;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.button-text {
  font-family: "Roboto medium";
  font-size: 14px;
  color: #ffffff;
}

.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
