<template>
  <div class="result-modal">
    <div id="result-map"></div>
    <div class="modal-footer">
      <div
        class="result-wrapper"
        v-if="!isShowingSummary && selectedMode === 'single'"
      >
        <span id="distance" class="text" v-if="distance !== null"
          >You are {{ distance }}km away.</span
        >
        <button
          id="next-round-button"
          class="long-button"
          v-if="round < 5"
          @click="onClickNextRoundButton"
        >
          <span class="text">NEXT ROUND</span>
        </button>
        <button
          id="view-summary-button"
          class="long-button"
          v-else
          @click="onClickViewSummaryButton"
        >
          <span class="text">VIEW SUMMARY</span>
        </button>
      </div>
      <div
        class="content-wrapper"
        v-if="!isShowingSummary && selectedMode === 'multiplayer'"
      >
        <div class="result-wrapper">
          <span
            class="text"
            style="margin: 4px"
            v-for="(item, index) in distanceByPlayerArr"
            :key="index"
          >
            {{ item.playerName }} is {{ item.distance }}km away!
          </span>
        </div>
        <div class="button-container-multiplayer-game">
          <button
            id="next-round-button"
            class="long-button"
            :class="[!isOwner && !isNextRoundReady ? 'disabled-button' : null]"
            v-if="round < 5"
            :disabled="!isOwner && !isNextRoundReady"
            @click="onClickNextRoundButton"
          >
            <span class="text">NEXT ROUND</span>
          </button>
          <button
            id="view-summary-button"
            class="long-button"
            v-else
            @click="onClickViewSummaryButton"
          >
            <span class="text">VIEW SUMMARY</span>
          </button>
        </div>
      </div>
      <div
        class="result-wrapper"
        v-if="isShowingSummary && selectedMode === 'single'"
      >
        <span id="distance" class="text"
          >You are {{ score }}km away in total.</span
        >
        <div class="button-container">
          <button
            id="play-again-button"
            class="long-button"
            @click="onClickPlayAgainButton"
          >
            <span class="text">PLAY AGAIN</span>
          </button>
          <button
            id="exit-button"
            class="long-button"
            @click="onClickExitButton"
          >
            <span class="text">EXIT</span>
          </button>
        </div>
      </div>
      <div
        class="content-wrapper"
        v-if="isShowingSummary && selectedMode === 'multiplayer'"
      >
        <div class="result-wrapper">
          <span
            id="distance"
            class="text"
            v-for="(item, index) in multiplayerGameSummary"
            :key="index"
            >{{ item.playerName }} is {{ item.score }}km away in total.</span
          >
        </div>
        <div class="button-container-multiplayer-game">
          <button
            id="exit-button"
            class="long-button"
            @click="endMultiplayerGame"
          >
            <span class="text">EXIT</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/*global google*/
import { GameHistory } from "@/types";
import { defineComponent, watch, onMounted } from "vue";

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
        strokeColor: "#ff4343",
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
      if (document.getElementById("result-map") !== null) {
        map = new google.maps.Map(
          document.getElementById("result-map") as HTMLElement,
          {
            center: { lat: 37.86926, lng: -122.254811 },
            zoom: 2,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
          }
        );
      }
    });

    return {
      onClickNextRoundButton,
      onClickViewSummaryButton,
      onClickPlayAgainButton,
      onClickExitButton,
      endMultiplayerGame,
    };
  },
});
</script>

<style scoped>
.result-modal {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3;
}

#result-map {
  position: absolute;
  width: 100%;
  height: 70%;
  top: 0;
  left: 0;
}

.modal-footer {
  position: absolute;
  width: 100%;
  height: 30%;
  bottom: 0;
  left: 0;
  background-color: #0000ae;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-wrapper {
  width: 360px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.button-container {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.button-container-multiplayer-game {
  position: absolute;
  right: 0;
  bottom: 0;
}

.text {
  color: #ffffff;
  font-family: "Roboto medium";
  font-size: 16px;
}

.long-button {
  width: 180px;
  height: 36px;
  margin: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.disabled-button {
  cursor: not-allowed;
}

#next-round-button,
#view-summary-button,
#play-again-button {
  background-color: #ff4343;
}

#exit-button {
  background-color: #0000ae;
  border: 1.5px solid #ffffff;
}
</style>
