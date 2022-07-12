<template>
  <div :class="$style['score-board']">
    <div :class="$style['score-board__wrapper']">
      <div :class="$style['score-board__label']">Map</div>
      <div :class="$style['score-board__text']">
        {{ selectedMap }}
      </div>
    </div>
    <div :class="$style['score-board__wrapper']">
      <div :class="$style['score-board__label']">Round</div>
      <div :class="$style['score-board__text']">{{ round }} / 5</div>
    </div>
    <div>
      <div :class="$style['score-board__label']">Score</div>
      <div :class="$style['score-board__text']">{{ score }}</div>
    </div>
    <div
      v-if="selectedMode === 'multiplayer'"
      :class="$style['score-board__wrapper']"
    >
      <div :class="$style['score-board__label']">Time</div>
      <div :class="$style['score-board__text']">{{ countdown }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    selectedMap: {
      type: String,
      required: true,
    },
    selectedMode: {
      type: String,
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
    countdown: {
      type: String,
    },
  },
});
</script>

<style module lang="scss">
.score-board {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 240px;
  height: 64px;
  padding: 0 16px;
  border-radius: 5px;
  background-color: $color-brand-primary;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.score-board__wrapper {
  margin: 0 16px;
}

.score-board__text {
  color: white;
  font-size: 16px;
}

.score-board__label {
  color: white;
  font-size: 12px;
}
</style>
