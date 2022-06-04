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

  it("Test onChangeValue event onClick yes button", async () => {
    const optionYes = wrapper.findAll(".option")[0];
    await optionYes.trigger("click");

    expect(wrapper.emitted().onChangeValue[0]).toEqual([true]);
    expect(optionYes.classes()).toContain("selected");
  });

  it("Test onChangeValue event onClick no button", async () => {
    const optionNo = wrapper.findAll(".option")[1];
    await optionNo.trigger("click");

    expect(wrapper.emitted().onChangeValue[0]).toEqual([false]);
    expect(optionNo.classes()).toContain("not-selected");
  });
});
