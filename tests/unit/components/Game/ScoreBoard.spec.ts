import { shallowMount, VueWrapper } from "@vue/test-utils";

import ScoreBoard from "@/components/Game/ScoreBoard.vue";

describe("Test ScoreBoard component", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = shallowMount(ScoreBoard, {
      props: {
        selectedMap: "Test",
        selectedMode: "single",
        round: 1,
        score: 1000,
        countdown: "00:00",
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

  it("Countdown text should not appear for single player game", () => {
    expect(wrapper.find("#time").exists()).toBe(false);
  });

  it("Countdown text should appear for multiplayer game", async () => {
    await wrapper.setProps({ selectedMode: "multiplayer" });

    expect(wrapper.find("#time").exists()).toBe(true);
    expect(wrapper.find("#time").text()).toBe("00:00");
  });
});
