<template>
  <v-dialog
    v-model="dialogSummary"
    max-width="640"
    persistent>
    <v-card color="#FAFAFA">
      <v-card-text id="card-text-wrapper">
        <v-row justify="center">
          <img 
            src="@/assets/illustration_2.png"
            width="108" 
          />
        </v-row>
        <v-row
          class="mt-8"
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
  padding: 30px 10% 40px 10%;
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