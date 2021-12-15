<template>
  <div
    class="select-box-highligted-container"
    :class="[state.isHovering ? 'on-hover' : '']"
  >
    <div
      class="select-box-container"
      :class="[state.isHovering ? 'on-hover-select-box-container' : '']"
      ref="selectboxRef"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
      @click="onClickSelectbox"
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

<style scoped>
.select-box-highligted-container {
  position: relative;
  height: 100%;
  width: 228px;
  background-color: #ffffff;
  border-radius: 32px;
  display: flex;
  align-items: center;
}

.on-hover {
  background-color: #eeeeee;
}

.select-box-container {
  width: 180px;
  height: 48px;
  padding: 0 24px;
  cursor: pointer;
  border-right: 1px solid #dcdcdc;
}

.on-hover-select-box-container {
  border-right: none;
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

@media only screen and (max-width: 480px) {
  .select-box-highligted-container {
    width: 40%;
  }

  .select-box-container {
    width: 100%;
    height: 44px;
    padding: 0 20px;
  }

  .select-box-title {
    font-size: 10px;
  }

  .selected-option {
    font-size: 14px;
  }
}
</style>
