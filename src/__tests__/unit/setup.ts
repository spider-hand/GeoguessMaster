import { vi } from "vitest";

global.google = {
  maps: {
    Map: vi.fn().mockImplementation(() => {
      return {};
    }),
    Marker: vi.fn().mockImplementation(() => {
      return {
        setMap: vi.fn(),
      };
    }),
    LatLng: vi.fn().mockImplementation(() => {
      return {};
    }),
    StreetViewService: vi.fn().mockImplementation(() => {
      return {
        getPanorama: vi.fn().mockReturnValue({
          data: {
            location: {
              latLng: {
                lat: vi.fn().mockReturnValue(1),
                lng: vi.fn().mockReturnValue(1),
              },
            },
          },
        }),
      };
    }),
    StreetViewPanorama: vi.fn().mockImplementation(() => {
      return {
        setOption: vi.fn(),
        setPano: vi.fn(),
        setPov: vi.fn(),
      };
    }),
    StreetViewPreference: {
      NEAREST: vi.fn(),
    },
    StreetViewSource: {
      OUTDOOR: vi.fn(),
    },
  } as any,
};
