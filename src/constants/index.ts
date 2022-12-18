import { SelectboxOption } from "@/types";

export enum DeviceTypes {
  MobilePortrait = 0,
  MobileLandscape = 1,
  TabletPortrait = 2,
  TabletLandscape = 3,
  Laptop = 4,
}

export const MAP_OPTIONS: SelectboxOption[] = [
  {
    text: "World",
    value: "WORLD",
  },
  {
    text: "Japan",
    value: "JPN",
  },
];

export const MODE_OPTIONS: SelectboxOption[] = [
  {
    text: "Single Player",
    value: "single",
  },
  {
    text: "With Friends",
    value: "multiplayer",
  },
];
