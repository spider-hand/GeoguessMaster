<template>
  <div class="page">
    <HeaderGame
      :score="state.scoreHeader"
      :round="state.round"
      :remainingTime="state.remainingTime"
    />
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
        <MapsWithFriends
          ref="mapRef"
          :randomLatLng="state.randomLatLng"
          :roomName="roomName"
          :playerNumber="playerNumber"
          :isReady="state.isReady"
          :round="state.round"
          :score="state.score"
          @calculateDistance="updateScore"
          @showResult="showResult"
          @goToNextRound="goToNextRound"
          @finishGame="finishGame"
        />
      </div>
    </div>
    <v-overlay 
      :value="state.overlay"
      opacity="0.8" 
      z-index="2"
    />
    <DialogMessage 
      :dialogMessage="state.dialogMessage"
      :title="state.dialogTitle"
      :text="state.dialogText" 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, } from '@vue/composition-api'

import firebase from 'firebase/app'
import 'firebase/database'

import HeaderGame from '@/components/widgets/bar/HeaderGame.vue'
import MapsWithFriends from '@/components/MapsWithFriends.vue'
import DialogMessage from '@/components/widgets/dialog/DialogMessage.vue'

declare interface MapRef {
  selectGivenLocation(randomLatLng: google.maps.LatLng): void;
  startNextRound(): void;
  selectedLatLng: google.maps.LatLng | null; 
}

