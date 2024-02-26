<template>
  <div :class="$style['text-input']">
    <label
      :for="name"
      :class="[
        $style['text-input__label'],
        ,
        disabled && $style['text-input__label--disabled'],
        errorMsg && $style['text-input__label--error'],
      ]"
    >
      {{ label }}
    </label>
    <input
      type="text"
      maxlength="20"
      :name="name"
      :class="[
        $style['text-input__body'],
        disabled && $style['text-input__body--disabled'],
        errorMsg && $style['text-input__body--error'],
      ]"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="e => $emit('onChangeValue', (e.target as HTMLInputElement).value)"
    >
    <span
      v-if="errorMsg"
      :class="$style['text-input__error']"
      data-testid="error-msg"
    >
      <img
        src="@/assets/images/material-symbols/error.svg"
        width="12"
        height="12"
        alt="error icon"
      >
      {{ errorMsg }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";

defineProps({
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
  disabled: {
    type: Boolean,
    default: false,
    required: false,
  },
  errorMsg: {
    type: [String, null] as PropType<string | null>,
    required: false,
    default: null,
  },
});

defineEmits<{
  onChangeValue: [val: string];
}>();
</script>

<style module lang="scss">
.text-input {
  display: flex;
  flex-direction: column;
}

.text-input__label {
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 400;
  color: var(--color-surface-secondary);

  &--disabled {
    color: var(--color-surface-light) !important;
  }

  &--error {
    color: var(--color-red-primary);
  }
}

.text-input__body {
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  line-height: 150%;
  color: var(--color-surface-primary);
  border: none;
  border-bottom: 2px solid var(--color-surface-secondary);

  &:focus-visible {
    outline: 0;
    box-shadow: none;
  }

  &::placeholder {
    color: var(--color-surface-tertiary);
  }

  &--disabled {
    color: var(--color-surface-light) !important;
    border-bottom-color: var(--color-surface-light) !important;

    &::placeholder {
      color: var(--color-surface-light) !important;
    }
  }

  &--error {
    color: var(--color-red-primary);
    border-bottom-color: var(--color-red-primary);

    &::placeholder {
      color: var(--color-red-primary);
    }
  }
}

.text-input__error {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-red-primary);
}
</style>
