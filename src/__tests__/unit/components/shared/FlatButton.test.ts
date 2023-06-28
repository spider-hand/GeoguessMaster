import FlatButtonVue from "../../../../components/shared/FlatButton.vue";
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

describe("FlatButton", () => {
  const wrapper = mount(FlatButtonVue, {
    props: {
      text: "Test",
    },
  });

  it("should show the text on button", () => {
    expect(wrapper.find("button").text()).toContain("Test");
  });
});
