import SelectBoxDialogVue from "../../../../components/home/SelectBoxDialog.vue";
import { MODE_OPTIONS } from "../../../../constants";
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

describe("SelectBoxDialog", () => {
  const wrapper = mount(SelectBoxDialogVue, {
    attachTo: document.createElement("div"),
    props: {
      options: MODE_OPTIONS,
    },
  });

  const multiplayer = "[data-test='multiplayer']";

  it("should emit an event with the key when clicking the element", async () => {
    await wrapper.find(multiplayer).trigger("click");
    expect(wrapper.emitted().onChangeOption[0]).toEqual(["multiplayer"]);
  });

  it("should show the text", () => {
    expect(wrapper.find(multiplayer).text()).toContain(
      MODE_OPTIONS.get("multiplayer")
    );
  });

  it("should emit an event when the outside of the component has been clicked", async () => {
    document.dispatchEvent(new MouseEvent("click"));
    expect(wrapper.emitted().close).toBeTruthy();
  });
});
