<template>
  <div class="room-number-dialog" :class="[isGameReady ? 'moved' : '']">
    <div class="content-wrapper">
      <span class="sub-text">Room Number</span>
      <br />
      <span id="room-number" class="main-text">{{ roomNumber }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    roomNumber: {
      type: String,
      required: true,
    },
    isGameReady: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style scoped>
.room-number-dialog {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 80px;
  height: 64px;
  padding: 0 16px;
  border-radius: 5px;
  background-color: #0000ae;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 1s;
}

.moved {
  transform: translateY(-200px);
}

.main-text {
  color: #ffffff;
  font-family: "Roboto medium";
  font-size: 16px;
}

.sub-text {
  color: #ffffff;
  font-family: "Roboto medium";
  font-size: 12px;
}
</style>
