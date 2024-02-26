<template>
  <div :class="$style['input']">
    <label
      :for="name"
      :class="[
        $style['input__label'],
        ,
        disabled && $style['input__label--disabled'],
        errorMsg && $style['input__label--error'],
      ]"
    >
      {{ label }}
    </label>
    <input
      type="text"
      maxlength="20"
      :name="name"
      :class="[
        $style['text-input'],
        disabled && $style['text-input--disabled'],
        errorMsg && $style['text-input--error'],
      ]"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="e => $emit('onChangeValue', (e.target as HTMLInputElement).value)"
    >
    <span
      v-if="errorMsg"
      :class="$style['input__error']"
      data-test="error-msg"
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
    type: String,
    required: false,
    default: null,
  },
});

defineEmits<{
  onChangeValue: [val: string];
}>();
</script>

<style module lang="scss">
.input {
  display: flex;
  flex-direction: column;
}

.input__label {
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

.text-input {
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

.input__error {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-red-primary);
}
</style>
