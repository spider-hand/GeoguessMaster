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
    expect(wrapper.find(".room-number-dialog__text").text()).toBe("9999");
  });

  it("Test component style when the game is not ready", () => {
    expect(wrapper.find(".room-number-dialog").exists()).toBe(true);
  });

  it("Dialog is gone when the game is ready", async () => {
    await wrapper.setProps({ isGameReady: true });
    expect(wrapper.find(".room-number-dialog--animated").exists()).toBe(true);
  });
});