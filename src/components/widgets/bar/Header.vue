<template>
  <div class="header">
    <div class="header-content">
      <img 
        src="@/assets/logo.png"
        width="45"
      />
      <span class="title">Geoguess Master</span>
      <div class="flex-grow-1"></div>
      <span>LANGUAGE</span>
      <span>ABOUT</span>
      <span>LIMITATION</span>
      <span>CONTACT</span>
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