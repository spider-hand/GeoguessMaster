import MyCounterVue from "@/components/home/MyCounter.vue";
import { VueWrapper, mount } from "@vue/test-utils";

describe("MyCounter", () => {
  let wrapper: VueWrapper<any>;
  const count = "[data-test='count-text']";
  const incrementButton = "[data-test='increment-button']";
  const decrementButton = "[data-test='decrement-button']";

  afterEach(() => {
    wrapper.unmount();
  });

  describe("when the count is neither max nor min", () => {
    beforeEach(() => {
      wrapper = mount(MyCounterVue, {
        props: {
          min: 1,
          max: 5,
          count: 3,
          disabled: false,
        },
      });
    });

    it("should show the count", () => {
      expect(wrapper.find(count).text()).toContain("3");
    });

    it("should increment the count when clicking the button", async () => {
      await wrapper.find(incrementButton).trigger("click");
      expect(wrapper.emitted().onChangeValue[0]).toEqual([4]);
    });

    it("should decrement the count when clicking the button", async () => {
      await wrapper.find(decrementButton).trigger("click");
      expect(wrapper.emitted().onChangeValue[0]).toEqual([2]);
    });
  });

  describe("when the count reaches max", () => {
    beforeEach(() => {
      wrapper = mount(MyCounterVue, {
        props: {
          min: 1,
          max: 5,
          count: 5,
          disabled: false,
        },
      });
    });

    test("the button should be disabled when reaching max", async () => {
      expect(
        wrapper.find(incrementButton).attributes("disabled")
      ).toBeDefined();
      expect(wrapper.emitted().onChangeValue).toBeFalsy();
    });
  });

  describe("when the count reaches min", () => {
    beforeEach(() => {
      wrapper = mount(MyCounterVue, {
        props: {
          min: 1,
          max: 5,
          count: 1,
          disabled: false,
        },
      });
    });

    test("the button should be disabled when reaching min", async () => {
      expect(
        wrapper.find(decrementButton).attributes("disabled")
      ).toBeDefined();
      expect(wrapper.emitted().onChangeValue).toBeFalsy();
    });
  });
});
