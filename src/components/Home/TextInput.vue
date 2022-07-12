<template>
  <div :class="$style['input']">
    <label
      :for="name"
      :class="[
        disabled ? $style['input__label--disabled'] : $style['input__label'],
      ]"
    >
      {{ label }}
    </label>
    <input
      type="text"
      :name="name"
      :class="[
        disabled ? $style['text-input--disabled'] : $style['text-input'],
      ]"
      :placeholder="placeholder"
      v-model="state.inputValue"
      @input="onChangeValue"
      :disabled="disabled"
    />
    <span v-if="errorMsg" :class="$style['input__error-text']">{{
      errorMsg
    }}</span>
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
.input {
  display: flex;
  flex-direction: column;
}

.input__label {
  margin-bottom: 4px;
  font-size: 10px;
  color: $color-black-secondary;

  &--disabled {
    @extend .input__label;
    color: $color-white-secondary;
  }
}

.text-input {
  border: none;
  font-size: 16px;
  border-bottom: 1px solid $color-white-secondary;
  color: $color-black-primary;

  &:focus-visible {
    box-shadow: none;
    outline: 0;
  }

  &::placeholder {
    color: $color-black-secondary;
  }

  &--disabled {
    @extend .text-input;
    border-bottom-color: $color-white-primary;
    color: $color-white-secondary;

    &::placeholder {
      color: $color-white-secondary;
    }
  }
}

.input__error-text {
  margin-top: 2px;
  font-size: 10px;
  color: $color-red-primary;
}
</style>
