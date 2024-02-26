<template>
  <div
    :class="$style['icon-button']"
    :style="{ padding: size === 24 ? '12px' : '4px' }"
  >
    <img
      :src="getIconUrl(icon)"
      :width="size"
      :height="size"
      :alt="`${icon} icon`"
      :class="$style['icon-button__icon']"
    >
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { getIconUrl } from "@/utils";

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
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-brand-gradient);
  border: none;
  border-radius: 100px;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
}
</style>
