<template>
  <button
    :class="$style['flat-button']"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style module lang="scss">
.flat-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  height: 48px;
  padding: 4px 20px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: var(--color-brand-gradient);
  border: none;
  border-radius: 100px;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
