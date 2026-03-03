<template>
  <Header />

  <div class="settings-page container py-4">
    <RouterLink to="/home" class="btn btn-outline-secondary rounded-pill px-3 mb-3">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <section class="settings-hero rounded-4 shadow-sm p-4 p-md-5 mb-4">
      <p class="small text-uppercase mb-1 hero-kicker">Account Controls</p>
      <h3 class="fw-bold mb-2">Settings</h3>
      <p class="text-muted mb-0">
        Manage security, notification preferences, and privacy options for your account.
      </p>
    </section>

    <div class="row g-4">
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <h6 class="section-title mb-3">
              <i class="bi bi-shield-lock me-2 text-primary"></i>Security
            </h6>

            <div class="setting-item">
              <div>
                <p class="item-title">Change Password</p>
                <p class="item-desc">Update your password regularly to secure your account.</p>
              </div>
              <button class="btn btn-sm btn-outline-primary rounded-pill px-3" @click="$router.push('/change-pass')">
                Update
              </button>
            </div>

            <div class="setting-item">
              <div>
                <p class="item-title">Profile Hub</p>
                <p class="item-desc">Edit your personal info, location, and preferences.</p>
              </div>
              <button class="btn btn-sm btn-light border rounded-pill px-3" @click="$router.push('/profile')">
                Open
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <h6 class="section-title mb-3">
              <i class="bi bi-bell me-2 text-warning"></i>Notifications
            </h6>

            <div class="setting-item">
              <div>
                <p class="item-title">In-App Notifications</p>
                <p class="item-desc">Receive booking, chat, and property activity alerts.</p>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="enableNotifications" @change="persistPreferences" />
              </div>
            </div>

            <div class="setting-item">
              <div>
                <p class="item-title">Email Updates</p>
                <p class="item-desc">Get important account and activity summaries by email.</p>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="enableEmailUpdates" @change="persistPreferences" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <h6 class="section-title mb-3">
              <i class="bi bi-eye me-2 text-info"></i>Privacy
            </h6>

            <div class="setting-item">
              <div>
                <p class="item-title">Profile Visibility</p>
                <p class="item-desc">Required for booking verification and owner screening.</p>
              </div>
              <div class="locked-pill">
                <i class="bi bi-lock-fill me-1"></i>Always On
              </div>
            </div>

            <div class="setting-item">
              <div>
                <p class="item-title">Location Usage</p>
                <p class="item-desc">Use your saved location for smarter recommendations.</p>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="locationUsage" @change="persistPreferences" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <h6 class="section-title mb-3">
              <i class="bi bi-box-arrow-right me-2 text-danger"></i>Session
            </h6>
            <p class="text-muted small mb-3">
              Signed in as <strong>{{ displayName }}</strong>. You can safely log out from this device.
            </p>
            <button class="btn btn-danger rounded-pill px-4 fw-semibold" :disabled="loggingOut" @click="handleLogout">
              <span v-if="loggingOut" class="spinner-border spinner-border-sm me-2"></span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import Header from "@/components/Header.vue";
import { useUserInfo } from "@/store/userInfo";
import { logout } from "@/api/auth";
import Swal from "sweetalert2";

export default {
  name: "SettingsPage",
  components: { RouterLink, Header },
  data() {
    return {
      enableNotifications: true,
      enableEmailUpdates: true,
      locationUsage: true,
      loggingOut: false,
    };
  },
  computed: {
    displayName() {
      const info = useUserInfo();
      return `${info.first_name || ""} ${info.last_name || ""}`.trim() || "User";
    },
  },
  mounted() {
    this.hydratePreferences();
  },
  methods: {
    hydratePreferences() {
      const raw = localStorage.getItem("userSettings");
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        this.enableNotifications = parsed.enableNotifications ?? true;
        this.enableEmailUpdates = parsed.enableEmailUpdates ?? true;
        this.locationUsage = parsed.locationUsage ?? true;
      } catch {
        localStorage.removeItem("userSettings");
      }
    },
    persistPreferences() {
      localStorage.setItem(
        "userSettings",
        JSON.stringify({
          enableNotifications: this.enableNotifications,
          enableEmailUpdates: this.enableEmailUpdates,
          locationUsage: this.locationUsage,
        })
      );
    },
    async handleLogout() {
      this.loggingOut = true;
      try {
        await logout();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        const info = useUserInfo();
        info.logout();
        this.loggingOut = false;
        await Swal.fire({
          icon: "success",
          title: "Signed out",
          timer: 900,
          showConfirmButton: false,
        });
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
.settings-page {
  max-width: 980px;
  background: radial-gradient(circle at top right, rgba(71, 128, 217, 0.08) 0%, rgba(255, 255, 255, 0) 55%);
}

.settings-hero {
  border: 1px solid #e7eefb;
  background: linear-gradient(180deg, #f8fbff 0%, #f3f7ff 100%);
}

.hero-kicker {
  color: #4871b3;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.section-title {
  font-size: 1rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #4b5d79;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid #e8edf7;
  border-radius: 14px;
  padding: 0.9rem 1rem;
  background: #fbfcff;
  margin-bottom: 0.75rem;
}

.item-title {
  margin-bottom: 0.2rem;
  font-weight: 600;
  color: #1f2d45;
}

.item-desc {
  margin-bottom: 0;
  font-size: 0.82rem;
  color: #66758f;
}

.form-check-input {
  width: 2.4rem;
  height: 1.3rem;
}

.form-check-input:checked {
  background-color: #4b81dc;
  border-color: #4b81dc;
}

.locked-pill {
  font-size: 0.74rem;
  font-weight: 700;
  color: #2f5da7;
  background: #e8f0ff;
  border: 1px solid #d4e2ff;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
}

@media (max-width: 575px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
