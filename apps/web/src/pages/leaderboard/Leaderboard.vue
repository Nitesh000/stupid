<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authClient } from "@/lib/auth-client";
import { env } from "@/config/env";
import { animate, stagger } from "animejs";
import { Trophy, Crown, Medal, Users, ArrowLeft } from "lucide-vue-next";

interface LeaderboardEntry {
  id: string;
  name: string;
  image: string | null;
  loginCount: number;
  country: string | null;
}

const router = useRouter();
const entries = ref<LeaderboardEntry[]>([]);
const loading = ref(true);
const error = ref("");

const medalFor = (rank: number) => {
  if (rank === 1) return "👑";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
};

const avatarUrl = (entry: LeaderboardEntry) =>
  entry.image || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${entry.name}`;

onMounted(async () => {
  const { data: session } = await authClient.getSession();
  if (!session) {
    router.push("/auth");
    return;
  }

  try {
    const res = await fetch(`${env.VITE_BACKEND_URL}/api/leaderboard`, {
      credentials: "include",
    });
    const data = await res.json();
    entries.value = data.leaderboard;
  } catch (e) {
    error.value = "Failed to load leaderboard. The hamsters are on strike.";
  } finally {
    loading.value = false;
  }

  // Anime.js entrance animations
  animate(".leaderboard-title", {
    opacity: [0, 1],
    y: [-20, 0],
    duration: 600,
    ease: "outQuad",
  });

  animate(".podium-card", {
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 700,
    delay: stagger(100),
    ease: "outBack",
  });

  animate(".rank-row", {
    opacity: [0, 1],
    x: [-20, 0],
    duration: 400,
    delay: stagger(40, { start: 400 }),
    ease: "outQuad",
  });
});
</script>

<template>
  <div class="leaderboard-wrapper">
    <div class="stars"></div>

    <!-- Back button -->
    <div class="top-bar">
      <router-link to="/dashboard" class="back-link">
        <ArrowLeft :size="18" />
        <span>Back to Dashboard</span>
      </router-link>
    </div>

    <main class="lb-container">
      <div class="lb-header">
        <Trophy :size="36" class="trophy-icon" />
        <h1 class="leaderboard-title">Hall of Shame</h1>
        <p class="lb-subtitle">These people have too much free time. Top 100 by login count.</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading the world's biggest losers…</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-card">{{ error }}</div>

      <template v-else>
        <!-- Top 3 podium -->
        <div class="podium" v-if="entries.length >= 3">
          <!-- Silver (2nd) -->
          <div class="podium-card rank-2">
            <span class="medal">🥈</span>
            <img :src="avatarUrl(entries[1]!)" :alt="entries[1]!.name" class="pod-avatar" />
            <p class="pod-name">{{ entries[1]!.name }}</p>
            <div class="pod-count">{{ entries[1]!.loginCount }} <span>logins</span></div>
          </div>

          <!-- Gold (1st) -->
          <div class="podium-card rank-1">
            <span class="medal">👑</span>
            <img :src="avatarUrl(entries[0]!)" :alt="entries[0]!.name" class="pod-avatar" />
            <p class="pod-name">{{ entries[0]!.name }}</p>
            <div class="pod-count">{{ entries[0]!.loginCount }} <span>logins</span></div>
          </div>

          <!-- Bronze (3rd) -->
          <div class="podium-card rank-3">
            <span class="medal">🥉</span>
            <img :src="avatarUrl(entries[2]!)" :alt="entries[2]!.name" class="pod-avatar" />
            <p class="pod-name">{{ entries[2]!.name }}</p>
            <div class="pod-count">{{ entries[2]!.loginCount }} <span>logins</span></div>
          </div>
        </div>

        <!-- Rest of the list -->
        <div class="rank-list">
          <div
            v-for="(entry, index) in entries.slice(3)"
            :key="entry.id"
            class="rank-row"
          >
            <span class="rank-num">{{ index + 4 }}</span>
            <img :src="avatarUrl(entry)" :alt="entry.name" class="rank-avatar" />
            <span class="rank-name">{{ entry.name }}</span>
            <span v-if="entry.country" class="rank-country">{{ entry.country }}</span>
            <span class="rank-count">{{ entry.loginCount }} logins</span>
          </div>
        </div>

        <div v-if="entries.length === 0" class="empty-lb">
          <Users :size="40" />
          <p>No one has logged in yet. Be the first idiot.</p>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.leaderboard-wrapper {
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at center, #1b122c 0%, #0c0817 100%);
  color: #f3f4f6;
  font-family: "Outfit", "Inter", sans-serif;
  overflow-y: auto;
  position: relative;
}

.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
    radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px);
  background-size: 550px 550px, 350px 350px;
  background-position: 0 0, 40px 60px;
  opacity: 0.1;
  pointer-events: none;
}

.top-bar {
  padding: 24px 24px 0;
  max-width: 900px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s;
}

.back-link:hover {
  color: #fff;
}

.lb-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px 60px;
  position: relative;
  z-index: 10;
}

.lb-header {
  text-align: center;
  margin-bottom: 48px;
}

.trophy-icon {
  color: #fbbf24;
  margin-bottom: 12px;
}

.leaderboard-title {
  font-size: 2.8rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  margin: 0 0 10px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
}

.lb-subtitle {
  color: #9ca3af;
  font-size: 1rem;
  margin: 0;
}

/* Podium */
.podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
}

.podium-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(22, 17, 36, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 24px 20px 20px;
  width: 200px;
  opacity: 0;
}

.podium-card.rank-1 {
  border-color: rgba(251, 191, 36, 0.25);
  background: rgba(251, 191, 36, 0.06);
  transform: translateY(-16px);
}

.podium-card.rank-2 {
  border-color: rgba(156, 163, 175, 0.2);
  background: rgba(156, 163, 175, 0.04);
}

.podium-card.rank-3 {
  border-color: rgba(217, 119, 6, 0.15);
  background: rgba(217, 119, 6, 0.04);
}

.medal {
  font-size: 2rem;
  margin-bottom: 10px;
}

.pod-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 10px;
}

.pod-name {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 6px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.pod-count {
  font-size: 1.3rem;
  font-weight: 800;
  color: #f3f4f6;
  line-height: 1;
}

.pod-count span {
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-top: 2px;
  text-align: center;
}

/* Rank list */
.rank-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rank-row {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  padding: 12px 20px;
  gap: 14px;
  opacity: 0;
}

.rank-num {
  width: 32px;
  font-weight: 800;
  color: #6b7280;
  font-size: 0.95rem;
  text-align: center;
}

.rank-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.rank-name {
  flex: 1;
  font-weight: 600;
  font-size: 0.95rem;
}

.rank-country {
  font-size: 0.8rem;
  color: #9ca3af;
}

.rank-count {
  font-size: 0.9rem;
  font-weight: 700;
  color: #a78bfa;
}

/* States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 60px;
  color: #9ca3af;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(167, 139, 250, 0.2);
  border-top-color: #a78bfa;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-card {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
}

.empty-lb {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px;
  color: #4b5563;
  text-align: center;
}
</style>
