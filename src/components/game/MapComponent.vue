<template>
  <div
    ref="mapRef"
    :class="[
      $style['map'],
      isVisible && $style['map--visible'],
      isShowingResult && $style['map--with-result'],
    ]"
    data-test="my-map"
  />
</template>

<script setup lang="ts">
import { ref, PropType } from "vue";
import { useMap } from "@/composables/game/useMap";
import { GameHistory, ModeTypes } from "@/types";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  isShowingResult: {
    type: Boolean,
    required: true,
  },
  selectedMode: {
    type: String as PropType<ModeTypes>,
    required: true,
  },
  randomLatLng: {
    type: Object as PropType<google.maps.LatLng | null>,
    default: null,
    required: false,
  },
  selectedLatLng: {
    type: Object as PropType<google.maps.LatLng | null>,
    default: null,
    required: false,
  },
  selectedLatLngArr: {
    type: Array<google.maps.LatLng>,
    required: true,
  },
  gameHistory: {
    type: Array<GameHistory>,
    required: true,
  },
});

const emit = defineEmits<{
  updateSelectedLatLng: [latLng: google.maps.LatLng];
}>();

const mapRef = ref<HTMLElement>();
const { map, removeMarkers, removePolyline, putMarker, drawPolyline } =
  useMap(mapRef);

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

const showResult = (): void => {
  if (
    props.selectedMode === "single" &&
    props.randomLatLng !== null &&
    props.selectedLatLng !== null
  ) {
    putMarker(props.randomLatLng);
    putMarker(props.selectedLatLng);
    drawPolyline(props.randomLatLng, props.selectedLatLng);
  } else if (
    props.selectedMode === "multiplayer" &&
    props.randomLatLng !== null
  ) {
    putMarker(props.randomLatLng);
    props.selectedLatLngArr.forEach((latLng) => {
      putMarker(latLng);
      drawPolyline(props.randomLatLng as google.maps.LatLng, latLng);
    });
  }
};

const showSummary = (): void => {
  props.gameHistory.forEach((e) => {
    putMarker(e.randomLatLng);
    putMarker(e.selectedLatLng);
    drawPolyline(e.randomLatLng, e.selectedLatLng);
  });
};

defineExpose({
  attachListener,
  removeListener,
  removeMarkers,
  removePolyline,
  showResult,
  showSummary,
});
</script>

<style module lang="scss">
.map {
  transform: translateY(300px);
  transform-origin: bottom left;
  transition: transform 1s;
  z-index: 3;
  opacity: 1;
  position: absolute;
  bottom: -280px;
  left: 12px;
  width: 320px;
  height: 240px;

  &--visible {
    transform: translateY(-352px);
  }

  &--with-result {
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 240px);
    transition-duration: 0s;
    transform: translateY(0);
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

    &--with-result {
      transition: 0s;
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>
