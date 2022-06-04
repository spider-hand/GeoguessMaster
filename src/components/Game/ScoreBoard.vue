<template>
  <div :class="$style['score-board']">
    <div :class="$style['content-wrapper']">
      <div :class="$style['label']">Map</div>
      <div :class="$style['main-text']">
        {{ selectedMap }}
      </div>
    </div>
    <div :class="$style['content-wrapper']">
      <div :class="$style['label']">Round</div>
      <div :class="$style['main-text']">{{ round }} / 5</div>
    </div>
    <div>
      <div :class="$style['label']">Score</div>
      <div :class="$style['main-text']">{{ score }}</div>
    </div>
    <div
      v-if="selectedMode === 'multiplayer'"
      :class="$style['content-wrapper']"
    >
      <div :class="$style['label']">Time</div>
      <div :class="$style['main-text']">{{ countdown }}</div>
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

.content-wrapper {
  margin: 0 16px;
}

.main-text {
  color: white;
  font-size: 16px;
}

.label {
  color: white;
  font-size: 12px;
}
</style>
