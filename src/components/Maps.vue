<template>
  <div>
    <div
      id="map"
      @mouseover="mouseOverMap"
      @mouseleave="mouseOutMap">
    </div>
    <v-btn
      id="hide-map-button"
      v-if="$viewport.width < 450 && !isGuessButtonClicked && isMakeGuessButtonClicked"
      fab
      x-small
      color="red"
      @click="hideMap">
      <v-icon color="white">mdi-close</v-icon>
    </v-btn>
    <button
      id="make-guess-button"
      v-if="$viewport.width < 450 && !isGuessButtonClicked && !isMakeGuessButtonClicked"
      @click="showMap">
      {{ $t('Maps.makeGuess') }}
    </button>
    <button
      id="guess-button"
      :disabled="selectedLatLng == null || isGuessButtonClicked"
      v-if="!isGuessButtonClicked && ($viewport.width > 450 || isMakeGuessButtonClicked)"
      @click="selectLocation"
      >{{ $t('Maps.guess') }}
    </button>
    <button
      id="next-button"
      v-if="isGuessButtonClicked && round < 5"
      @click="goToNextRound"
      >{{ $t('Maps.nextRound') }}
    </button>
    <button
      id="summary-button"
      v-if="isGuessButtonClicked && round >= 5"
      @click="dialogSummary = true"
      >{{ $t('Maps.viewSummary') }}
    </button>
    <DialogSummary
      :dialogSummary="dialogSummary"
      :score="score"
      @playAgain="playAgain" />   
  </div>
</template>

<script lang="ts">
  import Vue, { PropType } from 'vue'

  import DialogSummary from '@/components/widgets/dialog/DialogSummary.vue'

  export type DataType = {
    markers: google.maps.Marker[],
    map: google.maps.Map | null,
    polyline: google.maps.Polyline | null,
    selectedLatLng: google.maps.LatLng | null,
    distance: number,
    isGuessButtonClicked: boolean,
    isMakeGuessButtonClicked: boolean,
    isSelected: boolean,
    dialogSummary: boolean,
  }

  export default Vue.extend({
    name: 'Maps',

    props: {
      randomLatLng: Object as PropType<google.maps.LatLng>,
      round: Number,
      score: Number,
    },

    components: {
      DialogSummary,
    },

    data(): DataType {
      return {
        markers: [],
        map: null,
        polyline: null,
        selectedLatLng: null,
        distance: 0,
        isGuessButtonClicked: false,
        isMakeGuessButtonClicked: false,
        isSelected: false,
        dialogSummary: false,
      }
    },

    methods: {
      showMap(): void {
        document.getElementById('map')!.style.transform = "translateY(-300px)"
        this.isMakeGuessButtonClicked = true
      },

      hideMap(): void {
        document.getElementById('map')!.style.transform = "translateY(300px)"
        this.isMakeGuessButtonClicked = false
      },

      selectLocation(): void {
        this.calculateDistance()
        this.drawPolyline()
        this.putMarker(this.randomLatLng)
        this.setInfoWindow()

        google.maps.event.clearListeners(this.map!, 'click')

        this.isGuessButtonClicked = true
        this.isSelected = true

        this.mouseOverMap()
      },

      putMarker(position: google.maps.LatLng): void {
        let marker = new google.maps.Marker({
          position: position,
          map: this.map!,
        })
        this.markers.push(marker)
      },

      removeMarkers(): void {
        for (let i in this.markers) {
          this.markers[i].setMap(null)
        }
        this.markers = []
      },

      calculateDistance(): void {
        this.distance = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(this.randomLatLng, this.selectedLatLng!) / 1000)
        this.$emit('calculateDistance', this.distance)
      },

      setInfoWindow(): void {
        let infoWindow = new google.maps.InfoWindow({
          content: '<b>' + this.distance + '</b> km away!'
        })
        infoWindow.open(this.map!, this.markers[0])
      },

      drawPolyline(): void {
        this.polyline = new google.maps.Polyline({
          path: [this.selectedLatLng!, this.randomLatLng],
          strokeColor: '#FF0000',
        })
        this.polyline!.setMap(this.map!)
      },

      goToNextRound(): void {
        this.selectedLatLng = null
        this.polyline!.setMap(null)
        this.isGuessButtonClicked = false
        this.isSelected = false

        if (this.$viewport.width < 450) {
          this.hideMap()
        } else {
          this.mouseOutMap()
        }

        this.removeMarkers()
        this.$emit('goToNextRound')
      },

      playAgain(): void {
        this.selectedLatLng = null
        this.polyline!.setMap(null)
        this.isGuessButtonClicked = false
        this.isSelected = false
        this.dialogSummary = false

        if (this.$viewport.width < 450) {
          this.hideMap()
        } else {
          this.mouseOutMap()
        }

        this.removeMarkers()
        this.$emit('playAgain')
      },

      mouseOverMap(): void {
        if (this.$viewport.width > 450) {
          document.getElementById('map')!.style.opacity = '1.0'
          document.getElementById('map')!.style.transform = 'scale(1)'
        }
      },

      mouseOutMap(): void {
        if (this.isSelected === false && this.$viewport.width > 450) {
          document.getElementById('map')!.style.opacity = '0.7'
          document.getElementById('map')!.style.transform = 'scale(0.75)'
        }
      },
    },

    watch: {
      randomLatLng: function(newVal: google.maps.LatLng, oldVal: google.maps.LatLng) {
        if (newVal != null) {
          const that = this
          that.map!.addListener('click', (e) => {
            // Clear the markers and set the new one when clicking the map
            that.removeMarkers()
            that.putMarker(e.latLng)
            that.selectedLatLng = e.latLng
          })          
        }
      }
    },

    mounted(): void {
      this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: {lat: 37.869260, lng: -122.254811},
          zoom: 1,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
      })      
    },
  })
</script>

<style scoped>
  #make-guess-button, #guess-button, #next-button, #summary-button {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 3;
    border: none;
    border-radius: 5px;
    opacity: 0.8;
    color: white;
    font-size: 16px;
    text-decoration: none;
    text-align: center;
    padding: 10px 60px;
  }
  #make-guess-button, #guess-button {
    width: 360px;
  }
  #next-button, #summary-button {
    width: 480px;
  }
  #map {
    position: absolute;
    bottom: 60px;
    left: 10px;
    z-index: 3;
    opacity: 0.7;
    height: 320px;
    width: 480px;
    transform-origin: bottom left;
    transform: scale(0.75);
    transition: transform 0.3s;
  }
  #make-guess-button, #guess-button {
    background-color: #212121;
  }
  #guess-button:hover {
    opacity: 1.0;
  }
  #next-button, #summary-button {
    background-color: #F44336;
  }
  @media (max-width: 900px) {
    #make-guess-button, #guess-button {
      width: 300px;
    }
    #next-button, #summary-button {
      width: 400px;
    }
    #map {
      height: 265px;
      width: 400px;
    }
  }
  @media (max-width: 450px) {
    #make-guess-button, #guess-button, #next-button, #summary-button {
      bottom: -50px;
    }
    #next-button, #summary-button {
      width: 300px;
    }
    #map {
      bottom: -280px;
      height: 200px;
      width: 300px;
      opacity: 1.0;
      transition: transform 1s;
    }
    #hide-map-button {
      position: absolute;
      bottom: 210px;
      left: 300px;
      z-index: 3;
    }
  }
</style>
