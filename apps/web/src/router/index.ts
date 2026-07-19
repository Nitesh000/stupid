import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Landing from "@/pages/landing/Landing.vue";
import Auth from "@/pages/auth/Auth.vue";
import Dashboard from "@/pages/dashboard/Dashboard.vue";
import Chat from "@/pages/chat/Chat.vue";
import Leaderboard from "@/pages/leaderboard/Leaderboard.vue";
import Payment from "@/pages/payment/Payment.vue";
import { authClient } from "@/lib/auth-client";

const protectedRouteNames = ["Dashboard", "Chat", "Leaderboard", "Payment"];

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
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },
  {
    path: "/leaderboard",
    name: "Leaderboard",
    component: Leaderboard,
  },
  {
    path: "/payment",
    name: "Payment",
    component: Payment,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    const { data: session } = await authClient.getSession();

    if (protectedRouteNames.includes(String(to.name)) && !session) {
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
