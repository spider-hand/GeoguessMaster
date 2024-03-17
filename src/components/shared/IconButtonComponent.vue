<template>
  <button :class="$style['icon-button']">
    <img
      :src="getIconUrl(icon)"
      :width="24"
      :height="24"
      :alt="`${icon} icon`"
      :class="$style['icon-button__icon']"
    >
  </button>
</template>

<script setup lang="ts">
import { getIconUrl } from "@/utils";

defineProps({
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
  padding: 12px;
  background: var(--color-brand-gradient);
  border: none;
  border-radius: 100px;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
}
</style>
