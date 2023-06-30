import { Ref, onMounted, shallowRef } from "vue";

export const useMap = (
  Map: typeof google.maps.Map,
  mapRef: Ref<HTMLElement | undefined>
) => {
  const map = shallowRef<google.maps.Map>();
  const markers = shallowRef<google.maps.Marker[]>([]);
  const polylines = shallowRef<google.maps.Polyline[]>([]);

  const removeMarkers = (): void => {
    markers.value.forEach((marker) => {
      marker.setMap(null);
    });
    markers.value.splice(0);
  };

  const putMarker = (position: google.maps.LatLng): void => {
    const marker = new google.maps.Marker({
      position: position,
      map: map.value,
    });
    markers.value.push(marker);
  };

  const drawPolyline = (
    from: google.maps.LatLng,
    to: google.maps.LatLng
  ): void => {
    const polyline = new google.maps.Polyline({
      path: [from, to],
      strokeColor: "hsl(0, 100%, 63%)",
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
      map.value = new Map(mapRef.value as HTMLElement, {
        center: { lat: 37.86926, lng: -122.254811 },
        zoom: 1,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
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
