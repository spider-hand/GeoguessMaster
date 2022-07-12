<template>
  <div
    :class="[
      isGameReady
        ? $style['room-number-dialog--animated']
        : $style['room-number-dialog'],
    ]"
  >
    <div>
      <div :class="$style['room-number-dialog__label']">Room Number</div>
      <div :class="$style['room-number-dialog__text']">{{ roomNumber }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    roomNumber: {
      type: String,
      required: true,
    },
    isGameReady: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style module lang="scss">
.room-number-dialog {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 80px;
  height: 64px;
  padding: 0 16px;
  border-radius: 5px;
  background-color: $color-brand-primary;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 1s;

  &--animated {
    @extend .room-number-dialog;
    transform: translateY(-200px);
  }
}

.room-number-dialog__label {
  color: white;
  font-size: 12px;
}

.room-number-dialog__text {
  color: white;
  font-size: 16px;
}
</style>
