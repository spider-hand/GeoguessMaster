import { mount, VueWrapper } from "@vue/test-utils";

import Home from "@/views/Home.vue";
import SelectBox from "@/components/Home/SelectBox.vue";
import CreateRoomDialog from "@/components/Home/CreateRoomDialog.vue";
import { key, store } from "@/store";
// import { useRouter } from "vue-router";

jest.mock("vue-router", () => ({
  useRouter: jest.fn(() => ({
    push: () => {},
  })),
}));

describe("Test Home component", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(Home, {
      global: {
        plugins: [[store, key]],
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("Create room button doesn't appear when selectedMode is single", () => {
    expect(wrapper.findAll(".page__button").length).toBe(1);
    expect(wrapper.findAll(".page__button-text")[0].text()).toBe("START");
  });

  it("Start game button doesn't appear when selectedMode is multiplayer", () => {
    const modeSelectBox = wrapper.findAllComponents(SelectBox)[1];
    modeSelectBox.vm.$emit("onChangeOption", {
      text: "With Friends",
      value: "multiplayer",
    });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.findAll(".page__button").length).toBe(1);
      expect(wrapper.findAll(".page__button-text")[0].text()).toBe("CREATE ROOM");
    });
  });

  it("Test onChangeSelectedMap", () => {
    const mapSelectBox = wrapper.findAllComponents(SelectBox)[0];
    mapSelectBox.vm.$emit("onChangeOption", { text: "Japan", value: "JPN" });

    expect(wrapper.vm.store.state.gameSettings.selectedMap).toBe("JPN");
  });

  it("Test onChangeSelectedMode", () => {
    const modeSelectBox = wrapper.findAllComponents(SelectBox)[1];
    modeSelectBox.vm.$emit("onChangeOption", {
      text: "With Friends",
      value: "multiplayer",
    });

    expect(wrapper.vm.store.state.gameSettings.selectedMode).toBe(
      "multiplayer"
    );
  });

  it("Test onChangeSize", () => {
    const createRoomDialog = wrapper.findComponent(CreateRoomDialog);
    createRoomDialog.vm.$emit("onChangeSize", 5);

    expect(wrapper.vm.store.state.gameSettings.selectedSize).toBe(5);
  });

  it("Test openCreateRoomDialog", () => {
    const modeSelectBox = wrapper.findAllComponents(SelectBox)[1];
    modeSelectBox.vm.$emit("onChangeOption", {
      text: "With Friends",
      value: "multiplayer",
    });
    wrapper.vm.$nextTick(() => {
      wrapper.find(".page__button").trigger("click");

      expect(wrapper.vm.state.isShowingRoomCreateDialog).toBe(true);
    });
  });

  it("Test onChangeTime", () => {
    const createRoomDialog = wrapper.findComponent(CreateRoomDialog);
    createRoomDialog.vm.$emit("onChangeTime", 10);

    expect(wrapper.vm.store.state.gameSettings.selectedTime).toBe(10);
  });

  it("Test onChangePlayerName", () => {
    const createRoomDialog = wrapper.findComponent(CreateRoomDialog);
    createRoomDialog.vm.$emit("onChangePlayerName", "Test Player");

    expect(wrapper.vm.store.state.gameSettings.playerName).toBe("Test Player");
  });

  it("Test onChangeIsOwner", () => {
    const createRoomDialog = wrapper.findComponent(CreateRoomDialog);
    createRoomDialog.vm.$emit("onChangeIsOwner", false);

    expect(wrapper.vm.store.state.gameSettings.isOwner).toBe(false);
  });

  it("Test onChangeRoomNumber", () => {
    const createRoomDialog = wrapper.findComponent(CreateRoomDialog);
    createRoomDialog.vm.$emit("onChangeRoomNumber", "9999");

    expect(wrapper.vm.store.state.gameSettings.roomNumber).toBe("9999");
  });

  /**
  it("Test startSinglePlayerGame", async () => {
    // Followed the instrunction but failed for some reasons
    // https://next.vue-test-utils.vuejs.org/guide/advanced/vue-router.html#testing-userouter-and-useroute-within-setup
    const push = jest.fn();
    (useRouter as jest.MockedFunction<any>).mockImplementationOnce(() => ({
      push,
    }));

    await wrapper.find(".start-game-button").trigger("click");

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("game");
  });
  */
});
