<template>
  <v-dialog
    v-model="dialogSummary"
    max-width="640"
    persistent>
    <v-card color="#E1F5FE">
      <v-card-text id="card-text-wrapper">
        <v-row
          class="mt-3"
          justify="center" 
          v-for="(text, index) in summary"
          :key="index">
          <span id="summary-text">
            <v-icon 
              v-if="index === 0"
              color="#FAA61A"
            >
              mdi-crown
            </v-icon>
            <strong :style="{ 'margin-left': index !== 0 ? '24px' : 'none' }">{{ text.playerName }}</strong> is <strong>{{ text.finalScore }}</strong> km away!
          </span>
        </v-row>
        <v-row justify="center">
          <v-btn
            id="exit-button"
            class="mt-8"
            dark
            color="#FF5252"
            @click="finishGame">EXIT</v-btn>
        </v-row>
      </v-card-text>
      <v-card-text class="text-right">
        <v-btn
          target="_blank"
          :href="`http://www.facebook.com/sharer.php?u=https://geoguessmaster.com/&amp;t=I am ${score} km away! How close can you guess?`" 
          rel="nofollow"
          icon
          color="#061422">
          <v-icon size="32">mdi-facebook-box</v-icon>
        </v-btn>
        <v-btn
          target="_blank"
          :href="`http://twitter.com/share?url=https://geoguessmaster.com/&amp;text=I am ${score} km away! How close can you guess?`" 
          icon
          color="#061422">
          <v-icon size="32">mdi-twitter-box</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>  
</template>

<script lang="ts">
import { defineComponent, watch, PropType, } from '@vue/composition-api'

declare interface Summary {
  playerName: string;
  finalScore: number;
}

export default defineComponent({
  props: {
    dialogSummary: {
      type: Boolean,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    summary: {
      type: Array as PropType<Summary[]>,
      required: true,
    }
  },

  setup(props, context) {
    function updateRecord(): void {
      const currentRecord = localStorage.getItem('record') !== null
                              ? Number(localStorage.getItem('record'))
                              : null
      if (currentRecord === null || props.score < currentRecord) {
        localStorage.setItem('record', String(props.score))
      }
    }

    function finishGame(): void {
      context.emit('finishGame')
    }

    watch(
      () => props.dialogSummary,
      (newVal: boolean, oldVal: boolean) => {
        if (newVal === true) {
          updateRecord()
        }
      }
    )

    return {
      finishGame,
    }
  }
})
</script>

<style scoped>
#card-text-wrapper {
  padding: 80px 10% 80px 10%;
}

#summary-text {
  font-size: 18px;
  color: #061422;
  opacity: 0.9;
}

#exit-button {
  height: 44px;
  width: 210px;
  border-radius: 40px;
}

@media (max-width: 450px) {
  #exit-button {
    height: 36px;
    margin-top: 28px;
    margin-bottom: 24px;
  }
}
</style>