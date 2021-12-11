<template>
  <div class="screen">
    <ResultModal
      v-show="store.state.inGame.isShowingResult"
      :isShowingResult="store.state.inGame.isShowingResult"
      :isShowingSummary="store.state.inGame.isShowingSummary"
      :randomLatLng="store.state.inGame.randomLatLng"
      :selectedLatLng="store.state.inGame.selectedLatLng"
      :gameHistory="store.state.inGame.gameHistory"
      :distance="store.getters.distance"
      :round="store.state.inGame.round"
      :score="store.state.inGame.score"
      @onClickNextRoundButton="onClickNextRoundButton"
      @onClickViewSummaryButton="onClickViewSummaryButton"
      @onClickPlayAgainButton="onClickPlayAgainButton"
      @onClickExitButton="onClickExitButton"
    />
    <StreetView
      :selectedMap="store.state.gameSettings.selectedMap"
      :geoJSON="store.state.gameSettings.geoJSON"
      :round="store.state.inGame.round"
      @updateRandomLatLng="updateRandomLatLng"
      @fetchGeoJSON="fetchGeoJSON"
    />
    <ScoreBoard
      :selectedMap="store.getters.selectedMapText"
      :round="store.state.inGame.round"
      :score="store.state.inGame.score"
    />
    <Map
      :randomLatLng="store.state.inGame.randomLatLng"
      :round="store.state.inGame.round"
      @updateSelectedLatLng="updateSelectedLatLng"
    />
    <button
      id="guess-button"
      :class="['long-button', isGuessButtonDisabled ? 'disabled-button' : null]"
      :disabled="isGuessButtonDisabled"
      v-if="!state.isGuessButtonClicked"
      @click="onClickGuessButton"
    >
      <span class="button-text">GUESS</span>
    </button>
  </div>
</template>

<script lang="ts">
/*global google*/
import { defineComponent, reactive, computed } from "vue";

import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { key } from "@/store";
import StreetView from "@/components/Game/StreetView.vue";
import Map from "@/components/Game/Map.vue";
import ScoreBoard from "@/components/Game/ScoreBoard.vue";
import ResultModal from "@/components/Game/ResultModal.vue";

export default defineComponent({
  components: {
    StreetView,
    Map,
    ScoreBoard,
    ResultModal,
  },

  setup() {
    const store = useStore(key);
    const router = useRouter();

    const state = reactive<{
      isGuessButtonClicked: boolean;
    }>({
      isGuessButtonClicked: false,
    });

    const isGuessButtonDisabled = computed<boolean>(
      () =>
        store.state.inGame.selectedLatLng === null || state.isGuessButtonClicked
    );

    const fetchGeoJSON = async (callback: () => void): Promise<void> => {
      await store.dispatch("fetchGeoJSONAction", {
        countryCode: store.state.gameSettings.selectedMap,
      });
      callback();
    };

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

    const onClickGuessButton = (): void => {
      store.dispatch("saveScoreAction", {
        score: store.getters.distance,
      });
      store.dispatch("saveIsShowingResultAction", {
        isShowingResult: true,
      });
    };

    const onClickNextRoundButton = (): void => {
      const gameHistory = {
        randomLatLng: store.state.inGame.randomLatLng,
        selectedLatLng: store.state.inGame.selectedLatLng,
      };
      store.dispatch("updateGameHistoryAction", {
        gameHistory: gameHistory,
      });
      store.dispatch("proceedToNextRoundAction");
    };

    const onClickViewSummaryButton = (): void => {
      store.dispatch("saveIsShowingSummaryAction", {
        isShowingSummary: true,
      });
    };

    const onClickPlayAgainButton = (): void => {
      store.dispatch("resetInGameStateAction");
    };

    const onClickExitButton = (): void => {
      router.back();
    };

    return {
      store,
      state,
      isGuessButtonDisabled,
      fetchGeoJSON,
      updateRandomLatLng,
      updateSelectedLatLng,
      onClickGuessButton,
      onClickNextRoundButton,
      onClickViewSummaryButton,
      onClickPlayAgainButton,
      onClickExitButton,
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
  z-index: 1;
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
