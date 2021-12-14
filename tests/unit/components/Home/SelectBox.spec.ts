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
  });

  it("Test if the dialog doesn't show", () => {
    expect(wrapper!.find(".select-box-dialog").exists()).toBe(false);
  });

  it("Test if the dialog shows up onClickSelectBox", async () => {
    await wrapper!.find(".select-box-container").trigger("click");

    expect(wrapper!.find(".select-box-dialog").exists()).toBe(true);
  });

  it("Test the style on hovering the mouse", async () => {
    await wrapper!.find(".select-box-container").trigger("mouseover");

    expect(
      wrapper!.find(".select-box-highligted-container").classes()
    ).toContain("on-hover");
    expect(wrapper!.find(".select-box-container").classes()).toContain(
      "on-hover-select-box-container"
    );
  });

  it("Test the style when not hovering", async () => {
    await wrapper!.find(".select-box-container").trigger("mouseover");
    await wrapper!.find(".select-box-container").trigger("mouseleave");

    expect(
      wrapper!.find(".select-box-highligted-container").classes()
    ).not.toContain("on-hover");
    expect(wrapper!.find(".select-box-container").classes()).not.toContain(
      "on-hover-select-box-container"
    );
  });
});
