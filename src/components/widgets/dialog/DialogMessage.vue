<template>
  <v-dialog 
    v-model="dialogMessage"
    max-width="600"
    persistent
  >
    <v-card color="#E1F5FE">
      <v-card-title>
        <span>{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <span>{{ text }}</span>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, } from '@vue/composition-api'

export default defineComponent({

  props: {
    dialogMessage: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
})
</script>

<style scoped>
  
</style>