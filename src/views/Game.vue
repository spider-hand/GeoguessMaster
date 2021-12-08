<template>
  <div class="screen">
    <StreetView @updateRandomLatLng="updateRandomLatLng" />
    <ScoreBoard
      :selectedMap="store.getters.selectedMapText"
      :round="store.state.inGame.round"
      :score="store.state.inGame.score"
    />
    <Map
      :randomLatLng="store.state.inGame.randomLatLng"
      @updateSelectedLatLng="updateSelectedLatLng"
    />
    <button
      id="guess-button"
      :class="['long-button', isGuessButtonDisabled ? 'disabled-button' : null]"
      :disabled="isGuessButtonDisabled"
      v-if="!state.isGuessButtonClicked"
      @click="null"
    >
      <span class="button-text">GUESS</span>
    </button>
  </div>
</template>

<script lang="ts">
/*global google*/
import { defineComponent, reactive, computed } from "vue";

import { useStore } from "vuex";

import { key } from "@/store";
import StreetView from "@/components/Game/StreetView.vue";
import Map from "@/components/Game/Map.vue";
import ScoreBoard from "@/components/Game/ScoreBoard.vue";

export default defineComponent({
  components: {
    StreetView,
    Map,
    ScoreBoard,
  },

  setup() {
    const store = useStore(key);

    const state = reactive<{
      isGuessButtonClicked: boolean;
    }>({
      isGuessButtonClicked: false,
    });

    const isGuessButtonDisabled = computed<boolean>(
      () =>
        store.state.inGame.selectedLatLng === null || state.isGuessButtonClicked
    );

    const updateRandomLatLng = (latLng: google.maps.LatLng): void => {
      store.dispatch("saveRandomLatLngAction", {
        randomLatLng: latLng,
      });
    };

    const updateSelectedLatLng = (latLng: google.maps.LatLng): void => {
      store.dispatch("saveSelectedLatLngAction", {
        selectedLatLng: latLng,
      });
    };

    return {
      store,
      state,
      isGuessButtonDisabled,
      updateRandomLatLng,
      updateSelectedLatLng,
    };
  },
});
</script>

<style scoped>
.screen {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.long-button {
  position: absolute;
  bottom: 10px;
  left: 12px;
  width: 240px;
  height: 36px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 3;
}

.disabled-button {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-text {
  font-family: "Roboto medium";
  font-size: 16px;
  color: #ffffff;
}

#guess-button {
  background-color: #ff4343;
}
</style>
