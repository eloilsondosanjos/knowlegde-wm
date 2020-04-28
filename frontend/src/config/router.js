import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../components/home/Home";
import AdminPages from "../components/admin/AdminPages";
import ArticlesByCategory from "../components/articles/ArticlesByCategory";

Vue.use(VueRouter);

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "AdminPages",
    path: "/admin",
    component: AdminPages,
  },
  {
    name: "articlesByCategory",
    path: "/categories/:id/articles",
    component: ArticlesByCategory,
  },
];

export default new VueRouter({
  mode: "history",
  routes,
});
