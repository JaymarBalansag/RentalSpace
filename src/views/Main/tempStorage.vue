
<template>

    <Header></Header>

    <!-- Search Filter -->
    <div class="container-fluid  px-5 py-5 bg-secondary-subtle">
        <h1>Find a Space</h1>
        <div class="row mt-4 gap-2 px-3">
            <div class="col-3 d-flex justify-content-center align-items-center position-relative p-0">
                <div class="input-group">
                    <select class="form-select shadow-sm" aria-label="Default select example">
                        <option selected disabled>Amenities</option>
                        <option value="1">Electricity & Water Supply</option>
                        <option value="2">Private Bedroom</option>
                        <option value="3">Furnitures</option>
                        <option value="3">Security</option>
                        <option value="3">Wi-fi</option>
                    </select>
                </div>
            </div>
            <div class="col-3 d-flex justify-content-center align-items-center position-relative p-0">
                <div class="input-group">
                    <select class="form-select shadow-sm" aria-label="Default select example">
                        <option selected disabled>Facilties</option>
                        <option value="1">Kitchen</option>
                        <option value="2">Parking Space</option>
                        <option value="3">Gated Compound</option>
                        <option value="3">Common Lounge </option>
                        <option value="3">Fitness Area</option>
                    </select>
                </div>
            </div>

            <div class="col-3 d-flex justify-content-center align-items-center position-relative p-0">
                <div class="input-group shadow-sm">
                    <input type="text" class="form-control border-end-0" placeholder="Search" aria-label="Search">
                    <span class="input-group-text bg-white border-start-0"><i class="bi bi-search"></i></span>
                </div>
            </div>
            
            <div class="col-2 d-flex justify-content-center align-items-center position-relative p-0">
                <div class="input-group">
                    <button class="btn btn-primary shadow-sm">Search</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Side filters -->
     <div class="container-fluid px-5 py-3 ">
        <div class="row">
            <div class="col-5 border-end">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <h2>Property Type</h2>
                        <ul class="nav flex-column p-3 ">
                            <li class="nav-item">
                                <div class="form-check fs-5">
                                    <input class="form-check-input" type="checkbox" value="" id="checkDefault">
                                    <label class="form-check-label fw-light" for="checkDefault">
                                        Boarding House
                                    </label>
                                </div>
                            </li>
                            <li class="nav-item">
                                <div class="form-check fs-5">
                                    <input class="form-check-input" type="checkbox" value="" id="checkDefault">
                                    <label class="form-check-label fw-light" for="checkDefault">
                                        Apartment
                                    </label>
                                </div>
                            </li>
                            <li class="nav-item">
                                <div class="form-check fs-5 ">
                                    <input class="form-check-input" type="checkbox" value="" id="checkDefault">
                                    <label class="form-check-label fw-light" for="checkDefault">
                                        Dormitory
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <h2>Agreement Type</h2>
                        <ul class="nav flex-column p-3">
                            <li class="nav-item">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1">
                                    <label class="form-check-label fs-5 fw-light" for="radioDefault1">
                                        Rental
                                    </label>
                                    </div>
                                    <div class="form-check">
                                    <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault2">
                                    <label class="form-check-label fs-5 fw-light" for="radioDefault2">
                                        Lease
                                    </label>
                                </div>
                            </li>

                        </ul>
                    </li>
                </ul>
            </div>
            <div class="col-7">
                <div class="overflow-auto property-container">
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-4">
                            <img src="../../assets/hotel.jpg" class="img-fluid rounded-start" alt="...">
                            </div>
                            <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">Card title</h5>
                                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-4">
                            <img src="../../assets/hotel.jpg" class="img-fluid rounded-start" alt="...">
                            </div>
                            <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">Card title</h5>
                                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-4">
                            <img src="../../assets/hotel.jpg" class="img-fluid rounded-start" alt="...">
                            </div>
                            <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">Card title</h5>
                                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-4">
                            <img src="../../assets/hotel.jpg" class="img-fluid rounded-start" alt="...">
                            </div>
                            <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">Card title</h5>
                                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-4">
                            <img src="../../assets/hotel.jpg" class="img-fluid rounded-start" alt="...">
                            </div>
                            <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">Card title</h5>
                                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </div>
        </div>
     </div>

    

</template>


<script>
import { RouterLink } from 'vue-router';
import Header from '@/components/Header.vue';

export default {
  name: 'tempStorage',
    components: {
        Header,
        RouterLink
    }
};

</script>

<style scoped>

.property-container {
    max-height: 386px;
}


</style>