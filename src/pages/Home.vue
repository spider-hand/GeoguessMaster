<template>
  <div>
    <div id="section-top">
      <img
        id="background-image" 
        src="@/assets/background.jpg">
      <Header />
      <div class="content-wrapper record-wrapper">
        <div class="row">
          <span id="record">Record: {{ record }} km</span>
        </div>
      </div>
      <div class="content-wrapper button-wrapper">
        <div class="row">
          <button 
            id="single-player-btn"
            @click="$router.push('street-view')"
          >
              Single Player
            </button>
          <button id="with-friends-btn">With Friends</button>
        </div>
      </div>
    </div>
    <div id="section-about">
      <div class="content-wrapper">
        <div class="row">
          <div class="description-wrapper">
            Description here.
          </div>
        </div>
      </div>
    </div>
    <div id="section-limitation">
      <div class="content-wrapper">
        <div class="row">
          <div class="description-wrapper">
            Description here.
          </div>
        </div>       
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, } from '@vue/composition-api'

import Header from '@/components/widgets/bar/Header.vue'
import Footer from '@/components/widgets/footer/Footer.vue'

export default defineComponent({
  components: {
    Header,
    Footer,
  },

  setup() {
    const record = computed<number>(() => {
      return 0
    })

    return {
      record,
    }
  }
})
</script>

<style scoped>
button {
  width: 244px;
  height: 44px;
  border: none;
  border-radius: 40px;
  font-size: 14px;
}

#single-player-btn {
  margin-right: 32px;
  background-color: #FF5252;
  color: #FFFFFF;
}

#with-friends-btn {
  margin-left: 32px;
  background-color: #43B581;
  color: #FFFFFF;
}

#section-top {
  position: absolute;
  width: 100%;
  height: 640px;
  left: 0px;
  top: 0px;
  background: linear-gradient(#071D3E, #06121D);
}

#section-top * {
  z-index: 1;
}

#background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.4;
  z-index: 0 !important;
}

#section-about {
  position: absolute;
  width: 100%;
  height: 430px;
  left: 0px;
  top: 640px;
  background: #FAFAFA;
}

#section-limitation {
  position: absolute;
  width: 100%;
  height: 430px;
  left: 0px;
  top: 1070px;
  background: #F4F4F4;
}

.content-wrapper {
  padding: 12px;
}

.record-wrapper {
  margin-top: 150px;
}

.description-wrapper {
  padding: 0 18%;
}

.row {
  display: flex;
  justify-content: center;
}

#record {
  font-size: 26px;
  font-weight: 700;
  color: #FFFFFF;
}
</style>