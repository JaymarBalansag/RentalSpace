<template>
  <div class="dropdown">
    <button 
      class="btn profile-trigger d-flex align-items-center gap-2 p-1" 
      type="button" 
      id="profileDropdown" 
      data-bs-toggle="dropdown" 
      aria-expanded="false"
    >
      <div class="avatar-container shadow-sm">
        <img :src="Profile || placeholderImg" class="profile-img" alt="User" />
      </div>
      <i class="bi bi-chevron-down text-white small d-none d-md-block"></i>
    </button>

    <ul class="dropdown-menu dropdown-menu-end profile-dropdown shadow-lg border-0 animate slideIn" aria-labelledby="profileDropdown">
      <div class="dropdown-header-box px-3 py-2 mb-2">
        <span class="d-block fw-bold text-dark">{{ nameis }}</span>
        <span class="small text-muted text-uppercase fw-bold">{{ roleIs }}</span>
      </div>

      <li><RouterLink class="dropdown-item" to="/profile"><i class="bi bi-person"></i> My Profile</RouterLink></li>
      
      <template v-if="roleIs === 'user' && isComplete ">
        <li><button @click="goToPaymentWall" class="dropdown-item text-primary fw-bold"><i class="bi bi-plus-circle"></i> List Property</button></li>
      </template>
      <template v-else-if="roleIs === 'owner'">
        <li><RouterLink class="dropdown-item" to="/Dashboard"><i class="bi bi-speedometer2"></i> Dashboard</RouterLink></li>
      </template>
      <template v-else-if="roleIs === 'admin'">
        <li><RouterLink class="dropdown-item" to="/admin/admin"><i class="bi bi-shield-lock"></i> Admin Panel</RouterLink></li>
      </template>
      <template v-else-if="roleIs === 'tenants'">
        <li><RouterLink class="dropdown-item" to="/tenant/dashboard"><i class="bi bi-shield-lock"></i> Tenant Dashboard</RouterLink></li>
      </template>
      <template v-else>
        <li><RouterLink class="dropdown-item" to="/completion"><i class="bi bi-person-check"></i> Comeplete Profile</RouterLink></li>
      </template>

      <li><hr class="dropdown-divider"></li>
      <li><RouterLink class="dropdown-item" to="/messages"><i class="bi bi-chat"></i> Messages</RouterLink></li>
      <li><RouterLink class="dropdown-item" to="/notifications"><i class="bi bi-bell"></i> Notifications</RouterLink></li>
      <li><hr class="dropdown-divider"></li>
      <li><RouterLink class="dropdown-item" to="/settings"><i class="bi bi-gear"></i> Settings</RouterLink></li>
      <li><hr class="dropdown-divider"></li>
      <li><button @click="handleLogout" class="dropdown-item text-danger"><i class="bi bi-box-arrow-left"></i> Sign Out</button></li>
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
    },
    isComplete(){
      const info = useUserInfo();
      return info.isComplete;
    },
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

<style scoped>
.profile-trigger {
  border-radius: 50px;
  transition: 0.3s;
}

.profile-trigger:hover {
  background: rgba(255,255,255,0.1);
}

.avatar-container {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-dropdown {
  min-width: 240px;
  border-radius: 12px;
  padding: 0.5rem;
  margin-top: 10px !important;
}

.dropdown-header-box {
  background: #f8f9fa;
  border-radius: 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  color: #444;
}

.dropdown-item i {
  font-size: 1.1rem;
}

.dropdown-item:hover {
  background-color: #f0f4ff;
  color: #4780d9;
}

/* Simple Slide Animation */
.animate.slideIn {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: slideIn;
}

@keyframes slideIn {
  0% { transform: translateY(1rem); opacity: 0; }
  100% { transform: translateY(0rem); opacity: 1; }
}
</style>
