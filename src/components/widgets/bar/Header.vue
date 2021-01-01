<template>
  <div class="header">
    <div class="header-content">
      <img 
        src="@/assets/logo.png"
        width="45"
      />
      <span class="title">Geoguess Master</span>
      <div class="flex-grow-1"></div>
      <v-btn 
        text
        color="#FFFFFF"
        href="#section-about">
        <span>ABOUT</span>
      </v-btn>
      <v-btn
        text
        color="#FFFFFF"
        href="#section-limitation">
        <span>LIMITATION</span>
      </v-btn>
      <v-btn
        text
        color="#FFFFFF"
        href="#contact">
        <span>CONTACT</span>
      </v-btn>
    </div>
  </div>
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

.header {
  top: 0px;
  left: 0px;
  height: 56px;
  width: 100%;
}

.header * {
  z-index: 1;
}

.header-content {
  padding: 4px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  color: #FFFFFF;
  font-weight: 700;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>