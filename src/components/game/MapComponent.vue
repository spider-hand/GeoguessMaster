<template>
  <div
    ref="mapRef"
    :class="[
      $style['map'],
      isVisible && $style['map--visible'],
      isShowingResult && $style['map--with-result'],
    ]"
    data-testid="map"
  />
</template>

<script setup lang="ts">
import { ref, PropType } from "vue";
import { useMap } from "@/composables/game/useMap";
import { GameHistory, ModeTypes } from "@/types";
import { stringToColour } from "@/utils";

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
  selectedLatLngMap: {
    type: Map<string, google.maps.LatLng>,
    required: true,
  },
  ownColour: {
    type: String,
    required: true
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
    putMarker(e.latLng as google.maps.LatLng, "guess", props.ownColour);
    emit("updateSelectedLatLng", e.latLng as google.maps.LatLng);
  });
};

const removeListener = (): void => {
  google.maps.event.clearListeners(map.value as google.maps.Map, "click");
};

const showResult = (): void => {
  removeMarkers();
  if (
    props.selectedMode === "single" &&
    props.randomLatLng !== null &&
    props.selectedLatLng !== null
  ) {
    putMarker(props.randomLatLng, "actual", props.ownColour);
    putMarker(props.selectedLatLng, "guess", props.ownColour);
    drawPolyline(props.randomLatLng, props.selectedLatLng, props.ownColour);
  } else if (
    props.selectedMode === "multiplayer" &&
    props.randomLatLng !== null
  ) {
    putMarker(props.randomLatLng, "actual", "hsl(0, 100%, 63%)");
    props.selectedLatLngMap.forEach((latLng, playerId) => {
      const colour = stringToColour(playerId);
      if (latLng.equals(props.selectedLatLng)) putMarker(latLng, "guess", colour);
      else putMarker(latLng, "otherPlayer", colour);
      drawPolyline(props.randomLatLng as google.maps.LatLng, latLng, colour);
    });
  }
};

const showSummary = (): void => {
  removeMarkers();
  props.gameHistory.forEach((e) => {
    putMarker(e.randomLatLng, "actual", props.ownColour);
    putMarker(e.selectedLatLng, "guess", props.ownColour);
    drawPolyline(e.randomLatLng, e.selectedLatLng, props.ownColour);
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
  position: absolute;
  bottom: -280px;
  left: 12px;
  z-index: 3;
  width: 320px;
  height: 240px;
  opacity: 1;
  transition: transform 1s;
  transform: translateY(300px);
  transform-origin: bottom left;

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
      opacity: 1;
      transform: scale(1);
    }

    &--with-result {
      opacity: 1;
      transition: 0s;
      transform: scale(1);
    }
  }
}
</style>
