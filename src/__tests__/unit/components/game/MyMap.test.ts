import MyMapVue from "@/components/game/MyMap.vue";
import { VueWrapper, mount } from "@vue/test-utils";
import IconButtonVue from "@/components/shared/IconButton.vue";
import { DeviceTypes, ModeTypes } from "@/types";

describe("MyMap", () => {
  let wrapper: VueWrapper<any>;

  const props = {
    device: 0 as DeviceTypes,
    selectedMode: "single" as ModeTypes,
    randomLatLng: null,
    round: 1,
    isMakeGuessButtonClicked: false,
  };

  const myMap = "[data-test='my-map']";

  test("hide map button on mobile", () => {
    wrapper = mount(MyMapVue, {
      props: props,
    });
    expect(wrapper.findComponent(IconButtonVue).exists()).toBe(true);
  });

  test("hide map button on other devices", () => {
    wrapper = mount(MyMapVue, {
      props: { ...props, device: 1 },
    });
    expect(wrapper.findComponent(IconButtonVue).exists()).toBe(false);
  });

  // MEMO: isVisible() not working here for some reason
  test("hide map button visiblity when make guess button has not been clicked", () => {
    wrapper = mount(MyMapVue, {
      props: props,
    });

    expect(wrapper.findComponent(IconButtonVue).attributes().style).include(
      "display: none;"
    );
  });

  test("hide map button visiblity when make guess button has been clicked", () => {
    wrapper = mount(MyMapVue, {
      props: { ...props, isMakeGuessButtonClicked: true },
    });
    expect(wrapper.findComponent(IconButtonVue).attributes().style).not.include(
      "display: none;"
    );
  });

  it("should emit an event when clicking hide map button", async () => {
    wrapper = mount(MyMapVue, {
      props: { ...props, isMakeGuessButtonClicked: true },
    });
    await wrapper.findComponent(IconButtonVue).trigger("click");
    expect(wrapper.emitted().onClickHideMapButton).toBeTruthy();
  });

  it("should show and hide map when make guess button has been clicked or not", async () => {
    wrapper = mount(MyMapVue, {
      props: { ...props, isMakeGuessButtonClicked: true },
    });

    await wrapper.setProps({ ...props, isMakeGuessButtonClicked: false });

    expect(wrapper.find(myMap).attributes().style).include(
      "transform: translateY(300px);"
    );

    await wrapper.setProps({ ...props, isMakeGuessButtonClicked: true });

    expect(wrapper.find(myMap).attributes().style).include(
      "transform: translateY(-352px);"
    );
  });

  it("should remove markers when round has been updated", async () => {
    wrapper = mount(MyMapVue, {
      props: props,
    });

    wrapper.vm.putMarker({ lat: 0, lng: 1 });
    expect(wrapper.vm.markers).toHaveLength(1);

    await wrapper.setProps({ ...props, round: 2 });

    expect(wrapper.vm.markers).toHaveLength(0);
  });

  it("should remove markers when the user starts a new game", async () => {
    wrapper = mount(MyMapVue, {
      props: { ...props, round: 5 },
    });

    wrapper.vm.putMarker({ lat: 0, lng: 1 });
    expect(wrapper.vm.markers).toHaveLength(1);

    await wrapper.setProps({ ...props, round: 1 });

    expect(wrapper.vm.markers).toHaveLength(0);
  });
});
