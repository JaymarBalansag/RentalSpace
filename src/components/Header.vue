
<template>
    <div class="shadow-sm pb-4">
        <nav class="navbar navbar-expand-md align-top">
            <div class="container">
                <a class="navbar-brand fw-bold" href="#">RentaSpace</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav mx-auto gap-5">
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/">Home</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/map">Map</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/experience">Experience</RouterLink>
                        </li>
                    </ul>

                    <div class="d-flex ms-auto">
                        <button class="btn"><i class="bi bi-person-circle profile"></i></button>
                    </div>
                </div>
            </div>
        </nav>
    </div>

</template>

<script>
import { RouterLink } from 'vue-router';


    export default {
        name : "Header",
    }

</script>

<style src="../assets/component-style/header.css" scoped></style>
