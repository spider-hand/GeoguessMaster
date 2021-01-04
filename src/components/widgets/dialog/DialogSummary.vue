<template>
  <v-dialog 
    v-model="dialogSummary"
    max-width="640"
    persistent>
    <v-card color="#E1F5FE">
      <v-card-text id="card-text-wrapper">
        <v-row justify="center">
          <span id="summary-text">You are <strong>{{ score }}</strong> km away!</span>
        </v-row>
        <v-row
          class="mt-8"
          justify="center">
          <v-btn
            id="play-again-button"
            class="ml-4 mr-4"
            dark
            color="#FF5252"
            @click="$router.push('/')">EXIT</v-btn>
          <v-btn 
            id="exit-button"
            class="ml-4 mr-4"
            dark
            color="#43B581"
            @click="playAgain">PLAY AGAIN</v-btn>
        </v-row>
      </v-card-text>
      <v-card-text class="text-right">
        <v-btn
          target="_blank"
          :href="`http://www.facebook.com/sharer.php?u=https://geoguessmaster.com/&amp;t=I am ${score} km away! How close can you guess?`" 
          rel="nofollow"
          icon
          color="#061422"
        >
          <v-icon size="32">mdi-facebook-box</v-icon>
        </v-btn>
        <v-btn
          target="_blank"
          :href="`http://twitter.com/share?url=https://geoguessmaster.com/&amp;text=I am${score}km away! How close can you guess?`" 
          icon
          color="#061422"
        >
          <v-icon size="32">mdi-twitter-box</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>    
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, watch, } from '@vue/composition-api'

export default defineComponent({
  props: {
    dialogSummary: {
      type: Boolean,
      required: true,
    },
    score: {
      type: Number,
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

    function playAgain(): void {
      context.emit('playAgain')
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
      playAgain,
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

#exit-button, #play-again-button {
  height: 44px;
  width: 210px;
  border-radius: 40px;
}

@media (max-width: 450px) {
  #exit-button, #play-again-button {
    height: 36px;
  }

  #exit-button {
    margin-top: 28px;
    margin-bottom: 24px;
  }
}  
</style>