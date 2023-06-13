import { DEVICE_TYPES } from "../constants";

export const getDeviceType = (): number => {
  if (window.matchMedia("(min-width: 1200px)").matches) {
    return DEVICE_TYPES.LAPTOP;
  } else if (window.matchMedia("(min-width: 992px)").matches) {
    return DEVICE_TYPES.TABLET_LANDSCAPE;
  } else if (window.matchMedia("(min-width: 768px)").matches) {
    return DEVICE_TYPES.TABLET_PORTRAIT;
  } else if (window.matchMedia("(min-width: 480px)").matches) {
    return DEVICE_TYPES.MOBILE_LANDSCAPE;
  } else {
    return DEVICE_TYPES.MOBLE_PORTRAIT;
  }
};
