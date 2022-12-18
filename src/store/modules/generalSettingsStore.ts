import { DeviceTypes } from "../../constants";

export interface GeneralSettingsState {
  device: number;
}

const getDefaultState = (): GeneralSettingsState => ({
  device: DeviceTypes.MobilePortrait,
});

export const generalSettingsStore = {
  state: () => getDefaultState(),
  getters: {},
  mutations: {
    setDeviceType(state: GeneralSettingsState, value: number) {
      state.device = value;
    },
  },
  actions: {
    setDeviceTypeAction({ commit }: any, payload: any) {
      commit("setDeviceType", payload.device);
    },
  },
};
