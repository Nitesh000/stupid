<script setup lang="ts">
import { ref, onMounted } from "vue";
import { animate, stagger } from "animejs";
import { CreditCard, Zap, Star, Rocket, ArrowLeft } from "lucide-vue-next";

const showConfetti = ref(false);
const purchasedTier = ref("");

const tiers = [
  {
    id: "stupid",
    name: "Stupid",
    price: "$0",
    emoji: "🥚",
    color: "#6b7280",
    features: [
      "Access to absolutely nothing",
      "A warm feeling inside",
      "The privilege of existing here",
      "Same as the free tier (this IS the free tier)",
    ],
  },
  {
    id: "stupider",
    name: "Stupider",
    price: "$9.99",
    emoji: "🐔",
    color: "#a78bfa",
    popular: true,
    features: [
      "Everything from Stupid",
      "A fake badge next to your name",
      "Priority queue on the waitlist for features we'll never build",
      "We'll think about you occasionally",
    ],
  },
  {
    id: "stupidest",
    name: "Stupidest",
    price: "$99.99",
    emoji: "🦖",
    color: "#ec4899",
    features: [
      "Everything from Stupider",
      "A hand-written letter saying 'why?'",
      "Your name in our hearts (but not the code)",
      "A personal apology from the developer",
      "Literally nothing else, we are so sorry",
    ],
  },
];

const handlePurchase = (tierName: string) => {
  purchasedTier.value = tierName;
  showConfetti.value = true;
  setTimeout(() => (showConfetti.value = false), 4000);
};

onMounted(() => {
  animate(".payment-title", {
    opacity: [0, 1],
    y: [-20, 0],
    duration: 700,
    ease: "outQuad",
  });

  animate(".pricing-card", {
    opacity: [0, 1],
    y: [30, 0],
    duration: 600,
    delay: stagger(120),
    ease: "outBack",
  });
});
</script>

<template>
  <div class="payment-wrapper">
    <div class="stars"></div>

    <div class="top-bar">
      <router-link to="/dashboard" class="back-link">
        <ArrowLeft :size="18" />
        <span>Back to Dashboard</span>
      </router-link>
    </div>

    <!-- Confetti overlay -->
    <Transition name="fade">
      <div v-if="showConfetti" class="confetti-overlay">
        <div class="confetti-msg">
          <span class="big-emoji">🎉</span>
          <h2>You bought <span class="tier-name">{{ purchasedTier }}</span>!</h2>
          <p>The hamsters in our servers are crying tears of joy. Nothing will change for you. We promise.</p>
        </div>
      </div>
    </Transition>

    <main class="payment-container">
      <header class="payment-header">
        <CreditCard :size="36" class="card-icon" />
        <h1 class="payment-title">Donate for No Reason</h1>
        <p class="payment-subtitle">Give us money. We will do absolutely nothing in return. You have our word.</p>
      </header>

      <div class="pricing-grid">
        <div
          v-for="tier in tiers"
          :key="tier.id"
          class="pricing-card"
          :class="{ popular: tier.popular }"
        >
          <div v-if="tier.popular" class="popular-badge">
            <Star :size="12" />
            Most Popular (Somehow)
          </div>

          <div class="tier-emoji">{{ tier.emoji }}</div>
          <h2 class="tier-name-heading">{{ tier.name }}</h2>
          <div class="tier-price">{{ tier.price }}</div>
          <p class="tier-period">per month / per year / forever / who knows</p>

          <ul class="feature-list">
            <li v-for="feature in tier.features" :key="feature">
              <Zap :size="14" class="feature-icon" />
              {{ feature }}
            </li>
          </ul>

          <button
            class="buy-btn"
            :style="{ background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}aa 100%)` }"
            @click="handlePurchase(tier.name)"
          >
            <Rocket :size="18" />
            <span>{{ tier.price === '$0' ? 'Join for Free' : `Pay ${tier.price}` }}</span>
          </button>
        </div>
      </div>

      <p class="disclaimer">
        * All purchases are final. All purchases are also fake. No real payment processor was harmed in the making of this page. Powered by vibes and Dodo Payments (not really).
      </p>
    </main>
  </div>
</template>

<style scoped>
.payment-wrapper {
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
  inset: 0;
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
  max-width: 1100px;
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

/* Confetti overlay */
.confetti-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.confetti-msg {
  text-align: center;
  padding: 48px;
  background: rgba(22, 17, 36, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  max-width: 480px;
}

.big-emoji {
  font-size: 4rem;
  display: block;
  margin-bottom: 16px;
}

.confetti-msg h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 12px;
}

.confetti-msg .tier-name {
  color: #a78bfa;
}

.confetti-msg p {
  color: #9ca3af;
  line-height: 1.6;
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Payment container */
.payment-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 60px;
  position: relative;
  z-index: 10;
}

.payment-header {
  text-align: center;
  margin-bottom: 56px;
}

.card-icon {
  color: #a78bfa;
  margin-bottom: 12px;
}

.payment-title {
  font-size: 2.8rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
}

.payment-subtitle {
  color: #9ca3af;
  font-size: 1.05rem;
  margin: 0;
  max-width: 560px;
  margin: 0 auto;
}

/* Pricing grid */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
  margin-bottom: 40px;
}

.pricing-card {
  background: rgba(22, 17, 36, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  opacity: 0;
}

.pricing-card.popular {
  border-color: rgba(167, 139, 250, 0.3);
  background: rgba(167, 139, 250, 0.05);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #8b5cf6, #d946ef);
  padding: 4px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tier-emoji {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.tier-name-heading {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0 0 6px;
  letter-spacing: -0.5px;
}

.tier-price {
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -1px;
  margin-bottom: 4px;
}

.tier-period {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0 0 24px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  color: #d1d5db;
  line-height: 1.4;
}

.feature-icon {
  color: #a78bfa;
  flex-shrink: 0;
  margin-top: 2px;
}

.buy-btn {
  border: none;
  border-radius: 14px;
  color: #fff;
  padding: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.buy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.disclaimer {
  text-align: center;
  font-size: 0.8rem;
  color: #4b5563;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}
</style>
