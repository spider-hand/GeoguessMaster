import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import SwitchComponentVue from "../../../../components/home/SwitchComponent.vue";

describe("SwitchComponent", () => {
  const props = {
    ans: true,
  };
  const yesButton = "[data-testid=yes-button]";
  const noButton = "[data-testid=no-button]";

  it("should apply styles when yes is selected", () => {
    const wrapper = mount(SwitchComponentVue, {
      props: props,
    });

    expect(wrapper.find(yesButton).classes()).toContain(
      "switch__option--selected"
    );
    expect(wrapper.find(noButton).classes()).toContain(
      "switch__option--not-selected"
    );
  });

  it("should apply styles when no is selected", () => {
    const wrapper = mount(SwitchComponentVue, {
      props: { ...props, ans: false },
    });

    expect(wrapper.find(yesButton).classes()).toContain(
      "switch__option--not-selected"
    );
    expect(wrapper.find(noButton).classes()).toContain(
      "switch__option--selected"
    );
  });

  it("should emit true when clicking yes button", async () => {
    const wrapper = mount(SwitchComponentVue, {
      props: props,
    });

    await wrapper.find(yesButton).trigger("click");

    expect(wrapper.emitted().onChangeValue[0]).toEqual([true]);
  });

  it("should emit false when clicking no button", async () => {
    const wrapper = mount(SwitchComponentVue, {
      props: props,
    });

    await wrapper.find(noButton).trigger("click");

    expect(wrapper.emitted().onChangeValue[0]).toEqual([false]);
  });
});
