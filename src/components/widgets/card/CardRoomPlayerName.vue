<template>
  <v-card color="#E1F5FE">
    <v-card-title>
      <span>Input your name.</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
              <v-text-field 
                maxlength="10"
                v-model="state.playerName"></v-text-field>
           </v-col>       
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn
        dark
        depressed
        color="#43B581"
        @click="setPlayerName">NEXT</v-btn>
      <v-btn
        dark
        depressed
        color="#FF5252"
        @click="cancel">CANCEL</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, } from '@vue/composition-api'

export default defineComponent({

  setup(props, context) {
    const state = reactive<{
      playerName: string;
    }>({
      playerName: '',
    })

    function setPlayerName(): void {
      context.emit('setPlayerName', state.playerName)
    }

    function cancel(): void {
      context.emit('cancel')
    }

    return {
      state,
      setPlayerName,
      cancel,
    }
  }
})
</script>

<style scoped>

</style>