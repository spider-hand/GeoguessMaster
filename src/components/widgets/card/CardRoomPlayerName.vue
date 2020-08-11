<template>
  <v-card color="#061422">
    <v-card-title>
      <span id="card-title">{{ $t('CardRoomPlayerName.title') }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
              <v-text-field 
                dark
                maxlength="10"
                v-model="playerName"></v-text-field>
           </v-col>       
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn
        dark
        depressed
        color="#FF5252"
        @click="setPlayerName">{{ $t('CardRoomPlayerName.next') }}</v-btn>
      <v-btn
        dark
        depressed
        color="#43B581"
        @click="cancel">{{ $t('CardRoomPlayerName.cancel') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue'

  export type Datatype = {
    playerName: string,
  }

  export default Vue.extend({
    name: 'CardRoomPlayerName',
    
    data(): Datatype {
      return {
        playerName: '',
      }
    },

    methods: {
      setPlayerName(): void {
        this.$emit('setPlayerName', this.playerName)
      },

      cancel() {
        this.$emit('cancel')
      }
    }    
  })
</script>

<style scoped>
  #card-title {
    font-size: 16px;
    font-weight: 500;
    color: #FFFFFF;
    opacity: 0.9;
  } 
</style>