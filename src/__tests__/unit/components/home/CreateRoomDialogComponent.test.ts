import { describe, expect, it } from "vitest";
import CreateRoomDialogComponentVue from "../../../../components/home/CreateRoomDialogComponent.vue";
import TextInputComponentVue from "../../../../components/home/TextInputComponent.vue";
import { shallowMount } from "@vue/test-utils";
import SwitchComponent from "../../../../components/home/SwitchComponent.vue";
import CounterComponent from "../../../../components/home/CounterComponent.vue";

describe("CreateRoomDialogComponent", () => {
  const props = {
    isRoomFound: true,
    selectedSize: 2,
    selectedTime: 5,
    playerName: "foo",
    isOwner: true,
    roomNumber: "1000",
    isReadyForMultiplayerGame: false,
  };
  const sizeFormText = "[data-testid=size-form-text]";
  const timeFormText = "[data-testid=time-form-text]";
  const createRoomButton = "[data-testid=create-room-button]";

  it("should apply styles when the user is not an owner", () => {
    const wrapper = shallowMount(CreateRoomDialogComponentVue, {
      props: {
        ...props,
        isOwner: false,
      },
    });

    expect(wrapper.find(sizeFormText).classes()).toContain(
      "create-room-dialog__form-text--disabled"
    );
    expect(wrapper.find(timeFormText).classes()).toContain(
      "create-room-dialog__form-text--disabled"
    );
  });

  it("should emit an event when inputting a size of the room", async () => {
    const wrapper = shallowMount(CreateRoomDialogComponentVue, {
      props: { ...props, isOwner: true },
    });

    wrapper.findAllComponents(CounterComponent)[0].vm.$emit("onChangeValue", 5);

    expect(wrapper.emitted().onChangeSize[0]).toEqual([5]);
  });

  it("should emit an event when inputting a time of the room", async () => {
    const wrapper = shallowMount(CreateRoomDialogComponentVue, {
      props: { ...props, isOwner: true },
    });

    wrapper
      .findAllComponents(CounterComponent)[1]
      .vm.$emit("onChangeValue", 10);

    expect(wrapper.emitted().onChangeTime[0]).toEqual([10]);
  });

  it("should emit an event when inputting a player name", async () => {
    const wrapper = shallowMount(CreateRoomDialogComponentVue, {
      props: props,
    });

    wrapper
      .findAllComponents(TextInputComponentVue)[0]
      .vm.$emit("onChangeValue", "foo");

    expect(wrapper.emitted().onChangePlayerName[0]).toEqual(["foo"]);
  });

  it("should emit an event when switching the toggle", () => {
    const wrapper = shallowMount(CreateRoomDialogComponentVue, {
      props: props,
    });

    wrapper.findComponent(SwitchComponent).vm.$emit("onChangeValue", true);

    expect(wrapper.emitted().onChangeIsOwner[0]).toEqual([true]);
  });

  it("should emit an event when inputting a room number", () => {
    const wrapper = shallowMount(CreateRoomDialogComponentVue, {
      props: { ...props, isOwner: false },
    });

    wrapper
      .findAllComponents(TextInputComponentVue)[1]
      .vm.$emit("onChangeValue", "foo");

    expect(wrapper.emitted().onChangeRoomNumber[0]).toEqual(["foo"]);
  });

  it("should emit an event when clicking START button", async () => {
    const wrapper = shallowMount(CreateRoomDialogComponentVue, {
      props: { ...props, isReadyForMultiplayerGame: true },
    });

    await wrapper.find(createRoomButton).trigger("click");

    expect(wrapper.emitted().onClickStartMultiplayerGameButton).toBeTruthy();
  });

  it("should pass an error message when a room cannot be found.", () => {
    const wrapper = shallowMount(CreateRoomDialogComponentVue, {
      props: { ...props, isRoomFound: false },
    });

    expect(
      wrapper.findAllComponents(TextInputComponentVue)[1].vm.$props.errorMsg
    ).toBe("The room cannot be found.");
  });
});
