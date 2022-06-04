<template>
  <div
    :class="[$style['room-number-dialog'], isGameReady && $style['animated']]"
  >
    <div>
      <div :class="$style['label']">Room Number</div>
      <div :class="$style['room-number']">{{ roomNumber }}</div>
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
}

.animated {
  transform: translateY(-200px);
}

.room-number {
  color: white;
  font-size: 16px;
}

.label {
  color: white;
  font-size: 12px;
}
</style>
