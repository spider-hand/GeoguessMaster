<template>
  <div :class="$style['counter']">
    <button
      :class="[
        disabledDecrement
          ? $style['counter__button--disabled']
          : $style['counter__button'],
      ]"
      :disabled="disabledDecrement"
      @click="$emit('onChangeValue', count - 1)"
    >
      -
    </button>
    <div :class="$style['counter__text-wrapper']">
      <span
        :class="[
          disabled
            ? $style['counter__text--disabled']
            : $style['counter__text'],
        ]"
      >
        {{ count }}
      </span>
    </div>
    <button
      :class="[
        disabledIncrement
          ? $style['counter__button--disabled']
          : $style['counter__button'],
      ]"
      :disabled="disabledIncrement"
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
  display: flex;
  justify-content: right;
  flex-direction: row;
  position: relative;
  width: 150px;
}

.counter__button {
  border-radius: 18px;
  box-sizing: border-box;
  width: 36px;
  height: 36px;
  background-color: white;
  font-size: 20px;
  border: 2px solid var(--color-surface-secondary);
  color: var(--color-surface-secondary);
  cursor: pointer;

  &--disabled {
    @extend .counter__button;
    border-color: var(--color-surface-light);
    color: var(--color-surface-light);
    cursor: not-allowed;
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
    @extend .counter__text;
    color: var(--color-surface-light);
  }
}
</style>
