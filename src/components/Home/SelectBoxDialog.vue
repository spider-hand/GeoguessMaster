<template>
  <div
    ref="dialogRef"
    :class="$style['select-box-dialog']"
  >
    <div
      v-for="[key, text] in options"
      :key="key"
      :class="$style['select-box-dialog__option-wrapper']"
      @click="$emit('onChangeOption', key)"
    >
      <span :class="$style['select-box-dialog__option-text']">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

defineProps({
  options: {
    type: Object as PropType<Map<string, string>>,
    required: true,
  },
});

const emit = defineEmits<{
  close: [];
  onChangeOption: [val: string];
}>();

const dialogRef = ref(null);

onClickOutside(dialogRef, () => {
  emit("close");
});
</script>

<style module lang="scss">
.select-box-dialog {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  box-shadow: var(--color-shadow-bold);
  border-radius: 12px;
  width: 240px;
  height: auto;
  background-color: white;

  @media #{$mobile-landscape} {
    left: auto;
  }
}

.select-box-dialog__option-wrapper {
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 18px 24px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-surface-superlight);
  }
}

.select-box-dialog__option-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-surface-primary);
}
</style>
