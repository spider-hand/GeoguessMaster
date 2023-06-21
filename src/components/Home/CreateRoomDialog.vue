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
            !isOwner
              ? $style['create-room-dialog__text--disabled']
              : $style['create-room-dialog__text'],
          ]"
        >
          Size
        </div>
        <div
          :class="[
            !isOwner
              ? $style['create-room-dialog__helper-text--disabled']
              : $style['create-room-dialog__helper-text'],
          ]"
        >
          2-5 people
        </div>
      </div>
      <MySpace />
      <MyCounter
        :min="2"
        :max="5"
        :count="selectedSize"
        :disabled="!isOwner"
        @onChangeValue="(val) => $emit('onChangeSize', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <div>
        <span
          :class="[
            !isOwner
              ? $style['create-room-dialog__text--disabled']
              : $style['create-room-dialog__text'],
          ]"
        >
          Time per round
        </span>
        <br>
        <span
          :class="[
            !isOwner
              ? $style['create-room-dialog__helper-text--disabled']
              : $style['create-room-dialog__helper-text'],
          ]"
        >
          1-10 minutes
        </span>
      </div>
      <MySpace />
      <MyCounter
        :min="1"
        :max="10"
        :count="selectedTime"
        :disabled="!isOwner"
        @onChangeValue="(val) => $emit('onChangeTime', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <TextInput
        label="Player Name"
        name="player-name"
        placeholder="Your Player Name"
        @onChangeValue="(val) => $emit('onChangePlayerName', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <div>
        <span :class="$style['create-room-dialog__text']">Are you a host?</span>
      </div>
      <MySpace />
      <MySwitch
        :ans="isOwner"
        @onChangeValue="(val) => $emit('onChangeIsOwner', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__form']">
      <TextInput
        label="Room Number"
        name="room-number"
        placeholder="Room Number"
        :disabled="isOwner"
        :error-msg="roomCannnotBeFoundError"
        @onChangeValue="(val) => emit('onChangeRoomNumber', val)"
      />
    </div>
    <div :class="$style['create-room-dialog__footer']">
      <FlatButton
        :text="'START'"
        :disabled="!isReadyForMultiplayerGame"
        @click="$emit('onClickStartMultiplayerGameButton')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import MyCounter from "@/components/home/MyCounter.vue";
import MySwitch from "@/components/home/MySwitch.vue";
import TextInput from "@/components/home/TextInput.vue";
import FlatButton from "@/components/shared/FlatButton.vue";
import MySpace from "@/components/shared/MySpace.vue";

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
  flex-direction: row;
  width: 100%;
  height: 48px;
  padding: 12px;
}

.create-room-dialog__text {
  @include mainText;
  color: var(--color-surface-primary);

  &--disabled {
    @extend .create-room-dialog__text;
    color: var(--color-surface-light);
  }
}

.create-room-dialog__helper-text {
  @include label;
  color: var(--color-surface-secondary);

  &--disabled {
    @extend .create-room-dialog__helper-text;
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
