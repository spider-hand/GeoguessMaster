export type MapTypes = "world";

export type ModeTypes = "single" | "multiplayer";

export type GameHistory = {
  randomLatLng: google.maps.LatLng;
  selectedLatLng: google.maps.LatLng;
};

export type Summary = {
  playerName: string;
  score: number;
};

export type DistanceByPlayer = {
  playerName: string;
  distance: number;
};
