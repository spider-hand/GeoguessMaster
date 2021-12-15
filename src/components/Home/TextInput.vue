<template>
  <div class="input-wrapper">
    <label
      :for="name"
      class="input-label"
      :classs="[disabled ? 'disabled-input-label' : '']"
    >
      {{ label }}
    </label>
    <input
      type="text"
      :name="name"
      class="text-input"
      :class="[disabled ? 'disabled-input' : '']"
      :placeholder="placeholder"
      v-model="state.inputValue"
      @input="onChangeValue"
      :disabled="disabled"
    />
    <span v-if="errorMsg" class="error-text">{{ errorMsg }}</span>
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

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
}

.input-label {
  margin-bottom: 4px;
  font-family: "Roboto medium";
  font-size: 10px;
  color: #5f5f5f;
}

.disabled-input-label {
  color: #dcdcdc;
}

.text-input {
  border: none;
  font-family: "Roboto";
  font-size: 16px;
  border-bottom: 1px solid #dcdcdc;
  color: #3c3c3c;
}

.text-input ::placeholder {
  color: #5f5f5f;
}

.text-input::placeholder {
  color: var(--placeholder-color);
}

.text-input:focus-visible {
  box-shadow: none;
  outline: 0;
}

.disabled-input {
  border-bottom: 1px solid #eeeeee;
  color: #dcdcdc;
}

.disabled-input ::placeholder {
  color: #dcdcdc;
}

.error-text {
  margin-top: 2px;
  font-family: "Roboto";
  font-size: 10px;
  color: #ff4343;
}
</style>
