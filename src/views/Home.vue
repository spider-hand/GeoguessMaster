<template>
  <div class="screen">
    <div class="header">
      <img 
        src="@/assets/logo.png"
        class="logo"
      />
      <span class="title">Geoguess Master</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({

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

.logo {
  height: 48px;
  padding-left: 16px;
}

.title {
  color: #ffffff;
  font-family: "Roboto medium";
  font-size: 20px;
}
</style>