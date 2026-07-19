<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authClient } from "@/lib/auth-client";
import { useForm } from "vee-validate";
import { z } from "zod";
import { animate } from "animejs";
import { Github } from "lucide-vue-next";

const router = useRouter();
const isLogin = ref(true);
const serverError = ref("");
const loading = ref(false);
const formContainer = ref<HTMLElement | null>(null);

// Validation schema using Zod
const validationSchema = (values: any) => {
  const schema = isLogin.value
    ? z.object({
        email: z.email("Invalid email format"),
        password: z.string().min(1, "Password is required"),
      })
    : z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email format"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      });

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = String(issue.path[0]);
      errors[path] = issue.message;
    }
    return errors;
  }
  return {};
};

// Vee-Validate Form Configuration
const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema,
  initialValues: {
    name: "",
    email: "",
    password: "",
  },
});

const [name, nameProps] = defineField("name");
const [email, emailProps] = defineField("email");
const [password, passwordProps] = defineField("password");

// Animates form switching
const toggleMode = () => {
  serverError.value = "";
  resetForm();

  if (!formContainer.value) return;
  animate(formContainer.value, {
    opacity: [1, 0],
    y: [0, -10],
    duration: 200,
    ease: "inQuad",
    onComplete: () => {
      if (!formContainer.value) return;
      isLogin.value = !isLogin.value;
      animate(formContainer.value, {
        opacity: [0, 1],
        y: [10, 0],
        duration: 300,
        ease: "outQuad",
      });
    },
  });
};

const handleAuth = handleSubmit(async (values) => {
  serverError.value = "";
  loading.value = true;

  try {
    if (isLogin.value) {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      if (error) {
        serverError.value = error.message || "Failed to log in.";
      } else {
        router.push("/dashboard");
      }
    } else {
      const { error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });
      if (error) {
        serverError.value = error.message || "Failed to sign up.";
      } else {
        router.push("/dashboard");
      }
    }
  } catch (err: any) {
    serverError.value = err.message || "An unexpected error occurred.";
  } finally {
    loading.value = false;
  }
});

const handleSocialLogin = async (provider: "github") => {
  serverError.value = "";
  try {
    await authClient.signIn.social({
      provider,
      callbackURL: `${window.location.origin}/dashboard`,
    });
  } catch (err: any) {
    serverError.value = err.message || "OAuth login failed.";
  }
};

onMounted(async () => {
  try {
    // Check if session exists, redirect to dashboard if yes
    const { data: session } = await authClient.getSession();
    if (session) {
      router.push("/dashboard");
    }
  } catch (err) {
    console.error("Failed to fetch session:", err);
  }

  // Initial fade-in animation
  animate(".auth-card", {
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: 600,
    ease: "outElastic(1, .8)",
  });
});
</script>

<template>
  <div class="auth-wrapper">
    <div class="stars"></div>
    <div class="auth-card">
      <div class="logo-area">
        <img src="/stupid.svg" alt="logo" class="logo-img" />
        <h1 class="app-title">stupid</h1>
        <p class="app-tagline">The internet's least intelligent application</p>
      </div>

      <div class="tabs">
        <button
          type="button"
          :class="['tab-btn', { active: isLogin }]"
          @click="!isLogin && toggleMode()"
        >
          Login
        </button>
        <button
          type="button"
          :class="['tab-btn', { active: !isLogin }]"
          @click="isLogin && toggleMode()"
        >
          Register
        </button>
      </div>

      <div ref="formContainer" class="form-container">
        <form @submit="handleAuth" class="auth-form">
          <div v-if="!isLogin" class="form-group">
            <label for="name">Name</label>
            <input
              id="name"
              v-model="name"
              v-bind="nameProps"
              type="text"
              placeholder="Your silly name"
            />
            <span v-if="errors.name" class="field-error">{{
              errors.name
            }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              v-bind="emailProps"
              type="email"
              placeholder="email@example.com"
            />
            <span v-if="errors.email" class="field-error">{{
              errors.email
            }}</span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              v-bind="passwordProps"
              type="password"
              placeholder="••••••••"
            />
            <span v-if="errors.password" class="field-error">{{
              errors.password
            }}</span>
          </div>

          <div v-if="serverError" class="error-banner">
            {{ serverError }}
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>{{ isLogin ? "Proceed" : "Create Account" }}</span>
          </button>
        </form>

        <div class="divider">
          <span>or make it worse with</span>
        </div>

        <button
          type="button"
          class="github-btn"
          @click="handleSocialLogin('github')"
        >
          <Github class="github-icon" :size="20" />
          Sign in with GitHub
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #1b122c 0%, #0c0817 100%);
  position: relative;
  overflow: hidden;
  font-family: "Outfit", "Inter", sans-serif;
  color: #f3f4f6;
  padding: 20px;
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
  opacity: 0.15;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: rgba(22, 17, 36, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  z-index: 10;
  opacity: 0;
}

.logo-area {
  text-align: center;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-img {
  width: 72px;
  height: 72px;
  margin-bottom: 12px;
  filter: drop-shadow(0 0 2px rgba(167, 139, 250, 0.4));
}

.app-title {
  font-size: 3rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -2px;
}

.app-tagline {
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 6px 0 0 0;
}

.tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 28px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  color: #9ca3af;
  padding: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: #fff;
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #9ca3af;
  margin-bottom: 8px;
}

.form-group input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 16px;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #a78bfa;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15);
}

.field-error {
  font-size: 0.8rem;
  color: #fca5a5;
  margin-top: 6px;
}

.error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-bottom: 20px;
  text-align: center;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  padding: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.35);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #6b7280;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 24px 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.divider span {
  padding: 0 10px;
}

.github-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #fff;
  padding: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.github-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
}

.github-icon {
  color: #fff;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
