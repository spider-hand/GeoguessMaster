<template>
  <div :class="$style['result-modal']">
    <div
      :class="
        $style[
          state.isMapExpanding
            ? 'result-modal__map-wrapper--expanded'
            : 'result-modal__map-wrapper'
        ]
      "
    >
      <div
        ref="resultMapRef"
        :class="$style['result-modal__map']"
      />
      <IconButton
        :icon="state.isMapExpanding ? 'expand_less' : 'expand_more'"
        :style="{
          zIndex: 1,
          position: 'absolute',
          bottom: '12px',
          left: '12px',
        }"
        @click="state.isMapExpanding ? shrinkMap() : expandMap()"
      />
    </div>
    <div :class="$style['result-modal__footer']">
      <div
        v-if="selectedMode === 'single'"
        :class="$style['result-modal__container']"
      >
        <span
          v-if="distance !== null"
          :class="$style['result-modal__text']"
          :style="{ marginBottom: '24px' }"
        >You are <strong>{{ isShowingSummary ? score : distance }}</strong>km away {{ isShowingSummary ? "in total " : ""
        }}{{ isShowingSummary ? "&#127881;" : "&#128640;" }}</span>
        <FlatButton
          v-if="round < 5"
          :text="'NEXT ROUND'"
          @click="onClickNextRoundButton"
        />
        <div v-else>
          <FlatButton
            v-if="isShowingSummary"
            :text="'PLAY AGAIN'"
            :style="{
              marginBottom: '12px',
            }"
            @click="onClickPlayAgainButton"
          />
          <FlatButton
            :text="isShowingSummary ? 'EXIT' : 'VIEW SUMMARY'"
            @click="
              isShowingSummary
                ? onClickExitButton()
                : onClickViewSummaryButton()
            "
          />
        </div>
      </div>
      <div
        v-else
        :class="$style['result-modal__container']"
      >
        <span
          v-for="(item, index) in sortedScore"
          :key="index"
          :class="$style['result-modal__text']"
          :style="{
            marginBottom: index !== sortedScore.length - 1 ? '12px' : '24px',
          }"
        >
          <strong>{{ item.playerName }}</strong> is
          <strong>{{ item.distance }}</strong>km away {{ isShowingSummary ? "in total " : ""
          }}{{ isShowingSummary && index === 0 ? "&#127941;" : "" }}
        </span>
        <FlatButton
          v-if="round < 5"
          :text="'NEXT ROUND'"
          :disabled="!isOwner && !isNextRoundReady"
          @click="onClickNextRoundButton"
        />
        <div v-else>
          <FlatButton
            :text="isShowingSummary ? 'EXIT' : 'VIEW SUMMARY'"
            @click="
              isShowingSummary
                ? endMultiplayerGame()
                : onClickViewSummaryButton()
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/*global google*/
import { GameHistory, Summary, DistanceByPlayer } from "@/types";
import {
  defineComponent,
  watch,
  onMounted,
  ref,
  PropType,
  computed,
  reactive,
} from "vue";
import FlatButton from "@/components/shared/FlatButton.vue";
import IconButton from "@/components/shared/IconButton.vue";

export default defineComponent({
  components: {
    FlatButton,
    IconButton,
  },
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
      type: Object as PropType<google.maps.LatLng | null>,
      default: null,
      required: false,
    },
    selectedLatLng: {
      type: Object as PropType<google.maps.LatLng | null>,
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
      type: Array as PropType<DistanceByPlayer[]>,
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
      type: Array as PropType<Summary[]>,
      required: true,
    },
  },

  setup(props, context) {
    let map: google.maps.Map;
    const resultMapRef = ref<HTMLElement>();
    let markers: google.maps.Marker[] = [];
    let polylines: google.maps.Polyline[] = [];

    const state = reactive<{ isMapExpanding: boolean }>({
      isMapExpanding: false,
    });

    const sortedScore = computed(() => {
      const copiedArray = [...props.distanceByPlayerArr];
      return copiedArray.sort((x, y) => x.distance - y.distance);
    });

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

    const expandMap = (): void => {
      state.isMapExpanding = true;
    };

    const shrinkMap = (): void => {
      state.isMapExpanding = false;
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
                drawPolyline(props.randomLatLng as google.maps.LatLng, latLng);
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
          zoomControl: false,
        });
      }
    });

    return {
      state,
      resultMapRef,
      sortedScore,
      onClickNextRoundButton,
      onClickViewSummaryButton,
      onClickPlayAgainButton,
      onClickExitButton,
      endMultiplayerGame,
      expandMap,
      shrinkMap,
    };
  },
});
</script>

<style module lang="scss">
.result-modal {
  z-index: 3;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.result-modal__map-wrapper {
  transition: all 0.5s;
  position: relative;
  width: 100%;
  height: 50%;

  &--expanded {
    @extend .result-modal__map-wrapper;
    height: 100%;
  }
}

.result-modal__map {
  position: absolute;
  width: 100%;
  height: 100%;
}

.result-modal__footer {
  @include pagePadding;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  padding-top: 24px;
  padding-bottom: 24px;
  width: 100%;
  height: 50%;
  background-color: white;
}

.result-modal__container {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.result-modal__text {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-surface-primary);
}
</style>
