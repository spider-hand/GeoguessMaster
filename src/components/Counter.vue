<template>
  <div class="counter-container">
    <div style="flex-grow: 1"></div>
    <button
      class="button"
      @click="decrement"
      :disabled="disabledDecrement"
      :style="{
        border: disabledDecrement ? '1px solid #eeeeee' : '1px solid #dcdcdc',
      }"
    >
      <span 
        class="button-text"
        :style="{
          color: disabledIncrement ? '1px solid #dcdcdc' : '1px solid #5f5f5f',
        }"  
      >-</span>
    </button>
    <div class="text-wrapper">
      <span class="text">{{ state.count }}</span>
    </div>
    <button
      class="button"
      @click="increment"
      :disabled="disabledIncrement"
      :style="{
        border: disabledIncrement ? '1px solid #eeeeee' : '1px solid #dcdcdc',
      }"
    >
      <span
        class="button-text"
        :style="{
          color: disabledIncrement ? '1px solid #dcdcdc' : '1px solid #5f5f5f',
        }"
        >+</span
      >
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";

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
  },

  setup(props) {
    const state = reactive<{
      count: number;
    }>({
      count: props.min,
    });

    const disabledIncrement = computed<boolean>(() => props.max <= state.count);
    const disabledDecrement = computed<boolean>(() => props.min >= state.count);

    const increment = (): void => {
      state.count++;
    };

    const decrement = (): void => {
      state.count--;
    };

    return {
      state,
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
  font-family: "Roboto medium";
  font-size: 20px;
}
</style>
