<template>
  <div id="street-view-container"></div>
</template>

<script lang="ts">
/*global google*/
import { defineComponent, onMounted, watch } from "vue";

import { Feature, feature, MultiPolygon } from "@turf/helpers";
import { randomPosition } from "@turf/random";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import bbox from "@turf/bbox";

export default defineComponent({
  props: {
    selectedMap: {
      type: String,
      requred: true,
    },
    selectedMode: {
      type: String,
      required: true,
    },
    isOwner: {
      type: Boolean,
      required: true,
    },
    geoJSON: {
      type: Object,
      required: false,
    },
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
    let panorama: google.maps.StreetViewPanorama;

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
      (newVal: google.maps.LatLng, oldVal: google.maps.LatLng | null) => {
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
          location:
            decidedLatLng !== null
              ? decidedLatLng
              : props.geoJSON !== null
              ? getRandomLatLngInsideCountry()
              : getRandomLatLng(),
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

    const getRandomLatLngInsideCountry = (): google.maps.LatLng => {
      const featureObj = feature(props.geoJSON);

      let pos;
      do {
        pos = randomPosition(bbox(props.geoJSON));
      } while (booleanPointInPolygon(pos, featureObj as Feature<MultiPolygon>));
      return new google.maps.LatLng(pos[1], pos[0]);
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
          panorama = new google.maps.StreetViewPanorama(
            document.getElementById("street-view-container") as HTMLElement
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
          context.emit("updateRandomLatLng", data.location.latLng);
          context.emit("savePanorama", panorama);

          if (props.selectedMode === "multiplayer" && props.isOwner) {
            context.emit("saveStreetView", data.location.latLng);
          }
        }
      } else {
        loadStreetView();
      }
    };

    onMounted(() => {
      if (props.selectedMode !== "multiplayer") {
        if (props.selectedMap === "WORLD" || props.geoJSON !== null) {
          loadStreetView();
        } else {
          context.emit("fetchGeoJSON", loadStreetView);
        }
      } else {
        // Multiplayer mode
        if (props.isOwner) {
          if (props.selectedMap === "WORLD" || props.geoJSON !== null) {
            loadStreetView();
          } else {
            context.emit("fetchGeoJSON", loadStreetView());
          }
        }
      }
    });
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
