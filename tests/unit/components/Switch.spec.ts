import { shallowMount, VueWrapper } from "@vue/test-utils";

import Switch from "@/components/Switch.vue";

describe("Test Switch component", () => {
  let wrapper: VueWrapper<any> | null = null;

  beforeEach(() => {
    wrapper = shallowMount(Switch, {
      props: {
        ans: true,
      },
    });
  });

  afterEach(() => {
    wrapper!.unmount();
  });

  it("Test default state", () => {
    expect(wrapper!.vm.state.ans).toBe(true);
  });

  it("Test ans state onClick yes button", async () => {
    await wrapper!.find("#option-yes").trigger("click");

    expect(wrapper!.vm.state.ans).toBe(true);
  });

  it("Test onChangeValue event onClick yes button", async () => {
    await wrapper!.find("#option-yes").trigger("click");

    expect(wrapper!.emitted().onChangeValue[0]).toEqual([true]);
  });

  it("Test ans state onClick no button", async () => {
    await wrapper!.find("#option-no").trigger("click");

    expect(wrapper!.vm.state.ans).toBe(false);
  });

  it("Test onChangeValue event onClick no button", async () => {
    await wrapper!.find("#option-no").trigger("click");

    expect(wrapper!.emitted().onChangeValue[0]).toEqual([false]);
  });
});
