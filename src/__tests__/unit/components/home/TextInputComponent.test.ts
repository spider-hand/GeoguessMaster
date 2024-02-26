import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import TextInputComponentVue from "../../../../components/home/TextInputComponent.vue";

describe("TextInputComponent", () => {
  const props = {
    label: "foo",
    name: "test",
    placeholder: "Hello world",
    disabled: false,
    errorMsg: null,
  };
  const errorMessage = "[data-testid=error-msg]";

  it("should render the label", () => {
    const wrapper = mount(TextInputComponentVue, {
      props: props,
    });

    expect(wrapper.find("label").text()).toBe("foo");
  });

  it("should render the placeholder", () => {
    const wrapper = mount(TextInputComponentVue, {
      props: props,
    });

    expect(wrapper.find("input").attributes().placeholder).toBe("Hello world");
  });

  it("should apply styles when the form is disabled", () => {
    const wrapper = mount(TextInputComponentVue, {
      props: { ...props, disabled: true },
    });

    expect(wrapper.find("label").classes()).toContain(
      "text-input__label--disabled"
    );
    expect(wrapper.find("input").classes()).toContain(
      "text-input__body--disabled"
    );
  });

  it("should apply styles when the form has an error and show an error message", () => {
    const wrapper = mount(TextInputComponentVue, {
      props: { ...props, errorMsg: "Error" },
    });

    expect(wrapper.find("label").classes()).toContain(
      "text-input__label--error"
    );
    expect(wrapper.find("input").classes()).toContain(
      "text-input__body--error"
    );
    expect(wrapper.find(errorMessage).text()).toContain("Error");
  });

  it("should emit an event with an input value", async () => {
    const wrapper = mount(TextInputComponentVue, {
      props: props,
    });

    const val = "test";
    await wrapper.find("input").setValue(val);
    await wrapper.find("input").trigger("input");

    expect(wrapper.emitted().onChangeValue[0]).toEqual([val]);
  });
});
