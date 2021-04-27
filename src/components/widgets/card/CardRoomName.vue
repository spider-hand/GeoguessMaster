<template>
  <v-card color="#FAFAFA">
    <v-card-text id="card-text-wrapper">
      <v-container>
        <v-row justify="center">
          <img 
            src="@/assets/illustration_1.png"
            width="108" 
          />
        </v-row>
        <v-row 
          class="mt-8"
          justify="center">
          <span>Input your room name.</span>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              maxlength="10"
              autofocus
              :error-messages="errorMessage"
              v-model="state.roomName"
            />
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
        @click="searchRoom">
        NEXT
      </v-btn>
      <v-btn
        dark
        depressed
        color="#FF5D5D"
        @click="cancel">
        CANCEL
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, } from '@vue/composition-api'

export default defineComponent({
  
  props: {
    errorMessage: {
      type: String,
      required: true,
    }
  },

  setup(props, context) {
    const state = reactive<{
      roomName: string;
    }>({
      roomName: '',
    })

    function searchRoom(): void {
      context.emit('searchRoom', state.roomName)
    }

    function cancel(): void {
      context.emit('cancel')
    }

    return {
      state,
      searchRoom,
      cancel,
    }
  }
})
</script>

<style scoped>
span {
  color: rgba(0, 0, 0, .87);
  font-size: 20px;
  font-weight: 500;
}

#card-text-wrapper {
  padding: 15px 10% 40px 10%;
}
</style>