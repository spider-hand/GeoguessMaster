<template>
  <div class="screen">
    <div class="header">
      <img 
        src="@/assets/logo.png"
        class="logo"
      />
      <span class="title">Geoguess Master</span>
      <div class="header-right">
        <a href="https://github.com/spider-hand/Geoguess-Master">
          <GithubIcon 
            title="Github repository link here."
            fillColor="#ffffff"
            :size="32"
          />
        </a>
      </div>
    </div>
    <div class="container">
      <div class="game-create-box-container">
        <div class="game-create-box">
          <div class="map-select-box-container">
            <div>
              <span class="select-box-title">Map</span>
              <br>
              <span class="selected-option">Worlds</span>
            </div>
          </div>
          <div class="mode-select-box-container">
            <div>
              <span class="select-box-title">Mode</span>
              <br>
              <span class="selected-option">Single Player</span>
            </div>
          </div>
          <div class="start-game-button">
            <span class="create-button-text">START</span>
          </div>
        </div>
      </div>
      <div class="map-image-container">
        <img 
          src="@/assets/united_states.png"
          class="map-image"
          width="640"
        />
      </div>
    </div>
    <div class="footer">
      <div class="copyright-container">
        <span class="copyright-text">
          All rights reserved. Copyright © {{ new Date().getFullYear() }} <strong>Spider Hand</strong>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import GithubIcon from "vue-material-design-icons/Github.vue";

export default defineComponent({

  components: {
    GithubIcon
  }
})
</script>

<style scoped>
.screen {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(#0000AE, #000057);
  overflow-y: auto;
}

.header {
  position: absolute;
  width: 100%;
  height: 64px;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
}

.header-right {
  position: absolute;
  width: 96px;
  height: 100%;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  height: 48px;
  padding-left: 16px;
}

.title {
  color: #ffffff;
  font-family: "Roboto medium";
  font-size: 20px;
}

.container {
  position: absolute;
  width: 100%;
  top: 64px;
  left:0;
}

.game-create-box-container {
  width: 100%;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-create-box {
  width: 640px;
  height: 64px;
  background-color: #ffffff;
  border-radius: 64px;
  display: flex;
  align-items: center;
}

.map-select-box-container {
  height: 48px;
  width: 180px;
  padding : 0 24px;
  border-right: 1px solid #c3c3c3;
}

.mode-select-box-container {
  height: 48px;
  width: 180px;
  padding : 0 24px;
}

.select-box-title {
  font-family: "Roboto medium";
  font-size: 12px;
  color: #5f5f5f;
}

.selected-option {
  font-family: "Roboto medium";
  font-size: 16px;
  color: #3c3c3c;
}

.start-game-button {
  width: 172px;
  height: 48px;
  background-color: #ff4343;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-button-text {
  font-family: "Roboto medium";
  font-size: 16px;
  color: #ffffff;
}

.map-image-container {
  width: 100%;
  padding: 24px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-image {
  border-radius: 8px;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
}

.copyright-container {
  padding: 0 12px;
}

.copyright-text {
  font-family: "Roboto medium";
  font-size: 12px;
  color: #ffffff;
}
</style>