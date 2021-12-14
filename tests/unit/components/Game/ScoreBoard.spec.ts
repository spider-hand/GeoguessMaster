import { shallowMount, VueWrapper } from "@vue/test-utils";

import ScoreBoard from "@/components/Game/ScoreBoard.vue";

describe("Test ScoreBoard component", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = shallowMount(ScoreBoard, {
      props: {
        selectedMap: "Test",
        round: 1,
        score: 1000,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("Test selectedMap text", () => {
    expect(wrapper.find("#selected-map").text()).toBe("Test");
  });

  it("Test round text", () => {
    expect(wrapper.find("#round").text()).toBe("1 / 5");
  });

  it("Test round text", () => {
    expect(wrapper.find("#score").text()).toBe("1000");
  });
});
