<template>
  <div class="create-room-dialog" v-if="isShowingDialog">
    <div class="form-container">
      <div>
        <span class="form-title">Size</span>
        <br />
        <span class="form-helper-text">2-5 people</span>
      </div>
      <Counter :min="2" :max="5" />
    </div>
    <div class="form-container">
      <div>
        <span class="form-title">Time per round</span>
        <br />
        <span class="form-helper-text">1-10 minutes</span>
      </div>
      <Counter :min="1" :max="10" />
    </div>
    <div class="form-container">
      <div class="input-wrapper">
        <label for="player-name" class="input-label">Player Name</label>
        <input
          type="text"
          name="player-name"
          class="player-name-input"
          placeholder="Your Player Name"
        />
      </div>
    </div>
    <div class="form-container">
      <span class="form-title">Are you an owner?</span>
      <Switch />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Counter from "@/components/Counter.vue";
import Switch from "@/components/Switch.vue";

export default defineComponent({
  props: {
    isShowingDialog: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  components: {
    Counter,
    Switch,
  },
});
</script>

<style scoped>
.create-room-dialog {
  position: absolute;
  bottom: -324px;
  right: 0;
  width: 320px;
  height: 308px;
  padding: 0 32px;
  background: #ffffff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.form-container {
  width: 100%;
  height: 60px;
  padding: 8px 16px;
  flex-direction: row;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dcdcdc;
}

.form-title {
  font-family: "Roboto medium";
  font-size: 16px;
  color: #3c3c3c;
}

.form-helper-text {
  font-family: "Roboto medium";
  font-size: 12px;
  color: #5f5f5f;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
}

.input-label {
  margin-bottom: 4px;
  font-family: "Roboto medium";
  font-size: 10px;
  color: #5f5f5f;
}

.player-name-input {
  border: none;
  border-bottom: 1px solid #dcdcdc;
  font-family: "Roboto";
  font-size: 16px;
}

.player-name-input:focus-visible {
  box-shadow: none;
  outline: 0;
}
</style>
