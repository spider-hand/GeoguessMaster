import { ref } from "vue";
import { describe, expect, test, vi } from "vitest";
import { useMap } from "../../../../composables/game/map";
import * as GoogleMaps from "@googlemaps/js-api-loader";

vi.spyOn(GoogleMaps, "Loader").mockImplementation(() => {
  return {
    importLibrary: () =>
      vi.fn().mockResolvedValue(() => {
        return {
          Map: vi.fn(),
        };
      }),
  } as any;
});

describe("map", async () => {
  const loader = new GoogleMaps.Loader({
    apiKey: "",
    version: "weekly",
  });
  const { Map } = await loader.importLibrary("maps");
  const mapRef = ref<HTMLElement>();

  test("putMarker puts a marker", () => {
    const { markers, putMarker } = useMap(Map, mapRef);
    const latLng = new google.maps.LatLng(1, 1);
    putMarker(latLng);

    expect(markers.value.length).toBe(1);
  });

  test("removeMarkers removes markers", () => {
    const { markers, putMarker, removeMarkers } = useMap(Map, mapRef);
    const latLng = new google.maps.LatLng(1, 1);
    putMarker(latLng);
    putMarker(latLng);

    expect(markers.value.length).toBe(2);

    removeMarkers();

    expect(markers.value.length).toBe(0);
  });

  test("drawPolyline draws a polyline", () => {
    const { polylines, drawPolyline } = useMap(Map, mapRef);
    const from = new google.maps.LatLng(1, 1);
    const to = new google.maps.LatLng(1, 1);
    drawPolyline(from, to);

    expect(polylines.value.length).toBe(1);
  });

  test("removePolyline removes polylines", () => {
    const { polylines, drawPolyline, removePolyline } = useMap(Map, mapRef);
    const from = new google.maps.LatLng(1, 1);
    const to = new google.maps.LatLng(1, 1);
    drawPolyline(from, to);
    drawPolyline(from, to);

    expect(polylines.value.length).toBe(2);

    removePolyline();

    expect(polylines.value.length).toBe(0);
  });
});
