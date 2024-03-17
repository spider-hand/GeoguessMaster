import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import { VueWrapper, flushPromises, shallowMount } from "@vue/test-utils";
import CreateGameFormComponentVue from "../../../../components/home/CreateGameFormComponent.vue";
import SelectBoxDialogComponentVue from "../../../../components/home/SelectBoxDialogComponent.vue";
import CreateRoomDialogComponentVue from "../../../../components/home/CreateRoomDialogComponent.vue";
import { createTestingPinia } from "@pinia/testing";
import { MAP_OPTIONS, MODE_OPTIONS } from "../../../../constants";
import * as database from "firebase/database";

vi.mock("firebase/app", async () => {
  const actual = await vi.importActual<typeof import("firebase/app")>(
    "firebase/app"
  );
  return {
    ...actual,
    initializeApp: vi.fn(),
  };
});

vi.mock("firebase/analytics", async () => {
  const actual = await vi.importActual<typeof import("firebase/analytics")>(
    "firebase/analytics"
  );
  return {
    ...actual,
    getAnalytics: vi.fn(),
  };
});

vi.mock("firebase/database", async () => {
  const actual = await vi.importActual<typeof import("firebase/database")>(
    "firebase/database"
  );
  return {
    ...actual,
    getDatabase: vi.fn(),
    get: vi.fn(),
    ref: vi.fn(),
    push: vi.fn(),
    update: vi.fn(),
    child: vi.fn(),
    serverTimestamp: vi.fn(),
  };
});

const routerPushMock = vi.fn();
vi.mock("vue-router", async () => {
  return {
    useRouter: () => {
      return {
        push: routerPushMock,
      };
    },
  };
});

