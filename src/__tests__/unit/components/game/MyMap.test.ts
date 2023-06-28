import MyMapVue from "../../../../components/game/MyMap.vue";
import { VueWrapper, flushPromises, mount } from "@vue/test-utils";
import IconButtonVue from "../../../../components/shared/IconButton.vue";
import { DeviceTypes, ModeTypes } from "../../../../types";
import { defineComponent } from "vue";
import { describe, test, expect, it } from "vitest";

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

  test("hide map button on mobile", async () => {
    const MyMapComponent = defineComponent({
      components: { MyMapVue },
      template: `<Suspense><MyMapVue :device=${props.device} :selectedMode=${props.selectedMode} :randomLatLng=${props.randomLatLng} :round=${props.round} :isMakeGuessButtonClicked=${props.isMakeGuessButtonClicked} /></Suspence>`,
    });
    wrapper = mount(MyMapComponent);
    await flushPromises();

    expect(wrapper.findComponent(IconButtonVue).exists()).toBe(true);
  });

  test("hide map button on other devices", async () => {
    const MyMapComponent = defineComponent({
      components: { MyMapVue },
      template: `<Suspense><MyMapVue :device=${1} :selectedMode=${
        props.selectedMode
      } :randomLatLng=${props.randomLatLng} :round=${
        props.round
      } :isMakeGuessButtonClicked=${
        props.isMakeGuessButtonClicked
      } /></Suspence>`,
    });

    wrapper = mount(MyMapComponent);
    await flushPromises();

    expect(wrapper.findComponent(IconButtonVue).exists()).toBe(false);
  });

  // MEMO: isVisible() not working here for some reason
  test("hide map button visiblity when make guess button has not been clicked", async () => {
    const MyMapComponent = defineComponent({
      components: { MyMapVue },
      template: `<Suspense><MyMapVue :device=${props.device} :selectedMode=${props.selectedMode} :randomLatLng=${props.randomLatLng} :round=${props.round} :isMakeGuessButtonClicked=${props.isMakeGuessButtonClicked} /></Suspence>`,
    });
    wrapper = mount(MyMapComponent);
    await flushPromises();

    expect(wrapper.findComponent(IconButtonVue).attributes().style).include(
      "display: none;"
    );
  });

  test("hide map button visiblity when make guess button has been clicked", async () => {
    const MyMapComponent = defineComponent({
      components: { MyMapVue },
      template: `<Suspense><MyMapVue :device=${props.device} :selectedMode=${
        props.selectedMode
      } :randomLatLng=${props.randomLatLng} :round=${
        props.round
      } :isMakeGuessButtonClicked=${true} /></Suspence>`,
    });
    wrapper = mount(MyMapComponent);
    await flushPromises();

    expect(wrapper.findComponent(IconButtonVue).attributes().style).not.include(
      "display: none;"
    );
  });

  it("should emit an event when clicking hide map button", async () => {
    const MyMapComponent = defineComponent({
      components: { MyMapVue },
      template: `<Suspense><MyMapVue :device=${props.device} :selectedMode=${
        props.selectedMode
      } :randomLatLng=${props.randomLatLng} :round=${
        props.round
      } :isMakeGuessButtonClicked=${true} /></Suspence>`,
    });
    wrapper = mount(MyMapComponent);
    await flushPromises();

    await wrapper.findComponent(IconButtonVue).trigger("click");
    expect(
      wrapper.findComponent(MyMapVue).emitted().onClickHideMapButton
    ).toBeTruthy();
  });
});
