<template>
  <div
    ref="mapRef"
    :class="[$style['map'], isVisible && $style['map--visible']]"
    data-test="my-map"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMap } from "@/composables/game/useMap";

defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  updateSelectedLatLng: [latLng: google.maps.LatLng];
}>();

const mapRef = ref<HTMLElement>();
const { map, removeMarkers, putMarker } = useMap(mapRef);

const attachListener = (): void => {
  map.value?.addListener("click", (e: google.maps.MapMouseEvent) => {
    removeMarkers();
    putMarker(e.latLng as google.maps.LatLng);
    emit("updateSelectedLatLng", e.latLng as google.maps.LatLng);
  });
};

const removeListener = (): void => {
  google.maps.event.clearListeners(map.value as google.maps.Map, "click");
};

defineExpose({ attachListener, removeListener, removeMarkers });
</script>

<style module lang="scss">
.map {
  transform: translateY(300px);
  transform-origin: bottom left;
  transition: transform 1s;
  z-index: 1;
  opacity: 1;
  position: absolute;
  bottom: -280px;
  left: 12px;
  width: 320px;
  height: 240px;

  &--visible {
    transform: translateY(-352px);
  }

  @media #{$mobile-landscape} {
    bottom: 72px;
    opacity: 0.7;
    transition: transform 0.3s;
    transform: scale(0.75);

    &:hover {
      transform: scale(1);
      opacity: 1;
    }
  }
}
</style>
