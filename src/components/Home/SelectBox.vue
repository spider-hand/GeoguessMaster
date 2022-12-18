<template>
  <div :class="[$style['select-box-wrapper']]">
    <button
      :class="[$style['select-box']]"
      ref="selectboxRef"
      @click="onClickSelectbox"
    >
      <div :class="$style['select-box__title']">{{ title }}</div>
      <div :class="$style['select-box__selected']">
        {{ selectedOption.text }}
      </div>
    </button>
    <SelectboxDialog
      v-if="state.isShowingDialog"
      :options="options"
      @onChangeOption="onChangeOption"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

import { SelectboxOption } from "@/types";
import SelectboxDialog from "@/components/Home/SelectBoxDialog.vue";

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
      type: Array as PropType<SelectboxOption[]>,
      required: true,
    },
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
      isShowingDialog: boolean;
    }>({
      isShowingDialog: false,
    });

    const onClickSelectbox = (e: any): void => {
      state.isShowingDialog = true;
    };

    const onChangeOption = (option: SelectboxOption): void => {
      state.isShowingDialog = false;
      context.emit("onChangeOption", option);
    };

    return {
      state,
      selectboxRef,
      onClickSelectbox,
      onChangeOption,
    };
  },
});
</script>

<style module lang="scss">
.select-box-wrapper {
  height: 100%;
}

.select-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  border: none;
  border-radius: 32px;
  padding: 0 24px;
  height: 100%;
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: var(--color-surface-superlight);
  }

  @media #{$tablet-landscape} {
    padding: 0 48px;
  }
}

.select-box__title {
  width: 100%;
  font-size: 12px;
  color: var(--color-surface-secondary);
  text-align: left;
}

.select-box__selected {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-surface-primary);
}
</style>
