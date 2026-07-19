<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { authClient } from "@/lib/auth-client";
import { providerMemes, generalMemes, type Meme } from "@/config/memes";
import { animate } from "animejs";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import {
  LogOut,
  Trophy,
  MessageSquare,
  CreditCard,
  Radio,
  User as UserIcon,
  Smile,
  ShieldCheck,
  Compass,
} from "lucide-vue-next";

const router = useRouter();
const user = ref<any>(null);
const activeMeme = ref<Meme | null>(null);
const activeGeneralMeme = ref<Meme | null>(null);
const onlineCount = ref(1);

const handleLogout = async () => {
  disconnectSocket();
  await authClient.signOut();
  router.push("/auth");
};

onMounted(async () => {
  const { data: session } = await authClient.getSession();
  if (!session) {
    router.push("/auth");
    return;
  }
  user.value = session.user;

  // Connect socket and listen for real-time online count
  const socket = connectSocket();
  socket.on("online:count", (count: number) => {
    onlineCount.value = count;
  });

  // Determine provider meme — credentials vs OAuth
  const provider = session.session?.token ? "github" : "credentials";
  activeMeme.value = providerMemes[provider] ?? providerMemes.credentials!;

  const randomIndex = Math.floor(Math.random() * generalMemes.length);
  activeGeneralMeme.value = generalMemes[randomIndex]!;

  // Anime.js v4 dashboard entrance animations
  animate(".dashboard-header", {
    opacity: [0, 1],
    y: [-20, 0],
    duration: 600,
    ease: "outQuad",
  });

  animate(".meme-card", {
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: 700,
    delay: 200,
    ease: "outBack",
  });
});

onUnmounted(() => {
  disconnectSocket();
});
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">
          <img src="/stupid.svg" alt="stupid" class="nav-logo-img" />
          <span>stupid</span>
        </router-link>

        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link active">
            <Compass :size="18" />
            <span>Home</span>
          </router-link>

          <router-link to="/leaderboard" class="nav-link">
            <Trophy :size="18" />
            <span>Leaderboard</span>
          </router-link>

          <router-link to="/chat" class="nav-link">
            <MessageSquare :size="18" />
            <span>Chat</span>
          </router-link>

          <router-link to="/payment" class="nav-link">
            <CreditCard :size="18" />
            <span>Donate</span>
          </router-link>
        </div>

        <div class="nav-actions">
          <div class="online-indicator">
            <Radio class="indicator-icon pulse" :size="16" />
            <span>{{ onlineCount }} online</span>
          </div>

          <button @click="handleLogout" class="logout-btn" title="Get out">
            <LogOut :size="18" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="content-container">
      <header class="dashboard-header">
        <div class="welcome-box">
          <div class="avatar-container">
            <img
              v-if="user?.image"
              :src="user.image"
              alt="Avatar"
              class="user-avatar"
            />
            <div v-else class="avatar-placeholder">
              <UserIcon :size="24" />
            </div>
          </div>
          <div class="welcome-text">
            <h1>Hello, {{ user?.name || "Fellow Human" }}!</h1>
            <p>You have successfully logged in. Prepare to be disappointed.</p>
          </div>
        </div>

        <div class="status-pill">
          <ShieldCheck :size="16" />
          <span>Status: Logged in via Drizzle & Better Auth</span>
        </div>
      </header>

      <div class="grid-layout">
        <!-- Provider Specific Meme Card -->
        <section v-if="activeMeme" class="meme-card provider-card">
          <div class="card-title">
            <Smile :size="20" class="icon-accent" />
            <h3>Your Custom Provider Message</h3>
          </div>
          <p class="meme-text">{{ activeMeme.message }}</p>
          <div class="gif-container">
            <img :src="activeMeme.gifUrl" alt="Meme GIF" class="meme-gif" />
          </div>
        </section>

        <!-- General Random Meme Card -->
        <section v-if="activeGeneralMeme" class="meme-card general-card">
          <div class="card-title">
            <Radio :size="20" class="icon-accent-alt" />
            <h3>Random Fact of the Day</h3>
          </div>
          <p class="meme-text">{{ activeGeneralMeme.message }}</p>
          <div class="gif-container">
            <img
              :src="activeGeneralMeme.gifUrl"
              alt="General Meme GIF"
              class="meme-gif"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at center, #1b122c 0%, #0c0817 100%);
  color: #f3f4f6;
  font-family: "Outfit", "Inter", sans-serif;
  padding-top: 80px; /* Offset for navbar */
  overflow-x: hidden;
  overflow-y: auto;
}

/* Navigation Bar Styling */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: rgba(12, 8, 23, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.8rem;
  font-weight: 900;
  text-decoration: none;
  background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1.5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-logo-img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  filter: drop-shadow(0 0 2px rgba(167, 139, 250, 0.5));
}

.nav-links {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .nav-links {
    display: none; /* In production, we'd add a burger menu. For now, simple spacing works */
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #9ca3af;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.03);
}

.nav-link.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.online-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #34d399;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
}

.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
}

.logout-btn {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.25);
  color: #fff;
}

/* Dashboard Content Area */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  opacity: 0;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}

.welcome-box {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid rgba(167, 139, 250, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.welcome-text h1 {
  font-size: 2rem;
  font-weight: 850;
  margin: 0;
  letter-spacing: -0.5px;
}

.welcome-text p {
  margin: 6px 0 0 0;
  color: #9ca3af;
  font-size: 0.95rem;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 0.85rem;
  color: #d1d5db;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.meme-card {
  background: rgba(22, 17, 36, 0.55);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  opacity: 0;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.card-title h3 {
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0;
}

.icon-accent {
  color: #a78bfa;
}

.icon-accent-alt {
  color: #ec4899;
}

.meme-text {
  font-size: 1.05rem;
  line-height: 1.5;
  color: #d1d5db;
  margin: 0 0 24px 0;
  flex-grow: 1;
}

.gif-container {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
  width: 100%;
  aspect-ratio: 16 / 10;
}

.meme-gif {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
