
<template>
    <!-- Navbar on tablet, laptop, desktop -->
    <div class="container-fluid header-container px-5 py-3">
        <nav class="navbar">
            <RouterLink class="navbar-brand fw-bold text-light fs-1" to="/">SpaceSeeker</RouterLink>
            <ul class="nav d-md-flex d-none gap-4 me-auto ms-5 text-center">
                <li class="nav-item">
                    <RouterLink class="nav-link text-light" to="/home">Home</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link text-light" to="/map">Map</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link text-light" to="/experience">Experience</RouterLink>
                </li>
            </ul> 
            <!-- <button class="btn fs-5 " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                <i class="bi bi-list text-light"></i>
            </button> -->
            <HeaderDropDown></HeaderDropDown>
        </nav>
    </div>

    <!-- Bottom nav on mobile -->
     <div class="container-fluid  fixed-bottom d-md-none d-block header-container top-shadow">
        <nav class="navbar justify-content-center">
            <ul class="nav gap-2">
                <li class="nav-item">
                    <RouterLink class="nav-link text-light fw-light bottom-text" to="/home" ><i class="bi bi-house-door nav-icons"></i>Home</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link text-light fw-light bottom-text" to="/map"><i class="bi bi-map nav-icons"></i>Map</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link text-light fw-light bottom-text" to="/experience"><i class="bi bi-journal nav-icons"></i>Experience</RouterLink>
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
import HeaderDropDown from './HeaderDropDown.vue';
    export default {
        name : "Header",
        components: {
            offCanvas,
            HeaderDropDown
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
