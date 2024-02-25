<template>
  <div
    ref="streetviewRef"
    :class="$style['street-view']"
  />
</template>

<script setup lang="ts">
import { MapTypes, ModeTypes } from "@/types";
import { onMounted, ref, PropType } from "vue";
import { getRandomLatLng } from "@/utils";
import useStreetView from "@/composables/game/useStreetView";

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
  saveStreetView: [streetView: google.maps.LatLng];
}>();

const panorama = ref<google.maps.StreetViewPanorama | null>(null);
const streetviewRef = ref<HTMLElement>();
const { zoomIn, zoomOut } = useStreetView(panorama);

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
      panorama.value = new google.maps.StreetViewPanorama(
        streetviewRef.value as HTMLElement
      );
      panorama.value.setOptions({
        zoomControl: false,
        addressControl: false,
        fullscreenControl: false,
        motionTracking: false,
        motionTrackingControl: false,
        showRoadLabels: false,
      });
      panorama.value.setPano(data.location.pano);
      panorama.value.setPov({
        heading: 270,
        pitch: 0,
      });
      emit("updateRandomLatLng", data.location.latLng);

      if (props.selectedMode === "multiplayer" && props.isOwner) {
        emit("saveStreetView", data.location.latLng);
      }
    }
  } else {
    loadStreetView();
  }
};

const resetStreetView = () => {
  if (props.randomLatLng !== null) {
    panorama.value?.setPosition(props.randomLatLng);
  }
};

onMounted(() => {
  if (props.selectedMode !== "multiplayer") {
    loadStreetView();
  } else if (props.isOwner) {
    loadStreetView();
  }
});

defineExpose({ zoomIn, zoomOut, resetStreetView, loadStreetView });
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
