import "font-awesome/css/font-awesome.css";
import Vue from "vue";

import App from "./App";

import "./config/bootstrap";
import "./config/msgs";
import store from "./config/store";
import router from "./config/router";

Vue.config.productionTip = false;

// TEMPORÁRIO!

require("axios").defaults.headers.common["Authorization"] =
  "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibm9tZSI6IkVsb2lsc29uIGRvcyBBbm9zIFJvY2hhIiwiZW1haWwiOiJlbG9pbHNvbi5hZ2VlZHVAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU4NzMwNzY5MCwiZXhwIjoxNTg3NTY2ODkwfQ.gd7z8foH7P9x9wK5Pho0uqtCEnwiccTqzx98wf3Hdvk";

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
