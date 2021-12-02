<template>
  <div
    class="select-box-highligted-container"
    :style="{ backgroundColor: state.isHovering ? '#eeeeee' : '#ffffff' }"
  >
    <div
      class="select-box-container"
      ref="selectboxRef"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
      @click="onClickSelectbox"
      :style="{ borderRight: !state.isHovering ? '1px solid #dcdcdc' : null }"
    >
      <span class="select-box-title">{{ title }}</span>
      <br />
      <span class="selected-option">{{ selectedOption.text }}</span>
    </div>
    <SelectboxDialog
      :isShowingDialog="state.isShowingDialog"
      :options="options"
      @onChangeOption="onChangeOption"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

import { SelectboxOption } from "@/types";
import SelectboxDialog from "@/components/SelectBoxDialog.vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    selectedOption: {
      type: Object as PropType<SelectboxOption>,
      required: true,
    },
    options: {
      type: Array,
      required: true
    }
  },

  components: {
    SelectboxDialog,
  },

  setup(props, context) {
    const selectboxRef = ref(null);
    onClickOutside(selectboxRef, (event) => {
      let isSelectboxDialogClicked = false;
      const path = event.composedPath();
      path.forEach((el) => {
        if ((el as Element).className === "select-box-dialog") {
          isSelectboxDialogClicked = true;
          return;
        }
      });
      if (!isSelectboxDialogClicked) {
        state.isShowingDialog = false;
      }
    });

    const state = reactive<{
      isHovering: boolean;
      isShowingDialog: boolean;
    }>({
      isHovering: false,
      isShowingDialog: false,
    });

    const onMouseOver = (): void => {
      state.isHovering = true;
    };

    const onMouseLeave = (): void => {
      state.isHovering = false;
    };

    const onClickSelectbox = (): void => {
      state.isShowingDialog = true;
    };

    const onChangeOption = (option: SelectboxOption): void => {
      context.emit('onChangeOption', option);
    };

    return {
      state,
      selectboxRef,
      onMouseOver,
      onMouseLeave,
      onClickSelectbox,
      onChangeOption
    };
  },
});
</script>

<style scoped>
.select-box-highligted-container {
  position: relative;
  height: 100%;
  width: 228px;
  border-radius: 32px;
  display: flex;
  align-items: center;
}

.select-box-container {
  width: 180px;
  height: 48px;
  padding: 0 24px;
}

.select-box-title {
  font-family: "Roboto medium";
  font-size: 12px;
  color: #5f5f5f;
}

.selected-option {
  font-family: "Roboto medium";
  font-size: 16px;
  color: #3c3c3c;
}
</style>
