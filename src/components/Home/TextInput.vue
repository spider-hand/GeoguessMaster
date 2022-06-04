<template>
  <div :class="$style['input-wrapper']">
    <label
      :for="name"
      :class="[
        $style['input-label'],
        disabled ? $style['disabled'] : $style['active'],
      ]"
    >
      {{ label }}
    </label>
    <input
      type="text"
      :name="name"
      :class="[
        $style['text-input'],
        disabled ? $style['disabled'] : $style['active'],
      ]"
      :placeholder="placeholder"
      v-model="state.inputValue"
      @input="onChangeValue"
      :disabled="disabled"
    />
    <span v-if="errorMsg" :class="$style['error-text']">{{ errorMsg }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
      required: false,
    },
    inputValue: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    errorMsg: {
      type: String,
      required: false,
    },
  },

  setup(props, context) {
    const state = reactive<{
      inputValue: string;
    }>({
      inputValue: props.inputValue,
    });

    const onChangeValue = (): void => {
      context.emit("onChangeValue", state.inputValue);
    };

    return {
      state,
      onChangeValue,
    };
  },
});
</script>

<style module lang="scss">
.input-wrapper {
  display: flex;
  flex-direction: column;
}

.input-label {
  margin-bottom: 4px;
  font-size: 10px;

  &.active {
    color: $color-black-secondary;
  }

  &.disabled {
    color: $color-white-secondary;
  }
}

.text-input {
  border: none;
  font-size: 16px;

  &:focus-visible {
    box-shadow: none;
    outline: 0;
  }

  &.active {
    border-bottom: 1px solid $color-white-secondary;
    color: $color-black-primary;

    &::placeholder {
      color: $color-black-secondary;
    }
  }

  &.disabled {
    border-bottom: 1px solid $color-white-primary;
    color: $color-white-secondary;

    &::placeholder {
      color: $color-white-secondary;
    }
  }
}

.error-text {
  margin-top: 2px;
  font-size: 10px;
  color: $color-red-primary;
}
</style>
