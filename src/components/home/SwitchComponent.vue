<template>
  <div :class="$style['switch']">
    <button
      :class="[
        $style['switch__option'],
        $style['switch__option--left'],
        ans
          ? $style['switch__option--selected']
          : $style['switch__option--not-selected'],
      ]"
      data-testid="yes-button"
      @click="$emit('onChangeValue', true)"
    >
      YES
    </button>
    <button
      :class="[
        $style['switch__option'],
        $style['switch__option--right'],
        ans
          ? $style['switch__option--not-selected']
          : $style['switch__option--selected'],
      ]"
      data-testid="no-button"
      @click="$emit('onChangeValue', false)"
    >
      NO
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  ans: {
    type: Boolean,
    required: true,
  },
});

defineEmits<{
  onChangeValue: [val: boolean];
}>();
</script>

<style module lang="scss">
.switch {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 150px;
  height: 36px;
  background-color: var(--color-surface-light);
  border-radius: 100px;
}

.switch__option {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 4px 24px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-surface-primary);
  cursor: pointer;
  border: none;
  border-radius: 24px;

  &--left {
    left: 4px;
  }

  &--right {
    right: 4px;
  }

  &--selected {
    background-color: white;
  }

  &--not-selected {
    background-color: var(--color-surface-light);
  }
}
</style>
