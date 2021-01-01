<template>
  <div>
    <div 
      id="map"
      @mouseover="mouseOverMap"
      @mouseleave="mouseOutMap"
    />
    <v-btn
      id="hide-map-button"
      v-if="viewport.width < 450 && 
            !state.isGuessButtonClicked && 
            state.isMakeGuessButtonClicked"
      @click="hideMap"
      fab
      x-small
      color="red"
    >
      <v-icon color="white">mdi-close</v-icon>
    </v-btn>
    <button
      id="make-guess-button"
      v-if="viewport.width < 450 && 
            !state.isGuessButtonClicked && 
            !state.isMakeGuessButtonClicked"
      @click="showMap"
    >
      MAKE GUESS
    </button>
    <button
      id="guess-button"
      :disabled="state.selectedLatLng === null || 
                  state.isGuessButtonClicked"
      v-if="!state.isGuessButtonClicked && 
            (viewport.width > 450 || state.isMakeGuessButtonClicked)"
      @click="selectLocation"
      >
      GUESS
    </button>
    <button
      id="next-button"
      v-if="state.isGuessButtonClicked && round < 5"
      @click="goToNextRound"
    >
      NEXT ROUND
    </button>
    <button
      id="summary-button"
      v-if="state.isGuessButtonClicked && round >= 5"
      @click="state.dialogSummary = true"
    >
      VIEW SUMMARY
    </button>
  </div> 
</template>

<script lang="ts">
import { defineComponent, reactive, watch, onMounted, PropType, inject, } from '@vue/composition-api'

import { Viewport } from '@/types/index'

export default defineComponent({
  props: {
    randomLatLng: {
      type: Object as PropType<google.maps.LatLng>,
      required: true,
    },
    round: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },

  setup(props, context) {
    const viewport: Viewport = inject('viewport') as Viewport

    const state = reactive<{
      markers: google.maps.Marker[];
      map: google.maps.Map | null;
      polyline: google.maps.Polyline | null;
      selectedLatLng: google.maps.LatLng | null;
      distance: number;
      isGuessButtonClicked: boolean;
      isMakeGuessButtonClicked: boolean;
      isSelected: boolean;
      dialogSummary: boolean;
    }>({
      markers: [],
      map: null,
      polyline: null,
      selectedLatLng: null,
      distance: 0,
      isGuessButtonClicked: false,
      isMakeGuessButtonClicked: false,
      isSelected: false,
      dialogSummary: false,  
    })

    function showMap(): void {
      document.getElementById('map')!.style.transform = "translateY(-340px)"
      state.isMakeGuessButtonClicked = true
    }

    function hideMap(): void {
      document.getElementById('map')!.style.transform = "translateY(300px)"
      state.isMakeGuessButtonClicked = false
    }

    function selectLocation(): void {
      calculateDistance()
      drawPolyline()
      putMarker(props.randomLatLng)
      setInfoWindow()

      google.maps.event.clearListeners(state.map!, 'click')

      state.isGuessButtonClicked = true
      state.isSelected = true

      mouseOverMap()
    }

    function putMarker(position: google.maps.LatLng): void {
      const marker = new google.maps.Marker({
        position: position,
        map: state.map!,
      })
      state.markers.push(marker)
    }

    function removeMarkers(): void {
      for (let i = 0; i < state.markers.length; i++) {
        state.markers[i].setMap(null)
      }
      state.markers = []
    }

    function calculateDistance(): void {
      state.distance = 
        Math.floor(google.maps.geometry.spherical.computeDistanceBetween(props.randomLatLng, state.selectedLatLng!) / 1000)
      context.emit('calculateDistance', state.distance)
    }

    function setInfoWindow(): void {
      const infoWindow = new google.maps.InfoWindow({
        content: '<b>' + state.distance + '</b> km away!'
      })
      infoWindow.open(state.map!, state.markers[0])
    }

    function drawPolyline(): void {
      state.polyline = new google.maps.Polyline({
        path: [state.selectedLatLng!, props.randomLatLng],
        strokeColor: '#FF0000',
      })
      state.polyline!.setMap(state.map!)
    }

    function goToNextRound(): void {
      state.selectedLatLng = null
      state.polyline!.setMap(null)
      state.isGuessButtonClicked = false
      state.isSelected = false

      if (viewport.value.width < 450) {
        hideMap()
      } else {
        mouseOutMap()
      }

      removeMarkers()
      context.emit('goToNextRound')
    }

    function playAgain(): void {
      state.selectedLatLng = null
      state.polyline!.setMap(null)
      state.isGuessButtonClicked = false
      state.isSelected = false
      state.dialogSummary = false

      if (viewport.width < 450) {
        hideMap()
      } else {
        mouseOutMap()
      }

      removeMarkers()
      context.emit('playAgain')
    }

    function mouseOverMap(): void {
      if (viewport.width > 450) {
        document.getElementById('map')!.style.opacity = '1.0'
        document.getElementById('map')!.style.transform = 'scale(1)'
      }
    }

    function mouseOutMap(): void {
      if (!state.isSelected && viewport.width > 450) {
        document.getElementById('map')!.style.opacity = '0.7'
        document.getElementById('map')!.style.transform = 'scale(0.75)'
      }
    }

    watch(
      () => props.randomLatLng,
      (newVal: google.maps.LatLng, oldVal: google.maps.LatLng) => {
        if (newVal !== null) {
          state.map!.addListener('click', (e) => {
            removeMarkers()
            putMarker(e.latLng)
            state.selectedLatLng = e.latLng
          })
        }
      }
    )

    onMounted(() => {
      state.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: {lat: 37.869260, lng: -122.254811},
          zoom: 1,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
      })      
    })

    return {
      state,
      viewport,
      mouseOverMap,
      mouseOutMap,
      hideMap,
      showMap,
      selectLocation,
      goToNextRound,
    }
  }
})
</script>

<style scoped>
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
  background-color: #212121;
  width: 360px;
}

#next-button, #summary-button {
  background-color: #F44336;
  width: 480px;
}

#guess-button:hover {
  opacity: 1.0;
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
  #map {
    bottom: -280px;
    height: 200px;
    width: 300px;
    opacity: 1.0;
    transition: transform 1s;
  }

  #next-button, #summary-button {
    width: 300px;
  }

  #hide-map-button {
    position: absolute;
    bottom: 245px;
    left: 300px;
    z-index: 3;
  }
}
</style>