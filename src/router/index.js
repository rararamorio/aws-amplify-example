import Vue from "vue";
import VueRouter from "vue-router";
import { AmplifyEventBus, AmplifyPlugin } from "aws-amplify-vue";
import * as AmplifyModules from "aws-amplify";

import Home from "../views/Home.vue";
import About from "../views/About.vue";
import SampleAuth from "../views/SampleAuth";

Vue.use(VueRouter);
Vue.use(AmplifyPlugin, AmplifyModules);

let user;

getUser().then((user, error) => {
  console.log(error);
  if (user) {
    router.push({ path: "/" });
  }
});

AmplifyEventBus.$on("authState", async state => {
  if (state === "signedOut") {
    user = null;
    router.push({ path: "/auth" });
  } else if (state === "signedIn") {
    user = await getUser();
    router.push({ path: "/" });
  }
});

function getUser() {
  return Vue.prototype.$Amplify.Auth.currentAuthenticatedUser()
    .then(data => {
      if (data && data.signInUserSession) {
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return null;
    });
}

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: "/auth",
    name: "sampleAuth",
    component: SampleAuth
  },
  {
    path: "/about",
    name: "about",
    component: About
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeResolve(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    user = await getUser();
    if (!user) {
      return next({
        path: "/auth",
        query: {
          redirect: to.fullPath
        }
      });
    }
  }
  return next();
});

export default router;
