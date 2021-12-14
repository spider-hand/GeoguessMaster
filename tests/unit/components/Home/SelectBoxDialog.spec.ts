import { shallowMount, VueWrapper } from "@vue/test-utils";

import SelectBoxDialog from "@/components/Home/SelectBoxDialog.vue";

describe("Test SelectBoxDialog component", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = shallowMount(SelectBoxDialog, {
      props: {
        isShowingDialog: true,
        options: [
          { text: "1", value: "1" },
          { text: "2", value: "2" },
          { text: "3", value: "3" },
          { text: "4", value: "4" },
          { text: "5", value: "5" },
        ],
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("Test if the dialog shows", () => {
    expect(wrapper.find(".select-box-dialog").exists()).toBe(true);
  });

  it("Test if the dialog doesn't show", async () => {
    await wrapper.setProps({ isShowingDialog: false });

    expect(wrapper.find(".select-box-dialog").exists()).toBe(false);
  });

  it("Test dialog style", () => {
    expect(wrapper.find(".select-box-dialog").attributes("style")).toBe(
      "height: 180px; bottom: -196px;"
    );
  });

  it("Test dialog style when the number of options are less than 4", async () => {
    await wrapper.setProps({ 
      options:  [
        { text: "1", value: "1" },
        { text: "2", value: "2" },
        { text: "3", value: "3" },
        { text: "4", value: "4" },
      ], 
    });

    const length = wrapper.props("options").length;
    const height = 40 * length;
    const bottom = (40 * length + 16) * -1;

    expect(wrapper.find(".select-box-dialog").attributes("style")).toBe(
      `height: ${height}px; bottom: ${bottom}px;`
    );
  });

  it("Test option text", () => {
    const option = wrapper.findAll(".option-wrapper")[0];
    expect(option.find(".option-text").text()).toBe("1");
  });

  it("Test onClick option", async () => {
    const option = wrapper.findAll(".option-wrapper")[0];
    
    await option.trigger('click');

    expect(wrapper.emitted().onChangeOption[0]).toEqual([{ text: "1", value: "1" }]);
  });
});