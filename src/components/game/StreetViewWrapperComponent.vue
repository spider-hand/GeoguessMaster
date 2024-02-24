<template>
  <slot />
</template>

<script setup lang="ts">
import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: import.meta.env.VITE_API_KEY,
  version: "weekly",
});
await loader.importLibrary("streetView");
</script>
