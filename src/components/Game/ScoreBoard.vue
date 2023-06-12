<template>
  <div :class="$style['score-board']">
    <div :class="$style['score-board__wrapper']">
      <div :class="$style['score-board__label']">
        Map
      </div>
      <div :class="$style['score-board__text']">
        {{ selectedMap }}
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  z-index: 1;
  box-sizing: border-box;
  position: absolute;
  top: 12px;
  left: 12px;
  max-width: calc(100% - 24px);
  border-radius: 12px;
  background: var(--color-brand-gradient);
}

.score-board__wrapper {
  padding: 12px 24px;
}

.score-board__text {
  @include mainText;
  color: white;
}

.score-board__label {
  @include label;
  color: white;
}
</style>
