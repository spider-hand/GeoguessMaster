<template>
  <div :class="$style['counter']">
    <button
      :class="[
        $style['counter__button'],
        disabledDecrement && $style['counter__button--disabled'],
      ]"
      :disabled="disabledDecrement"
      data-testid="decrement-button"
      @click="$emit('onChangeValue', count - 1)"
    >
      -
    </button>
    <div :class="$style['counter__text-wrapper']">
      <span
        :class="[
          $style['counter__text'],
          disabled && $style['counter__text--disabled'],
        ]"
        data-testid="count-text"
      >
        {{ count }}
      </span>
    </div>
    <button
      :class="[
        $style['counter__button'],
        disabledIncrement && $style['counter__button--disabled'],
      ]"
      :disabled="disabledIncrement"
      data-testid="increment-button"
      @click="$emit('onChangeValue', count + 1)"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
  },
});

defineEmits<{
  onChangeValue: [count: number];
}>();

const disabledIncrement = computed<boolean>(
  () => props.max <= props.count || props.disabled
);
const disabledDecrement = computed<boolean>(
  () => props.min >= props.count || props.disabled
);
</script>

<style module lang="scss">
.counter {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: right;
  width: 150px;
}

.counter__button {
  width: 36px;
  height: 36px;
  font-size: 20px;
  color: var(--color-surface-secondary);
  cursor: pointer;
  background-color: white;
  border: 2px solid var(--color-surface-secondary);
  border-radius: 18px;

  &--disabled {
    color: var(--color-surface-light);
    cursor: not-allowed;
    border-color: var(--color-surface-light);
  }
}

.counter__text-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
}

.counter__text {
  font-size: 16px;
  color: var(--color-surface-primary);

  &--disabled {
    color: var(--color-surface-light);
  }
}
</style>
