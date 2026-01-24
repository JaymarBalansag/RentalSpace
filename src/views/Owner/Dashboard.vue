<template>
  <div class="dashboard-wrapper">
    <aside 
      class="main-sidebar" 
      :class="{ 'is-collapsed': isCollapsed, 'is-mobile-open': isMobileOpen }"
    >
      <div class="sidebar-brand">
        <div class="brand-logo bg-primary shadow-sm">
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
      <header class="content-header shadow-sm bg-white px-3">
        <div class="d-flex align-items-center">
          <button class="mobile-burger-btn d-md-none me-3" @click="isMobileOpen = !isMobileOpen">
            <i class="bi bi-list fs-4"></i>
          </button>
        </div>

        <div class="header-actions">
          <div class="dropdown">
            <button class="profile-pill border" data-bs-toggle="dropdown">
              <div class="avatar-box bg-primary text-white">{{ first_name[0] }}{{ last_name[0] }}</div>
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
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f4f7f6;
}

/* --- SIDEBAR --- */
.main-sidebar {
  width: 260px;
  background: #1e1e2d;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease;
  z-index: 2000;
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
    width: 70px; /* Only wide enough for icons */
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
  background: rgba(0,0,0,0.15);
}
.brand-logo {
  width: 35px;
  height: 35px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 12px;
  color: #a2a3b7;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 5px;
  position: relative;
}
@media (min-width: 769px) {
  /* Only align left if desktop and NOT collapsed */
  .main-sidebar:not(.is-collapsed) .nav-item-link {
    justify-content: flex-start;
  }
}

.nav-item-link:hover, .nav-item-link.active {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.nav-item-link.active {
  color: #3699ff;
  background: rgba(54, 153, 255, 0.1);
}

.nav-icon { font-size: 1.3rem; }
.nav-label { margin-left: 12px; font-size: 0.9rem; }

/* --- CONTENT AREA --- */
.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.content-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ebedef;
}
.page-container {
  flex-grow: 1;
  overflow-y: auto;
}

/* --- MOBILE HELPERS --- */
.mobile-burger-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 5px 10px;
}
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(2px);
  z-index: 1500;
}

.profile-pill {
  background: #fff;
  padding: 4px 10px;
  border-radius: 50px;
  display: flex;
  align-items: center;
}
.avatar-box {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
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
</style>