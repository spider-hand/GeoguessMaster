<template>
  <v-dialog 
    v-model="dialogRoom"
    max-width="600"
    persistent>
    <component 
      :is="state.currentComponent"
      :errorMessage="state.errorMessage"
      @searchRoom="searchRoom"
      @setRoomSize="setRoomSize"
      @setTimeLimitation="setTimeLimitation"
      @setPlayerName="setPlayerName"
      @cancel="cancel" 
    />
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, } from '@vue/composition-api'

import firebase from 'firebase/app'
import 'firebase/database'

import CardRoomName from '@/components/widgets/card/CardRoomName.vue'
import CardRoomSize from '@/components/widgets/card/CardRoomSize.vue'
import CardRoomTime from '@/components/widgets/card/CardRoomTime.vue'
import CardRoomPlayerName from '@/components/widgets/card/CardRoomPlayerName.vue'

export default defineComponent({
  props: {
    dialogRoom: {
      type: Boolean,
      required: true,
    }
  },

  components: {
    'roomName': CardRoomName,
    'roomSize': CardRoomSize,
    'timeLimitation': CardRoomTime,
    'playerName': CardRoomPlayerName,
  },

  setup(props, context) {

    const state = reactive<{
      errorMessage: string;
      room: firebase.database.Reference | null;
      roomName: string;
      currentComponent: string;
      playerNumber: number;
    }>({
      errorMessage: '',
      room: null,
      roomName: '',
      currentComponent: 'roomName',
      playerNumber: 0,
    })

    function searchRoom(roomName: string): void {
      if (roomName === '') {
        state.errorMessage = 'Invalid room name. Please try another one.'
      } else {
        state.room = firebase.database().ref(roomName)
        state.roomName = roomName
        state.room!.once('value', (snapshot) => {
          let numberOfPlayers = snapshot.child('playerName').numChildren()
          state.playerNumber = numberOfPlayers + 1
          if (numberOfPlayers === 0) {
            state.room!.child('playerName').update({
                player1: 'player1',
              }, (error) => {
                if (!error) {
                  state.room!.update({
                    createdAt: firebase.database.ServerValue.TIMESTAMP,
                  })
                  state.currentComponent = 'roomSize'
                }
            })
          } else if (!snapshot.hasChild('size') || !snapshot.hasChild('streetView')) {
            state.errorMessage = 'The first player is creating the room right now. Please wait and try again.'
          } else if (numberOfPlayers >= snapshot.child('size').val()) {
            state.errorMessage = 'This room is already full.'
          } else {
            state.room!.child('playerName/player' + state.playerNumber)
              .set('player' + state.playerNumber, 
                (error) => {
                  if (!error) {
                    state.currentComponent = 'playerName'
                  }
                })            
          }
        })
      }
    }

    function setRoomSize(roomSize: number): void {
      state.room!.update({
        size: roomSize
      }, (error) => {
        if (!error) {
          state.currentComponent = 'timeLimitation'
        }
      })
    }

    function setTimeLimitation(timeLimitation: number): void {
      state.room!.update({
        timeLimitation: timeLimitation
      }, (error) => {
        if (!error) {
          state.currentComponent = 'playerName'
        }
      })
    }

    function setPlayerName(playerName: string): void {
      state.room!.child('playerName/player' + state.playerNumber).set(playerName, 
        (error) => {
          if (!error) {
            context.root.$router.push({
              name: 'with-friends',
              params: { 
                roomName: state.roomName, 
                playerNumber: String(state.playerNumber), 
              }
            })
          }
      })
    }

    function cancel(): void {
      state.currentComponent = 'roomName'
      state.roomName = ''
      state.errorMessage = ''
      context.emit('closeDialog')
      // state.dialogRoom = false
      if (state.room !== null) {
        if (state.playerNumber === 1) {
          // Remove the entire node if the player is the first player
          state.room!.remove()
        } else {
          // Remove only the player's name node if the player isn't the first player
          state.room!.child('playerName/player' + state.playerNumber).remove()
        }
      }
    }    

    return {
      state,
      searchRoom,
      setRoomSize,
      setTimeLimitation,
      setPlayerName,
      cancel,
    }
  }
})
</script>