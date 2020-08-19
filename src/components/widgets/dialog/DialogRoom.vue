<template>
  <v-dialog 
    persistent
    :fullscreen="$viewport.width < 450"
    v-model="dialogRoom"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn
        id="multiplayer-button"
        class="ml-8 mr-8"
        dark
        color="#43B581"
        v-on="on">
        {{ $t('DialogRoom.withFriends')}}
      </v-btn>
    </template>
    <component 
      :is="currentComponent"
      :errorMessage="errorMessage"
      @searchRoom="searchRoom"
      @setRoomSize="setRoomSize"
      @setTimeLimitation="setTimeLimitation"
      @setPlayerName="setPlayerName"
      @cancel="cancel" />
  </v-dialog>
</template>

<script lang="ts">
  import Vue from 'vue'

  import firebase from 'firebase/app'
  import 'firebase/database'
  import { TranslateResult } from 'vue-i18n'

  import CardRoomName from '@/components/widgets/card/CardRoomName.vue'
  import CardRoomSize from '@/components/widgets/card/CardRoomSize.vue'
  import CardRoomTime from '@/components/widgets/card/CardRoomTime.vue'
  import CardRoomPlayerName from '@/components/widgets/card/CardRoomPlayerName.vue'

  export type DataType = {
      dialogRoom: boolean,
      errorMessage: TranslateResult,
      room: firebase.database.Reference | null,
      roomName: string,
      currentComponent: string,
      playerNumber: number,
  }

  export default Vue.extend({
    name: 'DialogRoom',

    data(): DataType {
      return {
        dialogRoom: false,
        errorMessage: '', 
        room: null,
        roomName: '',
        currentComponent: 'roomName',
        playerNumber: 0,
      }
    },

    components: {
      'roomName': CardRoomName,
      'roomSize': CardRoomSize,
      'timeLimitation': CardRoomTime,
      'playerName': CardRoomPlayerName,
    },

    methods: {
      searchRoom(roomName: string): void {
        if (roomName === '') {
          this.errorMessage = this.$t('DialogRoom.invalidRoomName') as TranslateResult
        } else {
          this.room = firebase.database().ref(roomName)
          this.roomName = roomName

          this.room!.once('value', (snapshot) => {
            let numberOfPlayers = snapshot.child('playerName').numChildren()
            this.playerNumber = numberOfPlayers + 1

            if (numberOfPlayers === 0) {
              this.room!.child('playerName').update({
                player1: 'player1',
              }, (error) => {
                if (!error) {
                  this.room!.update({
                    createdAt: firebase.database.ServerValue.TIMESTAMP,
                  })
                  this.currentComponent = 'roomSize'
                }
              })
            } else if (!snapshot.hasChild('size') || !snapshot.hasChild('streetView')) {
              this.errorMessage = this.$t('DialogRoom.inProgress')
            } else if (numberOfPlayers >= snapshot.child('size').val()) {
              this.errorMessage = this.$t('DialogRoom.roomIsFull')
            } else {
              this.room!.child('playerName/player' + this.playerNumber).set('player' + this.playerNumber, (error) => {
                if (!error) {
                  this.currentComponent = 'playerName'
                }
              })            
            }
          })
        }
      },

      setRoomSize(roomSize: number): void {
        this.room!.update({
          size: roomSize
        }, (error) => {
          if (!error) {
            this.currentComponent = 'timeLimitation'
          }
        })
      },

      setTimeLimitation(timeLimitation: number): void {
        this.room!.update({
          timeLimitation: timeLimitation
        }, (error) => {
          if (!error) {
            this.currentComponent = 'playerName'
          }
        })
      },

      setPlayerName(playerName: string): void {
        this.room!.child('playerName/player' + this.playerNumber).set(playerName, (error) => {
          if (!error) {
            // Start the game
            this.$router.push({
              name: 'with-friends',
              params: { 
                roomName: this.roomName, 
                playerNumber: String(this.playerNumber), 
              }
            })
          }
        })
      },

      cancel(): void {
        this.currentComponent = 'roomName'
        this.roomName = ''
        this.errorMessage = ''

        this.dialogRoom = false
        if (this.room !== null) {
          if (this.playerNumber === 1) {
            // Remove the entire node if the player is the first player
            this.room!.remove()
          } else {
            // Remove only the player's name node if the player isn't the first player
            this.room!.child('playerName/player' + this.playerNumber).remove()
          }
        }
      }
    }
  })
</script>

<style scoped>
  #multiplayer-button {
    height: 44px;
    width: 240px;
    border-radius: 40px;
  } 
</style>