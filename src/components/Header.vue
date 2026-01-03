
<template>
  <!-- TOP HEADER -->
  <div class="container-fluid header-container px-4 py-3">
    <nav class="navbar align-items-center justify-content-start">

      <!-- Brand -->
      <RouterLink
        class="navbar-brand fw-bold text-light brand-text"
        to="/"
      >
        RentaHub
      </RouterLink>

      <!-- Desktop Nav -->
      <ul class="nav d-md-flex d-none gap-4 ms-4">
        <li class="nav-item">
          <RouterLink class="nav-link text-light" to="/">Home</RouterLink>
        </li>
        <li v-if="isLoggedIn" class="nav-item">
          <RouterLink class="nav-link text-light" to="/experience">Experience</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link text-light" to="/about">About</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link text-light" to="/contactus">Contact</RouterLink>
        </li>
      </ul>

      

      <!-- Mobile Hamburger -->
      <button
        class="btn text-light d-md-none ms-auto"
        @click="toggleMobileMenu"
      >
        <i class="bi bi-list fs-2"></i>
      </button>

      <!-- Desktop Auth -->
      <div class="d-md-block ms-md-auto">
        <RouterLink
          v-if="!isLoggedIn && $route.path !== '/login'"
          to="/login"
          class="btn btn-outline-light"
        >
          Login
        </RouterLink>

        <HeaderDropDown v-if="isLoggedIn" />
      </div>

    </nav>

    <!-- Mobile Dropdown Menu -->
    <div v-if="showMobileMenu" class="mobile-menu d-md-none mt-3 " style="background-color: #4780d9 !important;">
      <RouterLink class="mobile-link" to="/" @click="closeMenu">Home</RouterLink>
      <RouterLink class="mobile-link" to="/experience" @click="closeMenu">Experience</RouterLink>
      <RouterLink class="mobile-link" to="/about" @click="closeMenu">About</RouterLink>
      <RouterLink class="mobile-link" to="/contactus" @click="closeMenu">Contact</RouterLink>

      <RouterLink
        v-if="!isLoggedIn"
        to="/login"
        class="btn btn-outline-light w-100 mt-3"
        @click="closeMenu"
      >
        Login
      </RouterLink>

      

    </div>

    
  </div>

  <!-- BOTTOM NAV (Mobile only) -->
  <!-- <div class="container-fluid fixed-bottom d-md-none header-container top-shadow">
    <nav class="navbar justify-content-center">
      <ul class="nav gap-5">
        <li class="nav-item">
          <RouterLink class="nav-link text-light bottom-text" to="/">
            <i class="bi bi-house-door nav-icons"></i>
            Home
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link text-light bottom-text" to="/experience">
            <i class="bi bi-journal nav-icons"></i>
            Experience
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div> -->
</template>


<script>
import HeaderDropDown from "./HeaderDropDown.vue";
import { useUserInfo } from "@/store/userInfo";

export default {
  components: { HeaderDropDown },

  data() {
    return {
      showMobileMenu: false
    };
  },

  computed: {
    isLoggedIn() {
      return useUserInfo().isLoggedIn;
    }
  },

  methods: {
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    closeMenu() {
      this.showMobileMenu = false;
    }
  }
};
</script>





<style src="../assets/component-style/header.css" scoped></style>
