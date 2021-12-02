<template>
  <div class="select-box-dialog" v-if="isShowingDialog">
    <div class="dialog-header">
      <span class="dialog-title">{{ dialogTitle }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    dialogTitle: {
      type: String,
      required: true,
    },
    isShowingDialog: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
});
</script>

<style scoped>
.select-box-dialog {
  position: absolute;
  bottom: -196px;
  left: 0;
  width: 480px;
  height: 180px;
  background: #ffffff;
  border-radius: 20px;
}

.dialog-header {
  position: absolute;
  width: 100%;
  height: 32px;
  padding: 16px;
}

.dialog-title {
  font-family: "Roboto medium";
  font-size: 16px;
  color: #3c3c3c;
}
</style>
