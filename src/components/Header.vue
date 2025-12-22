
<template>
    <!-- Navbar on tablet, laptop, desktop -->
    <div class="container-fluid header-container px-5 py-3">
        <nav class="navbar align-items-center">
            <!-- Brand -->
            <RouterLink
                class="navbar-brand fw-bold text-light fs-1"
                to="/"
            >
                SpaceSeeker
            </RouterLink>

            <!-- Main nav -->
            <ul class="nav d-md-flex d-none gap-4 me-auto ms-5 text-center">
                <li class="nav-item">
                    <RouterLink class="nav-link text-light" to="/">
                        Home
                    </RouterLink>
                </li>

                <li class="nav-item" >
                    <RouterLink class="nav-link text-light" to="/experience">
                        Experience
                    </RouterLink>
                </li>
                
                <li class="nav-item" >
                    <RouterLink class="nav-link text-light" to="/about">
                        About
                    </RouterLink>
                </li>
                
                <li class="nav-item" >
                    <RouterLink class="nav-link text-light" to="/contactus">
                        Contact Us!
                    </RouterLink>
                </li>
            </ul>

            <!-- RIGHT SIDE AUTH -->
            <!-- NOT LOGGED IN -->
            <RouterLink
                v-if="isLoggedIn === false && this.$route.path !== '/login'"
                to="/login"
                class="btn btn-outline-light"
            >
                Login
            </RouterLink>

            <!-- LOGGED IN -->
            <HeaderDropDown v-show="isLoggedIn === true "/>

        </nav>
    </div>

    <!-- Bottom nav on mobile -->
    <div class="container-fluid fixed-bottom d-md-none d-block header-container top-shadow">
        <nav class="navbar justify-content-center">
            <ul class="nav gap-2">
                <li class="nav-item">
                    <RouterLink
                        class="nav-link text-light fw-light bottom-text"
                        to="/"
                    >
                        <i class="bi bi-house-door nav-icons"></i>
                        Home
                    </RouterLink>
                </li>

                <li class="nav-item" >
                    <RouterLink
                        class="nav-link text-light fw-light bottom-text"
                        to="/experience"
                    >
                        <i class="bi bi-journal nav-icons"></i>
                        Experience
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import HeaderDropDown from "./HeaderDropDown.vue";
import { useUserInfo } from "@/store/userInfo";

export default {
  name: "Header",
  components: {
    HeaderDropDown
  },
  data() {
    return {
      path: null
    };
  },
  computed: {
    isLoggedIn() {
      const info = useUserInfo();
      return info.isLoggedIn;
    },
  },

};
</script>




<style src="../assets/component-style/header.css" scoped></style>
