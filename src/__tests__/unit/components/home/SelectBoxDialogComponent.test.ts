import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import SelectBoxDialogComponentVue from "../../../../components/home/SelectBoxDialogComponent.vue";

describe("SelectBoxDialogComponent", () => {
  const props = {
    options: new Map([
      ["key1", "value1"],
      ["key2", "value2"],
    ]),
  };
  const key1 = "[data-testid=key1]";
  const key2 = "[data-testid=key2]";

  it("should render the value", () => {
    const wrapper = mount(SelectBoxDialogComponentVue, {
      props: props,
    });

    expect(wrapper.find(key1).text()).toBe("value1");
    expect(wrapper.find(key2).text()).toBe("value2");
  });

  it("should emit an event with the selected key when clicking an option", async () => {
    const wrapper = mount(SelectBoxDialogComponentVue, {
      props: props,
    });

    await wrapper.find(key1).trigger("click");

    expect(wrapper.emitted().onChangeOption[0]).toEqual(["key1"]);

    await wrapper.find(key2).trigger("click");

    expect(wrapper.emitted().onChangeOption[1]).toEqual(["key2"]);
  });

  it("should emit an event when clicking outside of the component", () => {
    const wrapper = mount(SelectBoxDialogComponentVue, {
      props: props,
    });

    document.dispatchEvent(new MouseEvent("click"));
    expect(wrapper.emitted().close).toBeTruthy();
  });
});
