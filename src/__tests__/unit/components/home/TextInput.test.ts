import TextInputVue from "@/components/home/TextInput.vue";
import { mount } from "@vue/test-utils";

describe("TextInput", () => {
  const props = {
    label: "test",
    name: "test",
  };

  it("should emit an input value with an event", async () => {
    const wrapper = mount(TextInputVue, {
      props: props,
    });

    const val = "test";
    await wrapper.find("input").setValue(val);
    await wrapper.find("input").trigger("input");
    expect(wrapper.emitted().onChangeValue[0]).toEqual([val]);
  });

  it("should show an error message", () => {
    const errorMsg = "Error message test";
    const wrapper = mount(TextInputVue, {
      props: {
        ...props,
        errorMsg: errorMsg,
      },
    });

    expect(wrapper.find("[data-test='error-msg']").text()).toContain(errorMsg);
  });
});
