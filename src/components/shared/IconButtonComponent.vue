<template>
  <div :class="[$style['icon-button'], $style[`icon-button--${size}`]]">
    <img
      :src="getIconUrl(icon)"
      :width="iconSize"
      :height="iconSize"
      :alt="`${icon} icon`"
      :class="$style['icon-button__icon']"
    >
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue";
import { getIconUrl } from "@/utils";

type IconSizeTypes = "sm" | "md";

const props = defineProps({
  size: {
    type: String as PropType<IconSizeTypes>,
    required: false,
    default: "md",
  },
  icon: {
    type: String,
    required: true,
  },
});

const iconSize = computed(() => {
  switch (props.size) {
    case "sm":
      return "16";
    case "md":
      return "24";
    default: {
      return "24";
    }
  }
});
</script>

<style module lang="scss">
.icon-button {
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

  &--sm {
    padding: 4px;
  }

  &--md {
    padding: 12px;
  }
}
</style>
