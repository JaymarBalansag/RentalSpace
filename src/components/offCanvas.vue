<template>

  <div class="offcanvas offcanvas-end z-top" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
    <div class="offcanvas-header">
      <h2 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Menu</h2>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <ul class="nav flex-column nav-underline ">
        <li class="nav-item">
          <RouterLink class="nav-link fs-4 text-black" to="">Profile</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link fs-4 text-black" to="">Profile</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link fs-4 text-black" to="">Profile</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link fs-4 text-black" to="">Profile</RouterLink>
        </li>
      </ul>
    </div>
  </div>  
</template>

<script>
import { RouterLink } from 'vue-router';
    export default {
        name: "offCanvas"
    }
</script>