describe("CreateGameFormComponent", () => {
  let wrapper: VueWrapper;

  const selectMapForm = "[data-testid=select-map-form]";
  const selectMapButton = "[data-testid=select-map-button]";
  const selectedMap = "[data-testid=selected-map]";
  const selectModeForm = "[data-testid=select-mode-form]";
  const selectModeButton = "[data-testid=select-mode-button]";
  const selectedMode = "[data-testid=selected-mode]";
  const createRoomButton = "[data-testid=create-room-button]";

  beforeEach(() => {
    wrapper = shallowMount(CreateGameFormComponentVue, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              gameSettings: {
                selectedMap: "world",
                selectedMode: "single",
              },
            },
          }),
        ],
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should show a selected map", () => {
    expect(wrapper.find(selectedMap).text()).toBe(MAP_OPTIONS.get("world"));
  });

  it("should show a selected mode", async () => {
    expect(wrapper.find(selectedMode).text()).toBe(MODE_OPTIONS.get("single"));

    wrapper
      .find(selectModeForm)
      .findComponent(SelectBoxDialogComponentVue)
      .vm.$emit("onChangeOption", "multiplayer");

    await wrapper.vm.$nextTick();

    expect(wrapper.find(selectedMode).text()).toBe(
      MODE_OPTIONS.get("multiplayer")
    );
  });

  it("should hide a dialog to create a room as default", () => {
    expect(
      wrapper.findComponent(CreateRoomDialogComponentVue).isVisible()
    ).toBe(false);
  });

  it("should open a dialog to create a room when selecting multiplayer mode", async () => {
    wrapper
      .find(selectModeForm)
      .findComponent(SelectBoxDialogComponentVue)
      .vm.$emit("onChangeOption", "multiplayer");

    await wrapper.find(createRoomButton).trigger("click");

    expect(
      wrapper.findComponent(CreateRoomDialogComponentVue).isVisible()
    ).toBe(true);
  });

  it("should close a dialog to select a map as default", () => {
    expect(
      wrapper
        .find(selectMapForm)
        .findComponent(SelectBoxDialogComponentVue)
        .isVisible()
    ).toBe(false);
  });

  it("should open a dialog to select a map", async () => {
    await wrapper.find(selectMapButton).trigger("click");

    expect(
      wrapper
        .find(selectMapForm)
        .findComponent(SelectBoxDialogComponentVue)
        .isVisible()
    ).toBe(true);
  });

  it("should close a dialog to select a map", async () => {
    await wrapper.find(selectMapButton).trigger("click");

    wrapper
      .find(selectMapForm)
      .findComponent(SelectBoxDialogComponentVue)
      .vm.$emit("close");

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find(selectMapForm)
        .findComponent(SelectBoxDialogComponentVue)
        .isVisible()
    ).toBe(false);
  });

  it("should close a dialog to select a map after selecting a map", async () => {
    await wrapper.find(selectMapButton).trigger("click");

    wrapper
      .find(selectMapForm)
      .findComponent(SelectBoxDialogComponentVue)
      .vm.$emit("onChangeOption", "world");

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find(selectMapForm)
        .findComponent(SelectBoxDialogComponentVue)
        .isVisible()
    ).toBe(false);
  });

  it("should close a dialog to select a mode as default", () => {
    expect(
      wrapper
        .find(selectModeForm)
        .findComponent(SelectBoxDialogComponentVue)
        .isVisible()
    ).toBe(false);
  });

  it("should open a dialog to select a mode after selecting a mode", async () => {
    await wrapper.find(selectModeButton).trigger("click");

    expect(
      wrapper
        .find(selectModeForm)
        .findComponent(SelectBoxDialogComponentVue)
        .isVisible()
    ).toBe(true);
  });

  it("should close a dialog to select a mode", async () => {
    await wrapper.find(selectModeButton).trigger("click");

    wrapper
      .find(selectModeForm)
      .findComponent(SelectBoxDialogComponentVue)
      .vm.$emit("close");

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find(selectModeForm)
        .findComponent(SelectBoxDialogComponentVue)
        .isVisible()
    ).toBe(false);
  });

  it("should close a dialog to select a mode after selecting a mode", async () => {
    await wrapper.find(selectModeButton).trigger("click");

    wrapper
      .find(selectModeForm)
      .findComponent(SelectBoxDialogComponentVue)
      .vm.$emit("onChangeOption", "multiplayer");

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find(selectModeForm)
        .findComponent(SelectBoxDialogComponentVue)
        .isVisible()
    ).toBe(false);
  });

  it("should naviagte to game page when single mode is selected", async () => {
    wrapper
      .find(selectModeForm)
      .findComponent(SelectBoxDialogComponentVue)
      .vm.$emit("onChangeOption", "single");

    await wrapper.vm.$nextTick();

    await wrapper.find(createRoomButton).trigger("click");

    expect(routerPushMock).toHaveBeenCalledOnce();
    expect(routerPushMock).toHaveBeenCalledWith("game");
  });

  it("should open a dialog to create a room when multiplayer mode is selected", async () => {
    wrapper
      .find(selectModeForm)
      .findComponent(SelectBoxDialogComponentVue)
      .vm.$emit("onChangeOption", "multiplayer");

    await wrapper.vm.$nextTick();

    await wrapper.find(createRoomButton).trigger("click");

    expect(routerPushMock).not.toHaveBeenCalled();
    expect(
      wrapper.findComponent(CreateRoomDialogComponentVue).isVisible()
    ).toBe(true);
  });

  it("should navigate to game page when creating a room and the player is an owner", async () => {
    vi.spyOn(database, "get").mockResolvedValue({
      exists: vi.fn().mockReturnValue(false),
      child: vi.fn().mockReturnValue({
        val: vi.fn(),
      }),
    } as any);
    vi.spyOn(database, "push").mockResolvedValue({
      key: "foo",
    } as any);

    wrapper
      .findComponent(CreateRoomDialogComponentVue)
      .vm.$emit("onChangeIsOwner", true);
    wrapper
      .findComponent(CreateRoomDialogComponentVue)
      .vm.$emit("onClickStartMultiplayerGameButton");

    await flushPromises();

    expect(routerPushMock).toHaveBeenCalledOnce();
    expect(routerPushMock).toHaveBeenCalledWith("game");
  });

  it("should navigate to game page when creating a room and the player is not an owner", async () => {
    vi.spyOn(database, "get").mockResolvedValue({
      exists: vi.fn().mockReturnValue(true),
      child: vi.fn().mockReturnValue({
        val: vi.fn(),
      }),
    } as any);
    vi.spyOn(database, "push").mockResolvedValue({
      key: "foo",
    } as any);

    wrapper
      .findComponent(CreateRoomDialogComponentVue)
      .vm.$emit("onChangeIsOwner", false);
    wrapper
      .findComponent(CreateRoomDialogComponentVue)
      .vm.$emit("onClickStartMultiplayerGameButton");

    await flushPromises();

    expect(routerPushMock).toHaveBeenCalledOnce();
    expect(routerPushMock).toHaveBeenCalledWith("game");
  });

  it("should show an error message if the room doesn't exist", async () => {
    vi.spyOn(database, "get").mockResolvedValue({
      exists: vi.fn().mockReturnValue(false),
    } as any);

    wrapper
      .findComponent(CreateRoomDialogComponentVue)
      .vm.$emit("onChangeIsOwner", false);
    wrapper
      .findComponent(CreateRoomDialogComponentVue)
      .vm.$emit("onClickStartMultiplayerGameButton");

    await flushPromises();

    await wrapper.vm.$nextTick();

    expect(
      wrapper.findComponent(CreateRoomDialogComponentVue).vm.$props.isRoomFound
    ).toBe(false);
    expect(routerPushMock).not.toHaveBeenCalled();
  });
});
