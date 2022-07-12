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
          disabled ? 'counter__text--disabled' : $style['counter__text'],
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
  position: absolute;
  right: 24px;
  width: 150px;
  display: flex;
  justify-content: right;
  flex-direction: row;
}

.counter__button {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: white;
  font-size: 20px;
  border: 1px solid $color-white-secondary;
  color: $color-black-secondary;
  cursor: pointer;

  &--disabled {
    @extend .counter__button;
    border-color: $color-white-primary;
    color: $color-white-secondary;
    cursor: not-allowed;
  }
}

.counter__text-wrapper {
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.counter__text {
  font-size: 16px;
  color: $color-black-primary;

  &--disabled {
    @extend .counter__text;
    color: $color-white-secondary;
  }
}
</style>
