<template>
  <div class="dashboard-wrapper">
    <aside 
      class="main-sidebar" 
      :class="{ 'is-collapsed': isCollapsed, 'is-mobile-open': isMobileOpen }"
    >
      <div class="sidebar-brand">
        <div class="brand-logo">
          <i class="bi bi-house-door-fill text-white"></i>
        </div>
        <span v-if="!isCollapsed" class="brand-name d-none d-md-block">Owner Dashboard</span>
      </div>

      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.route"
          class="nav-item-link"
          :class="{ active: $route.path === item.route }"
          @click="closeOnMobile"
        >
          <i :class="item.icon" class="nav-icon" :title="item.name"></i>
          <span v-if="!isCollapsed" class="nav-label d-none d-md-block">{{ item.name }}</span>
          <div v-if="$route.path === item.route" class="active-indicator"></div>
        </RouterLink>
      </nav>

      <div class="sidebar-footer border-top border-secondary border-opacity-10">
        <button class="collapse-toggle d-none d-md-flex" @click="isCollapsed = !isCollapsed">
          <i :class="isCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"></i>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <header class="content-header px-3">
        <div class="d-flex align-items-center">
          <button class="mobile-burger-btn d-md-none me-3" @click="isMobileOpen = !isMobileOpen">
            <i class="bi bi-list fs-4"></i>
          </button>
        </div>

        <div class="header-actions">
          <div class="dropdown">
            <button class="profile-pill" data-bs-toggle="dropdown">
              <div class="avatar-box">{{ first_name[0] }}{{ last_name[0] }}</div>
              <span class="ms-2 d-none d-md-inline small fw-bold">{{ first_name }} {{ last_name }}</span>
              <i class="bi bi-chevron-down ms-2 small opacity-50"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end border-0 shadow mt-2">
              <li><RouterLink to="/home" class="dropdown-item">Home</RouterLink></li>
              <li><RouterLink to="/profile" class="dropdown-item">Settings</RouterLink></li>
              <li><hr class="dropdown-divider"></li>
              <li><button @click="handleLogout" class="dropdown-item text-danger">Logout</button></li>
            </ul>
          </div>
        </div>
      </header>

      <div class="page-container p-3 p-md-4">
        <router-view />
      </div>
    </main>

    <div v-if="isMobileOpen" class="sidebar-overlay d-md-none" @click="isMobileOpen = false"></div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { logout } from "@/api/auth";
import { useUserInfo } from "@/store/userInfo";
import { nextTick } from "vue";

