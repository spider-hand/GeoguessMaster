import MySwitchVue from "../../../../components/home/MySwitch.vue";
import { VueWrapper, mount } from "@vue/test-utils";
import { describe, beforeEach, afterEach, it, expect } from "vitest";

describe("MySwitch", () => {
  let wrapper: VueWrapper<any>;
  const yesButton = "[data-test='yes-button']";
  const noButton = "[data-test='no-button']";

  beforeEach(() => {
    wrapper = mount(MySwitchVue, {
      props: {
        ans: true,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("should emit onChangeValue event with true when clicking yes button", async () => {
    await wrapper.find(yesButton).trigger("click");
    expect(wrapper.emitted().onChangeValue[0]).toEqual([true]);
  });

  it("should emit onChangeValue with false when clicking no button", async () => {
    await wrapper.find(noButton).trigger("click");
    expect(wrapper.emitted().onChangeValue[0]).toEqual([false]);
  });
});
