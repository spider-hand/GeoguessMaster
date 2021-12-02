<template>
  <div
    class="select-box-dialog"
    v-if="isShowingDialog"
    :style="{
      height: options.length <= 4 ? options.length * 40 + 'px' : '180px',
      bottom:
        options.length <= 4 ? (options.length * 40 + 16) * -1 + 'px' : '-196px',
    }"
  >
    <div
      class="option-wrapper"
      v-for="option in options"
      :key="option.value"
      @click="onChangeOption(option)"
    >
      <span class="option-text">{{ option.text }}</span>
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
      context.emit('onChangeOption', option);
    };

    return {
      onChangeOption,
    };
  },
});
</script>

<style scoped>
.select-box-dialog {
  position: absolute;
  left: 0;
  width: 300px;
  background: #ffffff;
  border-radius: 20px;
  overflow-y: auto;
}

.option-wrapper {
  height: 32px;
  padding: 4px 48px;
  display: flex;
  align-items: center;
}

.option-text {
  font-family: "Roboto medium";
  font-size: 16px;
  color: #3c3c3c;
}
</style>
