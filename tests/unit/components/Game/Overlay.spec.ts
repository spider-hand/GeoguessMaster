import { shallowMount, VueWrapper } from "@vue/test-utils";

import Overlay from "@/components/Game/Overlay.vue";

describe("Test Overlay component", () => {
  const wrapper = shallowMount(Overlay, {
    props: {
      msg: "This is test.",
    },
  });

  it("Test msg text", () => {
    expect(wrapper.find(".text").text()).toBe("This is test.");
  });
});