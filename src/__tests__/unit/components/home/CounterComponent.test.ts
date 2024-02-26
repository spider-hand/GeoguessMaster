import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import CounterComponentVue from "../../../../components/home/CounterComponent.vue";

describe("CounterComponent", () => {
  const props = {
    min: 1,
    max: 5,
    count: 3,
    disabled: false,
  };
  const incrementButton = "[data-testid=increment-button]";
  const decremenntButton = "[data-testid=decrement-button]";
  const countText = "[data-testid=count-text]";

  it("should show the count", () => {
    const wrapper = mount(CounterComponentVue, {
      props: props,
    });

    expect(wrapper.find(countText).text()).toBe("3");
  });

  it("should increment the count when clicking the button", async () => {
    const wrapper = mount(CounterComponentVue, {
      props: props,
    });

    await wrapper.find(incrementButton).trigger("click");

    expect(wrapper.emitted().onChangeValue[0]).toEqual([4]);
  });

  it("should decrement the count when clicking the button", async () => {
    const wrapper = mount(CounterComponentVue, {
      props: props,
    });

    await wrapper.find(decremenntButton).trigger("click");

    expect(wrapper.emitted().onChangeValue[0]).toEqual([2]);
  });

  it("should be disabled when reaching the maximum value", () => {
    const wrapper = mount(CounterComponentVue, {
      props: { ...props, max: 5, count: 5 },
    });

    expect(wrapper.find(incrementButton).attributes("disabled")).toBeDefined();
  });

  it("should be disabled when reaching the minimum value", () => {
    const wrapper = mount(CounterComponentVue, {
      props: { ...props, min: 1, count: 1 },
    });

    expect(wrapper.find(decremenntButton).attributes("disabled")).toBeDefined();
  });

  it("should be disabled when disabled prop is true", () => {
    const wrapper = mount(CounterComponentVue, {
      props: { ...props, disabled: true },
    });

    expect(wrapper.find(incrementButton).attributes("disabled")).toBeDefined();
    expect(wrapper.find(decremenntButton).attributes("disabled")).toBeDefined();
  });
});
