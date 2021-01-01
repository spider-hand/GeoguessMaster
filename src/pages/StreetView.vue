<template>
  <div class="page">
    <HeaderGame
      :score="state.score"
      :round="state.round" />
    <div class="street-view-wrapper">
      <div id="street-view">
        <v-btn 
          id="reset-button"
          icon
          color="#FFFFFF"
          @click="resetLocation">
          <v-icon size="36">mdi-flag</v-icon>
        </v-btn>
        <v-btn 
          id="zoom-in-button"
          icon
          color="#FFFFFF"
          @click="zoomIn">
          <v-icon size="36">mdi-plus</v-icon>
        </v-btn>
        <v-btn 
          id="zoom-out-button"
          icon
          color="#FFFFFF"
          @click="zoomOut">
          <v-icon size="36">mdi-minus</v-icon>
        </v-btn>
        <Maps
          :randomLatLng="state.randomLatLng"
          :round="state.round"
          :score="state.score"
          @calculateDistance="updateScore"
          @goToNextRound="goToNextRound"
          @playAgain="playAgain"
        />
      </div>
    </div>
    <v-overlay 
      :value="state.overlay"
      opacity="0.8" 
      z-index="2"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, } from '@vue/composition-api'

import HeaderGame from '@/components/widgets/bar/HeaderGame.vue'
import Maps from '@/components/Maps.vue'

export default defineComponent({
  components: {
    HeaderGame,
    Maps,
  },

  setup() {
    const state = reactive<{
      randomLatLng: google.maps.LatLng | null;
      panorama: google.maps.StreetViewPanorama | null;
      score: number;
      round: number;
      overlay: boolean;
    }>({
      randomLatLng: null,
      panorama: null,
      score: 0,
      round: 1,
      overlay: false,
    })

    function getRandomLatLng(): google.maps.LatLng {
      const lat = (Math.random() * 170) - 85
      const lng = (Math.random() * 360) - 180
      return new google.maps.LatLng(lat, lng)
    }

    function loadStreetView(): void {
      const service = new google.maps.StreetViewService()
      service.getPanorama({
        location: getRandomLatLng(),
        preference: google.maps.StreetViewPreference.NEAREST,
        radius: 100000,
        source: google.maps.StreetViewSource.OUTDOOR,
      }, checkStreetView)
    }

    function checkStreetView(
      data: google.maps.StreetViewPanoramaData | null, 
      status: google.maps.StreetViewStatus): void {
        if (status === google.maps.StreetViewStatus.OK) {
          state.panorama = 
            new google.maps.StreetViewPanorama(document.getElementById('street-view')! as HTMLElement)
          state.panorama!.setOptions({
            zoomControl: false,
            addressControl: false,
            fullscreenControl: false,
            motionTracking: false,
            motionTrackingControl: false,
            showRoadLabels: false,
          })
          state.panorama!.setPano(data!.location!.pano!)
          state.panorama!.setPov({
            heading: 270,
            pitch: 0,
          })

          state.randomLatLng = data!.location!.latLng as google.maps.LatLng
        } else {
          loadStreetView()
        }
    }

    function updateScore(distance: number) {
      state.score += distance
      state.overlay = true
    }

    function goToNextRound(): void {
      state.randomLatLng = null
      state.overlay = false
      state.round += 1

      loadStreetView()
    }

    function playAgain(): void {
      state.randomLatLng = null
      state.score = 0
      state.round = 1
      state.overlay = false

      loadStreetView()
    }

    function resetLocation(): void {
      state.panorama!.setPosition(state.randomLatLng!)
    }

    function zoomIn(): void {
      let currentLevel = state.panorama!.getZoom()
      currentLevel++
      state.panorama!.setZoom(currentLevel)
    }

    function zoomOut(): void {
      let currentLevel = state.panorama!.getZoom()
      currentLevel--
      state.panorama!.setZoom(currentLevel)
    }

    onMounted(() => {
      loadStreetView()
    })

    return {
      state,
      updateScore,
      goToNextRound,
      playAgain,
      resetLocation,
      zoomIn,
      zoomOut,
    }
  }
})
</script>

<style scoped>
.page {
  position: relative;
  height: 100%; 
  width: 100%; 
  top: 0; 
  left: 0;
}

.street-view-wrapper {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

#street-view {
  position: relative;
  min-height: 100%;
  width: 100%;
}

#reset-button, #zoom-in-button, #zoom-out-button {
  position: absolute;
  z-index: 2;
  background-color: #212121;
  opacity: 0.8;
  right: 12px;
}

#reset-button {
  bottom: 200px;
}

#zoom-in-button {
  bottom: 150px;
}

#zoom-out-button {
  bottom: 100px;
}

@media (max-width: 450px) {
  #reset-button {
    bottom: 120px;
  }

  #zoom-in-button {
    bottom: 70px;
  }

  #zoom-out-button {
    bottom: 20px;
  }
}
</style>