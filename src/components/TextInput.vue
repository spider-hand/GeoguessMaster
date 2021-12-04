<template>
  <div class="input-wrapper">
    <label
      :for="name"
      class="input-label"
      :style="{
        color: disabled ? '#dcdcdc' : '#5f5f5f',
      }"
    >
      {{ label }}
    </label>
    <input
      type="text"
      :name="name"
      class="text-input"
      :style="{
        borderBottom: disabled ? '1px solid #eeeeee' : '1px solid #dcdcdc',
        '--placeholder-color': disabled ? '#dcdcdc' : '#5f5f5f',
      }"
      :placeholder="placeholder"
      v-model="state.inputValue"
      @input="onChangeValue"
      :disabled="disabled"
    />
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
}

.text-input {
  border: none;
  font-family: "Roboto";
  font-size: 16px;
}

.text-input::placeholder {
  color: var(--placeholder-color);
}

.text-input:focus-visible {
  box-shadow: none;
  outline: 0;
}
</style>
