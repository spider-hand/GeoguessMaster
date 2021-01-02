<template>
  <v-app-bar
    color="transparent"
    flat>
    <div class="flex-grow-1"></div>
    <v-menu>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="#FFFFFF"
          v-on="on">
          <v-icon>mdi-menu</v-icon>
        </v-btn></template>
        <v-list>
          <v-list-item href="#section-about">
            <v-list-item-content>
              <v-list-item-title>ABOUT</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="#section-limitation">
            <v-list-item-content>
              <v-list-item-title>LIMITATION</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="#contact">
            <v-list-item-content>
              <v-list-item-title>CONTACT</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, } from '@vue/composition-api'

export default defineComponent({

})
</script>

<style scoped>
span {
  color: #FFFFFF;
}
</style>