export default defineComponent({
  props: {
    roomName: {
      type: String,
      required: true,
    },
    playerNumber: {
      type: Number,
      required: true,
    },
  },

  components: {
    HeaderGame,
    MapsWithFriends,
    DialogMessage,
  },

  setup(props, context) {
    const state = reactive<{
      panorama: google.maps.StreetViewPanorama | null;
      randomLatLng: google.maps.LatLng | null;
      randomLat: number | null;
      randomLng: number | null;
      score: number;
      scoreHeader: number;
      round: number;
      timeLimitation: number;
      remainingTime: number;
      hasTimerStarted: boolean;
      hasLocationSelected: boolean;
      overlay: boolean;
      room: firebase.database.Reference | null;
      isReady: boolean;
      dialogMessage: boolean;
      dialogTitle: string;
      dialogText: string;    
    }>({
      panorama: null,
      randomLatLng: null,
      randomLat: null,
      randomLng: null,
      score: 0,
      scoreHeader: 0,
      round: 1,
      timeLimitation: 0,
      remainingTime: 0,
      hasTimerStarted: false,
      hasLocationSelected: false,
      overlay: false,
      room: null,
      isReady: false,
      dialogMessage: true,
      dialogTitle: 'Waiting for other players..',
      dialogText: '',
    })

    const mapRef = ref<MapRef | null>(null)

    function loadStreetView(): void {
      const service = new google.maps.StreetViewService()
      service.getPanorama({
        location: getRandomLatLng(),
        preference: google.maps.StreetViewPreference.NEAREST,
        radius: 100000,
        source: google.maps.StreetViewSource.OUTDOOR,
      }, checkStreetView)
    }

    function loadDecidedStreetView(): void {
      const service = new google.maps.StreetViewService()
      service.getPanorama({
        location: {
          lat: state.randomLat!,
          lng: state.randomLng!,
        },
        preference: google.maps.StreetViewPreference.NEAREST,
        radius: 100000,
        source: google.maps.StreetViewSource.OUTDOOR,
      }, checkStreetView)    
    }

    function getRandomLatLng(): google.maps.LatLng {
      const lat = (Math.random() * 170) - 85
      const lng = (Math.random() * 360) - 180
      return new google.maps.LatLng(lat, lng)
    }

    function checkStreetView(
      data: google.maps.StreetViewPanoramaData | null, 
      status: google.maps.StreetViewStatus): void {
      if (status === google.maps.StreetViewStatus.OK) {
        state.panorama = 
          new google.maps.StreetViewPanorama(document.getElementById('street-view') as HTMLElement)
        state.panorama.setOptions({
          zoomControl: false,
          addressControl: false,
          fullscreenControl: false,
          motionTracking: false,
          motionTrackingControl: false,
          showRoadLabels: false,
        })
        state.panorama.setPano(data!.location!.pano!)
        state.panorama.setPov({
          heading: 270,
          pitch: 0,
        })
        // Save the location's latitude and longitude
        state.randomLatLng = data!.location!.latLng! as google.maps.LatLng
        // Put the streetview's location into firebase
        state.room!.child('streetView/round' + state.round).set({
          latitude: state.randomLatLng!.lat(),
          longitude: state.randomLatLng!.lng(),
        })
      } else {
        loadStreetView()
      }
    }

    function startTimer(): void {
      if (!state.hasLocationSelected) {
        if (state.remainingTime > 0) {
          setTimeout(() => {
            state.remainingTime -= 1
            startTimer()
          }, 1000)
        } else {
          // Set a random location if the player didn't select a location in time
          mapRef!.value!.selectGivenLocation(mapRef!.value!.selectedLatLng 
                                              ? mapRef!.value!.selectedLatLng 
                                              : getRandomLatLng()
                                            )
        }
      }
    }

    function updateScore(distance: number): void {
      state.hasLocationSelected = true
      state.score += distance
      state.room!.child('finalScore/player' + props.playerNumber).set(state.score)
      state.dialogTitle = 'Waiting for other players..'
      state.dialogMessage = true
    }

    function showResult(): void {
      state.scoreHeader = state.score
      state.dialogMessage = false
      state.overlay = true
    }

    function goToNextRound(): void {
      // Reset
      state.randomLatLng = null
      state.overlay = false
      state.isReady = false
      state.dialogMessage = true
      state.hasTimerStarted = false
      state.hasLocationSelected = false
      state.round += 1
      if (props.playerNumber === 1) {
        loadStreetView()
      } else {
        state.room!.child('trigger/player' + props.playerNumber).set(state.round)
        mapRef!.value!.startNextRound()
      }
    }

    function exitGame(): void {
      state.dialogTitle = 'Redirecting to home page..'
      state.dialogText = 'You are forced to exit the game. Redirect to home page after 5 seconds..'
      state.dialogMessage = true
      if (state.room !== null) {
        state.room.off()
        state.room.remove()
      }      
      setTimeout(() => {
        context.root.$router.push({ name: 'home' })
      }, 5000)
    }

    function finishGame(): void {
      state.dialogTitle = 'Waiting for other players to finish..'
      state.dialogText = ''
      state.dialogMessage = true
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
      if (props.playerNumber === 1) {
        loadStreetView()
      }

      if (props.roomName === null || props.roomName === undefined) {
        exitGame()
      } else {
        state.room = firebase.database().ref(props.roomName)
        state.room!.child('active').set(true)
        state.room!.on('value', (snapshot) => {
          // Check if the room is already removed
          if (snapshot.hasChild('active')) {
            // Put the player into the current round node if the player is not put yet
            if (!snapshot.child('round' + state.round).hasChild('player' + props.playerNumber)) {
              state.room!.child('round' + state.round).child('player' + props.playerNumber).set(0)
              // Other players load the streetview the first player loaded earlier
              if (props.playerNumber !== 1) {
                state.randomLat = snapshot.child('streetView/round' + state.round + '/latitude').val()
                state.randomLng = snapshot.child('streetView/round' + state.round + '/longitude').val()
                loadDecidedStreetView()
              }
            }
            // Enable guess button when all players are put into the current round's node
            if (snapshot.child('round' + state.round).numChildren() === snapshot.child('size').val()) {
              // Close the dialog when all players get ready
              if (state.isReady === false) {
                state.dialogMessage = false
              }
              state.isReady = true
              mapRef!.value!.startNextRound()
              state.timeLimitation = snapshot.child('timeLimitation').val() * 60
              if (state.timeLimitation !== 0) {
                if (!state.hasTimerStarted) {
                  state.remainingTime = state.timeLimitation
                  startTimer()
                  state.hasTimerStarted = true
                }
              }
            }
            // Delete the room when all players finished the game
            if (snapshot.child('isGameDone').numChildren() === snapshot.child('size').val()) {
              state.room!.child('active').remove()
            }
          } else {
            // Force the players to exit the game when 'Active' node has been removed
            exitGame()
          }
        })
        // Remove the room when the player pressed the back button on browser
        window.addEventListener('popstate', (event) => {
          state.room!.child('active').remove()
          state.room!.off()
        })
        // Remove the room when the player refreshes the window
        window.addEventListener('beforeunload', (event) => {
          state.room!.child('active').remove()
          state.room!.off()
        })
      }
    })

    return {
      state,
      mapRef,
      updateScore,
      goToNextRound,
      showResult,
      finishGame,
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