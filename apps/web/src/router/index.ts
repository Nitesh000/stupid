import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Landing from "@/pages/landing/Landing.vue";
import Auth from "@/pages/auth/Auth.vue";
import Dashboard from "@/pages/dashboard/Dashboard.vue";
import { authClient } from "@/lib/auth-client";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    const { data: session } = await authClient.getSession();
    
    if (to.name === "Dashboard" && !session) {
      next("/auth");
    } else if (to.name === "Auth" && session) {
      next("/dashboard");
    } else {
      next();
    }
  } catch (err) {
    next();
  }
});

export default router;
