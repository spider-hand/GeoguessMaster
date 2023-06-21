<template>
  <div
    :class="$style['aurora-background']"
    :style="{
      background: `radial-gradient(50% 50% at ${xPercent}% ${yPercent}%, ${from} 0, transparent 100%)`,
    }"
  />
</template>

<script setup lang="ts">
defineProps({
  from: {
    type: String,
    required: true,
  },
  xPercent: {
    type: String,
    required: true,
  },
  yPercent: {
    type: String,
    required: true,
  },
});
</script>

<style module lang="scss">
.aurora-background {
  z-index: -1;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
