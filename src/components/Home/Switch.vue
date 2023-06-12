<template>
  <div :class="$style['switch']">
    <button
      :class="[
        $style['switch__option--left'],
        ans
          ? $style['switch__option--selected']
          : $style['switch__option--not-selected'],
      ]"
      @click="onClickYes"
    >
      YES
    </button>
    <div style="flex-grow: 1" />
    <button
      :class="[
        $style['switch__option--right'],
        ans
          ? $style['switch__option--not-selected']
          : $style['switch__option--selected'],
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
.switch {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  border-radius: 100px;
  height: 36px;
  width: 150px;
  background-color: var(--color-surface-light);
}

.switch__option {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  box-sizing: border-box;
  border: none;
  border-radius: 24px;
  padding: 4px 24px;
  height: 28px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-surface-primary);
  cursor: pointer;

  &--left {
    @extend .switch__option;
    left: 4px;
  }

  &--right {
    @extend .switch__option;
    right: 4px;
  }

  &--selected {
    @extend .switch__option;
    background-color: white;
  }

  &--not-selected {
    @extend .switch__option;
    background-color: var(--color-surface-light);
  }
}
</style>
