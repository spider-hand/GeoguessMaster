<template>
  <div
    id="create-room-dialog"
    :class="$style['create-room-dialog']"
  >
    <div :class="$style['create-room-dialog__form']">
      <div
        :class="[
          $style['create-room-dialog__form-text'],
          !isOwner && $style['create-room-dialog__form-text--disabled'],
        ]"
        data-testid="size-form-text"
      >
        <div :class="$style['create-room-dialog__form-main-text']">
          Size
        </div>
        <div :class="$style['create-room-dialog__form-helper-text']">
          2-5 people
        </div>
      </div>
      <CounterComponent
        :min="2"
        :max="5"
        :count="selectedSize"
        :disabled="!isOwner"
        @on-change-value="(val) => $emit('onChangeSize', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <div
        :class="[
          $style['create-room-dialog__form-text'],
          !isOwner && $style['create-room-dialog__form-text--disabled'],
        ]"
        data-testid="time-form-text"
      >
        <div :class="$style['create-room-dialog__form-main-text']">
          Time per round
        </div>
        <div :class="$style['create-room-dialog__form-helper-text']">
          1-10 minutes
        </div>
      </div>
      <CounterComponent
        :min="1"
        :max="10"
        :count="selectedTime"
        :disabled="!isOwner"
        @on-change-value="(val) => $emit('onChangeTime', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <TextInputComponent
        label="Player Name"
        name="player-name"
        placeholder="Your Player Name"
        @on-change-value="(val) => $emit('onChangePlayerName', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <div :class="$style['create-room-dialog__form-text']">
        Are you a host?
      </div>
      <SwitchComponent
        :ans="isOwner"
        @on-change-value="(val) => $emit('onChangeIsOwner', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <TextInputComponent
        label="Room Number"
        name="room-number"
        placeholder="Room Number"
        :disabled="isOwner"
        :error-msg="roomCannnotBeFoundError"
        @on-change-value="(val) => $emit('onChangeRoomNumber', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__footer']">
      <button
        :class="$style['create-room-dialog__button']"
        :disabled="!isReadyForMultiplayerGame"
        data-testid="create-room-button"
        @click="$emit('onClickStartMultiplayerGameButton')"
      >
        START
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CounterComponent from "./CounterComponent.vue";
import SwitchComponent from "./SwitchComponent.vue";
import TextInputComponent from "./TextInputComponent.vue";

const props = defineProps({
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

defineEmits<{
  onChangeSize: [val: number];
  onChangeTime: [val: number];
  onChangePlayerName: [val: string];
  onChangeIsOwner: [val: boolean];
  onChangeRoomNumber: [val: string];
  onClickStartMultiplayerGameButton: [];
}>();

const roomCannnotBeFoundError = computed<string | null>(() =>
  !props.isRoomFound ? "The room cannot be found." : null
);
</script>

<style module lang="scss">
.create-room-dialog {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  width: 100%;
  padding: 24px;
  background-color: white;
  border-radius: 20px;
  box-shadow: var(--color-shadow-bold);

  @media #{$tablet-landscape} {
    width: 80%;
  }
}

.create-room-dialog__form {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 12px;
}

.create-room-dialog__form-text {
  display: flex;
  flex-direction: column;

  &--disabled {
    > * {
      color: var(--color-surface-light) !important;
    }
  }
}

.create-room-dialog__form-main-text {
  @include main-text;

  color: var(--color-surface-primary);
}

.create-room-dialog__form-helper-text {
  @include label;

  color: var(--color-surface-secondary);
}

.create-room-dialog__footer {
  display: flex;
  align-items: center;
  width: 100%;
}

.create-room-dialog__button {
  @include flat-button;
}
</style>
