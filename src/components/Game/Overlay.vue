<template>
  <div class="overlay">
    <div class="container">
      <span class="text">{{ msg }}</span>
      <div class="loader"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    msg: {
      type: String,
      required: false,
    },
  },
});
</script>

<style scoped>
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.loader {
  border: 8px solid #ffffff;
  border-top: 8px solid transparent;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  margin: 32px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.text {
  font-family: "Roboto medium";
  font-size: 24px;
  color: #ffffff;
}
</style>
