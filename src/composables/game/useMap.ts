import { Ref, onMounted, shallowRef } from "vue";

export const useMap = (mapRef: Ref<HTMLElement | undefined>) => {
  const map = shallowRef<google.maps.Map>();
  const markers = shallowRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const polylines = shallowRef<google.maps.Polyline[]>([]);

  const removeMarkers = (): void => {
    markers.value.forEach((marker) => {
      marker.map = null;
    });
    markers.value.splice(0);
  };

  const putMarker = (position: google.maps.LatLng, type: "actual" | "guess" | "otherPlayer", colour: string): void => {
    const span = document.createElement("span");
    span.style.fontFamily = "'Material Icons'";
    span.style.fontSize = "18px";
    span.innerHTML = type == "actual" ? "\ue153" : (type == "guess" ? "\ue837" : "\ue853");
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: position,
      map: map.value,
      content: new google.maps.marker.PinElement({
        glyph: span,
        glyphColor: "#ffffff",
        background: colour,
        borderColor: colour
      }).element
    });
    markers.value.push(marker);
  };

  const drawPolyline = (
    from: google.maps.LatLng,
    to: google.maps.LatLng,
    strokeColor: string
  ): void => {
    const polyline = new google.maps.Polyline({
      path: [from, to],
      strokeColor,
      strokeOpacity: 0,
      icons: [
        {
          icon: {
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            scale: 4,
          },
          offset: "10px",
          repeat: "20px"
        }
      ]
    });
    polyline.setMap(map.value as google.maps.Map);
    polylines.value.push(polyline);
  };

  const removePolyline = (): void => {
    polylines.value.forEach((line) => {
      line.setMap(null);
    });
    polylines.value = [];
  };

  onMounted(() => {
    if (mapRef.value) {
      map.value = new google.maps.Map(mapRef.value as HTMLElement, {
        center: { lat: 37.86926, lng: -122.254811 },
        zoom: 1,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        // Unfortunately, Google requires a map ID in order to use Advanced Markers.
        // To save people hosting the game from having to create a map ID, we use
        // the demo ID (even though Google recommends using it only for testing).
        mapId: "DEMO_MAP_ID"
      });
    }
  });

  return {
    map,
    markers,
    polylines,
    removeMarkers,
    putMarker,
    drawPolyline,
    removePolyline,
  };
};
