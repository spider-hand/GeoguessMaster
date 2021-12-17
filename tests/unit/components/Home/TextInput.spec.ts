import { shallowMount, VueWrapper } from "@vue/test-utils";

import TextInput from "@/components/Home/TextInput.vue";

describe("Test TextInput component", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = shallowMount(TextInput, {
      props: {
        label: "Test",
        name: "test",
        placeholder: "This is test",
        inputValue: "",
        disabled: false,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("Test default state", () => {
    expect(wrapper.vm.state.inputValue).toBe("");
  });

  it("Test input name", () => {
    expect(wrapper.find("input[name='test']").exists()).toBe(true);
  });

  it("Test input placeholder", () => {
    expect(wrapper.find("input[placeholder='This is test']").exists()).toBe(true);
  });

  it("Test input value", () => {
    expect(wrapper.find("input").element.value).toBe("");
  });

  it("Test input label text", () => {
    expect(wrapper.find(".input-label").text()).toBe("Test");
  });

  it("Test error message text", async () => {
    await wrapper.setProps({ errorMsg: "Error message test" });

    expect(wrapper.find(".error-text").text()).toBe("Error message test");
  });

  it("Make sure the input is not disabled", () => {
    expect(wrapper.find("input").attributes("disabled")).not.toBeDefined();
  });

  it("Test disabled input", async () => {
    await wrapper.setProps({ disabled: true });

    expect(wrapper.find("input").attributes("disabled")).toBeDefined();
  });

  it("Test input value", async () => {
    const input = wrapper.find("input");
    await input.setValue("Hello, world");

    expect(input.element.value).toBe("Hello, world");
  });

  it("Test onChangeValue event", async () => {
    const input = wrapper.find("input");
    await input.setValue("Hello, world");

    expect(wrapper.emitted().onChangeValue[0]).toEqual(["Hello, world"]);
  });
});