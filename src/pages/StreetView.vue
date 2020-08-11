<template>
  <div id="game-page">
    <HeaderGame 
      :score="score"
      :round="round" />
    <div id="street-view-container">
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
      </div>
      <Maps
        :randomLatLng="randomLatLng"
        :round="round"
        :score="score"
        @calculateDistance="updateScore"
        @goToNextRound="goToNextRound"
        @playAgain="playAgain" />
    </div>
    <v-overlay 
      :value="overlay"
      opacity="0.8" 
      z-index="2"/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  import HeaderGame from '@/components/widgets/bar/HeaderGame.vue'
  import Maps from '@/components/Maps.vue'

  export type DataType = {
    randomLatLng: google.maps.LatLng | null,
    panorama: google.maps.StreetViewPanorama | null,
    score: number,
    round: number,
    overlay: boolean,
  }

  export default Vue.extend({
    name: 'StreetView',

    components: {
      HeaderGame,
      Maps,
    },

    data(): DataType {
      return {
        randomLatLng: null,
        panorama: null,
        score: 0,
        round: 1,
        overlay: false,
      }
    },

    methods: {
      loadStreetView(): void {
        let service = new google.maps.StreetViewService()
        service.getPanorama({
          location: this.getRandomLatLng(),
          preference: google.maps.StreetViewPreference.NEAREST,
          radius: 100000,
          source: google.maps.StreetViewSource.OUTDOOR,
        }, this.checkStreetView)
      },

      getRandomLatLng(): google.maps.LatLng  {
        let lat = (Math.random() * 170) - 85
        let lng = (Math.random() * 360) - 180
        return new google.maps.LatLng(lat, lng)
      },

      checkStreetView(data: google.maps.StreetViewPanoramaData | null, status: google.maps.StreetViewStatus): void {
        if (status === google.maps.StreetViewStatus.OK) {
          this.panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view')! as HTMLElement)
          this.panorama!.setOptions({
            zoomControl: false,
            addressControl: false,
            fullscreenControl: false,
            motionTracking: false,
            motionTrackingControl: false,
            showRoadLabels: false,
          })
          this.panorama!.setPano(data!.location!.pano!)
          this.panorama!.setPov({
            heading: 270,
            pitch: 0,
          })

          this.randomLatLng = data!.location!.latLng! as google.maps.LatLng
        } else {
          this.loadStreetView()
        }
      },

      updateScore(distance: number): void {
        this.score += distance
        this.overlay = true
      },

      goToNextRound(): void {
        this.randomLatLng = null
        this.overlay = false
        this.round += 1

        this.loadStreetView()
      },

      playAgain(): void {
        this.randomLatLng = null
        this.score = 0
        this.round = 1
        this.overlay = false

        this.loadStreetView()
      },

      resetLocation(): void {
        this.panorama!.setPosition(this.randomLatLng!)
      },

      zoomIn(): void {
        let currentLevel = this.panorama!.getZoom()
        currentLevel++
        this.panorama!.setZoom(currentLevel)
      },

      zoomOut(): void {
        let currentLevel = this.panorama!.getZoom()
        currentLevel--
        this.panorama!.setZoom(currentLevel)
      }
    },

    mounted(): void {
      this.loadStreetView()
    }
  })
</script>

<style scoped>
  #game-page {
    position: relative;
    height: 100%; 
    width: 100%; 
    top: 0; 
    left: 0;
  }

  #street-view-container {
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
    #game-page {
      position: fixed;
      height: 92%;
    }

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
