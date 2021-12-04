<template>
  <div class="create-room-dialog" v-if="isShowingDialog">
    <div class="form-container">
      <div>
        <span class="form-title">Size</span>
        <br />
        <span class="form-helper-text">2-5 people</span>
      </div>
      <Counter
        :min="2"
        :max="5"
        :count="store.state.selectedSize"
        @onChangeValue="onChangeSize"
      />
    </div>
    <div class="form-container">
      <div>
        <span class="form-title">Time per round</span>
        <br />
        <span class="form-helper-text">1-10 minutes</span>
      </div>
      <Counter
        :min="1"
        :max="10"
        :count="store.state.selectedTime"
        @onChangeValue="onChangeTime"
      />
    </div>
    <div class="form-container">
      <TextInput
        label="Player Name"
        name="player-name"
        placeholder="Your Player Name"
        :inputValue="store.state.playerName"
        @onChangeValue="onChangePlayerName"
      />
    </div>
    <div class="form-container">
      <span class="form-title">Are you an owner?</span>
      <Switch :ans="store.state.isOwner" @onChangeValue="onChangeIsOwner" />
    </div>
    <div class="form-container">
      <TextInput
        label="Room Number"
        name="room-number"
        placeholder="Room Number"
        :inputValue="store.state.roomNumber"
        @onChangeValue="onChangeRoomNumber"
        :disabled="store.state.isOwner"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useStore } from "vuex";

import { key } from "@/store";
import Counter from "@/components/Counter.vue";
import Switch from "@/components/Switch.vue";
import TextInput from "@/components/TextInput.vue";

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
    TextInput,
  },

  setup() {
    const store = useStore(key);

    const onChangeSize = (newVal: number): void => {
      store.dispatch("changeSelectedSizeAction", {
        selectedSize: newVal,
      });
    };

    const onChangeTime = (newVal: number): void => {
      store.dispatch("changeSelectedTimeAction", {
        selectedTime: newVal,
      });
    };

    const onChangePlayerName = (newVal: string): void => {
      store.dispatch("changePlayerNameAction", {
        playerName: newVal,
      });
    };

    const onChangeIsOwner = (): void => {
      store.dispatch("switchIsOwnerAction");
    };

    const onChangeRoomNumber = (newVal: string): void => {
      store.dispatch("changeRoomNumberAction", {
        roomNumber: newVal,
      });
    };

    return {
      store,
      onChangeSize,
      onChangeTime,
      onChangePlayerName,
      onChangeIsOwner,
      onChangeRoomNumber,
    };
  },
});
</script>

<style scoped>
.create-room-dialog {
  position: absolute;
  bottom: -401px;
  right: 0;
  width: 320px;
  height: 385px;
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
</style>
