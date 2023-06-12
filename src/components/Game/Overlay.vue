<template>
  <div :class="$style['overlay']">
    <span :class="$style['overlay__text']">{{ msg }}</span>
    <Spinner />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Spinner from "./Spinner.vue";

export default defineComponent({
  components: {
    Spinner,
  },
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
  @include pagePadding;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 4;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.overlay__text {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 500;
  color: white;
}
</style>
