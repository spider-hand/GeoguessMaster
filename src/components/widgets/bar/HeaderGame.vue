<template>
  <v-app-bar
    class="header"
    color="#212121">
    <div
      class="countdown-timer"
      v-if="remainingTime !== null && remainingTime !== 0">
      <span id="countdown-text">{{ countdownText }}</span>
    </div>
    <div class="flex-grow-1"></div>
    <div class="round-score-wrapper">
      <span class="sub-text">ROUND: </span>
    </div>
    <div>
      <span class="main-text">{{ round }} / 5</span>
    </div>
    <div class="round-score-wrapper">
      <span class="sub-text">SCORE: </span>
    </div>
    <div>
      <span class="main-text">{{ score }} km away</span>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, computed, } from '@vue/composition-api'

export default defineComponent({

  props: {
    score: {
      type: Number,
      required: true,
    },
    round: {
      type: Number,
      required: true,
    },
    remainingTime: {
      type: Number,
      required: false,
    }
  },

  setup(props) {
    const countdownText = computed<string>(() => {
      if (props.remainingTime !== undefined) {
        let minutes: string | number = Math.floor(props.remainingTime / 60)
        let seconds: string | number = props.remainingTime % 60
        if (minutes < 10) {
          minutes = `0${minutes}`
        }
        if (seconds < 10) {
          seconds = `0${seconds}`
        }
        return `${minutes}:${seconds}`   
      } else {
        return ''
      }
    })

    return {
      countdownText,
    }
  }
})
</script>

<style scoped>
.header {
  top: 0px;
  left: 0px;
  height: 56px;
  width: 100%;
  background-color: #212121;
  z-index: 3;
  opacity: 0.8;
}

.round-score-wrapper {
  padding: 0 10px 0 40px;
}

.main-text, #countdown-text {
  color: #FFFFFF;
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