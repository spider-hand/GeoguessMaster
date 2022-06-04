<template>
  <div :class="$style['counter']">
    <button
      :class="[
        $style['button'],
        disabledDecrement || disabled ? $style['disabled'] : $style['active'],
      ]"
      @click="decrement"
      :disabled="disabledDecrement || disabled"
    >
      -
    </button>
    <div :class="$style['text-wrapper']">
      <span :class="[$style['text'], disabled ? 'disabled' : $style['active']]">
        {{ count }}
      </span>
    </div>
    <button
      @click="increment"
      :class="[
        $style['button'],
        disabledIncrement || disabled ? $style['disabled'] : $style['active'],
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

.button {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: white;
  font-size: 20px;

  &.active {
    border: 1px solid $color-white-secondary;
    color: $color-black-secondary;
    cursor: pointer;
  }

  &.disabled {
    border: 1px solid $color-white-primary;
    color: $color-white-secondary;
    cursor: not-allowed;
  }
}

.text-wrapper {
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text {
  font-size: 16px;

  &.active {
    color: $color-black-primary;
  }

  &.disabled {
    color: $color-white-secondary;
  }
}
</style>
