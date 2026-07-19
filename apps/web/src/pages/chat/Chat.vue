<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { authClient } from "@/lib/auth-client";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { animate, stagger } from "animejs";
import { Send, MessageSquare, Clock, Users, Radio } from "lucide-vue-next";

interface ChatMessage {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  text: string;
  timestamp: string;
  isSelf?: boolean;
}

const router = useRouter();
const user = ref<any>(null);
const messages = ref<ChatMessage[]>([]);
const messageInput = ref("");
const sending = ref(false);
const errorMsg = ref("");
const slowModeSecondsLeft = ref(0);
const onlineCount = ref(1);
const messagesContainer = ref<HTMLElement | null>(null);

let slowModeTimer: ReturnType<typeof setInterval> | null = null;

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const startSlowMode = () => {
  slowModeSecondsLeft.value = 60;
  if (slowModeTimer) clearInterval(slowModeTimer);
  slowModeTimer = setInterval(() => {
    if (slowModeSecondsLeft.value <= 0) {
      clearInterval(slowModeTimer!);
      slowModeTimer = null;
    } else {
      slowModeSecondsLeft.value--;
    }
  }, 1000);
};

const sendMessage = () => {
  if (!messageInput.value.trim() || sending.value || slowModeSecondsLeft.value > 0) return;

  const socket = connectSocket();
  errorMsg.value = "";
  sending.value = true;

  socket.emit("chat:message", {
    userId: user.value?.id ?? "anon",
    name: user.value?.name ?? "Anonymous",
    avatar: user.value?.image ?? "",
    text: messageInput.value.trim(),
  });

  messageInput.value = "";
  sending.value = false;
  startSlowMode();
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

onMounted(async () => {
  const { data: session } = await authClient.getSession();
  if (!session) {
    router.push("/auth");
    return;
  }
  user.value = session.user;

  const socket = connectSocket();

  socket.on("online:count", (count: number) => {
    onlineCount.value = count;
  });

  socket.on("chat:message", async (msg: ChatMessage) => {
    const enriched: ChatMessage = {
      ...msg,
      isSelf: msg.userId === user.value?.id,
    };
    messages.value.push(enriched);
    await scrollToBottom();

    await nextTick();
    const lastMsg = messagesContainer.value?.lastElementChild;
    if (lastMsg) {
      animate(lastMsg as HTMLElement, {
        opacity: [0, 1],
        y: [10, 0],
        duration: 300,
        ease: "outQuad",
      });
    }
  });

  socket.on("chat:error", (payload: { message: string }) => {
    errorMsg.value = payload.message;
    setTimeout(() => (errorMsg.value = ""), 4000);
  });

  // Entrance animation
  animate(".chat-wrapper", {
    opacity: [0, 1],
    duration: 500,
    ease: "outQuad",
  });
});

onUnmounted(() => {
  const socket = connectSocket();
  socket.off("chat:message");
  socket.off("chat:error");
  if (slowModeTimer) clearInterval(slowModeTimer);
});
</script>

<template>
  <div class="chat-wrapper">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">
          <img src="/stupid.svg" alt="stupid" class="nav-logo-img" />
          <span>stupid</span>
        </router-link>

        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link">
            <MessageSquare :size="18" />
            <span>Home</span>
          </router-link>
          <router-link to="/leaderboard" class="nav-link">
            <Users :size="18" />
            <span>Leaderboard</span>
          </router-link>
          <router-link to="/chat" class="nav-link active">
            <MessageSquare :size="18" />
            <span>Chat</span>
          </router-link>
        </div>

        <div class="online-indicator">
          <Radio class="indicator-icon pulse" :size="16" />
          <span>{{ onlineCount }} online</span>
        </div>
      </div>
    </nav>

    <!-- Chat Area -->
    <main class="chat-container">
      <div class="chat-header">
        <MessageSquare :size="22" class="header-icon" />
        <div>
          <h1 class="chat-title">Stupid Chat</h1>
          <p class="chat-subtitle">No DMs. No logs. No regrets. 1 msg/min.</p>
        </div>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="messages-area">
        <div v-if="messages.length === 0" class="empty-state">
          <MessageSquare :size="48" class="empty-icon" />
          <p>No messages yet. Be the first to say something stupid.</p>
        </div>

        <div
          v-for="msg in messages"
          :key="msg.id"
          class="message-row"
          :class="{ self: msg.isSelf }"
        >
          <img
            v-if="!msg.isSelf"
            :src="msg.avatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${msg.name}`"
            :alt="msg.name"
            class="msg-avatar"
          />
          <div class="msg-bubble-group">
            <span v-if="!msg.isSelf" class="msg-sender">{{ msg.name }}</span>
            <div class="msg-bubble">{{ msg.text }}</div>
            <span class="msg-time">
              {{ new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }}
            </span>
          </div>
          <img
            v-if="msg.isSelf"
            :src="user?.image || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user?.name}`"
            :alt="user?.name"
            class="msg-avatar"
          />
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <div v-if="errorMsg" class="error-toast">{{ errorMsg }}</div>

        <div v-if="slowModeSecondsLeft > 0" class="slow-mode-banner">
          <Clock :size="16" />
          <span>Slow mode — next message in <strong>{{ slowModeSecondsLeft }}s</strong></span>
        </div>

        <div class="input-row">
          <input
            v-model="messageInput"
            type="text"
            class="message-input"
            placeholder="Say something stupid..."
            :disabled="slowModeSecondsLeft > 0"
            @keydown="handleKeydown"
            maxlength="500"
          />
          <button
            class="send-btn"
            :disabled="!messageInput.trim() || slowModeSecondsLeft > 0"
            @click="sendMessage"
          >
            <Send :size="20" />
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.chat-wrapper {
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at center, #1b122c 0%, #0c0817 100%);
  color: #f3f4f6;
  font-family: "Outfit", "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  width: 100%;
  height: 70px;
  background: rgba(12, 8, 23, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
  flex-shrink: 0;
}

.nav-container {
  max-width: 1000px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-size: 1.6rem;
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
  width: 30px;
  height: 30px;
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: #9ca3af;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
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
  animation: pulse-anim 2s infinite;
}

@keyframes pulse-anim {
  0%, 100% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
}

/* Chat content area */
.chat-container {
  flex: 1;
  max-width: 780px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 24px 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-icon {
  color: #a78bfa;
}

.chat-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
}

.chat-subtitle {
  margin: 4px 0 0;
  color: #9ca3af;
  font-size: 0.85rem;
}

/* Messages */
.messages-area {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #4b5563;
  padding: 60px 0;
  text-align: center;
}

.empty-icon {
  opacity: 0.3;
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.message-row.self {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.msg-bubble-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 72%;
}

.message-row.self .msg-bubble-group {
  align-items: flex-end;
}

.msg-sender {
  font-size: 0.75rem;
  font-weight: 600;
  color: #a78bfa;
  padding-left: 4px;
}

.msg-bubble {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px 18px 18px 4px;
  padding: 10px 16px;
  font-size: 0.95rem;
  line-height: 1.5;
  word-break: break-word;
}

.message-row.self .msg-bubble {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.3);
  border-radius: 18px 18px 4px 18px;
}

.msg-time {
  font-size: 0.7rem;
  color: #6b7280;
  padding-left: 4px;
}

/* Input */
.input-area {
  padding: 16px 0 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.error-toast {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.slow-mode-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
}

.input-row {
  display: flex;
  gap: 12px;
}

.message-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px 18px;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.message-input::placeholder {
  color: #4b5563;
}

.message-input:focus {
  outline: none;
  border-color: #a78bfa;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.12);
}

.message-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
  border: none;
  border-radius: 14px;
  color: #fff;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
