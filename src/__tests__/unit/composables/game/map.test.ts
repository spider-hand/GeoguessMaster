import { ref } from "vue";
import { describe, expect, test } from "vitest";
import { useMap } from "../../../../composables/game/map";
import * as GoogleMaps from "@googlemaps/js-api-loader";

describe("map", async () => {
  const loader = new GoogleMaps.Loader({
    apiKey: "foo",
    version: "weekly",
  });
  const libraries = await Promise.all([
    loader.importLibrary("maps"),
    loader.importLibrary("marker"),
  ]);
  const { Map, Polyline } = libraries[0];
  const { Marker } = libraries[1];
  const mapRef = ref<HTMLElement>();

  test("putMarker puts a marker", () => {
    const { markers, putMarker } = useMap(Map, Marker, Polyline, mapRef);
    const latLng = new google.maps.LatLng(1, 1);
    putMarker(latLng);

    expect(markers.value.length).toBe(1);
  });

  test("removeMarkers removes markers", () => {
    const { markers, putMarker, removeMarkers } = useMap(
      Map,
      Marker,
      Polyline,
      mapRef
    );
    const latLng = new google.maps.LatLng(1, 1);
    putMarker(latLng);
    putMarker(latLng);

    expect(markers.value.length).toBe(2);

    removeMarkers();

    expect(markers.value.length).toBe(0);
  });

  test("drawPolyline draws a polyline", () => {
    const { polylines, drawPolyline } = useMap(Map, Marker, Polyline, mapRef);
    const from = new google.maps.LatLng(1, 1);
    const to = new google.maps.LatLng(1, 1);
    drawPolyline(from, to);

    expect(polylines.value.length).toBe(1);
  });

  test("removePolyline removes polylines", () => {
    const { polylines, drawPolyline, removePolyline } = useMap(
      Map,
      Marker,
      Polyline,
      mapRef
    );
    const from = new google.maps.LatLng(1, 1);
    const to = new google.maps.LatLng(1, 1);
    drawPolyline(from, to);
    drawPolyline(from, to);

    expect(polylines.value.length).toBe(2);

    removePolyline();

    expect(polylines.value.length).toBe(0);
  });
});
