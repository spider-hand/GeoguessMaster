<template>
  <div class="footer">
    <v-container>
      <v-row
        id="contact" 
        justify="center">
        <v-btn
          class="ml-4 mr-4" 
          icon
          color="#FFFFFF"
          href="https://github.com/spider-hand/Geoguess-Master-Web">
          <v-icon size="30">mdi-github-circle</v-icon>
        </v-btn>
        <v-btn 
          class="ml-4 mr-4"
          icon
          color="#FFFFFF"
          href="https://discord.gg/fPpUzgJ">
          <v-icon size="30">mdi-discord</v-icon>
        </v-btn>
        <v-btn 
          class="ml-4 mr-4"
          icon
          color="#FFFFFF"
          href="mailto:creative.spider.hand@gmail.com">
          <v-icon size="30">mdi-email</v-icon>
        </v-btn>
      </v-row>
      <v-row
        class="mt-8"
        justify="center"
      >
        <span id="copyright">All rights reserved. Copyright © {{ new Date().getFullYear() }} <strong>Spider Hand</strong></span>
      </v-row>
      <v-row 
        class="mt-2"
        justify="center"
      >
        <span id="credit">Photo by <a href="https://unsplash.com/@timowielink?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Timo Wielink</a> on <a href="https://unsplash.com/s/photos/map?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a> ,
        Design by <a href="http://www.pauloxgomes.com/">Paulo Gomes</a></span>
      </v-row>
    </v-container>
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

.footer {
  position: absolute;
  left: 0;
  top: 1500px;
  bottom: 0;
  padding: 12px;
  height: 210px;
  width: 100%;
  background-color: #061422;
}

.footer-content {
  padding: 12px;
}

#copyright, #credit {
  font-size: 12px;
  color: #7D7D7D;
}

@media (max-width: 450px) {
  .footer {
    top: 1440px;
    height: 300px;
  }
}
</style>