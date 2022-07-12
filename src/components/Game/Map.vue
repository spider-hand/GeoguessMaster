<template>
  <div>
    <div :class="$style['map']" ref="mapRef"></div>
    <button
      :class="$style['map__button']"
      v-if="isMakeGuessButtonClicked"
      @click="onClickHideMapButton"
    >
      <span class="material-icons">close</span>
    </button>
  </div>
</template>

<script lang="ts">
/*global google*/
import { defineComponent, onMounted, ref, watch } from "vue";

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
    const mapRef = ref<HTMLElement>();
    const markers: google.maps.Marker[] = [];

    watch(
      () => props.isMakeGuessButtonClicked,
      (newVal: boolean, oldVal: boolean) => {
        if (newVal && mapRef.value) {
          mapRef.value.style.transform = "translateY(-340px)";
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

    return {
      mapRef,
      onClickHideMapButton,
    };
  },
});
</script>

<style module lang="scss">
.map {
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

  &:hover {
    opacity: 1;
    transform: scale(1);
  }
}

.map__button {
  display: none;
}

@media only screen and (max-width: 480px) {
  .map {
    bottom: -280px;
    opacity: 1;
    transition: transform 1s;
  }

  .map__button {
    position: absolute;
    width: 24px;
    height: 24px;
    bottom: 292px;
    left: 324px;
    border: none;
    border-radius: 12px;
    background-color: $color-red-primary;
    color: white;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
