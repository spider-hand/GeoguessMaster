<template>
  <div :class="$style['score-board']">
    <div :class="$style['score-board__wrapper']">
      <div :class="$style['score-board__label']">
        Map
      </div>
      <div :class="$style['score-board__text']">
        {{ MAP_OPTIONS.get(selectedMap) }}
      </div>
    </div>
    <div :class="$style['score-board__wrapper']">
      <div :class="$style['score-board__label']">
        Round
      </div>
      <div :class="$style['score-board__text']">
        {{ round }} / 5
      </div>
    </div>
    <div :class="$style['score-board__wrapper']">
      <div :class="$style['score-board__label']">
        Score
      </div>
      <div :class="$style['score-board__text']">
        {{ score }}
      </div>
    </div>
    <div
      v-if="selectedMode === 'multiplayer'"
      :class="$style['score-board__wrapper']"
    >
      <div :class="$style['score-board__label']">
        Time
      </div>
      <div :class="$style['score-board__text']">
        {{ countdown }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, watch } from "vue";
import { MapTypes, ModeTypes } from "@/types";
import { MAP_OPTIONS } from "@/constants";
import useCountdown from "@/composables/game/useCountdown";

const props = defineProps({
  selectedMap: {
    type: String as PropType<MapTypes>,
    required: true,
  },
  selectedMode: {
    type: String as PropType<ModeTypes>,
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
  timePerRound: {
    type: Number,
    required: true,
  },
});

const { startCountdown, stopCountdown, remainingTime, countdown } =
  useCountdown(props.timePerRound);

const emit = defineEmits<{
  onCountdownFinish: [];
}>();

watch(
  () => remainingTime.value,
  (newVal) => {
    if (newVal === 0) {
      emit("onCountdownFinish");
    }
  }
);

defineExpose({ startCountdown, stopCountdown });
</script>

<style module lang="scss">
.score-board {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  max-width: calc(100% - 24px);
  background: var(--color-brand-gradient);
  border-radius: 12px;
}

.score-board__wrapper {
  padding: 12px 24px;
}

.score-board__text {
  @include main-text;

  color: white;
}

.score-board__label {
  @include label;

  color: white;
}
</style>