export default {
  name: "OwnerDashboard",
  components: { RouterLink },
  data() {
    return {
      first_name : "Owner",
      last_name : "Account",
      isCollapsed: false, // Desktop starts expanded
      isMobileOpen: false, // Mobile starts hidden
      navItems: [
        { name: "Overview", route: "/overview", icon: "bi bi-speedometer2" },
        { name: "Properties", route: "/properties", icon: "bi bi-building" },
        { name: "Tenants", route: "/tenants", icon: "bi bi-people" },
        { name: "Bookings", route: "/bookings", icon: "bi bi-book" },
        { name: "Billing", route: "/billing", icon: "bi bi-cash-stack" },
        { name: "Account Ledger", route: "/ledger", icon: "bi bi-wallet" },
        { name: "Reports", route: "/reports", icon: "bi bi-bar-chart-line" },
      ],
    };
  },
  mounted(){
    this.$nextTick(() => {
      this.getUser();
    })
  },
  methods: {
    closeOnMobile() {
      if (window.innerWidth <= 768) {
        this.isMobileOpen = false;
      }
    },
    getUser(){
      const info = useUserInfo();
      this.first_name = info.first_name;
      this.last_name = info.last_name;
    },
    async handleLogout() {
      try {
        await logout();
        const info = useUserInfo();
        info.logout();
        this.$router.push("/login");
      } catch (error) {
        console.error(error);
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
.dashboard-wrapper {
  --dash-bg: #f3f6fb;
  --dash-surface: rgba(255, 255, 255, 0.78);
  --dash-border: rgba(15, 23, 42, 0.08);
  --dash-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  --dash-accent: #2b6af3;
  --dash-accent-soft: rgba(43, 106, 243, 0.18);
  --dash-ink: #0f172a;
  --dash-muted: #64748b;
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background:
    radial-gradient(circle at 0 0, rgba(209, 226, 255, 0.6), transparent 45%),
    radial-gradient(circle at 100% 0, rgba(255, 244, 229, 0.6), transparent 40%),
    var(--dash-bg);
}

/* --- SIDEBAR --- */
.main-sidebar {
  width: 260px;
  background:
    linear-gradient(160deg, rgba(18, 22, 36, 0.98) 0%, rgba(26, 34, 58, 0.96) 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease;
  z-index: 2000;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.03);
}

/* Desktop Collapse State */
.main-sidebar.is-collapsed { width: 80px; }

/* Mobile logic: acts as a floating icon bar */
@media (max-width: 768px) {
  .main-sidebar {
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    width: 74px; /* Only wide enough for icons */
    transform: translateX(-100%);
  }
  .main-sidebar.is-mobile-open {
    transform: translateX(0);
  }
  /* Force labels hidden on mobile regardless of collapse state */
  .nav-label { display: none !important; }
}

/* --- BRAND --- */
.sidebar-brand {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.04);
}
.brand-logo {
  width: 35px;
  height: 35px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(43, 106, 243, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
}
.brand-name { margin-left: 12px; font-weight: 700; }

/* --- NAVIGATION --- */
.sidebar-nav {
  flex-grow: 1;
  padding: 15px 10px;
  overflow-y: auto;
}
.nav-item-link {
  display: flex;
  align-items: center;
  justify-content: center; /* Center icons for mobile/collapsed */
  padding: 12px 14px;
  color: #a2a3b7;
  text-decoration: none;
  border-radius: 12px;
  margin-bottom: 5px;
  position: relative;
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}
@media (min-width: 769px) {
  /* Only align left if desktop and NOT collapsed */
  .main-sidebar:not(.is-collapsed) .nav-item-link {
    justify-content: flex-start;
  }
}

.nav-item-link:hover, .nav-item-link.active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.nav-item-link.active {
  color: #8fb8ff;
  background: rgba(54, 153, 255, 0.16);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.18);
}

.nav-icon { font-size: 1.3rem; }
.nav-label { margin-left: 12px; font-size: 0.9rem; }
.active-indicator {
  position: absolute;
  right: 8px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--dash-accent);
  box-shadow: 0 0 12px rgba(43, 106, 243, 0.6);
}

/* --- CONTENT AREA --- */
.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  z-index: 1;
}
.content-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--dash-border);
  background: var(--dash-surface);
  backdrop-filter: blur(16px);
  box-shadow: var(--dash-shadow);
  position: relative;
  z-index: 5;
  overflow: visible;
}
.page-container {
  flex-grow: 1;
  overflow-y: auto;
  color: var(--dash-ink);
}

/* --- MOBILE HELPERS --- */
.mobile-burger-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--dash-border);
  border-radius: 6px;
  padding: 5px 10px;
}
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(9, 14, 24, 0.35);
  backdrop-filter: blur(6px);
  z-index: 1500;
}

.profile-pill {
  background: rgba(255, 255, 255, 0.85);
  padding: 6px 12px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  border: 1px solid var(--dash-border);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}
.profile-pill:focus-visible {
  outline: 2px solid var(--dash-accent);
  outline-offset: 2px;
}
.dropdown-menu {
  z-index: 10;
}
.avatar-box {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2b6af3, #2dd4bf);
  color: #fff;
}
.sidebar-footer { padding: 10px; text-align: center; }
.collapse-toggle {
  background: transparent;
  border: none;
  color: #a2a3b7;
  font-size: 1.2rem;
  width: 100%;
  justify-content: center;
}

@media (prefers-reduced-motion: reduce) {
  .nav-item-link,
  .main-sidebar,
  .profile-pill {
    transition: none !important;
  }
}
</style>
