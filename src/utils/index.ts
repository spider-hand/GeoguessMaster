import { DeviceTypes } from "../constants";

export const getDeviceType = (): number => {
  if (window.matchMedia("(min-width: 1200px)").matches) {
    return DeviceTypes.Laptop;
  } else if (window.matchMedia("(min-width: 992px)").matches) {
    return DeviceTypes.TabletLandscape;
  } else if (window.matchMedia("(min-width: 768px)").matches) {
    return DeviceTypes.TabletPortrait;
  } else if (window.matchMedia("(min-width: 480px)").matches) {
    return DeviceTypes.MobileLandscape;
  } else {
    return DeviceTypes.MobilePortrait;
  }
};
