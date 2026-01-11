<template>
  <div class="admin-layout">
    <aside 
      class="sidebar" 
      :class="{ 'collapsed': isCollapsed, 'mobile-active': isMobileOpen }"
    >
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-box">
            <i class="bi bi-shield-lock-fill"></i>
          </div>
          <span v-if="!isCollapsed" class="logo-text">Admin<span>Pro</span></span>
        </div>
        <button class="d-md-none btn btn-primary btn-close-sidebar" @click="toggleSidebar">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="sidebar-content">
        <ul class="nav-menu">
          <li v-for="item in navItems" :key="item.label">
            <RouterLink 
              :to="item.link" 
              class="nav-item" 
              active-class="active"
              @click="closeOnMobile"
            >
              <i :class="item.icon"></i>
              <span class="nav-label">{{ item.label }}</span>
              <span v-if="isCollapsed" class="custom-tooltip">{{ item.label }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">
          <i class="bi bi-box-arrow-right"></i>
          <span v-if="!isCollapsed">Sign Out</span>
        </button>
      </div>
    </aside>

    <div v-if="isMobileOpen" class="sidebar-overlay" @click="closeOnMobile"></div>

    <main class="main-body">
      <header class="top-navbar">
        <div class="navbar-left">
          <button class="sidebar-toggle" @click="toggleSidebar">
            <i class="bi bi-text-indent-left fs-4"></i>
          </button>
          <h4 class="page-title d-none d-sm-block">Dashboard Overview</h4>
        </div>

        <div class="navbar-right">
          <button class="nav-icon-btn">
            <i class="bi bi-bell"></i>
            <span class="notification-badge"></span>
          </button>

          <div class="dropdown">
            <button 
              class="profile-trigger" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              <img src="https://ui-avatars.com/api/?name=Admin&background=0D6EFD&color=fff" class="avatar" />
              <div class="user-info d-none d-md-block">
                <span class="user-name">Administrator</span>
                <span class="user-role">Super Admin</span>
              </div>
              <i class="bi bi-chevron-down ms-2 small opacity-50"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end border-0 shadow-lg">
              <li><RouterLink class="dropdown-item" to="/home"><i class="bi bi-house me-2"></i>Home</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/profile"><i class="bi bi-person me-2"></i>Profile</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/settings"><i class="bi bi-gear me-2"></i>Settings</RouterLink></li>
              <li><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item text-danger" @click="handleLogout"><i class="bi bi-power me-2"></i>Logout</button></li>
            </ul>
          </div>
        </div>
      </header>

      <div class="content-container">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
  data() {
    return {
      isCollapsed: false,
      isMobileOpen: false,
      navItems: [
        { label: "Dashboard", link: "/admin/admin", icon: "bi bi-grid-1x2" },
        { label: "Owners", link: "/admin/owners", icon: "bi bi-person-badge" },
        { label: "Users", link: "/admin/tenants", icon: "bi bi-people" },
        { label: "Properties", link: "/admin/properties", icon: "bi bi-houses" },
        { label: "Bookings", link: "/admin/bookings", icon: "bi bi-calendar-check" },
        { label: "Reports", link: "/admin/reports", icon: "bi bi-graph-up" },
        { label: "Feedback", link: "/admin/feedback", icon: "bi bi-chat-dots" },
      ],
    };
  },
  mounted() {
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
  },
  methods: {
    checkScreen() {
      if (window.innerWidth <= 991) {
        this.isCollapsed = false;
      }
    },
    toggleSidebar() {
      if (window.innerWidth <= 991) {
        this.isMobileOpen = !this.isMobileOpen;
      } else {
        this.isCollapsed = !this.isCollapsed;
      }
    },
    closeOnMobile() {
      if (window.innerWidth <= 991) this.isMobileOpen = false;
    },
    handleLogout() {
      console.log("Logging out...");
      // Logic for logout
    }
  },
};
</script>

<style scoped>
/* Layout Structure */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f4f7fe;
  overflow-x: hidden;
}

/* Sidebar Styling */
.sidebar {
  width: 260px;
  background: #111827;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1050;
  position: relative;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  width: 35px;
  height: 35px;
  background: #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-text {
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.logo-text span { color: #3b82f6; }

/* Navigation Items */
.sidebar-content {
  flex-grow: 1;
  padding: 20px 12px;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #9ca3af;
  text-decoration: none;
  border-radius: 12px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item i {
  font-size: 1.2rem;
  min-width: 25px;
}

.nav-label {
  margin-left: 15px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item.active {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Collapsed Sidebar Adjustments */
.sidebar.collapsed .nav-label {
  display: none;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px 0;
}

/* Tooltip for Mini Sidebar */
.custom-tooltip {
  position: absolute;
  left: 100%;
  margin-left: 15px;
  background: #1f2937;
  color: white;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: 0.2s;
  z-index: 100;
}

.nav-item:hover .custom-tooltip {
  opacity: 1;
  left: 100%;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px;
  border: none;
  background: transparent;
  color: #ef4444;
  border-radius: 12px;
  transition: background 0.2s;
}

.logout-btn:hover { background: rgba(239, 68, 68, 0.1); }
.logout-btn i { font-size: 1.2rem; margin-right: 15px; }

/* Main Content Area */
.main-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.top-navbar {
  height: 70px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  position: sticky;
  top: 0;
  z-index: 999;
  border-bottom: 1px solid #e5e7eb;
}

.navbar-left { display: flex; align-items: center; gap: 20px; }
.sidebar-toggle {
  background: none;
  border: none;
  color: #4b5563;
  padding: 0;
}

.page-title { margin: 0; font-weight: 700; color: #111827; }

.navbar-right { display: flex; align-items: center; gap: 15px; }

.nav-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: #f3f4f6;
  color: #4b5563;
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  border: none;
  background: none;
  padding: 5px;
  border-radius: 50px;
  transition: background 0.2s;
}

.profile-trigger:hover { background: #f9fafb; }

.avatar { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; }

.user-info { text-align: left; }
.user-name { display: block; font-size: 0.85rem; font-weight: 700; color: #111827; line-height: 1.2; }
.user-role { font-size: 0.75rem; color: #6b7280; }

.content-container { padding: 25px; }

/* Mobile Logic */
@media (max-width: 991px) {
  .sidebar {
    position: fixed;
    left: -260px;
    height: 100vh;
  }
  .sidebar.mobile-active {
    left: 0;
    width: 260px;
  }
  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    z-index: 1040;
  }
  .sidebar.collapsed { width: 260px; } /* Don't collapse on mobile */
}

/* Animations */
.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.page-fade-enter-from { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>