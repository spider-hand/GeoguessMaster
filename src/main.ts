import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { createPinia } from "pinia";
import cloneDeep from "lodash.clonedeep";

const pinia = createPinia();

// @see: https://stackoverflow.com/a/71760032/11043317
pinia.use(({ store }) => {
  const initialState = cloneDeep(store.$state);
  store.$reset = () => store.$patch(cloneDeep(initialState));
});

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");
