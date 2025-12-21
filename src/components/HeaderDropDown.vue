<template>
  <div class="dropdown">
    <!-- Profile Icon Button -->
    <button 
      type="button"
      class="btn fw-lighter text-light dropdown-toggle " 
      id="profileDropdown" 
      data-bs-toggle="dropdown" 
      aria-expanded="false"
    >
      <img
        :src="Profile || placeholderImg"
        class="rounded-circle"
        width="50"
        height="50"
        alt="User profile picture"
      />
    </button>

    <!-- Dropdown Menu -->
    <ul class="dropdown-menu dropdown-menu-end " aria-labelledby="profileDropdown">
      <!-- If Logged In -->
      <template v-if="isLoggedIn">
        <li>
          <RouterLink class="dropdown-item d-flex gap-2 align-items-center" to="/profile">
            <i class="bi bi-person"></i> {{ nameis }}
          </RouterLink>
        </li>
        <li><hr class="dropdown-divider"></li>
        <!-- Role-based Items -->
        <li v-if="roleIs === 'user'">
          <button @click="goToPaymentWall" class="dropdown-item text-primary">
            <i class="bi bi-house-add"></i> List Your Property
          </button>
        </li>
        <li v-else-if="roleIs === 'owner'">
          <RouterLink class="dropdown-item d-flex gap-2 align-items-center" to="/Dashboard">
            <i class="bi bi-kanban"></i> Dashboard
          </RouterLink>
        </li>
        <li v-else-if="roleIs === 'admin'">
          <RouterLink class="dropdown-item d-flex gap-2 align-items-center" to="/admin/dashboard">
            <i class="bi bi-speedometer2"></i> Admin Dashboard
          </RouterLink>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <RouterLink class="dropdown-item d-flex gap-2 align-items-center" to="/messages">
            <i class="bi bi-chat-dots"></i> Messages
          </RouterLink>
        </li>
        <li>
          <RouterLink class="dropdown-item d-flex gap-2 align-items-center" to="/notifications">
            <i class="bi bi-bell"></i> Notifications
          </RouterLink>
        </li>
        <li><hr class="dropdown-divider"></li>

        

        <li>
          <RouterLink class="dropdown-item d-flex gap-2 align-items-center" to="/settings">
            <i class="bi bi-gear"></i> Settings
          </RouterLink>
        </li>
        
        <li><hr class="dropdown-divider"></li>
        <li>
          <button @click="handleLogout" class="dropdown-item text-danger d-flex gap-2 align-items-center">
            <i class="bi bi-box-arrow-left"></i> Logout
          </button>
        </li>
      </template>

      <!-- If NOT Logged In -->
      <template v-else>
        <li>
          <RouterLink to="/login" class="dropdown-item d-flex gap-2 align-items-center">
            <i class="bi bi-box-arrow-in-right"></i> Sign In
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/register" class="dropdown-item d-flex gap-2 align-items-center">
            <i class="bi bi-person-plus"></i> Sign Up
          </RouterLink>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { logout } from '@/api/auth';
import { useUserInfo } from '@/store/userInfo';
import { isSubscribing } from '@/api/property';
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";


export default {
  name: "ProfileDropdown",
  components: { RouterLink },
  computed: {
    isLoggedIn() {
      const info = useUserInfo();
      return info.isLoggedIn;
    },
    roleIs() {
      const info = useUserInfo();
      return info.role;
    },
    nameis(){
      const info = useUserInfo();
      return info.first_name + " " + info.last_name
    },
    Profile(){
      const info = useUserInfo();
      return info.profile_photo;
    }
  },
  data() {
    return {
      userprofile : null,
      placeholderImg: placeholderImg
    }
  },
  methods: {
    goToPaymentWall() {
      this.$router.push("/payment/wall");
    },
    async handleLogout() {
      try {
        await logout();
        const info = useUserInfo();
        this.userprofile = null;
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
    
  },
}
</script>
