<template>
  <div :class="$style['result-modal']">
    <div :class="$style['result-modal__map']" ref="resultMapRef"></div>
    <div :class="$style['result-modal__footer']">
      <div
        :class="$style['result-modal__wrapper']"
        v-if="!isShowingSummary && selectedMode === 'single'"
      >
        <span :class="$style['result-modal__text']" v-if="distance !== null"
          >You are {{ distance }}km away.</span
        >
        <button
          :class="$style['result-modal__button--red']"
          v-if="round < 5"
          @click="onClickNextRoundButton"
        >
          NEXT ROUND
        </button>
        <button
          :class="$style['result-modal__button--red']"
          v-else
          @click="onClickViewSummaryButton"
        >
          VIEW SUMMARY
        </button>
      </div>
      <div v-if="!isShowingSummary && selectedMode === 'multiplayer'">
        <div :class="$style['result-modal__wrapper']">
          <span
            :class="$style['result-modal__text']"
            style="margin: 4px"
            v-for="(item, index) in distanceByPlayerArr"
            :key="index"
          >
            {{ item.playerName }} is {{ item.distance }}km away!
          </span>
        </div>
        <div :class="$style['result-modal__button-wrapper2']">
          <button
            :class="[
              !isOwner && !isNextRoundReady
                ? $style['result-modal__button--red--disabled']
                : $style['result-modal__button--red'],
            ]"
            v-if="round < 5"
            :disabled="!isOwner && !isNextRoundReady"
            @click="onClickNextRoundButton"
          >
            NEXT ROUND
          </button>
          <button
            :class="$style['result-modal__button--red']"
            v-else
            @click="onClickViewSummaryButton"
          >
            VIEW SUMMARY
          </button>
        </div>
      </div>
      <div
        :class="$style['result-modal__wrapper']"
        v-if="isShowingSummary && selectedMode === 'single'"
      >
        <span :class="$style['result-modal__text']"
          >You are {{ score }}km away in total.</span
        >
        <div :class="$style['result-modal__button-wrapper']">
          <button
            :class="$style['result-modal__button--red']"
            @click="onClickPlayAgainButton"
          >
            PLAY AGAIN
          </button>
          <button
            :class="$style['result-modal__button--brand']"
            @click="onClickExitButton"
          >
            EXIT
          </button>
        </div>
      </div>
      <div v-if="isShowingSummary && selectedMode === 'multiplayer'">
        <div :class="$style['result-modal__wrapper']">
          <span
            :class="$style['result-modal__text']"
            v-for="(item, index) in multiplayerGameSummary"
            :key="index"
            >{{ item.playerName }} is {{ item.score }}km away in total.</span
          >
        </div>
        <div :class="$style['result-modal__button-wrapper2']">
          <button
            :class="$style['result-modal__button--brand']"
            @click="endMultiplayerGame"
          >
            EXIT
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/*global google*/
import { GameHistory } from "@/types";
import { defineComponent, watch, onMounted, ref } from "vue";

