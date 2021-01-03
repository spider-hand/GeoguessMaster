<template>
  <v-card color="#E1F5FE">
    <v-card-title>
      <span>Input your room size.</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="4">
            <v-select 
              v-model="state.roomSize"
              :items="state.roomSizeItems"></v-select>
          </v-col>        
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn
        dark
        depressed
        color="#43B581"
        @click="setRoomSize">NEXT</v-btn>
      <v-btn
        dark
        depressed
        color="#FF5252"
        @click="cancel">CANCEL</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, } from '@vue/composition-api'

declare interface RoomSizeItem {
  text: string;
  value: number;
}

export default defineComponent({
  
  setup(props, context) {

    const state = reactive<{
      roomSize: number;
      roomSizeItems: RoomSizeItem[],
    }>({
      roomSize: 2,
      roomSizeItems: [
        {
          text: '2',
          value: 2,
        },
        {
          text: '3',
          value: 3,
        },
        {
          text: '4',
          value: 4,
        },
        {
          text: '5',
          value: 5,
        },              
      ]
    })

    function setRoomSize(): void {
      context.emit('setRoomSize', state.roomSize)
    }

    function cancel(): void {
      context.emit('cancel')
    }

    return {
      state,
      setRoomSize,
      cancel,
    }
  }
})
</script>

<style scoped>

</style>