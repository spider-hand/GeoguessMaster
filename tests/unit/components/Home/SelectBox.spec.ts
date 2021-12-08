import { mount, VueWrapper } from "@vue/test-utils";

import SelectBox from "@/components/Home/SelectBox.vue";
import { MAP_OPTIONS } from "@/constants";

describe("Test SelectBox component", () => {
  let wrapper: VueWrapper<any> | null = null;

  beforeEach(() => {
    wrapper = mount(SelectBox, {
      props: {
        title: "Map",
        selectedOption: MAP_OPTIONS[0],
        options: MAP_OPTIONS,
      },
    });
  });

  afterEach(() => {
    wrapper!.unmount();
  });

  it("Test default isHovering state", () => {
    expect(wrapper!.vm.state.isHovering).toBe(false);
  });

  it("Test default isShowingDialog state", () => {
    expect(wrapper!.vm.state.isShowingDialog).toBe(false);
  });

  it("Test title", () => {
    expect(wrapper!.find(".select-box-title").text()).toBe("Map");
  });

  it("Test selected option", () => {
    expect(wrapper!.find(".selected-option").text()).toBe(MAP_OPTIONS[0].text);
  })

  it("Test if the dialog doesn't show", () => {
    expect(wrapper!.find(".select-box-dialog").exists()).toBe(false);
  });

  it("Test if the dialog shows up onClickSelectBox", async () => {
    await wrapper!.find(".select-box-container").trigger("click");

    expect(wrapper!.find(".select-box-dialog").exists()).toBe(true);
  });

  it("Test the style", () => {
    const selectBoxContainer =  wrapper!.find(".select-box-container");
    expect(selectBoxContainer.attributes("style")).toBe(
      "border-right: 1px solid #dcdcdc;"
    );
  });

  it("Test the style on mouse over", async () => {
    const selectBoxContainer =  wrapper!.find(".select-box-container");
    await selectBoxContainer.trigger("mouseover");

    wrapper!.vm.$nextTick(() => {
      expect(selectBoxContainer.attributes("style")).toBe("");
    });
  });
});
