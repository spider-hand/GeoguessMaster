import { MapTypes, ModeTypes } from "@/types";

export enum DEVICE_TYPES {
  MOBLE_PORTRAIT = 0,
  MOBILE_LANDSCAPE = 1,
  TABLET_PORTRAIT = 2,
  TABLET_LANDSCAPE = 3,
  LAPTOP = 4,
}

export const MAP_OPTIONS: Map<MapTypes, string> = new Map([["world", "World"]]);

export const MODE_OPTIONS: Map<ModeTypes, string> = new Map([
  ["single", "Single Player"],
  ["multiplayer", "With Friends"],
]);
