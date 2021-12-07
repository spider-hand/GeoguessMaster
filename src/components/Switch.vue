<template>
  <div class="switch-container">
    <button
      class="option"
      id="option-yes"
      @click="onClickYes"
      :style="{ backgroundColor: state.ans ? '#ffffff' : '#eeeeee' }"
    >
      <span class="option-text">YES</span>
    </button>
    <div style="flex-grow: 1"></div>
    <button
      class="option"
      id="option-no"
      @click="onClickNo"
      :style="{ backgroundColor: state.ans ? '#eeeeee' : '#ffffff' }"
    >
      <span class="option-text">NO</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  props: {
    ans: {
      type: Boolean,
      required: true,
    }
  },

  setup(props, context) {
    const state = reactive<{
      ans: boolean;
    }>({
      ans: props.ans,
    });

    const onClickYes = (): void => {
      state.ans = true;
      context.emit("onChangeValue", true);
    };

    const onClickNo = (): void => {
      state.ans = false;
      context.emit("onChangeValue", false);
    };

    return {
      state,
      onClickYes,
      onClickNo,
    };
  },
});
</script>

<style scoped>
.switch-container {
  position: absolute;
  right: 24px;
  height: 36px;
  width: 150px;
  padding: 0 4px;
  background-color: #eeeeee;
  border-radius: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.option {
  height: 28px;
  width: 64px;
  border: none;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.option-text {
  font-family: "Roboto medium";
  font-size: 12px;
  color: #5f5f5f;
}
</style>
