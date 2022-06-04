<template>
  <div :class="$style['switch-container']">
    <button
      :class="[
        $style['option'],
        ans ? $style['selected'] : $style['not-selected'],
      ]"
      @click="onClickYes"
    >
      YES
    </button>
    <div style="flex-grow: 1"></div>
    <button
      :class="[
        $style['option'],
        ans ? $style['not-selected'] : $style['selected'],
      ]"
      @click="onClickNo"
    >
      NO
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    ans: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, context) {
    const onClickYes = (): void => {
      context.emit("onChangeValue", true);
    };

    const onClickNo = (): void => {
      context.emit("onChangeValue", false);
    };

    return {
      onClickYes,
      onClickNo,
    };
  },
});
</script>

<style module lang="scss">
.switch-container {
  position: absolute;
  right: 24px;
  height: 36px;
  width: 150px;
  padding: 0 4px;
  background-color: $color-white-primary;
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
  font-size: 12px;
  color: $color-black-secondary;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.selected {
    background-color: white;
  }

  &.not-selected {
    background-color: $color-white-primary;
  }
}
</style>
