<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { getDeviceType } from "@/utils";
import { useDeviceStore } from "./stores/device";
import { storeToRefs } from "pinia";

const deviceStore = useDeviceStore();
const { deviceState } = storeToRefs(deviceStore);

const onWindowResize = (): void => {
  deviceState.value = getDeviceType();
};

onMounted(() => {
  deviceState.value = getDeviceType();
  window.addEventListener("resize", onWindowResize);
});
</script>

<style lang="scss">
:root {
  --color-brand-primary: #{$color-brand-primary};
  --color-brand-light: #{$color-brand-light};
  --color-brand-gradient: #{$color-brand-gradient};
  --color-tone-primary: #{$color-tone-primary};
  --color-tone-light: #{$color-tone-light};
  --color-surface-primary: #{$color-surface-primary};
  --color-surface-secondary: #{$color-surface-secondary};
  --color-surface-tertiary: #{$color-surface-tertiary};
  --color-surface-light: #{$color-surface-light};
  --color-surface-superlight: #{$color-surface-superlight};
  --color-red-primary: #{$color-red-primary};
  --color-shadow-bold: #{$color-shadow-bold};
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  overflow: hidden;
  overscroll-behavior: contain;
  font-family: Poppins, sans-serif;
  user-select: none;
}

textarea,
input,
button {
  font-family: Poppins, sans-serif;
}

button,
a {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
</style>
