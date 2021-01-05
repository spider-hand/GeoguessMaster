<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, provide, } from '@vue/composition-api'

import { Viewport } from '@/types/index'

export default defineComponent({

  setup() {
    function updateSizes(obj: any = {}): Viewport {
      obj.width = window.innerWidth
      obj.height = window.innerHeight
      return obj
    }

    provide('viewport', updateSizes())
  }
})
</script>

<style>

</style>
