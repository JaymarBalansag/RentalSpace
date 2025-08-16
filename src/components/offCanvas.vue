<template>

  <div class="offcanvas offcanvas-end z-top" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
    <div class="offcanvas-header btn-group dropstart">
      <!-- <h2 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Menu</h2> -->
       <div class="dropstart">
         <button class="btn dropdown-toggle w-2" data-bs-toggle="dropdown"><i class="bi bi-person-circle fs-2"></i></button>
          <ul class="dropdown-menu nav-underline">
            <!-- Dropdown menu links -->
             <li class="dropdown-item fs-6 pb-0">
                <button @click="handleLogout" to="" class="nav-link d-flex gap-2 m-0 p-0 justify-content-start align-content-center"><i class="bi bi-box-arrow-left"></i><p class="">Logout</p></button>
             </li>
          </ul>
       </div>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <hr>
      <ul class="nav flex-column nav-underline ">
        <li class="nav-item">
          <RouterLink class="nav-link fs-6 text-black" to="/"><i class="bi bi-person me-1"></i>Profile</RouterLink>
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
        <li class="nav-item">
          <RouterLink class="btn btn-primary" to="/"><i class="bi bi-bell me-1"></i>List Your Property</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link fs-6 text-black" to="/"><i class="bi bi-speedometer me-1"></i>Admin Dashboard</RouterLink>
        </li>
        <li class="nav-item">
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
import api from '@/api/axios';
    export default {
        name: "offCanvas",
        methods: {
          async handleLogout() {
            const router = useRouter();
            try {
              const res = await api.post("/logout");
              // console.log("LoggedOUt");
              localStorage.removeItem("token");
              this.$router.push("/login")
            }
            catch (error) {
              console.error(error);
            }
          }
        }
    }
</script>