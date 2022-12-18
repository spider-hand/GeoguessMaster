<template>
  <div :class="$style[`icon-button--${size}`]">
    <span
      :class="$style[`icon-button__icon--${size}`]"
      class="material-icons"
      >{{ icon }}</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

type IconSize = "sm" | "md";

export default defineComponent({
  props: {
    size: {
      type: String as PropType<IconSize>,
      default: "md",
      required: false,
    },
    icon: {
      type: String,
      required: true,
    },
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

  &--md {
    @extend .icon-button;
    width: 48px;
    height: 48px;
  }

  &--sm {
    @extend .icon-button;
    width: 24px;
    height: 24px;
  }
}

.icon-button__icon {
  color: white;

  &--md {
    @extend .icon-button__icon;
    font-size: 24px;
  }

  &--sm {
    @extend .icon-button__icon;
    font-size: 12px;
  }
}
</style>
