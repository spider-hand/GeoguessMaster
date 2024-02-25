<template>
  <div
    v-if="isShowingDialog"
    id="create-room-dialog"
    :class="$style['create-room-dialog']"
  >
    <div :class="$style['create-room-dialog__form']">
      <div>
        <div
          :class="[
            $style['create-room-dialog__text'],
            !isOwner && $style['create-room-dialog__text--disabled'],
          ]"
        >
          Size
        </div>
        <div
          :class="[
            $style['create-room-dialog__helper-text'],
            !isOwner && $style['create-room-dialog__helper-text--disabled'],
          ]"
        >
          2-5 people
        </div>
      </div>
      <CounterComponent
        :min="2"
        :max="5"
        :count="selectedSize"
        :disabled="!isOwner"
        @onChangeValue="(val: number) => $emit('onChangeSize', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <div>
        <span
          :class="[
            $style['create-room-dialog__text'],
            !isOwner && $style['create-room-dialog__text--disabled'],
          ]"
        >
          Time per round
        </span>
        <br>
        <span
          :class="[
            $style['create-room-dialog__helper-text'],
            !isOwner && $style['create-room-dialog__helper-text--disabled'],
          ]"
        >
          1-10 minutes
        </span>
      </div>
      <CounterComponent
        :min="1"
        :max="10"
        :count="selectedTime"
        :disabled="!isOwner"
        @onChangeValue="(val: number) => $emit('onChangeTime', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <TextInputComponent
        label="Player Name"
        name="player-name"
        placeholder="Your Player Name"
        @onChangeValue="(val: string) => $emit('onChangePlayerName', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <div>
        <span :class="$style['create-room-dialog__text']">Are you a host?</span>
      </div>
      <SwitchComponent
        :ans="isOwner"
        @onChangeValue="(val: boolean) => $emit('onChangeIsOwner', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <TextInputComponent
        label="Room Number"
        name="room-number"
        placeholder="Room Number"
        :disabled="isOwner"
        :error-msg="roomCannnotBeFoundError"
        @onChangeValue="(val: string) => emit('onChangeRoomNumber', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__footer']">
      <FlatButtonComponent
        :text="'START'"
        :disabled="!isReadyForMultiplayerGame"
        @click="$emit('onClickStartMultiplayerGameButton')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CounterComponent from "./CounterComponent.vue";
import SwitchComponent from "./SwitchComponent.vue";
import TextInputComponent from "./TextInputComponent.vue";
import FlatButtonComponent from "../shared/FlatButtonComponent.vue";

const props = defineProps({
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
    required: true,
  },
  isReadyForMultiplayerGame: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  onChangeSize: [val: number];
  onChangeTime: [val: number];
  onChangePlayerName: [val: string];
  onChangeIsOwner: [val: boolean];
  onChangeRoomNumber: [val: string];
  onClickStartMultiplayerGameButton: [];
}>();

const roomCannnotBeFoundError = computed<string | undefined>(() =>
  !props.isRoomFound ? "The room cannot be found." : undefined
);
</script>

<style module lang="scss">
.create-room-dialog {
  display: flex;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  padding: 12px 24px;
  width: 100%;
  box-shadow: var(--color-shadow-bold);
  border-radius: 20px;
  background-color: white;

  @media #{$tablet-landscape} {
    width: 80%;
  }
}

.create-room-dialog__form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  height: 48px;
  padding: 12px;
}

.create-room-dialog__text {
  @include mainText;
  color: var(--color-surface-primary);

  &--disabled {
    color: var(--color-surface-light);
  }
}

.create-room-dialog__helper-text {
  @include label;
  color: var(--color-surface-secondary);

  &--disabled {
    color: var(--color-surface-light);
  }
}

.create-room-dialog__footer {
  display: flex;
  align-items: center;
  margin-top: 12px;
  width: 100%;
}
</style>
