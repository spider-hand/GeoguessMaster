import { Ref } from "vue";

const useStreetView = (
  panorama: Ref<google.maps.StreetViewPanorama | null>
) => {
  const zoomIn = () => {
    if (panorama.value) {
      const current = panorama.value.getZoom();
      panorama.value.setZoom(current + 1);
    }
  };

  const zoomOut = () => {
    if (panorama.value) {
      const current = panorama.value.getZoom();
      panorama.value.setZoom(current - 1);
    }
  };

  return {
    zoomIn,
    zoomOut,
  };
};

export default useStreetView;
