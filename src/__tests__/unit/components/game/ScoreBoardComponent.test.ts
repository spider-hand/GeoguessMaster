import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ScoreBoardComponentVue from "../../../../components/game/ScoreBoardComponent.vue";

describe("ScoreBoardComponent", () => {
  const props = {
    selectedMap: "world",
    selectedMode: "single",
    round: 1,
    score: 1000,
    timePerRound: 5,
  };

  const selectedMap = "[data-testid=selected-map]";
  const round = "[data-testid=round]";
  const score = "[data-testid=score]";
  const time = "[data-testid=time]";

  it("should render the selected map", () => {
    const wrapper = mount(ScoreBoardComponentVue, {
      props: props,
    });
    expect(wrapper.find(selectedMap).text()).toBe("World");
  });

  it("should render the current round", () => {
    const wrapper = mount(ScoreBoardComponentVue, {
      props: props,
    });
    expect(wrapper.find(round).text()).toBe("1 / 5");
  });

  it("should render the current score", () => {
    const wrapper = mount(ScoreBoardComponentVue, {
      props: props,
    });
    expect(wrapper.find(score).text()).toBe("1000");
  });

  it("should not render the countdown on single mode", () => {
    const wrapper = mount(ScoreBoardComponentVue, {
      props: props,
    });
    expect(wrapper.find(time).exists()).toBe(false);
  });

  it("should render the countdown on multiplayer mode", () => {
    const wrapper = mount(ScoreBoardComponentVue, {
      props: { ...props, selectedMode: "multiplayer" },
    });
    expect(wrapper.find(time).exists()).toBe(true);
    expect(wrapper.find(time).text()).toBe("05:00");
  });

  it("should decrement countdown text by 1 second", async () => {
    vi.spyOn(global.performance, "now").mockReturnValue(0);

    const wrapper = mount(ScoreBoardComponentVue, {
      props: { ...props, selectedMode: "multiplayer" },
    });

    wrapper.vm.startCountdown();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(wrapper.find(time).text()).toBe("04:59");
  });

  it("should stop countdown", async () => {
    vi.spyOn(global.performance, "now").mockReturnValue(0);

    const wrapper = mount(ScoreBoardComponentVue, {
      props: { ...props, selectedMode: "multiplayer" },
    });

    wrapper.vm.startCountdown();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(wrapper.find(time).text()).toBe("04:59");

    wrapper.vm.stopCountdown();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(wrapper.find(time).text()).toBe("04:59");
  });
});
