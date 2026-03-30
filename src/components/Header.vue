<template>
  <header class="header-container sticky-top shadow-sm">
    <div class="container py-2">
      <nav class="navbar navbar-expand-md px-0">
        
        <RouterLink class="navbar-brand fw-bold text-white d-flex align-items-center" to="/Rentahub">
          <!-- <i class="bi bi-house-heart-fill me-2 fs-3"></i> -->
          <img class="brand-logo" src="/favicon.ico" alt="RentaHub Logo">
          <span class="brand-text">RentaHub</span>
        </RouterLink>

        <div class="collapse navbar-collapse justify-content-center d-none d-md-flex">
          <ul class="navbar-nav gap-lg-4 gap-md-2">
            <li class="nav-item">
              <RouterLink class="nav-link text-white-50 px-3 hover-link" active-class="text-white active fw-bold" to="/home">
                Home
              </RouterLink>
            </li>
            <li v-if="isLoggedIn" class="nav-item">
              <RouterLink class="nav-link text-white-50 px-3 hover-link" active-class="text-white active fw-bold" to="/experience">
                Experience
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-white-50 px-3 hover-link" active-class="text-white active fw-bold" to="/about">
                About
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-white-50 px-3 hover-link" active-class="text-white active fw-bold" to="/faq">
                FAQ
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-white-50 px-3 hover-link" active-class="text-white active fw-bold" to="/contactus">
                Contact
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="ms-auto d-flex align-items-center">
          <div v-if="!isLoggedIn && $route.path !== '/login'" class="d-none d-md-block">
            <RouterLink to="/login" class="btn btn-outline-light rounded-pill px-4 btn-sm fw-bold">
              Login
            </RouterLink>
          </div>

          <HeaderDropDown v-if="isLoggedIn" />

          <button
            class="navbar-toggler border-0 text-white p-2 ms-2 d-md-none"
            type="button"
            @click="toggleMobileMenu"
          >
            <i :class="showMobileMenu ? 'bi bi-x-lg' : 'bi bi-filter-right'" class="fs-1"></i>
          </button>
        </div>
      </nav>

      <transition name="fade">
        <div v-if="showMobileMenu" class="mobile-menu d-md-none shadow-lg">
          <div class="d-flex flex-column p-3">
            <RouterLink class="mobile-link" to="/home" @click="closeMenu">
              <i class="bi bi-house me-3"></i>Home
            </RouterLink>
            <RouterLink v-if="isLoggedIn" class="mobile-link" to="/experience" @click="closeMenu">
              <i class="bi bi-star me-3"></i>Experience
            </RouterLink>
            <RouterLink class="mobile-link" to="/about" @click="closeMenu">
              <i class="bi bi-info-circle me-3"></i>About Us
            </RouterLink>
            <RouterLink class="mobile-link" to="/faq" @click="closeMenu">
              <i class="bi bi-patch-question me-3"></i>FAQ
            </RouterLink>
            <RouterLink class="mobile-link" to="/contactus" @click="closeMenu">
              <i class="bi bi-envelope me-3"></i>Contact
            </RouterLink>
            
            <div v-if="!isLoggedIn" class="mt-3">
              <RouterLink to="/login" class="btn btn-light w-100 fw-bold py-2 rounded-pill" @click="closeMenu">
                Login
              </RouterLink>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script>
import HeaderDropDown from "./HeaderDropDown.vue";
import { useUserInfo } from "@/store/userInfo";

export default {
  name: "Header",
  components: { HeaderDropDown },

  data() {
    return {
      showMobileMenu: false
    };
  },

  computed: {
    isLoggedIn() {
      // Accesses your Pinia/Vuex store to check login status
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

<style scoped>
/* Main Background */
.header-container {
    background-color: #4780d9;
    z-index: 1050;
}

/* Brand Logo Text */
.brand-logo {
    width: 38px;
    height: 38px;
    object-fit: contain;
    margin-right: 0.65rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.12);
    padding: 4px;
    flex-shrink: 0;
}

.brand-text {
    font-size: 1.5rem;
    letter-spacing: -0.5px;
}

/* Desktop Nav Link Styling */
.nav-link {
    transition: all 0.2s ease;
    font-size: 0.95rem;
}

.hover-link:hover {
    color: #ffffff !important;
    transform: translateY(-2px);
}

/* Underline effect for Active Page */
.active.fw-bold {
    position: relative;
    opacity: 1 !important;
}

@media (min-width: 768px) {
    .active.fw-bold::after {
        content: '';
        position: absolute;
        bottom: 5px;
        left: 20%;
        width: 60%;
        height: 2px;
        background: white;
        border-radius: 10px;
    }
}

@media (max-width: 767px) {
    .brand-logo {
        width: 32px;
        height: 32px;
        margin-right: 0.5rem;
    }

    .brand-text {
        font-size: 1.3rem;
    }
}

/* Mobile Dropdown Menu Container */
.mobile-menu {
    background: #4780d9;
    border-radius: 15px;
    margin-top: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: absolute;
    left: 15px;
    right: 15px;
    z-index: 1000;
}

/* Mobile Links Styling */
.mobile-link {
    display: flex;
    align-items: center;
    color: white;
    padding: 1.2rem;
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transition: background 0.2s;
}

.mobile-link:hover {
    background: rgba(255, 255, 255, 0.05);
}

.mobile-link i {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
}

.mobile-link:last-child {
    border-bottom: none;
}

/* Smooth Entrance Animation */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(-15px);
}

/* Navbar Toggler Icon Color */
.navbar-toggler:focus {
    box-shadow: none;
}
</style>
