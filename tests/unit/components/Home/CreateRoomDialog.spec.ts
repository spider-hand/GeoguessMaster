import { mount, VueWrapper } from "@vue/test-utils";

import CreateRoomDialog from "@/components/Home/CreateRoomDialog.vue";
import Counter from "@/components/Home/Counter.vue";
import Switch from "@/components/Home/Switch.vue";
import TextInput from "@/components/Home/TextInput.vue";

describe("Test CreateRoomDialog component", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(CreateRoomDialog, {
      props: {
        isShowingDialog: true,
        isRoomFound: true,
        selectedSize: 2,
        selectedTime: 1,
        playerName: "",
        isOwner: true,
        roomNumber: "",
        isReadyForMultiplayerGame: false,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("Test if dialog shows when isShowingDialog is true", () => {
    expect(wrapper.find(".create-room-dialog").exists()).toBe(true);
  });

  it("Test if dialog doesn't show when isShowingDialog is false", async () => {
    await wrapper.setProps({ isShowingDialog: false });

    expect(wrapper.find(".create-room-dialog").exists()).toBe(false);
  });

  it("Test the size text style when isOwner is false", async () => {
    await wrapper.setProps({ isOwner: false });

    expect(
      wrapper.findAll(".create-room-dialog__form-title--disabled")[0].text()
    ).toBe("Size");
  });

  it("Test the size helper text style when isOwner is false", async () => {
    await wrapper.setProps({ isOwner: false });

    expect(
      wrapper
        .findAll(".create-room-dialog__form-helper-text--disabled")[0]
        .text()
    ).toBe("2-5 people");
  });

  it("Test the time text style when isOwner is false", async () => {
    await wrapper.setProps({ isOwner: false });

    expect(
      wrapper.findAll(".create-room-dialog__form-title--disabled")[1].text()
    ).toBe("Time per round");
  });

  it("Test the time helper text style when isOwner is false", async () => {
    await wrapper.setProps({ isOwner: false });

    expect(
      wrapper
        .findAll(".create-room-dialog__form-helper-text--disabled")[1]
        .text()
    ).toBe("1-10 minutes");
  });

  it("Test the button style when isReadyForMultiplayerGame is false", () => {
    expect(wrapper.find(".create-room-dialog__button--disabled").text()).toBe(
      "START"
    );
  });

  it("Test error message when isRoomFound is false", async () => {
    await wrapper.setProps({ isRoomFound: false });

    expect(wrapper.vm.roomCannnotBeFoundError).toBe(
      "The room cannot be found."
    );
  });

  it("Test onChangeSize event", () => {
    const sizeCounter = wrapper.findAllComponents(Counter)[0];
    sizeCounter.vm.$emit("onChangeValue", 3);

    expect(wrapper.emitted().onChangeSize).toBeDefined();
    expect(wrapper.emitted().onChangeSize[0]).toEqual([3]);
  });

  it("Test onChangeTime event", () => {
    const timeCounter = wrapper.findAllComponents(Counter)[1];
    timeCounter.vm.$emit("onChangeValue", 2);

    expect(wrapper.emitted().onChangeTime).toBeDefined();
    expect(wrapper.emitted().onChangeTime[0]).toEqual([2]);
  });

  it("Test onChangePlayerName event", () => {
    const playerNameInput = wrapper.findAllComponents(TextInput)[0];
    playerNameInput.vm.$emit("onChangeValue", "Test user");

    expect(wrapper.emitted().onChangePlayerName).toBeDefined();
    expect(wrapper.emitted().onChangePlayerName[0]).toEqual(["Test user"]);
  });

  it("Test onChangeIsOwner event", () => {
    wrapper.findComponent(Switch).vm.$emit("onChangeValue", false);

    expect(wrapper.emitted().onChangeIsOwner).toBeDefined();
    expect(wrapper.emitted().onChangeIsOwner[0]).toEqual([false]);
  });

  it("Test onChangeRoomNumber event", () => {
    const roomNumberInput = wrapper.findAllComponents(TextInput)[1];
    roomNumberInput.vm.$emit("onChangeValue", "9999");

    expect(wrapper.emitted().onChangeRoomNumber).toBeDefined();
    expect(wrapper.emitted().onChangeRoomNumber[0]).toEqual(["9999"]);
  });

  it("Start button is disabled when isReadyForMultiplayerGame is false", async () => {
    expect(wrapper.find(".create-room-dialog__button--disabled").exists()).toBe(
      true
    );
  });

  it("Test onClickStartMultiplayerGameButton event", async () => {
    await wrapper.setProps({ isReadyForMultiplayerGame: true });
    await wrapper.find(".create-room-dialog__button").trigger("click");

    expect(wrapper.emitted().onClickStartMultiplayerGameButton).toBeDefined();
  });
});
