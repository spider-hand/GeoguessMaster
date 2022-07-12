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
      expect(wrapper.find(".counter__text").text()).toBe("3");
    });

    it("Test onChangeValue event onClick increment button", async () => {
      await wrapper.findAll(".counter__button")[1].trigger("click");

      expect(wrapper.emitted().onChangeValue[0]).toEqual([4]);
    });

    it("Test onChangeValue event onClick decrement button", async () => {
      await wrapper.findAll(".counter__button")[0].trigger("click");

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

    it("Confirm increment button is disabled", () => {
      const incrementButton = wrapper.findAll(".counter__button--disabled")[0];
      expect(incrementButton.text()).toBe("+");
    });

    it("increment button is disabled when the count reaches to max", async () => {
      const incrementButton = wrapper.findAll(".counter__button--disabled")[0];
      await incrementButton.trigger("click");

      expect(incrementButton.attributes("disabled")).toBeDefined();
    });

    it("onChangeValue has not been triggered when the count reaches to max", async () => {
      await wrapper.findAll(".counter__button--disabled")[0].trigger("click");

      expect(wrapper.emitted().onChangeValue).toBeUndefined();
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

    it("Confirm decrement button is disabled", () => {
      const decrementButton = wrapper.findAll(".counter__button--disabled")[0];
      expect(decrementButton.text()).toBe("-");
    });

    it("decrement button is disabled when the count reaches to min", async () => {
      const decrementButton = wrapper.findAll(".counter__button--disabled")[0];
      await decrementButton.trigger("click");

      expect(decrementButton.attributes("disabled")).toBeDefined();
    });

    it("onChangeValue has not been triggered when the count reaches to min", async () => {
      await wrapper.findAll(".counter__button--disabled")[0].trigger("click");

      expect(wrapper.emitted().onChangeValue).toBeUndefined();
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
      const incrementButton = wrapper.findAll(".counter__button--disabled")[0];

      expect(incrementButton.attributes("disabled")).toBeDefined();
    });

    it("decrement button is disabled", () => {
      const decrementButton = wrapper.findAll(".counter__button--disabled")[1];

      expect(decrementButton.attributes("disabled")).toBeDefined();
    });
  });
});
