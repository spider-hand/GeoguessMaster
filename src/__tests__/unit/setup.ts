import { vi } from "vitest";

global.google = {
  maps: {
    Map: vi.fn().mockImplementation(() => {
      return {};
    }),
    Marker: vi.fn().mockImplementation(() => {
      return {};
    }),
    Polyline: vi.fn().mockImplementation(() => {
      return {};
    }),
    LatLng: vi.fn().mockImplementation(() => {
      return {};
    }),
  } as any,
};
