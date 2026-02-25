<template>
  <div class="verify-wrapper">
    <nav class="top-nav">
      <button @click="handleLogout" class="btn-text">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        Logout
      </button>
    </nav>

    <div class="verify-card">
      <div class="icon-circle">
        <span class="envelope-icon">✉️</span>
      </div>
      
      <h2>Verify your email</h2>
      <p class="text-muted">
        We've sent a verification link to your email. Please check your inbox and click the link to activate your account.
      </p>

      <div class="action-area">
        <button
          class="btn-primary"
          :disabled="loading || countdown > 0"
          @click="resendVerification"
        >
          <span v-if="loading">Sending...</span>
          <span v-else-if="countdown > 0">Resend in {{ countdown }}s</span>
          <span v-else>Resend Verification Email</span>
        </button>

        <transition name="fade">
          <div v-if="success" class="alert success-alert">
            <span class="icon">✓</span> Email sent! Check your spam folder if you don't see it.
          </div>
        </transition>

        <transition name="fade">
          <div v-if="error" class="alert error-alert">
            <span class="icon">⚠️</span> {{ error }}
          </div>
        </transition>
      </div>

    </div>
  </div>
</template>

<script>
import api from '@/api/api';
import { RouterLink } from 'vue-router';
import { logout } from '@/api/auth';
import { useUserInfo } from '@/store/userInfo';

export default {
  name: "ResendVerifyEmail",
  data() {
    return {
      loading: false,
      success: false,
      error: null,
      countdown: 0, // Prevent spamming the button
    };
  },
  methods: {
    async resendVerification() {
      this.loading = true;
      this.success = false;
      this.error = null;

      try {
        await api.post("/email/verification-notification");
        this.success = true;  
        this.startCountdown();
      } catch (err) {
        if (err.response?.status === 400) {
          this.error = "Your email is already verified.";
        } else if (err.response?.status === 429) {
          this.error = "Too many requests. Please wait a moment.";
          this.startCountdown(60); // Force 60s wait
        } else {
          this.error = "Something went wrong. Please try again.";
        }
      } finally {
        this.loading = false;
        this.startPolling();
      }
    },
    startCountdown(seconds = 30) {
      this.countdown = seconds;
      const interval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) clearInterval(interval);
      }, 1000);
    },
    async handleLogout() {
      try {
        await logout();
        const info = useUserInfo();
        info.logout();
        this.$router.push("/login");
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
          this.$router.push("/login");
        } else {
          alert("Something went wrong!");
        }
      }
    },
    startPolling(){
      this.checkStatusInterval = setInterval(() => {
        console.log("log: Checking verification status...");
        this.getVerificationStatus();
        }, 3000);
    },
    clearPolling(){
      if(this.checkStatusInterval){
        clearInterval(this.checkStatusInterval);
        this.checkStatusInterval = null;
      }
    },
    async getVerificationStatus(){
      const response = await api.get(`/check-resend-verification-status`);
      const info = useUserInfo();

      if(response.data.is_verified){
        this.clearPolling();
        info.email_verified_at = new Date().toISOString();
        this.$router.push('/home');
      }

    }
  },
};
</script>

<style scoped>
/* Layout */
.verify-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  font-family: 'Inter', -apple-system, sans-serif;
  padding: 20px;
}

/* Navigation */
.top-nav {
  position: absolute;
  top: 0;
  width: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: flex-end;
}

/* Card Styling */
.verify-card {
  background: #ffffff;
  padding: 2.5rem;
  width: 100%;
  max-width: 440px;
  text-align: center;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.icon-circle {
  width: 64px;
  height: 64px;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.envelope-icon {
  font-size: 1.5rem;
}

h2 {
  color: #111827;
  font-weight: 700;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
}

.text-muted {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* Buttons */
.btn-primary {
  width: 100%;
  padding: 0.8rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.btn-text {
  background: transparent;
  border: none;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-text:hover {
  color: #1e293b;
}

/* Alerts */
.alert {
  margin-top: 1.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.success-alert {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.error-alert {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.footer-note {
  margin-top: 2rem;
  font-size: 0.85rem;
  color: #9ca3af;
}

.footer-note a {
  color: #2563eb;
  text-decoration: none;
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>