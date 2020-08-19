<template>
  <div id="game-page">
    <HeaderGame
      ref="header"
      :score="scoreHeader"
      :round="round"
      :remainingTime="remainingTime" />
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
      <MapsWithFriends
        ref="map"
        :randomLatLng="randomLatLng"
        :roomName="roomName"
        :playerNumber="playerNumber"
        :isReady="isReady"
        :round="round"
        :score="score"
        @calculateDistance="updateScore"
        @showResult="showResult"
        @goToNextRound="goToNextRound"
        @finishGame="finishGame" />
    </div>
    <v-overlay 
      :value="overlay"
      opacity="0.8" 
      z-index="2"/>
    <DialogMessage 
      :dialogMessage="dialogMessage"
      :dialogTitle="dialogTitle"
      :dialogText="dialogText" />
  </div>  
</template>

<script lang="ts">
  import Vue, { PropType } from 'vue'

  import firebase from 'firebase/app'
  import 'firebase/database'
  import { TranslateResult } from 'vue-i18n'

  import HeaderGame from '@/components/widgets/bar/HeaderGame.vue'
  import MapsWithFriends from '@/components/MapsWithFriends.vue'
  import DialogMessage from '@/components/widgets/dialog/DialogMessage.vue'

  export type DataType = {
    panorama: google.maps.StreetViewPanorama | null,
    randomLatLng: google.maps.LatLng | null,
    randomLat: number | null,
    randomLng: number | null,
    score: number,
    scoreHeader: number,
    round: number,
    timeLimitation: number,
    remainingTime: number,
    hasTimerStarted: boolean,
    hasLocationSelected: boolean,
    overlay: boolean,
    room: firebase.database.Reference | null,
    isReady: boolean,
    dialogMessage: boolean,
    dialogTitle: TranslateResult,
    dialogText: TranslateResult,
  }

  export default Vue.extend({
    name: 'StreetViewWithFriends',

    props: {
      roomName: String,
      playerNumber: Number,
    },

    components: {
      HeaderGame,
      MapsWithFriends,
      DialogMessage,
    },

    data(): DataType {
      return {
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
        dialogTitle: this.$t('StreetViewWithFriends.waitForOtherPlayers'),
        dialogText: '',
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

      loadDecidedStreetView(): void {
        let service = new google.maps.StreetViewService()
        service.getPanorama({
          location: {
            lat: this.randomLat!,
            lng: this.randomLng!,
          },
          preference: google.maps.StreetViewPreference.NEAREST,
          radius: 100000,
          source: google.maps.StreetViewSource.OUTDOOR,
        }, this.checkStreetView)    
      },

      getRandomLatLng(): google.maps.LatLng {
        let lat = (Math.random() * 170) - 85
        let lng = (Math.random() * 360) - 180
        return new google.maps.LatLng(lat, lng)
      },

      checkStreetView(data: google.maps.StreetViewPanoramaData | null, status: google.maps.StreetViewStatus): void {
        if (status === google.maps.StreetViewStatus.OK) {
          this.panorama = new google.maps.StreetViewPanorama(document.getElementById('street-view') as HTMLElement)
          this.panorama.setOptions({
            zoomControl: false,
            addressControl: false,
            fullscreenControl: false,
            motionTracking: false,
            motionTrackingControl: false,
            showRoadLabels: false,
          })
          this.panorama.setPano(data!.location!.pano!)
          this.panorama.setPov({
            heading: 270,
            pitch: 0,
          })

          // Save the location's latitude and longitude
          this.randomLatLng = data!.location!.latLng! as google.maps.LatLng

          // Put the streetview's location into firebase
          this.room!.child('streetView/round' + this.round).set({
            latitude: this.randomLatLng!.lat(),
            longitude:this.randomLatLng!.lng(),
          })

        } else {
          this.loadStreetView()
        }
      },

      startTimer(): void {
        if (!this.hasLocationSelected) {
          if (this.remainingTime > 0) {
            setTimeout(() => {
              this.remainingTime -= 1
              this.startTimer()
            }, 1000)
          } else {
            // Set a random location if the player didn't select a location in time
            let mapRef = this.$refs.map as any
            mapRef.selectRandomLocation(this.getRandomLatLng())
          }
        }
      },

      updateScore(distance: number): void {
        this.hasLocationSelected = true
        this.score += distance
        this.room!.child('finalScore/player' + this.playerNumber).set(this.score)

        this.dialogTitle = this.$t('StreetViewWithFriends.waitForOtherPlayers') as TranslateResult
        this.dialogMessage = true
      },

      showResult(): void {
        this.scoreHeader = this.score
        this.dialogMessage = false
        this.overlay = true
      },

      goToNextRound(): void {
        // Reset
        this.randomLatLng = null
        this.overlay = false
        this.isReady = false
        this.dialogMessage = true
        this.hasTimerStarted = false
        this.hasLocationSelected = false
        this.round += 1

        if (this.playerNumber === 1) {
          this.loadStreetView()
        } else {
          this.room!.child('trigger/player' + this.playerNumber).set(this.round)
          let mapRef = this.$refs.map as any
          mapRef.startNextRound()
        }
      },

      exitGame(): void {
        this.dialogTitle = this.$t('StreetViewWithFriends.redirectToHomePage') as TranslateResult
        this.dialogText = this.$t('StreetViewWithFriends.exitGame') as TranslateResult
        this.dialogMessage = true

        if (this.room !== null) {
          this.room.off()
          this.room.remove()
        }      
        setTimeout(() => {
          this.$router.push({ name: 'home' })
        }, 5000)
      },

      finishGame(): void {
        this.dialogTitle = this.$t('StreetViewWithFriends.waitForOtherPlayersToFinish') as TranslateResult
        this.dialogText = ''
        this.dialogMessage = true
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
      },
    },

    mounted(): void {
      if (this.playerNumber === 1) {
        this.loadStreetView()
      }

      // Set a default room name if it's null to check if the user refresh the page
      if (this.roomName === null || this.roomName === undefined) {
        this.exitGame()
      } else {
        this.room = firebase.database().ref(this.roomName)
        this.room!.child('active').set(true)
        this.room!.on('value', (snapshot) => {
          // Check if the room is already removed
          if (snapshot.hasChild('active')) {

            // Put the player into the current round node if the player is not put yet
            if (!snapshot.child('round' + this.round).hasChild('player' + this.playerNumber)) {

              this.room!.child('round' + this.round).child('player' + this.playerNumber).set(0)

              // Other players load the streetview the first player loaded earlier
              if (this.playerNumber !== 1) {
                this.randomLat = snapshot.child('streetView/round' + this.round + '/latitude').val()
                this.randomLng = snapshot.child('streetView/round' + this.round + '/longitude').val()

                this.loadDecidedStreetView()
              }
            }

            // Enable guess button when all players are put into the current round's node
            if (snapshot.child('round' + this.round).numChildren() === snapshot.child('size').val()) {
              // Close the dialog when all players get ready
              if (this.isReady === false) {
                this.dialogMessage = false
              }

              this.isReady = true
              let mapRef = this.$refs.map as any
              mapRef.startNextRound()
              this.timeLimitation = snapshot.child('timeLimitation').val() * 60

              if (this.timeLimitation !== 0) {
                if (!this.hasTimerStarted) {
                  this.remainingTime = this.timeLimitation
                  this.startTimer()
                  this.hasTimerStarted = true
                }
              }
            }

            // Delete the room when all players finished the game
            if (snapshot.child('isGameDone').numChildren() === snapshot.child('size').val()) {
              this.room!.child('active').remove()
            }
          } else {
            // Force the players to exit the game when 'Active' node has been removed
            this.exitGame()
          }
        })

        // Remove the room when the player pressed the back button on browser
        window.addEventListener('popstate', (event) => {
          this.room!.child('active').remove()
          this.room!.off()
        })

        // Remove the room when the player refreshes the window
        window.addEventListener('beforeunload', (event) => {
          this.room!.child('active').remove()
          this.room!.off()
        })
      }
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