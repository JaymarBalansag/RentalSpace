<template>
  <Header />

  <div class="container-fluid mt-4">
    <div class="row">
      <!-- Sidebar Navigation -->
      <div class="col-md-3 border-end">
        <h5 class="text-muted ps-3">Profile Navigation</h5>
        <ul class="nav flex-column ps-3 fs-5 nav-underline">
          <li class="nav-item mb-2">
            <RouterLink class="nav-link mt-3 text-muted" to="info">Personal Info</RouterLink>
          </li>
          <li class="nav-item mb-2">
            <RouterLink class="nav-link  text-muted" to="address">Address</RouterLink>
          </li>
          <li class="nav-item mb-2">
            <RouterLink class="nav-link  text-muted" to="info">Preferences</RouterLink>
          </li>
        </ul>
      </div>

      <!-- Main Content -->
      <div class="col-md-9 px-4">
        <RouterView />
      </div>
    </div>
  </div>
</template>


<script>
import Header from '@/components/Header.vue';
import { RouterLink, RouterView } from 'vue-router';

export default {
    name: "profile",
    components: {
        Header,
        RouterLink,
        RouterView
    }
}
</script>
