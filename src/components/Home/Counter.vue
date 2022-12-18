<template>
  <div :class="$style['counter']">
    <button
      :class="[
        disabledDecrement || disabled
          ? $style['counter__button--disabled']
          : $style['counter__button'],
      ]"
      @click="decrement"
      :disabled="disabledDecrement || disabled"
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
      @click="increment"
      :class="[
        disabledIncrement || disabled
          ? $style['counter__button--disabled']
          : $style['counter__button'],
      ]"
      :disabled="disabledIncrement || disabled"
    >
      +
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
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
  },

  setup(props, context) {
    const disabledIncrement = computed<boolean>(() => props.max <= props.count);
    const disabledDecrement = computed<boolean>(() => props.min >= props.count);

    const increment = (): void => {
      const updated = props.count + 1;
      context.emit("onChangeValue", updated);
    };

    const decrement = (): void => {
      const updated = props.count - 1;
      context.emit("onChangeValue", updated);
    };

    return {
      disabledIncrement,
      disabledDecrement,
      increment,
      decrement,
    };
  },
});
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
