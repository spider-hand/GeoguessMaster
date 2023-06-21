import { DEVICE_TYPES } from "@/constants";
import { DeviceTypes } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDeviceStore = defineStore("device", () => {
  const defaultState = DEVICE_TYPES.MOBLE_PORTRAIT;
  const deviceState = ref<DeviceTypes>(defaultState);

  const saveDeviceType = (val: DeviceTypes) => {
    deviceState.value = val;
  };

  return { deviceState, saveDeviceType };
});
