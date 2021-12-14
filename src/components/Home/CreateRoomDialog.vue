<template>
  <div class="create-room-dialog" v-if="isShowingDialog">
    <div class="form-container">
      <div>
        <span
          class="form-title"
          :class="[!isOwner ? 'disabled-form-title' : '']"
          >Size
        </span>
        <br />
        <span
          class="form-helper-text"
          :class="[!isOwner ? 'disabled-form-helper-text' : '']"
          >2-5 people</span
        >
      </div>
      <Counter
        :min="2"
        :max="5"
        :count="selectedSize"
        :disabled="!isOwner"
        @onChangeValue="onChangeSize"
      />
    </div>
    <div class="form-container">
      <div>
        <span
          class="form-title"
          :class="[!isOwner ? 'disabled-form-title' : '']"
        >
          Time per round
        </span>
        <br />
        <span
          class="form-helper-text"
          :class="[!isOwner ? 'disabled-form-helper-text' : '']"
        >
          1-10 minutes
        </span>
      </div>
      <Counter
        :min="1"
        :max="10"
        :count="selectedTime"
        :disabled="!isOwner"
        @onChangeValue="onChangeTime"
      />
    </div>
    <div class="form-container">
      <TextInput
        label="Player Name"
        name="player-name"
        placeholder="Your Player Name"
        :inputValue="playerName"
        @onChangeValue="onChangePlayerName"
      />
    </div>
    <div class="form-container">
      <span class="form-title">Are you an owner?</span>
      <Switch :ans="isOwner" @onChangeValue="onChangeIsOwner" />
    </div>
    <div class="form-container">
      <TextInput
        label="Room Number"
        name="room-number"
        placeholder="Room Number"
        :inputValue="roomNumber"
        @onChangeValue="onChangeRoomNumber"
        :disabled="isOwner"
      />
    </div>
    <div class="button-container">
      <button
        class="start-game-button"
        :class="[!isReadyForMultiplayerGame ? 'cursor-not-allowed' : '']"
        :style="{ opacity: isReadyForMultiplayerGame ? 1 : 0.7 }"
        :disabled="!isReadyForMultiplayerGame"
        @click="onClickStartMultiplayerGameButton"
      >
        <span class="button-text">START</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Counter from "@/components/Home/Counter.vue";
import Switch from "@/components/Home/Switch.vue";
import TextInput from "@/components/Home/TextInput.vue";

export default defineComponent({
  props: {
    isShowingDialog: {
      type: Boolean,
      required: true,
    },
    selectedSize: {
      type: Number,
      required: true,
    },
    selectedTime: {
      type: Number,
      required: true,
    },
    playerName: {
      type: String,
      required: true,
    },
    isOwner: {
      type: Boolean,
      required: true,
    },
    roomNumber: {
      type: String,
      required: false,
    },
    isReadyForMultiplayerGame: {
      type: Boolean,
      required: true,
    },
  },

  components: {
    Counter,
    Switch,
    TextInput,
  },

  setup(props, context) {
    const onChangeSize = (newVal: number): void => {
      context.emit("onChangeSize", newVal);
    };

    const onChangeTime = (newVal: number): void => {
      context.emit("onChangeSize", newVal);
    };

    const onChangePlayerName = (newVal: string): void => {
      context.emit("onChangePlayerName", newVal);
    };

    const onChangeIsOwner = (newVal: boolean): void => {
      context.emit("onChangeIsOwner", newVal);
    };

    const onChangeRoomNumber = (newVal: string): void => {
      context.emit("onChangeRoomNumber", newVal);
    };

    const onClickStartMultiplayerGameButton = (): void => {
      context.emit("onClickStartMultiplayerGameButton");
    };

    return {
      onChangeSize,
      onChangeTime,
      onChangePlayerName,
      onChangeIsOwner,
      onChangeRoomNumber,
      onClickStartMultiplayerGameButton,
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

.disabled-form-title,
.disabled-form-helper-text {
  color: #dcdcdc;
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
