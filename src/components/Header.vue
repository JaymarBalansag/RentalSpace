
<template>
    <!-- Navbar on tablet, laptop, desktop -->
    <div class="container ">
        <nav class="navbar">
            <RouterLink class="navbar-brand fw-bold" to="/">RentaSpace</RouterLink>
            <ul class="nav gap-5 d-md-flex d-none">
                <li class="nav-item">
                    <RouterLink class="nav-link text-black" to="/properties">Home</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link text-black" to="/map">Map</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link text-black" to="/">Experience</RouterLink>
                </li>
            </ul> 
            <button class="btn fs-5 " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                <i class="bi bi-list"></i>
            </button>
        </nav>
        <offCanvas></offCanvas>
    </div>

    <!-- Bottom nav on mobile -->
     <div class="container-fluid  fixed-bottom d-md-none d-block bg-white top-shadow">
        <nav class="navbar justify-content-center">
            <ul class="nav gap-2">
                <li class="nav-item">
                    <RouterLink class="nav-link text-black fw-light bottom-text" to="/properties" ><i class="bi bi-house-door nav-icons"></i>Home</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link text-black fw-light bottom-text" to="/map"><i class="bi bi-map nav-icons"></i>Map</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link text-black fw-light bottom-text" to="/"><i class="bi bi-journal nav-icons"></i>Experience</RouterLink>
                </li>
            </ul>
        </nav>
     </div>

    
</template>

<script>
import { RouterLink } from 'vue-router';
import offCanvas from './offCanvas.vue';
import { offcanvasState } from '@/store/offCanvasState';
import { onMounted } from 'vue';
    export default {
        name : "Header",
        components: {
            offCanvas
        },
        setup() {
            onMounted(() => {
                const el = document.getElementById('offcanvasWithBothOptions');
                if (el) {
                    el.addEventListener('show.bs.offcanvas', () => {
                    offcanvasState.isOpen = true;
                    });
                    el.addEventListener('hide.bs.offcanvas', () => {
                    offcanvasState.isOpen = false;
                    });
                }
            });
            return {offcanvasState};
        }
    }

</script>

<style src="../assets/component-style/header.css" scoped></style>
