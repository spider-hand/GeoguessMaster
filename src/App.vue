<template>
  <div></div>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import { key } from "./store";
import { getDeviceType } from "@/utils";

export default defineComponent({
  setup() {
    const store = useStore(key);

    const onWindowResize = (): void => {
      store.dispatch("setDeviceTypeAction", { device: getDeviceType() });
    };

    onMounted(() => {
      store.dispatch("setDeviceTypeAction", { device: getDeviceType() });
      window.addEventListener("resize", onWindowResize);
    });
  },
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
