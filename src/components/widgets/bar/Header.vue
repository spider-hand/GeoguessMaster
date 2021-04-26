<template>
  <v-app-bar
    color="#061422"
    flat>
    <img 
      src="@/assets/logo.png"
      width="45"
    />
    <img 
      src="@/assets/title.png"
      height="32"
    />
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
  </v-app-bar>
</template>

<style scoped>
span {
  color: #FFFFFF;
}
</style>