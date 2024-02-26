<template>
  <div :class="$style['result-modal']">
    <div
      v-if="selectedMode === 'single'"
      :class="$style['result-modal__container']"
    >
      <span
        v-if="distance !== null"
        :class="$style['result-modal__text']"
      >You are <strong>{{ isShowingSummary ? score : distance }}</strong>km away {{ isShowingSummary ? "in total " : ""
      }}{{ isShowingSummary ? "&#127881;" : "&#128640;" }}</span>
      <FlatButtonComponent
        v-if="round < 5"
        :text="'NEXT ROUND'"
        @click="$emit('onClickNextRoundButton')"
      />
      <div
        v-else
        :class="$style['result-modal__button-group']"
      >
        <FlatButtonComponent
          v-if="isShowingSummary"
          :text="'PLAY AGAIN'"
          @click="$emit('onClickPlayAgainButton')"
        />
        <FlatButtonComponent
          :text="isShowingSummary ? 'EXIT' : 'VIEW SUMMARY'"
          @click="
            isShowingSummary
              ? $emit('onClickExitButton')
              : $emit('onClickViewSummaryButton')
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
          v-for="(item, index) in distanceByPlayerArr"
          :key="index"
          :class="$style['result-modal__text']"
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
          v-for="(item, index) in multiplayerGameSummary"
          :key="index"
          :class="$style['result-modal__text']"
        >
          <strong>{{ item.playerName }}</strong> is
          <strong>{{ item.score }}</strong>km away in total
          {{ index === 0 ? "&#127941;" : "" }}
        </span>
      </div>
      <FlatButtonComponent
        v-if="round < 5"
        :text="'NEXT ROUND'"
        :disabled="!isOwner && !isNextRoundReady"
        @click="$emit('onClickNextRoundButton')"
      />
      <div v-else>
        <FlatButtonComponent
          :text="isShowingSummary ? 'EXIT' : 'VIEW SUMMARY'"
          @click="
            isShowingSummary
              ? $emit('endMultiplayerGame')
              : $emit('onClickViewSummaryButton')
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Summary, DistanceByPlayer, ModeTypes } from "@/types";
import { PropType } from "vue";
import FlatButtonComponent from "../shared/FlatButtonComponent.vue";

defineProps({
  selectedMode: {
    type: String as PropType<ModeTypes>,
    required: true,
  },
  isOwner: {
    type: Boolean,
    required: true,
  },
  isShowingSummary: {
    type: Boolean,
    required: true,
  },
  isNextRoundReady: {
    type: Boolean,
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

defineEmits<{
  onClickNextRoundButton: [];
  onClickViewSummaryButton: [];
  onClickPlayAgainButton: [];
  onClickExitButton: [];
  endMultiplayerGame: [];
}>();
</script>

<style module lang="scss">
.result-modal {
  @include page-padding;

  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 240px;
  padding-top: 24px;
  padding-bottom: 24px;
  background-color: white;
}

.result-modal__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.result-modal__button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-modal__text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-modal__text {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-surface-primary);
}
</style>
