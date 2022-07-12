<template>
  <div
    :class="$style['select-box-dialog']"
    v-if="isShowingDialog"
    :style="{
      height: options.length <= 4 ? options.length * 40 + 'px' : '180px',
      bottom:
        options.length <= 4 ? (options.length * 40 + 16) * -1 + 'px' : '-196px',
    }"
  >
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
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    isShowingDialog: {
      type: Boolean,
      default: false,
      required: true,
    },
    options: {
      type: Array,
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
  left: 0;
  width: 300px;
  background: white;
  border-radius: 20px;
  overflow-y: auto;
}

.select-box-dialog__option-wrapper {
  height: 32px;
  padding: 4px 48px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.select-box-dialog__option-text {
  font-size: 16px;
  color: $color-black-primary;
}
</style>
