import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Amplify from "aws-amplify";
import { I18n } from "aws-amplify";
import { messages } from "./i18n/amplify/messages";
import aws_exports from "./aws-exports";

Amplify.configure(aws_exports);
I18n.putVocabularies(messages);
I18n.setLanguage("ja");

Vue.config.productionTip = false;
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