export default defineComponent({
  props: {
    selectedMode: {
      type: String,
      required: true,
    },
    isOwner: {
      type: Boolean,
      required: true,
    },
    isShowingResult: {
      type: Boolean,
      requreid: true,
    },
    isShowingSummary: {
      type: Boolean,
      required: true,
    },
    isNextRoundReady: {
      type: Boolean,
      required: true,
    },
    randomLatLng: {
      type: google.maps.LatLng,
      default: null,
    },
    selectedLatLng: {
      type: google.maps.LatLng,
      default: null,
      required: false,
    },
    selectedLatLngArr: {
      type: Array,
      required: true,
    },
    gameHistory: {
      type: Array,
      required: true,
    },
    distance: {
      type: Number,
      default: null,
    },
    distanceByPlayerArr: {
      type: Array,
      required: true,
    },
    round: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    multiplayerGameSummary: {
      type: Array,
      required: true,
    },
  },

  setup(props, context) {
    let map: google.maps.Map;
    const resultMapRef = ref<HTMLElement>();
    let markers: google.maps.Marker[] = [];
    let polylines: google.maps.Polyline[] = [];

    const putMarker = (position: google.maps.LatLng): void => {
      const marker = new google.maps.Marker({
        position: position,
        map: map,
      });
      markers.push(marker);
    };

    const removeMarkers = (): void => {
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
    };

    const drawPolyline = (
      from: google.maps.LatLng,
      to: google.maps.LatLng
    ): void => {
      const polyline = new google.maps.Polyline({
        path: [from, to],
        strokeColor: "hsl(0, 100%, 63%)",
      });
      polyline.setMap(map);
      polylines.push(polyline);
    };

    const removePolyline = (): void => {
      polylines.forEach((line) => {
        line.setMap(null);
      });
      polylines = [];
    };

    const onClickNextRoundButton = (): void => {
      context.emit("onClickNextRoundButton");
    };

    const onClickViewSummaryButton = (): void => {
      context.emit("onClickViewSummaryButton");
      (props.gameHistory as Array<GameHistory>).forEach((e: GameHistory) => {
        putMarker(e.randomLatLng);
        putMarker(e.selectedLatLng);
        drawPolyline(e.randomLatLng, e.selectedLatLng);
      });
    };

    const onClickPlayAgainButton = (): void => {
      context.emit("onClickPlayAgainButton");
    };

    const onClickExitButton = (): void => {
      context.emit("onClickExitButton");
    };

    const endMultiplayerGame = (): void => {
      context.emit("endMultiplayerGame");
    };

    watch(
      () => props.isShowingResult,
      (newVal: boolean) => {
        if (props.selectedMode === "multiplayer") {
          if (
            newVal &&
            props.randomLatLng &&
            props.selectedLatLngArr.length > 0 &&
            props.distanceByPlayerArr.length > 0
          ) {
            putMarker(props.randomLatLng);
            (props.selectedLatLngArr as google.maps.LatLng[]).forEach(
              (latLng: google.maps.LatLng) => {
                putMarker(latLng);
                drawPolyline(props.randomLatLng, latLng);
              }
            );
          } else {
            removeMarkers();
            removePolyline();
          }
        } else {
          if (newVal && props.randomLatLng && props.selectedLatLng) {
            putMarker(props.randomLatLng);
            putMarker(props.selectedLatLng);
            drawPolyline(props.randomLatLng, props.selectedLatLng);
          } else if (!newVal) {
            removeMarkers();
            removePolyline();
          }
        }
      }
    );

    onMounted(() => {
      if (resultMapRef.value) {
        map = new google.maps.Map(resultMapRef.value as HTMLElement, {
          center: { lat: 37.86926, lng: -122.254811 },
          zoom: 2,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
        });
      }
    });

    return {
      resultMapRef,
      onClickNextRoundButton,
      onClickViewSummaryButton,
      onClickPlayAgainButton,
      onClickExitButton,
      endMultiplayerGame,
    };
  },
});
</script>

<style module lang="scss">
.result-modal {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3;
}

.result-modal__map {
  position: absolute;
  width: 100%;
  height: 70%;
  top: 0;
  left: 0;
}

.result-modal__footer {
  position: absolute;
  width: 100%;
  height: 30%;
  bottom: 0;
  left: 0;
  background-color: $color-brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-modal__wrapper {
  width: 360px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.result-modal__button-wrapper {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.result-modal__button-wrapper2 {
  position: absolute;
  right: 0;
  bottom: 0;
}

.result-modal__button {
  width: 180px;
  height: 36px;
  margin: 16px;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &--red {
    @extend .result-modal__button;
    background-color: $color-red-primary;

    &--disabled {
      @extend .result-modal__button--red;
      cursor: not-allowed;
    }
  }

  &--brand {
    @extend .result-modal__button;
    background-color: $color-brand-primary;
    border: 1.5px solid white;
  }
}

.result-modal__text {
  font-size: 16px;
  color: white;
}
</style>
