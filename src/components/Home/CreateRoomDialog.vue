<template>
  <div
    id="create-room-dialog"
    :class="$style['create-room-dialog']"
    v-if="isShowingDialog"
  >
    <div :class="$style['create-room-dialog__form']">
      <div>
        <div
          :class="[
            !isOwner
              ? $style['create-room-dialog__form-title--disabled']
              : $style['create-room-dialog__form-title'],
          ]"
        >
          Size
        </div>
        <div
          :class="[
            !isOwner
              ? $style['create-room-dialog__form-helper-text--disabled']
              : $style['create-room-dialog__form-helper-text'],
          ]"
        >
          2-5 people
        </div>
      </div>
      <Counter
        :min="2"
        :max="5"
        :count="selectedSize"
        :disabled="!isOwner"
        @onChangeValue="onChangeSize"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <div>
        <span
          :class="[
            !isOwner
              ? $style['create-room-dialog__form-title--disabled']
              : $style['create-room-dialog__form-title'],
          ]"
        >
          Time per round
        </span>
        <br />
        <span
          :class="[
            !isOwner
              ? $style['create-room-dialog__form-helper-text--disabled']
              : $style['create-room-dialog__form-helper-text'],
          ]"
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
    <div :class="$style['create-room-dialog__form']">
      <TextInput
        label="Player Name"
        name="player-name"
        placeholder="Your Player Name"
        :inputValue="playerName"
        @onChangeValue="onChangePlayerName"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <span :class="$style['form-title']">Are you an owner?</span>
      <Switch :ans="isOwner" @onChangeValue="onChangeIsOwner" />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <TextInput
        label="Room Number"
        name="room-number"
        placeholder="Room Number"
        :inputValue="roomNumber"
        @onChangeValue="onChangeRoomNumber"
        :disabled="isOwner"
        :errorMsg="roomCannnotBeFoundError"
      />
    </div>
    <div :class="$style['create-room-dialog__button-wrapper']">
      <button
        :class="[
          isReadyForMultiplayerGame
            ? $style['create-room-dialog__button']
            : $style['create-room-dialog__button--disabled'],
        ]"
        :disabled="!isReadyForMultiplayerGame"
        @click="onClickStartMultiplayerGameButton"
      >
        START
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

import Counter from "@/components/Home/Counter.vue";
import Switch from "@/components/Home/Switch.vue";
import TextInput from "@/components/Home/TextInput.vue";

export default defineComponent({
  props: {
    isShowingDialog: {
      type: Boolean,
      required: true,
    },
    isRoomFound: {
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
    const roomCannnotBeFoundError = computed<string | null>(() =>
      !props.isRoomFound ? "The room cannot be found." : null
    );

    const onChangeSize = (newVal: number): void => {
      context.emit("onChangeSize", newVal);
    };

    const onChangeTime = (newVal: number): void => {
      context.emit("onChangeTime", newVal);
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
      roomCannnotBeFoundError,
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

<style module lang="scss">
.create-room-dialog {
  position: absolute;
  bottom: -393px;
  right: 0;
  width: 320px;
  height: 377px;
  padding: 0 32px;
  background: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.create-room-dialog__form {
  width: 100%;
  height: 48px;
  padding: 8px 16px;
  flex-direction: row;
  display: flex;
  align-items: center;
  border-bottom: 1px solid $color-white-secondary;
}

.create-room-dialog__form-title {
  font-size: 16px;
  color: $color-black-primary;

  &--disabled {
    @extend .create-room-dialog__form-title;
    color: $color-white-secondary;
  }
}

.create-room-dialog__form-helper-text {
  font-size: 12px;
  color: $color-black-secondary;

  &--disabled {
    @extend .create-room-dialog__form-helper-text;
    color: $color-white-secondary;
  }
}

.create-room-dialog__button-wrapper {
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
}

.create-room-dialog__button {
  width: 129px;
  height: 36px;
  background-color: $color-red-primary;
  border: none;
  border-radius: 18px;
  font-size: 14px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &--disabled {
    @extend .create-room-dialog__button;
    cursor: not-allowed;
    opacity: 0.7;
  }
}

@media only screen and (max-width: 480px) {
  .create-room-dialog {
    width: 80%;
  }
}
</style>
