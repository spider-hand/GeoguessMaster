<template>
  <div :class="$style['overlay']">
    <span :class="$style['overlay__text']">{{ msg }}</span>
    <SpinnerComponent />
  </div>
</template>

<script setup lang="ts">
import SpinnerComponent from "./SpinnerComponent.vue";

defineProps({
  msg: {
    type: String,
    required: false,
    default: "",
  },
});
</script>

<style module lang="scss">
.overlay {
  @include page-padding;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 50%);
}

.overlay__text {
  font-size: 24px;
  font-weight: 500;
  color: white;
}
</style>
