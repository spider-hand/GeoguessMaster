<template>
  <div
    :class="$style['icon-button']"
    :style="{ padding: size === 24 ? '12px' : '4px' }"
  >
    <img
      :src="`/src/assets/images/material-symbols/${icon}.svg`"
      :width="size"
      :height="size"
      :alt="`${icon} icon`"
      :class="$style['icon-button__icon']"
    >
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";

type IconSizeTypes = 16 | 24;

defineProps({
  size: {
    type: Number as PropType<IconSizeTypes>,
    required: false,
    default: 24,
  },
  icon: {
    type: String,
    required: true,
  },
});
</script>

<style module lang="scss">
.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: none;
  border-radius: 100px;
  box-sizing: border-box;
  background: var(--color-brand-gradient);

  &:active {
    transform: scale(0.95);
  }
}
</style>
