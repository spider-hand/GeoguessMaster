<template>
  <div>
    <div 
      id="map"
      @mouseover="mouseOverMap"
      @mouseleave="mouseOutMap">
    </div>
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
                  state.isGuessButtonClicked ||
                  !isReady"
      v-if="!state.isNextButtonVisible && 
            !state.isSummaryButtonVisible && 
            (viewport.width > 450 || state.isMakeGuessButtonClicked)"
      @click="selectLocation"
      >
      GUESS
    </button>
    <button
      id="next-button"
      :disabled="!state.isNextButtonEnabled"
      :style="{ backgroundColor: isNextButtonEnabled ? '#F44336' : '#B71C1C' }"
      v-if="state.isNextButtonVisible"
      @click="goToNextRound"
      >
      NEXT ROUND
    </button>
    <button
      id="summary-button"
      v-if="state.isSummaryButtonVisible"
      @click="state.dialogSummary = true"
      >
      VIEW SUMMARY
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted, PropType, inject, } from '@vue/composition-api'

import firebase from 'firebase/app'
import 'firebase/database'  

import { Viewport, } from '@/types/index'

declare interface Summary {
  playerName: string;
  finalScore: number;
}

export default defineComponent({
  props: {
    randomLatLng: {
      type: Object as PropType<google.maps.LatLng>,
      required: false,
    },
    roomName: {
      type: String,
      required: true,
    },
    playerNumber: {
      type: Number,
      required: true,
    },
    isReady: {
      type: Boolean,
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
      polylines: google.maps.Polyline[];
      summaryTexts: Summary[];
      strokeColors: string[];
      map: google.maps.Map | null;
      room: firebase.database.Reference | null;
      selectedLatLng: google.maps.LatLng | null;
      distance: number;
      isGuessButtonClicked: boolean;
      isMakeGuessButtonClicked: boolean;
      isSelected: boolean;
      isNextStreetViewReady: boolean;
      isNextButtonVisible: boolean;
      isSummaryButtonVisible: boolean;
      dialogSummary: boolean;
    }>({
      markers: [],
      polylines: [],
      summaryTexts: [],
      strokeColors: [
        '#F44336',
        '#76FF03',
        '#FFEB3B',
        '#FF4081',
        '#18FFFF',
      ],
      map: null,
      room: null,
      selectedLatLng: null,
      distance: 0,
      isGuessButtonClicked: false,
      isMakeGuessButtonClicked: false,
      isSelected: false,
      isNextStreetViewReady: false,
      isNextButtonVisible: false,
      isSummaryButtonVisible: false,
      dialogSummary: false,
    })

    const isNextButtonEnabled = computed<boolean>(() => {
      return props.playerNumber === 1 ? true : state.isNextStreetViewReady
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
      state.room!.child('guess/player' + props.playerNumber).set({
          latitude: state.selectedLatLng!.lat(),
          longitude:state.selectedLatLng!.lng()
      })
      google.maps.event.clearListeners(state.map!, 'click')
      state.isGuessButtonClicked = true
      state.isSelected = true
      state.isNextStreetViewReady = false
      mouseOverMap()
    }

    function selectGivenLocation(randomLatLng: google.maps.LatLng): void {
      state.selectedLatLng = randomLatLng
      removeMarkers()
      putMarker(state.selectedLatLng!)
      selectLocation()
    }

    function putMarker(position: google.maps.LatLng): void {
      let marker = new google.maps.Marker({
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
        Math.floor(google.maps.geometry.spherical.computeDistanceBetween(props!.randomLatLng!, state.selectedLatLng!) / 1000)
      state.room!.child('round' + props.round + '/player' + props.playerNumber).set(state.distance)
      context.emit('calculateDistance', state.distance)
    }

    function setInfoWindow(playerName: string, distance: number): void {
      let infoWindow = new google.maps.InfoWindow({
        content: '<b>' + playerName + '</b>' + ' is <b>' + distance + '</b> km away!'
      })
      infoWindow.open(state.map!, state.markers[state.markers.length - 1])
    }

    function drawPolyline(selectedLatLng: google.maps.LatLng, i: number): void {
      let polyline = new google.maps.Polyline({
        path: [selectedLatLng, props!.randomLatLng!],
        strokeColor: state.strokeColors[i],
      })
      polyline.setMap(state.map!)
      state.polylines.push(polyline)
    }

    function removePolylines(): void {
      for (let i = 0; i < state.polylines.length; i++) {
        state.polylines[i].setMap(null)
      }
    }

    function startNextRound(): void {
      state.map!.addListener('click', (e) => {
        removeMarkers()
        putMarker(e.latLng)
        state.selectedLatLng = e.latLng
      })
    }

    function goToNextRound(): void {
      state.selectedLatLng = null
      state.isGuessButtonClicked = false
      state.isSelected = false
      state.isNextButtonVisible = false
      if (viewport.width < 450) {
        hideMap()
      } else {
        mouseOutMap()
      }
      removeMarkers()
      removePolylines()
      context.emit('goToNextRound')
    }

    function finishGame(): void {
      state.dialogSummary = false
      state.room!.child('isGameDone/player' + props.playerNumber).set(true)
      context.emit('finishGame')
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

    onMounted(() => {
      state.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: {lat: 37.869260, lng: -122.254811},
          zoom: 1,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
      })

      state.room = firebase.database().ref(props.roomName)
      state.room!.on('value', (snapshot) => {
        // Check if the room is already removed
        if (snapshot.hasChild('active')) {
          // Allow players to move on to the next round when all players guess locations
          if (snapshot.child('guess').numChildren() === snapshot.child('size').val()) {
            context.emit('showResult')
            // Set markers and draw polylines on the map
            let i = 0
            let j = 1
            snapshot.child('guess').forEach((childSnapshot) => {
              let lat = childSnapshot.child('latitude').val()
              let lng = childSnapshot.child('longitude').val()
              let latLng = new google.maps.LatLng({lat: lat, lng: lng})
              let playerName = snapshot.child('playerName').child(childSnapshot!.key!).val()
              let distance = snapshot.child('round' + props.round + '/player' + j).val()
              drawPolyline(latLng, i)
              putMarker(latLng)
              setInfoWindow(playerName, distance)
              i++
              j++
            })
            putMarker(props!.randomLatLng!)
            // Remove guess node every time the round is done
            state.room!.child('guess').remove()
            if (props.round >= 5) {
              // Show summary button
              snapshot.child('finalScore').forEach((childSnapshot) => {
                let playerName = snapshot.child('playerName').child(childSnapshot!.key!).val()
                let finalScore = childSnapshot.val()
                state.summaryTexts.push({
                  playerName: playerName,
                  finalScore: finalScore,
                })
              })
              state.summaryTexts.sort((a, b) => a.finalScore - b.finalScore)
              state.isSummaryButtonVisible = true
            } else {
              // Show next button
              state.isNextButtonVisible = true
            }
          }
          // Allow other players to move on to the next round when the next street view is set
          if (snapshot.child('streetView').numChildren() == props.round + 1) {
            state.isNextStreetViewReady = true
          }
        }
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