import { shallowMount, VueWrapper } from "@vue/test-utils";

import Switch from "@/components/Home/Switch.vue";

describe("Test Switch component", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = shallowMount(Switch, {
      props: {
        ans: true,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("Test onChangeValue event onClick no button", async () => {
    const optionNo = wrapper.findAll(".switch__option--not-selected")[0];
    expect(optionNo.text()).toBe("NO");
    await optionNo.trigger("click");

    expect(wrapper.emitted().onChangeValue[0]).toEqual([false]);
  });
});
