<template>
  <div
    id="map-container"
    @mouseover="onMouseOverMap"
    @mouseleave="onMouseLeaveMap"
  ></div>
</template>

<script lang="ts">
/*global google*/
import { defineComponent, onMounted, reactive, watch } from "vue";

export default defineComponent({
  props: {
    randomLatLng: {
      type: google.maps.LatLng,
      default: null,
      required: false,
    },
    round: {
      type: Number,
      required: true,
    },
  },

  setup(props, context) {
    const state = reactive<{
      map: google.maps.Map | null;
    }>({
      map: null,
    });

    const markers: google.maps.Marker[] = [];

    watch(
      () => props.round,
      (newVal: number, oldVal: number) => {
        if (oldVal + 1 === newVal || (oldVal === 5 && newVal === 1)) {
          removeMarkers();
        }
      }
    );

    const onMouseOverMap = (): void => {
      const mapEl = document.getElementById("map-container");
      if (mapEl !== null) {
        mapEl.style.opacity = "1.0";
        mapEl.style.transform = "scale(1)";
      }
    };

    const onMouseLeaveMap = (): void => {
      const mapEl = document.getElementById("map-container");
      if (mapEl !== null) {
        mapEl.style.opacity = "0.7";
        mapEl.style.transform = "scale(0.75)";
      }
    };

    const removeMarkers = (): void => {
      markers.forEach((marker, index) => {
        marker.setMap(null);
        markers.splice(index, 1);
      });
    };

    const putMarker = (position: google.maps.LatLng): void => {
      const marker = new google.maps.Marker({
        position: position,
        map: state.map,
      });
      markers.push(marker);
    };

    watch(
      () => props.randomLatLng,
      (newVal: google.maps.LatLng | null) => {
        if (newVal !== null) {
          state.map?.addListener("click", (e: any) => {
            removeMarkers();
            putMarker(e.latLng);
            context.emit("updateSelectedLatLng", e.latLng);
          });
        }
      }
    );

    onMounted(() => {
      if (document.getElementById("map-container") !== null) {
        state.map = new google.maps.Map(
          document.getElementById("map-container") as HTMLElement,
          {
            center: { lat: 37.86926, lng: -122.254811 },
            zoom: 1,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
          }
        );
      }
    });

    return {
      state,
      onMouseOverMap,
      onMouseLeaveMap,
    };
  },
});
</script>

<style scoped>
#map-container {
  position: absolute;
  bottom: 54px;
  left: 12px;
  z-index: 1;
  opacity: 0.7;
  width: 320px;
  height: 240px;
  transform-origin: bottom left;
  transform: scale(0.75);
  transition: transform 0.3s;
}
</style>
