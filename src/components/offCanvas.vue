<template>

  <div class="offcanvas offcanvas-end z-top" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
    <div class="offcanvas-header btn-group dropstart">
       <div class="dropstart">
         <button class="btn dropdown-toggle w-2" data-bs-toggle="dropdown"><i class="bi bi-person-circle fs-2"></i></button>
          <ul v-if="isLoggedIn" class="dropdown-menu nav-underline">
            <!-- Dropdown menu links -->
             <li class="dropdown-item fs-6 pb-0">
                <button @click="handleLogout" class="nav-link d-flex gap-2 m-0 p-0 justify-content-start align-content-center"><i class="bi bi-box-arrow-left"></i><p class="">Logout</p></button>
              </li>
          </ul>
          <ul v-else-if="!isLoggedIn" class="dropdown-menu nav-underline">
            <li class="dropdown-item fs-6 pb-0">
                <RouterLink to="/login" class="nav-link d-flex gap-2 m-0 p-0 justify-content-start align-content-center"><i class="bi bi-box-arrow-right"></i><p class="">Sign In</p></RouterLink>
             </li>
             <li class="dropdown-item fs-6 pb-0">
                <RouterLink  to="/register" class="nav-link d-flex gap-2 m-0 p-0 justify-content-start align-content-center"><i class="bi bi-box-arrow-left"></i><p class="">Sign up</p></RouterLink>
             </li>
          </ul>
       </div>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <hr>
      <ul v-if="isLoggedIn" class="nav flex-column nav-underline ">
        <li class="nav-item">
          <RouterLink class="nav-link fs-6 text-black" to="/profile"><i class="bi bi-person me-1"></i>Profile</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link fs-6 text-black" to="/"><i class="bi bi-chat-dots me-1"></i>Messages</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link fs-6 text-black" to="/"><i class="bi bi-bell me-1"></i>Notifications</RouterLink>
        </li>
        <li class="nav-item">
          <hr>
        </li>
        <li v-if="roleIs === 'user'" class="nav-item">
          <button @click="goToPaymentWall" class="btn btn-primary" ><i class="bi bi-bell me-1"></i>List Your Property</button>
        </li>
        <li v-else-if="roleIs === 'admin'" class="nav-item">
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            Admin Dashboard
          </button>        
          <AdminLogin></AdminLogin>
        </li>
        <li v-else-if="roleIs === 'owner'" class="nav-item">
          <RouterLink class="nav-link fs-6 text-black" to="/"><i class="bi bi-kanban me-1"></i>Property Management</RouterLink>
        </li>
        <li class="nav-item">
          <hr>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link fs-6 text-black" to="/"><i class="bi bi-gear me-1"></i>Settings</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link fs-6 text-black" to="/"><i class="bi bi-file-earmark me-1"></i>About</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link fs-6 text-black" to="/"><i class="bi bi-bell-fill me-1"></i>Contact Us!</RouterLink>
        </li>
      </ul>
    </div>
  </div>  
</template>

<script>
import { RouterLink, useRouter } from 'vue-router';
import { logout } from '@/api/auth';
import { useUserInfo } from '@/store/userInfo';
import { isSubscribing } from '@/api/property';
import AdminLogin from './AdminLogin.vue';

    export default {
        name: "offCanvas",
        components: {
          RouterLink,
          AdminLogin
        },
        computed: {
          isLoggedIn() {
            const info = useUserInfo();
            return info.isLoggedIn;
          },
          roleIs() {
            const info = useUserInfo();
            console.log(info.role);
            return info.role;
          }
        },
        methods: {
          goToPaymentWall() {
            this.$router.push("/payment/wall")
          },
          async handleLogout() {
            try {
              const res = await logout();  
              const userInfo = JSON.parse(localStorage.getItem('userInfo'));
              const info = useUserInfo();
              info.logout();           
              this.$router.push("/login");
            } catch (error) {
              if (error.response) {
                alert(error.response.data.message); // <--- This will catch "The provided credentials are incorrect"
                this.$router.push("/login")
              } 
              else {
                alert("Something went wrong!");
              }
            }
          },
          async isSubscribing() {
            const info = useUserInfo();
            try {
              console.log("first_name", info.first_name);
              console.log("last_name", info.last_name);
              console.log("email", info.email);
              
              const res = await isSubscribing(info.first_name, info.last_name, info.email);
              console.log("done checking subscription status");
              if(res && res.role === "owner"){
                info.setRole(res.role);
                alert(res.message);
              } else {
                alert("You are not subscribing yet. Please subscribe to list your property.");
                info.setRole("user");
              }
              console.log(res);
            } catch (error) {
              console.error("Error checking subscription status:", error);
          }
        }
    }
  }
</script>