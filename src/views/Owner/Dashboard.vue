<template>
  <div class="d-flex" style="min-height: 100vh;">
    <!-- Sidebar -->
    <div class="bg-dark text-white p-3" style="width: 250px; min-height: 100vh;">
      <h4 class="mb-4">Owner Dashboard</h4>
      <ul class="nav flex-column">
        <li class="nav-item mb-2" v-for="item in navItems" :key="item.name">
          <RouterLink
            :to="item.route"
            class="nav-link text-white"
            :class="{'active': $route.path === item.route}"
          >
            <i :class="item.icon + ' me-2'"></i> {{ item.name }}
          </RouterLink>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex-grow-1 p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>Welcome, Owner</h3>
        <!-- Profile Dropdown -->
        <div class="dropdown">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle me-1"></i> Profile
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
            <li><hr class="dropdown-divider"></li>
            <li>
              <button @click="handleLogout" class="dropdown-item text-danger">
                <i class="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Placeholder for inner routes -->
      <router-view />
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { logout } from '@/api/auth';
import { useUserInfo } from '@/store/userInfo';

export default {
  name: 'OwnerDashboard',
  components: { RouterLink },
  data() {
    return {
      navItems: [
        { name: 'Overview', route: '/overview', icon: 'bi bi-speedometer2' },
        { name: 'Properties', route: '/properties', icon: 'bi bi-building' },
        { name: 'Tenants', route: '/tenants', icon: 'bi bi-people' },
        { name: 'Billing', route: '/billing', icon: 'bi bi-cash-stack' },
        { name: 'Reports', route: '/reports', icon: 'bi bi-bar-chart-line' },
      ],
    };
  },
  methods: {
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
    }
  }
};
</script>

<style scoped>
.nav-link.active {
  background-color: #0056b3;
  border-radius: 5px;
  color: #ffffff;
}
</style>
