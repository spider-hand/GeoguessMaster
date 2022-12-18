<template>
  <div :class="$style['select-box-dialog']">
    <div
      :class="$style['select-box-dialog__option-wrapper']"
      v-for="option in options"
      :key="option.value"
      @click="onChangeOption(option)"
    >
      <span :class="$style['select-box-dialog__option-text']">{{
        option.text
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { SelectboxOption } from "@/types";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    options: {
      type: Array as PropType<SelectboxOption[]>,
      required: true,
    },
  },

  setup(props, context) {
    const onChangeOption = (option: SelectboxOption): void => {
      context.emit("onChangeOption", option);
    };

    return {
      onChangeOption,
    };
  },
});
</script>

<style module lang="scss">
.select-box-dialog {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  box-shadow: var(--color-shadow-bold);
  border-radius: 12px;
  padding: 12px 24px;
  width: 240px;
  height: auto;
  background-color: white;

  @media #{$mobile-landscape} {
    left: auto;
  }
}

.select-box-dialog__option-wrapper {
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
}

.select-box-dialog__option-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-surface-primary);
}
</style>
