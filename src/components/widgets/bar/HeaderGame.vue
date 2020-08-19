<template>
  <v-app-bar
    id="header-game" 
    color="#212121">
    <div 
      id="countdown-timer"
      v-if="remainingTime != null && remainingTime != 0">
      <span id="countdown-text">{{ countdownText }}</span>
    </div>
    <div class="flex-grow-1"></div>
    <div id="round-score-container">
      <span class="sub-text">{{ $t('HeaderGame.round') }}: </span>
    </div>
    <div>
      <span class="main-text">{{ round }} / 5</span>
    </div>
    <div class="round-score-container">
      <span class="sub-text">{{ $t('HeaderGame.score') }}: </span>
    </div>
    <div>
      <span class="main-text">{{ score }} km away</span>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
  import Vue, { PropType } from 'vue'

  export default Vue.extend({
    name: 'HeaderGame',

    props: {
      score: Number,
      round: Number,
      remainingTime: Number,
    },

    computed: {
      countdownText(): string {
        let minutes: string | number = Math.floor(this.remainingTime / 60)
        let seconds: string | number = this.remainingTime % 60
        if (minutes < 10) {
          minutes = `0${minutes}`
        }
        if (seconds < 10) {
          seconds = `0${seconds}`
        }
        return `${minutes}:${seconds}`
      },
    },
  })
</script>

<style scoped>
  #header-game {
    z-index: 3;
    opacity: 0.8;
  }

  .round-score-container {
    padding: 0 10px 0 40px;
  }

  .main-text, #countdown-text {
    color: white;
  }

  .sub-text {
    color: #616161;
  }

  @media (max-width: 450px) {
    .main-text, .sub-text, #countdown-text {
      font-size: 14px;
    }
  } 
</style>