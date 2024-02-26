import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import MapComponentVue from "../../../../components/game/MapComponent.vue";
import * as UseMap from "../../../../composables/game/useMap";
import { ref } from "vue";

const putMarkerMock = vi.fn();
const drawPolylineMock = vi.fn();
const mapRef = ref();
vi.spyOn(UseMap, "useMap").mockReturnValue({
  ...UseMap.useMap(mapRef),
  putMarker: putMarkerMock,
  drawPolyline: drawPolylineMock,
});

describe("MapComponent", () => {
  const map = "[data-testid=map]";
  const props = {
    isVisible: false,
    isShowingResult: false,
    selectedMode: "single",
    randomLatLng: new google.maps.LatLng(1, 1),
    selectedLatLng: new google.maps.LatLng(100, 100),
    selectedLatLngArr: [
      new google.maps.LatLng(100, 100),
      new google.maps.LatLng(100, 100),
    ],
    gameHistory: Array.from(new Array(5), (_) => ({
      randomLatLng: new google.maps.LatLng(1, 1),
      selectedLatLng: new google.maps.LatLng(100, 100),
    })),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component with default style", () => {
    const wrapper = mount(MapComponentVue, {
      props: props,
    });

    expect(wrapper.find(map).classes()).not.toContain("map--visible");
    expect(wrapper.find(map).classes()).not.toContain("map--with-result");
  });

  it("should be visible when isVisible is true", () => {
    const wrapper = mount(MapComponentVue, {
      props: { ...props, isVisible: true },
    });

    expect(wrapper.find(map).classes()).toContain("map--visible");
  });

  it("should show a result when isShowingResult is true", () => {
    const wrapper = mount(MapComponentVue, {
      props: { ...props, isShowingResult: true },
    });

    expect(wrapper.find(map).classes()).toContain("map--with-result");
  });

  it("should put two markers and draw one polyline in single mode", () => {
    const wrapper = mount(MapComponentVue, {
      props: props,
    });

    wrapper.vm.showResult();

    expect(putMarkerMock).toHaveBeenCalledTimes(2);
    expect(drawPolylineMock).toHaveBeenCalledOnce();
  });

  it("should put three markers and draw two polylines for two players in multiplayer mode", () => {
    const wrapper = mount(MapComponentVue, {
      props: { ...props, selectedMode: "multiplayer" },
    });

    wrapper.vm.showResult();

    expect(putMarkerMock).toHaveBeenCalledTimes(3);
    expect(drawPolylineMock).toHaveBeenCalledTimes(2);
  });

  it("should put ten markers and draw five polylines for five records", () => {
    const wrapper = mount(MapComponentVue, {
      props: { ...props, selectedMode: "multiplayer" },
    });

    wrapper.vm.showSummary();
    
    expect(putMarkerMock).toHaveBeenCalledTimes(10);
    expect(drawPolylineMock).toHaveBeenCalledTimes(5);
  });
});
