<template>
  <div class="d-flex" style="min-height: 100vh;">
    <!-- Sidebar -->
    <div
      class="sidebar bg-dark text-white d-flex flex-column"
      :class="{ collapsed: isCollapsed, mobileOpen: isMobileOpen }"
    >
      <!-- Header -->
      <div
        class="sidebar-header d-flex justify-content-between align-items-center px-3 py-3 border-bottom border-secondary"
      >
        <h5 v-if="!isCollapsed" class="fw-bold mb-0">Owner Panel</h5>
        <i v-else class="bi bi-house-door fs-3" :title="'Owner Panel'"></i>

        <!-- Toggle Button -->
        <button class="toggle-btn" @click="toggleSidebar">
          <i :class="isCollapsed ? 'bi bi-list' : 'bi bi-x-lg'"></i>
        </button>
      </div>

      <!-- Navigation -->
      <ul class="nav flex-column flex-grow-1 mt-3">
        <li v-for="item in navItems" :key="item.name" class="nav-item">
          <RouterLink
            :to="item.route"
            class="nav-link d-flex align-items-center px-3 py-2"
            :class="{ active: $route.path === item.route }"
            @click="closeOnMobile"
          >
            <i :class="item.icon + ' fs-5'" :title="item.name"></i>
            <transition name="fade">
              <span v-if="!isCollapsed" class="ms-3">{{ item.name }}</span>
            </transition>
          </RouterLink>
        </li>
      </ul>
    </div>

    <!-- Overlay for mobile -->
    <div v-if="isMobileOpen" class="overlay" @click="closeOnMobile"></div>

    <!-- Main Content -->
    <div class="flex-grow-1 p-4">
      <!-- Top Bar -->
      <div
        class="d-flex justify-content-between align-items-center mb-4 flex-wrap"
      >
        <!-- Mobile Hamburger -->
        <button
          class="btn btn-outline-primary d-md-none me-3 mb-2"
          @click="toggleSidebar"
        >
          <i class="bi bi-list fs-3"></i>
        </button>

        <h3 class="fw-bold mb-0">Welcome, Owner</h3>

        <!-- Profile Dropdown -->
        <div class="dropdown">
          <button
            class="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person-circle me-2"></i>
            Profile
          </button>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdownMenuButton"
          >
            <li>
              <RouterLink to="/home" class="dropdown-item">
                <i class="bi bi-house-door me-2"></i> Go to Home
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/profile" class="dropdown-item">
                <i class="bi bi-gear me-2"></i> Account Settings
              </RouterLink>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <button @click="handleLogout" class="dropdown-item text-danger">
                <i class="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Dynamic Page Content -->
      <router-view />
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { logout } from "@/api/auth";
import { useUserInfo } from "@/store/userInfo";

export default {
  name: "OwnerDashboard",
  components: { RouterLink },
  data() {
    return {
      isCollapsed: true,
      isMobileOpen: false,
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
  methods: {
    toggleSidebar() {
      if (window.innerWidth <= 768) {
        this.isMobileOpen = !this.isMobileOpen;
      } else {
        this.isCollapsed = !this.isCollapsed;
      }
    },
    closeOnMobile() {
      if (window.innerWidth <= 768) {
        this.isMobileOpen = false;
      }
    },
    async handleLogout() {
      try {
        await logout();
        const info = useUserInfo();
        info.logout();
        this.$router.push("/login");
      } catch (error) {
        alert(error.response?.data?.message || "Something went wrong!");
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
/* Sidebar */
.sidebar {
  width: 260px;
  transition: width 0.3s ease, transform 0.3s ease;
  overflow: hidden;
}
.sidebar.collapsed {
  width: 80px;
}

/* Mobile sidebar */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 260px;
    transform: translateX(-100%);
    z-index: 1050;
  }
  .sidebar.mobileOpen {
    transform: translateX(0);
  }
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1040;
}

/* Header & toggle */
.sidebar-header {
  position: relative;
}
.toggle-btn {
  border: none;
  background: transparent;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.toggle-btn:hover {
  transform: scale(1.1);
}

/* Navigation links */
.nav-link {
  color: #cfcfcf;
  border-radius: 6px;
  transition: all 0.25s ease;
}
.nav-link:hover,
.nav-link.active {
  background: rgba(13, 110, 253, 0.9);
  color: #fff;
}
.sidebar i {
  min-width: 30px;
  text-align: center;
}

/* Smooth fade for collapsed labels */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Main content scroll */
.flex-grow-1 {
  overflow-y: auto;
  min-height: 100vh;
}

/* Top bar responsive spacing */
@media (max-width: 768px) {
  .flex-grow-1 {
    padding: 1rem !important;
  }
}
</style>
