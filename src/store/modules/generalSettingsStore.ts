import { DEVICE_TYPES } from "../../constants";

export interface GeneralSettingsState {
  device: number;
}

const getDefaultState = (): GeneralSettingsState => ({
  device: DEVICE_TYPES.MOBLE_PORTRAIT,
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
