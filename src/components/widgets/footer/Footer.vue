<template>
  <div class="footer">
    <div class="footer-content">
      <div class="row">
        <span>Github</span>
        <span>Discord</span>
        <span>Email</span>
      </div>
      <div class="row">
        <span id="copyright">All rights reserved. Copyright © {{ new Date().getFullYear() }} <strong>Spider Hand</strong></span>
      </div>
      <div class="row">
        <span>Photo by <a href="https://unsplash.com/@timowielink?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Timo Wielink</a> on <a href="https://unsplash.com/s/photos/map?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a> ,
        Design by <a href="http://www.pauloxgomes.com/">Paulo Gomes</a></span>
      </div>
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

.footer {
  position: absolute;
  left: 0;
  top: 1500px;
  bottom: 0;
  padding: 6px 0 6px 0;
  height: 210px;
  width: 100%;
  background-color: #061422;
}

.footer-content {
  padding: 12px;
}

.row {
  display: flex;
  justify-content: center;
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