<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authClient } from "@/lib/auth-client";
import { animate, stagger } from "animejs";
import { Trophy, LogIn, Compass, ShieldAlert } from "lucide-vue-next";

const router = useRouter();
const isLoggedIn = ref(false);
const userSession = ref<any>(null);

// Temporary mock leaderboard for Step 2 (will connect to backend in Step 5)
const leaderboard = ref([
  {
    id: "1",
    name: "SillySocrates",
    loginCount: 382,
    image: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=S Socrates",
  },
  {
    id: "2",
    name: "MegaMindMinus",
    loginCount: 294,
    image: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Mega",
  },
  {
    id: "3",
    name: "CodeCrasher",
    loginCount: 184,
    image: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Crash",
  },
  {
    id: "4",
    name: "TabMaster9000",
    loginCount: 92,
    image: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Tabs",
  },
  {
    id: "5",
    name: "WhitespaceWizard",
    loginCount: 65,
    image: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=White",
  },
]);

const handleAction = () => {
  if (isLoggedIn.value) {
    router.push("/dashboard");
  } else {
    router.push("/auth");
  }
};

onMounted(async () => {
  const { data: session } = await authClient.getSession();
  if (session) {
    isLoggedIn.value = true;
    userSession.value = session.user;
  }

  // Anime.js v4 entrance animations
  animate(".hero-label", {
    opacity: [0, 1],
    y: [-30, 0],
    duration: 800,
    ease: "outQuad",
  });

  // animate(".hero-logo", {
  //   opacity: [0, 1],
  //   y: [-30, 0],
  //   duration: 800,
  //   ease: "outQuad",
  // });

  animate(".hero-tagline", {
    opacity: [0, 1],
    y: [20, 0],
    duration: 800,
    delay: 200,
    ease: "outQuad",
  });

  animate(".hero-actions", {
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 600,
    delay: 400,
    ease: "outBack",
  });

  animate(".leaderboard-preview-card", {
    opacity: [0, 1],
    x: [50, 0],
    duration: 800,
    delay: 300,
    ease: "outQuad",
  });

  animate(".leaderboard-item", {
    opacity: [0, 1],
    y: [15, 0],
    delay: stagger(100, { start: 500 }),
    duration: 500,
    ease: "outQuad",
  });
});
</script>

<template>
  <div class="landing-wrapper">
    <div class="stars"></div>
    <div class="container">
      <div class="hero-section">
        <div class="badge">
          <ShieldAlert class="badge-icon" :size="16" />
          <span>Warning: Extremely Low IQ Ahead</span>
        </div>
        <div class="hero-label">
          <img src="/stupid.svg" alt="stupid logo" class="hero-logo" />
          <h1 class="hero-title">stupid</h1>
        </div>
        <p class="hero-tagline">
          The ultimate social playground built entirely on questionable
          architectural decisions. Log in, do nothing of value, track your
          logins, and see where other developers compile errors.
        </p>

        <div class="hero-actions">
          <button @click="handleAction" class="primary-btn">
            <template v-if="isLoggedIn">
              <Compass :size="20" />
              <span>Go to Dashboard</span>
            </template>
            <template v-else>
              <LogIn :size="20" />
              <span>Enter the Void</span>
            </template>
          </button>
          <div v-if="isLoggedIn" class="user-greeting">
            Welcome back, <span class="username">{{ userSession?.name }}</span
            >!
          </div>
        </div>
      </div>

      <div class="leaderboard-preview-card">
        <div class="card-header">
          <Trophy class="header-icon" :size="24" />
          <h2>The Hall of Shame</h2>
        </div>
        <p class="card-subtitle">Who has logged in the most times?</p>

        <div class="leaderboard-list">
          <div
            v-for="(item, index) in leaderboard"
            :key="item.id"
            class="leaderboard-item"
            :class="`rank-${index + 1}`"
          >
            <div class="rank-badge">
              <span v-if="index === 0" class="crown">👑</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <img :src="item.image" :alt="item.name" class="avatar" />
            <div class="user-info">
              <span class="user-name">{{ item.name }}</span>
            </div>
            <div class="login-badge">
              <span class="count">{{ item.loginCount }}</span>
              <span class="label">logins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-wrapper {
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at center, #1b122c 0%, #0c0817 100%);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  color: #f3f4f6;
  font-family: "Outfit", "Inter", sans-serif;
  display: flex;
  align-items: center;
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(white, rgba(255, 255, 255, 0.2) 2px, transparent 40px),
    radial-gradient(white, rgba(255, 255, 255, 0.15) 1px, transparent 30px);
  background-size:
    550px 550px,
    350px 350px;
  background-position:
    0 0,
    40px 60px;
  opacity: 0.12;
  pointer-events: none;
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  z-index: 10;
}

@media (max-width: 968px) {
  .container {
    flex-direction: column;
    justify-content: center;
    padding: 60px 24px;
    gap: 48px;
  }
}

.hero-section {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

@media (max-width: 968px) {
  .hero-section {
    align-items: center;
    text-align: center;
  }
}

.badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fca5a5;
  margin-bottom: 24px;
}

.badge-icon {
  color: #ef4444;
}

.hero-logo {
  width: 88px;
  height: 88px;
  filter: drop-shadow(0 0 2px rgba(167, 139, 250, 0.5));
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.hero-label {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.hero-title {
  font-size: 5rem;
  font-weight: 900;
  margin: 0;
  line-height: 0.9;
  background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -4px;
  margin-bottom: 24px;
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 3.5rem;
    letter-spacing: -2px;
  }
}

.hero-tagline {
  font-size: 1.15rem;
  line-height: 1.6;
  color: #9ca3af;
  margin: 0 0 40px 0;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  width: 100%;
}

@media (max-width: 968px) {
  .hero-actions {
    align-items: center;
  }
}

.primary-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
  border: none;
  border-radius: 14px;
  color: #fff;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
}

.primary-btn:active {
  transform: translateY(0);
}

.user-greeting {
  font-size: 0.95rem;
  color: #9ca3af;
}

.username {
  color: #a78bfa;
  font-weight: 600;
}

.leaderboard-preview-card {
  flex: 1;
  width: 100%;
  max-width: 480px;
  background: rgba(22, 17, 36, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  opacity: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.header-icon {
  color: #fbbf24;
}

.card-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
}

.card-subtitle {
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0 0 24px 0;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 12px 16px;
  border-radius: 16px;
  opacity: 0;
}

.rank-badge {
  width: 32px;
  font-weight: 800;
  color: #9ca3af;
  font-size: 1rem;
}

.crown {
  font-size: 1.1rem;
}

.rank-1 {
  background: rgba(251, 191, 36, 0.06);
  border-color: rgba(251, 191, 36, 0.15);
}
.rank-1 .rank-badge {
  color: #fbbf24;
}

.rank-2 {
  background: rgba(156, 163, 175, 0.05);
  border-color: rgba(156, 163, 175, 0.12);
}
.rank-2 .rank-badge {
  color: #d1d5db;
}

.rank-3 {
  background: rgba(217, 119, 6, 0.05);
  border-color: rgba(217, 119, 6, 0.1);
}
.rank-3 .rank-badge {
  color: #f59e0b;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  margin-right: 12px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.login-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.login-badge .count {
  font-size: 1.1rem;
  font-weight: 800;
  color: #f3f4f6;
  line-height: 1;
}

.login-badge .label {
  font-size: 0.7rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
