<template>
  <div class="counter-container">
    <div style="flex-grow: 1"></div>
    <button
      class="button"
      id="decrement-button"
      :class="[disabledDecrement || disabled ? 'disabled-button' : '']"
      @click="decrement"
      :disabled="disabledDecrement || disabled"
    >
      <span
        class="button-text"
        :class="[disabledDecrement || disabled ? 'disabled-text' : '']"
        >-</span
      >
    </button>
    <div class="text-wrapper">
      <span class="text" :class="[disabled ? 'disabled-text' : '']">
        {{ count }}
      </span>
    </div>
    <button
      class="button"
      id="increment-button"
      @click="increment"
      :class="[disabledIncrement || disabled ? 'disabled-button' : '']"
      :disabled="disabledIncrement || disabled"
    >
      <span
        class="button-text"
        :class="[disabledIncrement || disabled ? 'disabled-text' : '']"
        >+</span
      >
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

<style scoped>
.counter-container {
  position: absolute;
  right: 24px;
  width: 150px;
  display: flex;
  flex-direction: row;
}

.button {
  width: 36px;
  height: 36px;
  border: 1px solid #dcdcdc;
  border-radius: 18px;
  background-color: #ffffff;
  cursor: pointer;
}

.disabled-button {
  border: 1px solid #eeeeee;
  cursor: not-allowed;
}

.text-wrapper {
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text {
  font-family: "Roboto medium";
  font-size: 16px;
  color: #3c3c3c;
}

.button-text {
  color: #5f5f5f;
  font-family: "Roboto medium";
  font-size: 20px;
}

.disabled-text {
  color: #dcdcdc;
}
</style>
