<template>
  <div>
    <div
      ref="mapRef"
      :class="$style['map']"
    />
    <IconButton
      v-if="
        store.state.generalSettings.device <= DeviceTypes.MobilePortrait &&
          isMakeGuessButtonClicked
      "
      :icon="'close'"
      :style="{
        zIndex: '1',
        position: 'absolute',
        bottom: '300px',
        left: '0px',
      }"
      :size="'sm'"
      @click="onClickHideMapButton"
    />
  </div>
</template>

<script lang="ts">
/*global google*/
import { defineComponent, onMounted, ref, watch, PropType } from "vue";
import { useStore } from "vuex";
import { key } from "@/store";
import { DeviceTypes } from "@/constants";
import IconButton from "../IconButton.vue";
import { LatLngPropType } from "@/types";

export default defineComponent({

  components: {
    IconButton,
  },
  props: {
    selectedMode: {
      type: String,
      required: true,
    },
    randomLatLng: {
      type: Object as PropType<LatLngPropType>,
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
    const store = useStore(key);

    watch(
      () => props.isMakeGuessButtonClicked,
      (newVal: boolean, oldVal: boolean) => {
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
      store,
      DeviceTypes,
      onClickHideMapButton,
    };
  },
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
