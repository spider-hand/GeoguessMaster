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
      @click="hideMap"
      >
      <v-icon color="white">mdi-close</v-icon>
    </v-btn>
    <button
      id="make-guess-button"
      v-if="$viewport.width < 450 && !isGuessButtonClicked && !isMakeGuessButtonClicked"
      @click="showMap"
      >{{ $t('MapsWithFriends.makeGuess') }}
    </button>
    <button
      id="guess-button"
      :disabled="selectedLatLng == null || isGuessButtonClicked || !isReady"
      v-if="!isNextButtonVisible && !isSummaryButtonVisible && ($viewport.width > 450 || isMakeGuessButtonClicked)"
      @click="selectLocation"
      >{{ $t('MapsWithFriends.guess') }}
    </button>
    <button
      id="next-button"
      :disabled="!isNextButtonEnabled"
      :style="{ backgroundColor: isNextButtonEnabled ? '#F44336' : '#B71C1C' }"
      v-if="isNextButtonVisible"
      @click="goToNextRound"
      > {{ $t('MapsWithFriends.nextRound') }}
    </button>
    <button
      id="summary-button"
      v-if="isSummaryButtonVisible"
      @click="dialogSummary = true"
      > {{ $t('MapsWithFriends.viewSummary') }}
    </button>
    <DialogSummaryWithFriends
      :dialogSummary="dialogSummary"
      :summaryTexts="summaryTexts"
      :score="score"
      @finishGame="finishGame" />
  </div>  
</template>

<script lang="ts">
  import Vue, { PropType } from 'vue'

  import firebase from 'firebase/app'
  import 'firebase/database'
  
  import DialogSummaryWithFriends from '@/components/widgets/dialog/DialogSummaryWithFriends.vue'

  declare interface Summary {
    playerName: string,
    finalScore: number,
  }

  export type DataType = {
    markers: google.maps.Marker[],
    polylines: google.maps.Polyline[],
    summaryTexts: Summary[],
    strokeColors: string[],
    map: google.maps.Map | null,
    room: firebase.database.Reference | null,
    selectedLatLng: google.maps.LatLng | null,
    distance: number,
    isGuessButtonClicked: boolean,
    isMakeGuessButtonClicked: boolean,
    isSelected: boolean,
    isNextStreetViewReady: boolean,
    isNextButtonVisible: boolean,
    isSummaryButtonVisible: boolean,
    dialogSummary: boolean,
  }

  export default Vue.extend({
    name: 'MapsWithFriends',

    props: {
      randomLatLng: Object as PropType<google.maps.LatLng>,
      roomName: String,
      playerNumber: Number,
      isReady: Boolean,
      round: Number,
      score: Number,
    },

    components: {
      DialogSummaryWithFriends,
    },

    data(): DataType {
      return {
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
      }
    },

    computed: {
      isNextButtonEnabled(): boolean {
        if (this.playerNumber === 1) {
          return true
        } else {
          return this.isNextStreetViewReady === true
        }
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

        this.room!.child('guess/player' + this.playerNumber).set({
            latitude: this.selectedLatLng!.lat(),
            longitude:this.selectedLatLng!.lng()
        })

        google.maps.event.clearListeners(this.map!, 'click')

        this.isGuessButtonClicked = true
        this.isSelected = true
        this.isNextStreetViewReady = false

        this.mouseOverMap()
      },

      selectRandomLocation(randomLatLng: google.maps.LatLng): void {
        this.selectedLatLng = randomLatLng
        this.removeMarkers()
        this.putMarker(this.selectedLatLng!)
        this.selectLocation()
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
        this.distance = 
          Math.floor(google.maps.geometry.spherical.computeDistanceBetween(this.randomLatLng, this.selectedLatLng!) / 1000)

        this.room!.child('round' + this.round + '/player' + this.playerNumber).set(this.distance)

        this.$emit('calculateDistance', this.distance)
      },

      setInfoWindow(playerName: string, distance: number): void {
        let infoWindow = new google.maps.InfoWindow({
          content: '<b>' + playerName + '</b>' + ' is <b>' + distance + '</b> km away!'
        })
        infoWindow.open(this.map!, this.markers[this.markers.length - 1])
      },

      drawPolyline(selectedLatLng: google.maps.LatLng, i: number): void {
        let polyline = new google.maps.Polyline({
          path: [selectedLatLng, this.randomLatLng],
          strokeColor: this.strokeColors[i],
        })
        polyline.setMap(this.map!)
        this.polylines.push(polyline)
      },

      removePolylines(): void {
        for (let i in this.polylines) {
          this.polylines[i].setMap(null)
        }
      },

      startNextRound(): void {
        this.map!.addListener('click', (e) => {
          this.removeMarkers()
          this.putMarker(e.latLng)
          this.selectedLatLng = e.latLng
        })
      },

      goToNextRound(): void {
        this.selectedLatLng = null
        this.isGuessButtonClicked = false
        this.isSelected = false
        this.isNextButtonVisible = false

        if (this.$viewport.width < 450) {
          this.hideMap()
        } else {
          this.mouseOutMap()
        }

        this.removeMarkers()
        this.removePolylines()

        this.$emit('goToNextRound')
      },

      finishGame(): void {
        this.dialogSummary = false
        this.room!.child('isGameDone/player' + this.playerNumber).set(true)
        this.$emit('finishGame')
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

    mounted(): void {
      this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: {lat: 37.869260, lng: -122.254811},
          zoom: 1,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
      })

      this.room = firebase.database().ref(this.roomName)
      this.room!.on('value', (snapshot) => {
        // Check if the room is already removed
        if (snapshot.hasChild('active')) {

          // Allow players to move on to the next round when all players guess locations
          if (snapshot.child('guess').numChildren() === snapshot.child('size').val()) {
            this.$emit('showResult')

            // Set markers and draw polylines on the map
            var i = 0
            var j = 1
            snapshot.child('guess').forEach((childSnapshot) => {
              let lat = childSnapshot.child('latitude').val()
              let lng = childSnapshot.child('longitude').val()
              let latLng = new google.maps.LatLng({lat: lat, lng: lng});

              let playerName = snapshot.child('playerName').child(childSnapshot!.key!).val()
              let distance = snapshot.child('round' + this.round + '/player' + j).val()

              this.drawPolyline(latLng, i)
              this.putMarker(latLng)
              this.setInfoWindow(playerName, distance)
              i++
              j++
            })
            this.putMarker(this.randomLatLng)

            // Remove guess node every time the round is done
            this.room!.child('guess').remove()

            if (this.round >= 5) {
              // Show summary button
              snapshot.child('finalScore').forEach((childSnapshot) => {
                let playerName = snapshot.child('playerName').child(childSnapshot!.key!).val()
                let finalScore = childSnapshot.val()
                this.summaryTexts.push({
                  playerName: playerName,
                  finalScore: finalScore,
                })
              })

              this.isSummaryButtonVisible = true

            } else {
              // Show next button
              this.isNextButtonVisible = true
            }
          }

          // Allow other players to move on to the next round when the next street view is set
          if (snapshot.child('streetView').numChildren() == this.round + 1) {
            this.isNextStreetViewReady = true
          }
        }
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

  #summary-button {
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