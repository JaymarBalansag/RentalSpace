
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
                            <RouterLink class="nav-link" to="/Map">Map</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="btn btn-outline-danger owner" to="#">Be a Owner!</RouterLink>
                        </li>
                    </ul>

                    <div class="d-flex ms-auto">
                        <button class="btn"><i class="bi bi-person-circle profile"></i></button>
                    </div>
                </div>
            </div>
        </nav>


        <div class="container mt-3 justify-content-center filter-bar shadow">
            <div class="d-flex justify-content-center gap-2 flex-wrap  ">
                <div class="form-floating filter-group ">
                    <input type="text" id="property" class="form-control border-0 filter-input" placeholder="Property">
                    <label for="property">Property</label>
                </div>
                <div class="form-floating filter-group">
                    <input type="text" id="property" class="form-control border-0 filter-input" placeholder="Location">
                    <label for="property">Location</label>
                </div>
                <div class="form-floating filter-group">
                    <input type="text" id="property" class="form-control border-0 filter-input" placeholder="Price">
                    <label for="property">Price</label>
                </div>
                <div class="form-floating filter-group">
                    <input type="text" id="property" class="form-control border-0 filter-input" placeholder="Amenities">
                    <label for="property">Amenities</label>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { RouterLink } from 'vue-router';


    export default {
        name : "Header"
    }

</script>

<style src="../assets/component-style/header.css" scoped></style>
