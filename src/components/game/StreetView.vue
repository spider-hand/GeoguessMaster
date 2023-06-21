<template>
  <div
    ref="streetviewRef"
    :class="$style['street-view']"
  />
</template>

<script setup lang="ts">
import { MapTypes, ModeTypes } from "@/types";
import { getRandomLatLng } from "@/utils";
import { onMounted, watch, ref, PropType } from "vue";

const props = defineProps({
  selectedMap: {
    type: String as PropType<MapTypes>,
    required: true,
  },
  selectedMode: {
    type: String as PropType<ModeTypes>,
    required: true,
  },
  isOwner: {
    type: Boolean,
    required: true,
  },
  randomLatLng: {
    type: Object as PropType<google.maps.LatLng | null>,
    default: null,
    required: false,
  },
  round: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits<{
  updateRandomLatLng: [latLng: google.maps.LatLng];
  savePanorama: [panorama: google.maps.StreetViewPanorama];
  saveStreetView: [streetView: google.maps.LatLng];
}>();

let panorama: google.maps.StreetViewPanorama;
const streetviewRef = ref<HTMLElement>();

watch(
  () => props.round,
  (newVal: number, oldVal: number) => {
    if (oldVal + 1 === newVal || (oldVal === 5 && newVal === 1)) {
      if (
        props.selectedMode !== "multiplayer" ||
        (props.selectedMode === "multiplayer" && props.isOwner)
      ) {
        loadStreetView();
      }
    }
  }
);

watch(
  () => props.randomLatLng,
  (newVal: google.maps.LatLng | null, oldVal: google.maps.LatLng | null) => {
    if (
      oldVal === null &&
      newVal &&
      props.selectedMode === "multiplayer" &&
      !props.isOwner
    ) {
      // Load a decided street view the owner loaded earlier in multiplayer game
      loadStreetView(newVal);
    }
  }
);

const loadStreetView = (
  decidedLatLng: google.maps.LatLng | null = null
): void => {
  const service = new google.maps.StreetViewService();
  service.getPanorama(
    {
      location: decidedLatLng !== null ? decidedLatLng : getRandomLatLng(),
      preference: google.maps.StreetViewPreference.NEAREST,
      radius: 100000,
      source: google.maps.StreetViewSource.OUTDOOR,
    },
    checkStreetView
  );
};

const checkStreetView = (
  data: google.maps.StreetViewPanoramaData | null,
  status: google.maps.StreetViewStatus
): void => {
  if (
    status === google.maps.StreetViewStatus.OK &&
    data !== null &&
    data.location !== undefined &&
    data.location.latLng !== undefined &&
    data.location.latLng !== null
  ) {
    if (streetviewRef.value) {
      panorama = new google.maps.StreetViewPanorama(
        streetviewRef.value as HTMLElement
      );
      panorama.setOptions({
        zoomControl: false,
        addressControl: false,
        fullscreenControl: false,
        motionTracking: false,
        motionTrackingControl: false,
        showRoadLabels: false,
      });
      panorama.setPano(data.location.pano);
      panorama.setPov({
        heading: 270,
        pitch: 0,
      });
      emit("updateRandomLatLng", data.location.latLng);
      emit("savePanorama", panorama);

      if (props.selectedMode === "multiplayer" && props.isOwner) {
        emit("saveStreetView", data.location.latLng);
      }
    }
  } else {
    loadStreetView();
  }
};

onMounted(() => {
  if (props.selectedMode !== "multiplayer") {
    loadStreetView();
  } else {
    // Multiplayer mode
    if (props.isOwner) {
      loadStreetView();
    }
  }
});
</script>

<style module lang="scss">
.street-view {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
