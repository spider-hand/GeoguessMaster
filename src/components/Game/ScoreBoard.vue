<template>
  <div class="score-board">
    <div class="content-wrapper">
      <span class="sub-text">Map</span>
      <br />
      <span class="main-text">{{ selectedMap }}</span>
    </div>
    <div class="content-wrapper">
      <span class="sub-text">Round</span>
      <br />
      <span class="main-text">{{ round }} / 5</span>
    </div>
    <div class="content-wrapper">
      <span class="sub-text">Score</span>
      <br />
      <span class="main-text">{{ score }}</span>
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
    round: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
});
</script>

<style scoped>
.score-board {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 240px;
  height: 64px;
  padding: 0 16px;
  border-radius: 5px;
  background-color: #0000ae;
  z-index: 3;
  display: flex;
  align-items: center;
  flex-direction: row;
}

.content-wrapper {
  margin: 0 12px;
}

.main-text {
  color: #ffffff;
  font-family: "Roboto medium";
  font-size: 16px;
}

.sub-text {
  color: #ffffff;
  font-family: "Roboto medium";
  font-size: 12px;
}
</style>
