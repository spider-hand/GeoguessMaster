<template>
  <div :class="$style['overlay']">
    <div :class="$style['overlay__container']">
      <span :class="$style['overlay__text']">{{ msg }}</span>
      <div :class="$style['overlay__loader']"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    msg: {
      type: String,
      required: false,
    },
  },
});
</script>

<style module lang="scss">
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay__container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.overlay__loader {
  border: 8px solid white;
  border-top: 8px solid transparent;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  margin: 32px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.overlay__text {
  font-size: 24px;
  color: white;
}

@media only screen and (max-width: 480px) {
  .overlay__text {
    font-size: 20px;
  }
}
</style>
