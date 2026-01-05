<template>
  <div class="d-flex" style="min-height: 100vh;">
    <!-- Sidebar -->
    <div
      class="sidebar bg-dark text-white d-flex flex-column"
      :class="{ collapsed: isCollapsed, mobileOpen: isMobileOpen }"
    >
      <!-- Header -->
      <div class="sidebar-header d-flex justify-content-between align-items-center px-3 py-3 border-bottom border-secondary">
        <h5 v-if="!isCollapsed" class="fw-bold mb-0">Admin Panel</h5>
        <i v-else class="bi bi-speedometer2 fs-3" :title="'Admin Panel'"></i>

        <!-- Toggle Button -->
        <button class="toggle-btn d-md-none" @click="toggleSidebar">
          <i :class="isMobileOpen ? 'bi bi-x-lg' : 'bi bi-list'"></i>
        </button>
      </div>

      <!-- Navigation -->
      <ul class="nav flex-column flex-grow-1 mt-3">
        <li v-for="item in navItems" :key="item.label" class="nav-item">
          <RouterLink
            :to="item.link"
            class="nav-link d-flex align-items-center px-3 py-2"
            :class="{ active: $route.path === item.link }"
            @click="closeOnMobile"
            :title="isCollapsed || isMobile ? item.label : ''"
          >
            <i :class="[item.icon, 'fs-5']" :title="item.label"></i>
            <transition name="fade">
              <span v-if="!isCollapsed && !isMobile" class="ms-3">{{ item.label }}</span>
            </transition>
          </RouterLink>
        </li>
      </ul>

      <!-- Bottom Logout -->
      <div class="p-3 border-top border-secondary">
        <RouterLink
          to="/logout"
          class="nav-link d-flex align-items-center text-danger"
          @click="closeOnMobile"
          :title="isCollapsed || isMobile ? 'Logout' : ''"
        >
          <i class="bi bi-box-arrow-right fs-5 me-2"></i>
          <span v-if="!isCollapsed && !isMobile">Logout</span>
        </RouterLink>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div v-if="isMobileOpen" class="overlay" @click="closeOnMobile"></div>

    <!-- Main Content -->
    <div class="flex-grow-1 p-4">
      <!-- Top Bar -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <!-- Mobile Hamburger -->
        <button class="btn btn-outline-primary d-md-none me-3 mb-2" @click="toggleSidebar">
          <i class="bi bi-list fs-3"></i>
        </button>

        <h4 class="fw-bold text-primary mb-2">Admin Dashboard</h4>

        <!-- Profile Dropdown -->
        <div class="d-flex align-items-center gap-2">
          <!-- Notifications -->
          <button class="btn btn-outline-primary">
            <i class="bi bi-bell"></i>
          </button>

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
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
              <li>
                <RouterLink to="/home" class="dropdown-item">
                  <i class="bi bi-house-door me-2"></i> Home
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/profile" class="dropdown-item">
                  <i class="bi bi-gear me-2"></i> Settings
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button @click="" class="dropdown-item text-danger">
                  <i class="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Dynamic Content -->
      <router-view />
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
  name: "AdminDashboard",
  components: { RouterLink },
  data() {
    return {
      isCollapsed: false, // desktop sidebar starts expanded
      isMobileOpen: false,
      isMobile: false,
      navItems: [
        { label: "Dashboard", link: "/admin/dashboard", icon: "bi bi-speedometer2" },
        { label: "Owners", link: "/admin/owners", icon: "bi bi-person-badge" },
        { label: "Users", link: "/admin/tenants", icon: "bi bi-people" },
        { label: "Properties", link: "/admin/properties", icon: "bi bi-house-door" },
        { label: "Reservations", link: "/admin/reservations", icon: "bi bi-calendar-check" },
        { label: "Reports", link: "/admin/reports", icon: "bi bi-file-earmark-text" },
        { label: "Feedback", link: "/admin/feedback", icon: "bi bi-chat-dots" },
      ],
    };
  },
  mounted() {
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreen);
  },
  methods: {
    checkScreen() {
      this.isMobile = window.innerWidth <= 768;
      if (this.isMobile) this.isCollapsed = true;
    },
    toggleSidebar() {
      if (this.isMobile) {
        this.isMobileOpen = !this.isMobileOpen;
      } else {
        this.isCollapsed = !this.isCollapsed;
      }
    },
    closeOnMobile() {
      if (this.isMobile) this.isMobileOpen = false;
    },
  },
};
</script>

<style scoped>
/* Sidebar */
.sidebar {
  width: 250px;
  min-height: 100vh;
  transition: width 0.25s ease, transform 0.25s ease;
  overflow-x: hidden;
  /* position: fixed; */
  top: 0;
  left: 0;
  z-index: 1050;
}
.sidebar.collapsed {
  width: 80px;
}
.nav-link {
  border-radius: 6px;
  transition: all 0.25s ease;
  color: #cfcfcf;
}
.nav-link:hover,
.nav-link.active {
  background-color: #0d6efd !important;
  color: #fff !important;
}
.sidebar i {
  min-width: 30px;
  text-align: center;
}
.link-text {
  white-space: nowrap;
}
.sidebar.collapsed .link-text {
  display: none;
}

/* Toggle button */
.toggle-btn {
  border: none;
  background: transparent;
  color: #fff;
  cursor: pointer;
}
.toggle-btn:hover {
  transform: scale(1.1);
}

/* Main content spacing */
.main-content {
  margin-left: 250px;
  transition: margin-left 0.25s ease;
}
.sidebar.collapsed ~ .main-content {
  margin-left: 80px;
}

/* Mobile sidebar */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
    width: 250px;
  }
  .sidebar.mobileOpen {
    transform: translateX(0);
  }
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  z-index: 1040;
}

/* Smooth fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
