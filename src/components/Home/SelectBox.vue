<template>
  <div
    :class="[
      state.isHovering
        ? $style['select-box-wrapper--on-hover']
        : $style['select-box-wrapper'],
      ,
    ]"
  >
    <div
      :class="[
        state.isHovering
          ? $style['select-box--on-hover']
          : $style['select-box'],
      ]"
      ref="selectboxRef"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
      @click="onClickSelectbox"
    >
      <div :class="$style['select-box__title']">{{ title }}</div>
      <div :class="$style['select-box__selected-option']">
        {{ selectedOption.text }}
      </div>
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
      type: Array,
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
      context.emit("onChangeOption", option);
    };

    return {
      state,
      selectboxRef,
      onMouseOver,
      onMouseLeave,
      onClickSelectbox,
      onChangeOption,
    };
  },
});
</script>

<style module lang="scss">
.select-box-wrapper {
  position: relative;
  height: 100%;
  width: 228px;
  background-color: #ffffff;
  border-radius: 32px;
  display: flex;
  align-items: center;

  &--on-hover {
    @extend .select-box-wrapper;
    background-color: $color-white-primary;
  }
}

.select-box {
  width: 180px;
  height: 48px;
  padding: 4px 24px 0 24px;
  cursor: pointer;
  border-right: 1px solid $color-white-secondary;
  box-sizing: border-box;

  &--on-hover {
    @extend .select-box;
    border-right: none;
  }
}

.select-box__title {
  font-size: 12px;
  color: $color-black-secondary;
}

.select-box__selected-option {
  font-size: 16px;
  color: $color-black-primary;
}

@media only screen and (max-width: 480px) {
  .select-box-wrapper {
    width: 40%;
  }

  .select-box {
    width: 100%;
    height: 44px;
    padding: 8px 16px 0 16px;
  }

  .select-box__title {
    font-size: 10px;
  }

  .select-box__selected-option {
    font-size: 14px;
  }
}
</style>
