import { shallowMount, VueWrapper } from "@vue/test-utils";

import Counter from "@/components/Counter.vue";

describe("Test Counter component", () => {
  let wrapper: VueWrapper<any> | null = null;

  beforeEach(() => {
    wrapper = shallowMount(Counter, {
      props: {
        min: 2,
        max: 5,
        count: 3,
      },
    });
  });

  afterEach(() => {
    wrapper!.unmount();
  });

  it("Test count text", () => {
    expect(wrapper!.find(".text").text()).toBe("3");
  });

  it("Test the count text onClick increment button", async () => {
    await wrapper!.find("#increment-button").trigger("click");

    expect(wrapper!.find(".text").text()).toBe("4");
  });

  it("Test onChangeValue event onClick increment button", async () => {
    await wrapper!.find("#increment-button").trigger("click");

    expect(wrapper!.emitted().onChangeValue[0]).toEqual([4]);
  });

  it("Disabled increment when the count reaches to max", async () => {
    const incrementButton = wrapper!.find("#increment-button");
    await incrementButton.trigger("click"); // 4
    await incrementButton.trigger("click"); // 5
    await incrementButton.trigger("click"); // 5

    expect(wrapper!.find(".text").text()).toBe("5");
    expect(wrapper!.emitted().onChangeValue).toHaveLength(2);
    expect(incrementButton.attributes("disabled")).toBeDefined();
  });

  it("Test the count text onClick decrement button", async () => {
    await wrapper!.find("#decrement-button").trigger("click"); // 2

    expect(wrapper!.find(".text").text()).toBe("2");
  });

  it("Test onChangeValue event onClick decrement button", async () => {
    await wrapper!.find("#decrement-button").trigger("click"); // 2

    expect(wrapper!.emitted().onChangeValue[0]).toEqual([2]);
  });

  it("Disabled decrement when the count reaches to min", async () => {
    const decrementButton = wrapper!.find("#decrement-button");
    await decrementButton.trigger("click"); // 2
    await decrementButton.trigger("click"); // 2

    expect(wrapper!.find(".text").text()).toBe("2");
    expect(wrapper!.emitted().onChangeValue).toHaveLength(1);
    expect(decrementButton.attributes("disabled")).toBeDefined();
  });
});
