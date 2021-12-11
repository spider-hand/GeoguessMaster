<template>
  <div id="street-view-container"></div>
</template>

<script lang="ts">
/*global google*/
import { defineComponent, reactive, onMounted, watch } from "vue";

export default defineComponent({
  props: {
    round: {
      type: Number,
      required: true,
    },
  },

  setup(props, context) {
    const state = reactive<{
      panorama: google.maps.StreetViewPanorama | null;
    }>({
      panorama: null,
    });

    watch(
      () => props.round,
      (newVal: number, oldVal: number) => {
        if (oldVal + 1 === newVal || (oldVal === 5 && newVal === 1)) {
          loadStreetView();
        }
      }
    );

    const loadStreetView = (): void => {
      // TODO: Filter locations by the selected map
      const service = new google.maps.StreetViewService();
      service.getPanorama(
        {
          location: getRandomLatLng(),
          preference: google.maps.StreetViewPreference.NEAREST,
          radius: 100000,
          source: google.maps.StreetViewSource.OUTDOOR,
        },
        checkStreetView
      );
    };

    const getRandomLatLng = (): google.maps.LatLng => {
      const lat = Math.random() * 170 - 85;
      const lng = Math.random() * 360 - 180;
      return new google.maps.LatLng(lat, lng);
    };

    const checkStreetView = (
      data: google.maps.StreetViewPanoramaData | null,
      status: google.maps.StreetViewStatus
    ): void => {
      if (
        status === google.maps.StreetViewStatus.OK &&
        data !== null &&
        data.location !== undefined
      ) {
        if (document.getElementById("street-view-container") !== null) {
          state.panorama = new google.maps.StreetViewPanorama(
            document.getElementById("street-view-container") as HTMLElement
          );
          state.panorama.setOptions({
            zoomControl: false,
            addressControl: false,
            fullscreenControl: false,
            motionTracking: false,
            motionTrackingControl: false,
            showRoadLabels: false,
          });
          state.panorama.setPano(data.location.pano);
          state.panorama.setPov({
            heading: 270,
            pitch: 0,
          });
          context.emit("updateRandomLatLng", data.location.latLng);
        }
      } else {
        loadStreetView();
      }
    };

    onMounted(() => {
      loadStreetView();
    });

    return {
      state,
    };
  },
});
</script>

<style scoped>
#street-view-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}
</style>
