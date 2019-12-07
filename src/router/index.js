import Vue from "vue";
import VueRouter from "vue-router";
import { components, AmplifyEventBus, AmplifyPlugin } from "aws-amplify-vue";
import * as AmplifyModules from "aws-amplify";

import Home from "../views/Home.vue";

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
    name: "Authenticator",
    component: components.Authenticator
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
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
