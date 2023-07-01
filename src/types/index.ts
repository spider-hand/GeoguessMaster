export type MapTypes = "world";

export type ModeTypes = "single" | "multiplayer";

export type MobilePortraint = 0;
export type MobileLandscape = 1;
export type TabletPortrait = 2;
export type TabletLandscape = 3;
export type Laptop = 4;
export type DeviceTypes =
  | MobilePortraint
  | MobileLandscape
  | TabletPortrait
  | TabletLandscape
  | Laptop;

export interface GameHistory {
  randomLatLng: google.maps.LatLng;
  selectedLatLng: google.maps.LatLng;
}

export interface Summary {
  playerName: string;
  score: number;
}

export interface DistanceByPlayer {
  playerName: string;
  distance: number;
}
