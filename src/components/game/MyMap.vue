<template>
  <div>
    <div
      ref="mapRef"
      :class="$style['map']"
      data-test="my-map"
    />
    <IconButton
      v-if="device <= DEVICE_TYPES.MOBLE_PORTRAIT"
      v-show="isMakeGuessButtonClicked"
      :icon="'close'"
      :style="{
        zIndex: '1',
        position: 'absolute',
        bottom: '300px',
        left: '0px',
      }"
      :size="'sm'"
      @click="$emit('onClickHideMapButton')"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, PropType } from "vue";
import { DEVICE_TYPES } from "@/constants";
import IconButton from "@/components/shared/IconButton.vue";
import { DeviceTypes, ModeTypes } from "@/types";

const props = defineProps({
  device: {
    type: Number as PropType<DeviceTypes>,
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
  round: {
    type: Number,
    required: true,
  },
  isMakeGuessButtonClicked: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  updateSelectedLatLng: [latLng: google.maps.LatLng];
  onClickHideMapButton: [];
}>();

let map: google.maps.Map;
const mapRef = ref<HTMLElement>();
const markers: google.maps.Marker[] = [];

watch(
  () => props.isMakeGuessButtonClicked,
  (newVal: boolean) => {
    if (newVal && mapRef.value) {
      mapRef.value.style.transform = "translateY(-352px)";
    } else if (!newVal && mapRef.value) {
      mapRef.value.style.transform = "translateY(300px)";
    }
  }
);

watch(
  () => props.round,
  (newVal: number, oldVal: number) => {
    if (oldVal + 1 === newVal || (oldVal === 5 && newVal === 1)) {
      removeMarkers();
    }
  }
);

watch(
  () => props.randomLatLng,
  (newVal: google.maps.LatLng | null) => {
    if (newVal !== null) {
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        removeMarkers();
        putMarker(e.latLng as google.maps.LatLng);
        emit("updateSelectedLatLng", e.latLng as google.maps.LatLng);
      });
    }
  }
);

const removeMarkers = (): void => {
  markers.forEach((marker, index) => {
    marker.setMap(null);
    markers.splice(index, 1);
  });
};

const putMarker = (position: google.maps.LatLng): void => {
  const marker = new google.maps.Marker({
    position: position,
    map: map,
  });
  markers.push(marker);
};

onMounted(() => {
  if (mapRef.value) {
    map = new google.maps.Map(mapRef.value as HTMLElement, {
      center: { lat: 37.86926, lng: -122.254811 },
      zoom: 1,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    });
  }
});
</script>

<style module lang="scss">
.map {
  transform-origin: bottom left;
  transform: scale(0.75);
  transition: transform 1s;
  z-index: 1;
  opacity: 1;
  position: absolute;
  bottom: -280px;
  left: 12px;
  width: 320px;
  height: 240px;

  &:hover {
    transform: scale(1);
    opacity: 1;
  }

  @media #{$mobile-landscape} {
    bottom: 72px;
    opacity: 0.7;
    transition: transform 0.3s;
  }
}
</style>
