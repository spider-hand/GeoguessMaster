import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ResultModalComponentVue from "../../../../components/game/ResultModalComponent.vue";

describe("ResultModalComponent", () => {
  const props = {
    selectedMode: "single",
    isOwner: false,
    isShowingSummary: false,
    isNextRoundReady: false,
    distance: 10000,
    distanceByPlayerArr: [],
    round: 1,
    score: 10000,
    multiplayerGameSummary: [],
  };

  const singleResult = "[data-testid=single-result]";
  const singleNextRoundButton = "[data-testid=single-next-round-button]";
  const singlePlayAgainButton = "[data-testid=single-play-again-button]";
  const singleShowSummaryButton = "[data-testid=single-show-summary-button]";
  const multiplayerResult = "[data-testid=multiplayer-result]";
  const multiplayerSummary = "[data-testid=multiplayer-summary]";
  const multiplayerNextRoundButton =
    "[data-testid=multiplayer-next-round-button]";
  const multiplayerShowSummaryButton =
    "[data-testid=multiplayer-show-summary-button]";

  it("should show a result for single player", () => {
    const wrapper = shallowMount(ResultModalComponentVue, {
      props: props,
    });

    expect(wrapper.find(singleResult).text()).toBe("You are 10000km away 🚀");
  });

  it("should show a button to proceed to next round in single mode", async () => {
    const wrapper = shallowMount(ResultModalComponentVue, {
      props: props,
    });

    await wrapper.find(singleNextRoundButton).trigger("click");

    expect(wrapper.find(singleNextRoundButton).exists()).toBe(true);
    expect(wrapper.emitted().onClickNextRoundButton).toBeTruthy();
  });

  it("should show a button to show a summary when the round reaches 5", () => {
    const wrapper = shallowMount(ResultModalComponentVue, {
      props: { ...props, round: 5 },
    });

    expect(wrapper.find(singleNextRoundButton).exists()).toBe(false);
    expect(wrapper.find(singleShowSummaryButton).exists()).toBe(true);
  });

  it("should emit an event to show a summary when clicking the button", async () => {
    const wrapper = shallowMount(ResultModalComponentVue, {
      props: { ...props, round: 5 },
    });

    await wrapper.find(singleShowSummaryButton).trigger("click");

    expect(wrapper.emitted().onClickViewSummaryButton).toBeTruthy();
  });

  it("should show a summary for single player", () => {
    const wrapper = shallowMount(ResultModalComponentVue, {
      props: { ...props, round: 5, isShowingSummary: true },
    });

    expect(wrapper.find(singleResult).text()).toBe(
      "You are 10000km away in total 🎉"
    );
  });

  it("should show a button to play the game again and a button to exit the current game when showing a summary", async () => {
    const wrapper = shallowMount(ResultModalComponentVue, {
      props: { ...props, round: 5, isShowingSummary: true },
    });

    expect(wrapper.find(singlePlayAgainButton).exists()).toBe(true);
    expect(wrapper.find(singleShowSummaryButton).text()).toBe("EXIT");

    await wrapper.find(singlePlayAgainButton).trigger("click");
    await wrapper.find(singleShowSummaryButton).trigger("click");

    expect(wrapper.emitted().onClickViewSummaryButton).toBeUndefined();
    expect(wrapper.emitted().onClickPlayAgainButton).toBeTruthy();
    expect(wrapper.emitted().onClickExitButton).toBeTruthy();
  });

  it("should show results for multiplayer", () => {
    const wrapper = shallowMount(ResultModalComponentVue, {
      props: {
        ...props,
        selectedMode: "multiplayer",
        distanceByPlayerArr: [
          { playerName: "player1", distance: 1000 },
          { playerName: "player2", distance: 2000 },
        ],
      },
    });

    expect(wrapper.find(multiplayerResult).text()).toBe(
      "player1 is 1000km away🏅player2 is 2000km away"
    );
  });

  it("should show a button to proceed to next round in multiplayer mode", async () => {
    const wrapper = shallowMount(ResultModalComponentVue, {
      props: { ...props, selectedMode: "multiplayer", isOwner: true },
    });

    await wrapper.find(multiplayerNextRoundButton).trigger("click");

    expect(wrapper.find(multiplayerNextRoundButton).exists()).toBe(true);
    expect(wrapper.emitted().onClickNextRoundButton).toBeTruthy();
  });

  it("should not let the player proceed to next round when the player is not an owner of the game and the next round is not ready", async () => {
    const wrapper = shallowMount(ResultModalComponentVue, {
      props: {
        ...props,
        selectedMode: "multiplayer",
        isOwner: false,
        isNextRoundReady: false,
      },
    });

    await wrapper.find(multiplayerNextRoundButton).trigger("click");

    expect(wrapper.emitted().onClickNextRoundButton).toBeUndefined();
  });

  it("should emit an event to show a summary when clicking the button", async () => {
    const wrapper = shallowMount(ResultModalComponentVue, {
      props: { ...props, round: 5, selectedMode: "multiplayer" },
    });

    await wrapper.find(multiplayerShowSummaryButton).trigger("click");

    expect(wrapper.emitted().onClickViewSummaryButton).toBeTruthy();
  });

  it("should show a summary for multiplayer", () => {
    const wrapper = shallowMount(ResultModalComponentVue, {
      props: {
        ...props,
        round: 5,
        selectedMode: "multiplayer",
        isShowingSummary: true,
        multiplayerGameSummary: [
          { playerName: "player1", score: 10000 },
          { playerName: "player2", score: 20000 },
        ],
      },
    });

    expect(wrapper.find(multiplayerSummary).text()).toBe(
      "player1 is 10000km away in total🏅player2 is 20000km away in total"
    );
  });

  it("should emit an event to end the game when clicking the button", async () => {
    const wrapper = shallowMount(ResultModalComponentVue, {
      props: {
        ...props,
        round: 5,
        selectedMode: "multiplayer",
        isShowingSummary: true,
      },
    });

    await wrapper.find(multiplayerShowSummaryButton).trigger("click");

    expect(wrapper.find(multiplayerShowSummaryButton).text()).toBe("EXIT");
    expect(wrapper.emitted().onClickViewSummaryButton).toBeUndefined();
    expect(wrapper.emitted().endMultiplayerGame).toBeTruthy();
  });
});
