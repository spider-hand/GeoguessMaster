<template>
  <button :class="$style['flat-button']" :disabled="disabled">
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style module lang="scss">
.flat-button {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: none;
  border-radius: 100px;
  box-sizing: border-box;
  padding: 4px 20px;
  min-width: 180px;
  height: 48px;
  background: var(--color-brand-gradient);
  font-size: 16px;
  font-weight: 600;
  color: white;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
