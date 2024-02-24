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
        ref="mapRef"
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
        @click="state.isMapExpanding = !state.isMapExpanding"
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
          @click="$emit('onClickNextRoundButton')"
        />
        <div v-else>
          <FlatButton
            v-if="isShowingSummary"
            :text="'PLAY AGAIN'"
            :style="{
              marginBottom: '12px',
            }"
            @click="$emit('onClickPlayAgainButton')"
          />
          <FlatButton
            :text="isShowingSummary ? 'EXIT' : 'VIEW SUMMARY'"
            @click="
              isShowingSummary
                ? $emit('onClickExitButton')
                : onClickViewSummaryButton()
            "
          />
        </div>
      </div>
      <div
        v-else
        :class="$style['result-modal__container']"
      >
        <div
          v-if="!isShowingSummary"
          :class="$style['result-modal__text-wrapper']"
        >
          <span
            v-for="(item, index) in sortedDistance"
            :key="index"
            :class="$style['result-modal__text']"
            :style="{
              marginBottom:
                index !== sortedDistance.length - 1 ? '12px' : '24px',
            }"
          >
            <strong>{{ item.playerName }}</strong> is
            <strong>{{ item.distance }}</strong>km away
          </span>
        </div>
        <div
          v-else
          :class="$style['result-modal__text-wrapper']"
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
            <strong>{{ item.score }}</strong>km away in total
            {{ index === 0 ? "&#127941;" : "" }}
          </span>
        </div>
        <FlatButton
          v-if="round < 5"
          :text="'NEXT ROUND'"
          :disabled="!isOwner && !isNextRoundReady"
          @click="$emit('onClickNextRoundButton')"
        />
        <div v-else>
          <FlatButton
            :text="isShowingSummary ? 'EXIT' : 'VIEW SUMMARY'"
            @click="
              isShowingSummary
                ? $emit('endMultiplayerGame')
                : onClickViewSummaryButton()
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GameHistory, Summary, DistanceByPlayer, ModeTypes } from "@/types";
import { watch, ref, PropType, computed, reactive } from "vue";
import FlatButton from "@/components/shared/FlatButton.vue";
import IconButton from "@/components/shared/IconButton.vue";
import { useMap } from "@/composables/game/useMap";

const props = defineProps({
  selectedMode: {
    type: String as PropType<ModeTypes>,
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
});

const emit = defineEmits<{
  onClickNextRoundButton: [];
  onClickViewSummaryButton: [];
  onClickPlayAgainButton: [];
  onClickExitButton: [];
  endMultiplayerGame: [];
}>();

const mapRef = ref<HTMLElement>();
const { removeMarkers, putMarker, drawPolyline, removePolyline } =
  useMap(mapRef);

const state = reactive<{ isMapExpanding: boolean }>({
  isMapExpanding: false,
});

const sortedDistance = computed(() => {
  return [...props.distanceByPlayerArr].sort((x, y) => x.distance - y.distance);
});

const sortedScore = computed(() => {
  return [...props.multiplayerGameSummary].sort((x, y) => x.score - y.score);
});

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

const onClickViewSummaryButton = (): void => {
  emit("onClickViewSummaryButton");
  (props.gameHistory as Array<GameHistory>).forEach((e: GameHistory) => {
    putMarker(e.randomLatLng);
    putMarker(e.selectedLatLng);
    drawPolyline(e.randomLatLng, e.selectedLatLng);
  });
};
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

.result-modal__text-wrapper {
  display: flex;
  flex-direction: column;
}

.result-modal__text {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-surface-primary);
}
</style>
@/composables/game/useMap
