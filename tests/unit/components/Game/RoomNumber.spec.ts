import { shallowMount, VueWrapper } from "@vue/test-utils";

import RoomNumberDialog from "@/components/Game/RoomNumberDialog.vue";

describe("Test RoomNumberDialog", () => {
  const wrapper = shallowMount(RoomNumberDialog, {
    props: {
      roomNumber: "9999",
      isGameReady: false,
    },
  });

  it("Test roomNumber text", () => {
    expect(wrapper.find("#room-number").text()).toBe("9999");
  });

  it("Test component style when the game is not ready", () => {
    expect(wrapper.find(".room-number-dialog").classes()).not.toContain("moved");
  });

  it("Dialog is gone when the game is ready", async () => {
    await wrapper.setProps({ isGameReady: true });
    expect(wrapper.find(".room-number-dialog").classes()).toContain("moved");
  });
});