<template>
  <div>
    <HeaderGame />
    <div class="street-view-wrapper">
      <div id="street-view">
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
    }
  }
})
</script>

<style scoped>
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
</style>