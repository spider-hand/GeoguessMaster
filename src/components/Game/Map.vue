<template>
  <div>
    <div
      id="map-container"
      @mouseover="onMouseOverMap"
      @mouseleave="onMouseLeaveMap"
    ></div>
    <div
      id="hide-map-button"
      v-if="isMakeGuessButtonClicked"
      @click="onClickHideMapButton"
    >
      <span id="close-icon" class="material-icons">close</span>
    </div>
  </div>
</template>

<script lang="ts">
/*global google*/
import { defineComponent, onMounted, watch } from "vue";

export default defineComponent({
  props: {
    selectedMode: {
      type: String,
      required: true,
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
    isMakeGuessButtonClicked: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, context) {
    let map: google.maps.Map;
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
        map: map,
      });
      markers.push(marker);
    };

    const onClickHideMapButton = (): void => {
      context.emit("onClickHideMapButton");
    };

    watch(
      () => props.randomLatLng,
      (newVal: google.maps.LatLng | null) => {
        if (newVal !== null) {
          map.addListener("click", (e: any) => {
            removeMarkers();
            putMarker(e.latLng);
            context.emit("updateSelectedLatLng", e.latLng);
          });
        }
      }
    );

    onMounted(() => {
      if (document.getElementById("map-container") !== null) {
        map = new google.maps.Map(
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
      onMouseOverMap,
      onMouseLeaveMap,
      onClickHideMapButton,
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

#hide-map-button {
  display: none;
}

@media only screen and (max-width: 480px) {
  #map-container {
    bottom: -280px;
    opacity: 1;
    transition: transform 1s;
  }

  #hide-map-button {
    display: block;
    position: absolute;
    width: 24px;
    height: 24px;
    bottom: 292px;
    left: 324px;
    border-radius: 12px;
    background-color: #ff4343;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #close-icon {
    color: #ffffff;
  }
}
</style>
