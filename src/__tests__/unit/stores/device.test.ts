import { DEVICE_TYPES } from "@/constants";
import { useDeviceStore } from "@/stores/device";
import { createPinia, setActivePinia } from "pinia";

describe("Device Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("setDeviceType", () => {
    const device = useDeviceStore();
    expect(device.deviceState).toBe(DEVICE_TYPES.MOBLE_PORTRAIT);
    device.saveDeviceType(DEVICE_TYPES.LAPTOP);
    expect(device.deviceState).toBe(DEVICE_TYPES.LAPTOP);
  });
});
