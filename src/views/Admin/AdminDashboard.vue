<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <div
      class="sidebar bg-dark text-white p-3 d-flex flex-column"
      :class="{ collapsed: isCollapsed || isMobile }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Logo / Header -->
      <div class="text-center mb-4">
        <h5 v-if="!isCollapsed && !isMobile" class="fw-bold">Admin Panel</h5>
        <i v-else class="bi bi-speedometer2 fs-4"></i>
      </div>

      <!-- Navigation -->
      <ul class="nav flex-column">
        <li
          class="nav-item mb-2"
          v-for="item in navItems"
          :key="item.label"
        >
          <RouterLink
            :to="item.link"
            class="nav-link text-white d-flex align-items-center"
            :title="isCollapsed || isMobile ? item.label : ''"
          >
            <i :class="[item.icon, 'me-2', 'fs-5']"></i>
            <span v-if="!isCollapsed && !isMobile" class="link-text">{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>

      <!-- Bottom Logout -->
      <div class="mt-auto">
        <RouterLink
          to="/logout"
          class="nav-link text-white d-flex align-items-center"
          :title="isCollapsed || isMobile ? 'Logout' : ''"
        >
          <i class="bi bi-box-arrow-right fs-5 me-2"></i>
          <span v-if="!isCollapsed && !isMobile">Logout</span>
        </RouterLink>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow-1 bg-light p-4" style="min-height: 100vh;">
      <!-- Topbar -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold text-primary">Admin Dashboard</h4>
        <div>
          
          <!-- <button class="btn btn-primary">
            <i class="bi bi-person-circle me-2"></i> Admin
          </button> -->



          
        </div>

        <div class="dropdown d-flex">
          <button class="btn btn-outline-primary me-2">
            <i class="bi bi-bell"></i>
          </button>
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
                <i class="bi bi-house-door me-2"></i> Go to Home
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/profile" class="dropdown-item">
                <i class="bi bi-gear me-2"></i> Account Settings
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

      <!-- Router View -->
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
  data() {
    return {
      isCollapsed: true,
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
      if (this.isMobile) {
        this.isCollapsed = true; // always collapsed on small screens
      }
    },
    handleMouseEnter() {
      if (!this.isMobile) this.isCollapsed = false;
    },
    handleMouseLeave() {
      if (!this.isMobile) this.isCollapsed = true;
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
  transition: width 0.25s ease-in-out;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar .nav-link {
  border-radius: 8px;
  padding: 10px 12px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.sidebar .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.sidebar.collapsed .nav-link i {
  margin-right: 0 !important;
  text-align: center;
  width: 100%;
}

.link-text {
  white-space: nowrap;
}

.sidebar.collapsed .link-text {
  display: none;
}

/* Adjust content when sidebar collapses */
.d-flex > .flex-grow-1 {
  margin-left: 250px;
  transition: margin-left 0.25s ease-in-out;
}

.sidebar.collapsed ~ .flex-grow-1 {
  margin-left: 80px;
}

/* Responsive: Sidebar always collapsed on small screens */
@media (max-width: 768px) {
  .sidebar {
    width: 80px !important;
    position: fixed;
    z-index: 1050;
  }

  .sidebar .link-text {
    display: none !important;
  }

  .d-flex > .flex-grow-1 {
    margin-left: 80px !important;
  }
}
</style>
