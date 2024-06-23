import { DeviceTypes } from "@/types";
import { DEVICE_TYPES } from "../constants";

export const getDeviceType = (): DeviceTypes => {
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

export const getRandomLatLng = (): google.maps.LatLng => {
  const lat = Math.random() * 170 - 85;
  const lng = Math.random() * 360 - 180;
  return new google.maps.LatLng(lat, lng);
};

// @see https://stackoverflow.com/a/71135980/11043317
export const getIconUrl = (icon: string) => {
  return new URL(
    `/src/assets/images/material-symbols/${icon}.svg`,
    import.meta.url
  ).href;
};

// @see https://stackoverflow.com/a/16348977/14269655
export const stringToColour = (str: string) => {
  let hash = 0;
  str.split("").forEach(char => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
}
