import Vue from "vue";
import Router from "vue-router";
import Flipbook from "@/components/Flipbook/index.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Flipbook",
      component: Flipbook
    }
  ]
});
