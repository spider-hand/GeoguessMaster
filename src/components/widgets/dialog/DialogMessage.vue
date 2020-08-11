<template>
  <v-dialog 
    v-model="dialogMessage"
    max-width="600"
    persistent
    :fullscreen="$viewport.width < 450">
    <v-card color="#061422">
      <v-card-title>
        <span id="card-title">{{ dialogTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <span>{{ dialogText }}</span>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import Vue, { PropType } from 'vue'

  export default Vue.extend({
    name: 'DialogMessage',

    props: {
      dialogMessage: Boolean,
      dialogTitle: String,
      dialogText: String,
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