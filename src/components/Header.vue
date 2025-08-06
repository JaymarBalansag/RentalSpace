
<template>
    <!-- Navbar on tablet, laptop, desktop -->
    <div class="container ">
        <nav class="navbar">
            <RouterLink class="navbar-brand fw-bold" to="/">RentaSpace</RouterLink>
            <ul class="nav gap-5 d-md-flex d-none">
                <li class="nav-item">
                    <RouterLink class="nav-link text-black" to="/">Home</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link text-black" to="/map">Map</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link text-black" to="/experience">Experience</RouterLink>
                </li>
            </ul>
            <button class="btn profile" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                <i class="bi bi-list"></i>
            </button>
        </nav>
        <offCanvas></offCanvas>
    </div>

    <!-- Bottom nav on mobile -->
     <div class="container-fluid  fixed-bottom d-md-none d-block bg-white top-shadow">
        <nav class="navbar justify-content-center">
            <ul class="nav gap-5">
                <li class="nav-item">
                    <RouterLink class="nav-link text-black fw-bold" to="/properties" >Home</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link text-black fw-bold" to="/map">Map</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link text-black fw-bold" to="/experience">Experience</RouterLink>
                </li>
            </ul>
        </nav>
     </div>

    
</template>

<script>
import { RouterLink } from 'vue-router';
import offCanvas from './offCanvas.vue';
    export default {
        name : "Header",
        components: {
            offCanvas
        }
    }

</script>

<style src="../assets/component-style/header.css" scoped></style>
