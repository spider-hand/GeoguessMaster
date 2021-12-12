<template>
  <div class="counter-container">
    <div style="flex-grow: 1"></div>
    <button
      class="button"
      id="decrement-button"
      :class="[disabledDecrement || disabled ? 'cursor-not-allowed' : '']"
      @click="decrement"
      :disabled="disabledDecrement || disabled"
      :style="{
        border:
          disabledDecrement || disabled
            ? '1px solid #eeeeee'
            : '1px solid #dcdcdc',
      }"
    >
      <span
        class="button-text"
        :style="{
          color: disabledDecrement || disabled ? '#dcdcdc' : '#5f5f5f',
        }"
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
      :class="[disabledIncrement || disabled ? 'cursor-not-allowed' : '']"
      :disabled="disabledIncrement || disabled"
      :style="{
        border:
          disabledIncrement || disabled
            ? '1px solid #eeeeee'
            : '1px solid #dcdcdc',
      }"
    >
      <span
        class="button-text"
        :style="{
          color: disabledIncrement || disabled ? '#dcdcdc' : '#5f5f5f',
        }"
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
  border-radius: 18px;
  background-color: #ffffff;
  cursor: pointer;
}

.cursor-not-allowed {
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

.disabled-text {
  color: #dcdcdc;
}

.button-text {
  font-family: "Roboto medium";
  font-size: 20px;
}
</style>
