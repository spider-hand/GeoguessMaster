import { DEVICE_TYPES } from "@/constants";
import { DeviceTypes } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDeviceStore = defineStore("device", () => {
  const deviceState = ref<DeviceTypes>(DEVICE_TYPES.MOBLE_PORTRAIT);

  return { deviceState };
});
