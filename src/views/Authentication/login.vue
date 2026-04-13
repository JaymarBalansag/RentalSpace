<template>
  <Header />

  <successToast
    v-if="showSuccess"
    message="Registration successful! Please log in."
  ></successToast>

  <div
    class="auth-container d-flex align-items-center justify-content-center min-vh-100 py-5 px-3"
  >
    <div class="card shadow-lg border-0 rounded-4 auth-card overflow-hidden">
      <div class="auth-accent-line"></div>

      <div class="card-body p-4 p-md-5">
        <div class="text-center mb-4">
          <div class="logo-wrapper mb-3 mx-auto shadow-sm">
            <i class="bi bi-house-heart-fill text-primary fs-1"></i>
          </div>
          <h3 class="fw-bold text-dark mb-1">Welcome</h3>
          <p class="text-muted small">Enter your credentials to access RentaHub</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Email Address</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 rounded-start-3">
                <i class="bi bi-person text-muted"></i>
              </span>
              <input
                type="email"
                class="form-control rounded-end-3 shadow-none border-start-0 custom-input"
                placeholder="name@email.com"
                v-model="form.email"
                required
              />
            </div>
          </div>

          <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <label class="form-label small fw-bold text-secondary">Password</label>
            </div>
            <div class="position-relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                class="form-control rounded-3 shadow-none pe-5 custom-input"
                placeholder="password"
                required
              />
              <button
                type="button"
                class="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted text-decoration-none"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <div class="mb-4 form-check">
            <input
              id="rememberEmail"
              v-model="rememberEmail"
              type="checkbox"
              class="form-check-input"
            />
            <label class="form-check-label small text-secondary" for="rememberEmail">
              Remember email on this device
            </label>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 rounded-3 py-3 fw-bold shadow-sm submit-btn d-flex align-items-center justify-content-center"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
              role="status"
            ></span>
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>
        </form>

        <div class="d-flex align-items-center my-4">
          <hr class="flex-grow-1 text-muted opacity-25" />
          <span class="px-3 text-muted small fw-bold">OR</span>
          <hr class="flex-grow-1 text-muted opacity-25" />
        </div>

        <p class="text-center mb-0 small">
          Don't have an account?
          <router-link
            to="/register"
            class="fw-bold text-primary text-decoration-none hover-underline"
          >
            Create an account
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/auth';
import { useUserInfo } from '@/store/userInfo';
import successToast from '@/components/successToast.vue';
import { getOwnerSubscriptionStatus } from '@/api/subscription';
import Header from '@/components/Header.vue';
import Swal from 'sweetalert2';

export default {
  name: "Login",
  components: {
    successToast,
    Header,
  },
  data() {
    return {
      form: { email: '', password: '' },
      rememberEmail: false,
      showSuccess: false,
      showPassword: false,
      loading: false,
    };
  },
  methods: {
    async warmOwnerSubscription(info) {
      try {
        const ownerSubscription = await getOwnerSubscriptionStatus();
        info.setSubscriptionStatus(ownerSubscription);

        if (ownerSubscription?.is_expiring_soon) {
          sessionStorage.setItem(
            "ownerSubscriptionWarning",
            ownerSubscription.message ||
              `Your subscription will expire in ${ownerSubscription.days_left} day(s).`
          );
        }
      } catch (subscriptionError) {
        console.warn("Subscription status fetch failed during login:", subscriptionError);
      }
    },
    async handleLogin() {
      const info = useUserInfo();
      const email = this.form.email.trim().toLowerCase();

      if (!email) {
        await Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: 'Please enter your email address.',
        });
        return;
      }

      this.loading = true;

      try {
        const res = await login(email, this.form.password);

        if (!res) {
          await Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid credentials. Please check your email and password.',
          });
          return;
        }

        await info.fetchCurrentUser();

        if (info.role === "owner") {
          void this.warmOwnerSubscription(info);
        } else {
          info.clearSubscriptionStatus();
        }

        if (this.rememberEmail) {
          localStorage.setItem("remember_email_enabled", "true");
          localStorage.setItem("remembered_email", email);
        } else {
          localStorage.removeItem("remembered_email");
          localStorage.setItem("remember_email_enabled", "false");
        }

        if (info.email_verified_at === null) {
          this.$router.push("/reverify-email");
          return;
        }

        sessionStorage.setItem("loginSuccess", "true");
        this.$router.push("/home");
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Something went wrong during login.";

        await Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: message,
        });
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    const rememberEmailEnabled =
      localStorage.getItem("remember_email_enabled") === "true";
    const rememberedEmail = localStorage.getItem("remembered_email") || "";

    if (rememberEmailEnabled && rememberedEmail) {
      this.form.email = rememberedEmail;
      this.rememberEmail = true;
    }

    const registerSuccess = sessionStorage.getItem("registerSuccess");
    if (registerSuccess) {
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 5000);
      sessionStorage.removeItem("registerSuccess");
    }
  },
};
</script>

<style scoped>
.auth-container {
  background-color: #f4f7fe;
  background-image: radial-gradient(#4780d9 0.5px, transparent 0.5px);
  background-size: 24px 24px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: white;
}

.auth-accent-line {
  height: 6px;
  background: linear-gradient(90deg, #4780d9, #ffd166);
}

.logo-wrapper {
  width: 64px;
  height: 64px;
  background: #f0f7ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-input {
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.custom-input:focus {
  border-color: #4780d9;
  background-color: #fcfdff;
  box-shadow: 0 0 0 3px rgba(71, 128, 217, 0.1);
}

.submit-btn {
  background-color: #4780d9;
  border: none;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #366ac2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 128, 217, 0.2);
}

.submit-btn:active {
  transform: translateY(0);
}

.hover-underline:hover {
  text-decoration: underline !important;
}

@media (max-width: 576px) {
  .auth-card {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none !important;
  }

  .auth-container {
    padding: 0 !important;
    background: white;
  }
}
</style>
