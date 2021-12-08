import { shallowMount, VueWrapper } from "@vue/test-utils";

import Counter from "@/components/Home/Counter.vue";

describe("Test Counter component", () => {
  let wrapper: VueWrapper<any> | null = null;

  afterEach(() => {
    wrapper!.unmount();
  });

  describe("Test when the count is neither max nor min", () => {
    beforeEach(() => {
      wrapper = shallowMount(Counter, {
        props: {
          min: 2,
          max: 5,
          count: 3,
        },
      });
    });

    it("Test count text", () => {
      expect(wrapper!.find(".text").text()).toBe("3");
    });

    it("Test onChangeValue event onClick increment button", async () => {
      await wrapper!.find("#increment-button").trigger("click");
  
      expect(wrapper!.emitted().onChangeValue[0]).toEqual([4]);
    });

    it("Test onChangeValue event onClick decrement button", async () => {
      await wrapper!.find("#decrement-button").trigger("click");
  
      expect(wrapper!.emitted().onChangeValue[0]).toEqual([2]);
    });
  });

  describe("Test when the count reached to max", () => {
    beforeEach(() => {
      wrapper = shallowMount(Counter, {
        props: {
          min: 2,
          max: 5,
          count: 5,
        },
      });
    });

    it("increment button is disabled when the count reaches to max", async () => {
      const incrementButton = wrapper!.find("#increment-button");
      await incrementButton.trigger("click");
  
      expect(incrementButton.attributes("disabled")).toBeDefined();
    });

    it("onChangeValue has not been triggered when the count reaches to max", async () => {
      await wrapper!.find("#increment-button").trigger("click");
  
      expect(wrapper!.emitted().onChangeValue).toBeUndefined();
    });
  });

  describe("Test when the count reached to min", () => {
    beforeEach(() => {
      wrapper = shallowMount(Counter, {
        props: {
          min: 2,
          max: 5,
          count: 2,
        },
      });
    });

    it("decrement button is disabled when the count reaches to min", async () => {
      const decrementButton = wrapper!.find("#decrement-button");
      await decrementButton.trigger("click");
  
      expect(decrementButton.attributes("disabled")).toBeDefined();
    });


    it("onChangeValue has not been triggered when the count reaches to min", async () => {
      await wrapper!.find("#decrement-button").trigger("click");
  
      expect(wrapper!.emitted().onChangeValue).toBeUndefined();
    });
  });
});
