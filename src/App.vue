<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { getDeviceType } from "@/utils";
import { useDeviceStore } from "./stores/device";

const deviceStore = useDeviceStore();
const { saveDeviceType } = deviceStore;

const onWindowResize = (): void => {
  saveDeviceType(getDeviceType());
};

onMounted(() => {
  saveDeviceType(getDeviceType());
  window.addEventListener("resize", onWindowResize);
});
</script>

<style lang="scss">
@import "./src/assets/styles/_fonts.scss";
 
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

body {
  overflow: hidden;
  overscroll-behavior: contain;
  user-select: none;
  margin: 0;
  font-family: "Poppins", sans-serif;
}

textarea,
input,
button {
  font-family: "Poppins", sans-serif;
}

button,
a {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
</style>
