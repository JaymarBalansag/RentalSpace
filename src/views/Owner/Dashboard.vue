<template>
  <div class="d-flex" style="min-height: 100vh;">
    <!-- Sidebar -->
    <div
      class="sidebar bg-dark text-white d-flex flex-column"
      :class="{ collapsed: isCollapsed }"
      @mouseenter="isCollapsed = false"
      @mouseleave="isCollapsed = true"
    >
      <!-- Header -->
      <div class="text-center py-3 mb-3 border-bottom border-secondary">
        <h5 v-if="!isCollapsed" class="fw-bold mb-0">Owner Panel</h5>
        <i v-else class="bi bi-house-door fs-3"></i>
      </div>

      <!-- Navigation -->
      <ul class="nav flex-column flex-grow-1">
        <li
          v-for="item in navItems"
          :key="item.name"
          class="nav-item mb-2"
        >
          <RouterLink
            :to="item.route"
            class="nav-link text-white d-flex align-items-center py-2 px-3 rounded"
            :class="{ active: $route.path === item.route }"
          >
            <i :class="item.icon + ' fs-5'"></i>
            <span v-if="!isCollapsed" class="ms-3">{{ item.name }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex-grow-1 p-4">
      <!-- Top Bar -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold">Welcome, Owner</h3>

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
import { RouterLink } from 'vue-router'
import { logout } from '@/api/auth'
import { useUserInfo } from '@/store/userInfo'

export default {
  name: 'OwnerDashboard',
  components: { RouterLink },
  data() {
    return {
      isCollapsed: true,
      navItems: [
        { name: 'Overview', route: '/overview', icon: 'bi bi-speedometer2' },
        { name: 'Properties', route: '/properties', icon: 'bi bi-building' },
        { name: 'Tenants', route: '/tenants', icon: 'bi bi-people' },
        { name: 'Billing', route: '/billing', icon: 'bi bi-cash-stack' },
        { name: 'Reports', route: '/reports', icon: 'bi bi-bar-chart-line' },
      ],
    }
  },
  methods: {
    async handleLogout() {
      try {
        await logout()
        const info = useUserInfo()
        info.logout()
        this.$router.push('/login')
      } catch (error) {
        alert(error.response?.data?.message || 'Something went wrong!')
        this.$router.push('/login')
      }
    },
  },
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  transition: all 0.3s ease;
  overflow: hidden;
}
.sidebar.collapsed {
  width: 100px;
}

.nav-link {
  color: #cfcfcf;
  transition: all 0.25s ease;
}
.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
.nav-link.active {
  background: #0d6efd;
  color: #fff;
}

.sidebar i {
  min-width: 30px;
  text-align: center;
}

.dropdown-toggle {
  transition: all 0.3s;
}
</style>
