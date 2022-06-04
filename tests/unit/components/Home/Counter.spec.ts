import { shallowMount, VueWrapper } from "@vue/test-utils";

import Counter from "@/components/Home/Counter.vue";

describe("Test Counter component", () => {
  let wrapper: VueWrapper<any>;

  afterEach(() => {
    wrapper.unmount();
  });

  describe("Test when the count is neither max nor min", () => {
    beforeEach(() => {
      wrapper = shallowMount(Counter, {
        props: {
          min: 2,
          max: 5,
          count: 3,
          disabled: false,
        },
      });
    });

    it("Test count text", () => {
      expect(wrapper.find(".text").text()).toBe("3");
    });

    it("Test onChangeValue event onClick increment button", async () => {
      await wrapper.findAll(".button")[1].trigger("click");
  
      expect(wrapper.emitted().onChangeValue[0]).toEqual([4]);
    });

    it("Test onChangeValue event onClick decrement button", async () => {
      await wrapper.findAll(".button")[0].trigger("click");
  
      expect(wrapper.emitted().onChangeValue[0]).toEqual([2]);
    });
  });

  describe("Test when the count reached to max", () => {
    beforeEach(() => {
      wrapper = shallowMount(Counter, {
        props: {
          min: 2,
          max: 5,
          count: 5,
          disabled: false,
        },
      });
    });

    it("increment button is disabled when the count reaches to max", async () => {
      const incrementButton = wrapper.findAll(".button")[1];
      await incrementButton.trigger("click");
  
      expect(incrementButton.attributes("disabled")).toBeDefined();
    });

    it("onChangeValue has not been triggered when the count reaches to max", async () => {
      await wrapper.findAll(".button")[1].trigger("click");
  
      expect(wrapper.emitted().onChangeValue).toBeUndefined();
    });

    it("Test the style when the increment button is disabled", () => {
      const incrementButton = wrapper.findAll(".button")[1];
      expect(incrementButton.classes()).toContain("disabled");
    });
  });

  describe("Test when the count reached to min", () => {
    beforeEach(() => {
      wrapper = shallowMount(Counter, {
        props: {
          min: 2,
          max: 5,
          count: 2,
          disabled: false,
        },
      });
    });

    it("decrement button is disabled when the count reaches to min", async () => {
      const decrementButton = wrapper.findAll(".button")[0];
      await decrementButton.trigger("click");
  
      expect(decrementButton.attributes("disabled")).toBeDefined();
    });


    it("onChangeValue has not been triggered when the count reaches to min", async () => {
      await wrapper.findAll(".button")[0].trigger("click");
  
      expect(wrapper.emitted().onChangeValue).toBeUndefined();
    });

    it("Test the style when the decrement button is disabled", () => {
      const decrementButton = wrapper.findAll(".button")[0];
      expect(decrementButton.classes()).toContain("disabled");
    });
  });

  describe("Test when disabled prop is true", () => {
    beforeEach(() => {
      wrapper = shallowMount(Counter, {
        props: {
          min: 2,
          max: 5,
          count: 3,
          disabled: true,
        },
      });
    });

    it("increment button is disabled", () => {
      const incrementButton = wrapper.findAll(".button")[1];

      expect(incrementButton.attributes("disabled")).toBeDefined();
    });

    it("Test the style when the increment button is disabled", () => {
      const incrementButton = wrapper.findAll(".button")[1];
      expect(incrementButton.classes()).toContain("disabled");
    });

    it("decrement button is disabled", () => {
      const decrementButton = wrapper.findAll(".button")[0];

      expect(decrementButton.attributes("disabled")).toBeDefined();
    });

    it("Test the style when the decrement button is disabled", () => {
      const decrementButton = wrapper.findAll(".button")[0];
      expect(decrementButton.classes()).toContain("disabled");
    });
  });
});
