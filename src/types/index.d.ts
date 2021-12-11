import { Store } from "vuex";

export type SelectboxOption = {
  text: string;
  value: string;
};

export type GameHistory = {
  randomLatLng: google.maps.LatLng;
  selectedLatLng: google.maps.LatLng;
};
