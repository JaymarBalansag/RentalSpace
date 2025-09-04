<template>

    <Header></Header>

    <div class="container-fluid p-5 bg-light-subtle">
        <div class="row">
            <!-- Left Component -->
            <div class="col-8">

                <!-- Recommended -->
                <div class="row">
                    <!-- Recommended Cabinet -->
                    <div class="col">
                        <h1 class="mb-4">Recommended</h1>
                        <div class="d-flex gap-2 mb-3">
                            <button class="btn btn-outline-secondary shadow-sm">Near You!</button>
                            <button class="btn btn-outline-secondary shadow-sm">Preferences</button>
                            <button class="btn btn-primary ms-auto">See More</button>
                        </div>

                        <!-- Property Cards Section -->
                        <div class="row g-3">
                            <div class="col-md-4 col-sm-6">
                                <div class="card shadow-sm">
                                    <img src="../../assets/rental.jpg" class="card-img-top" alt="Rental Property">
                                    <div class="card-body">
                                        <h5 class="card-title">Card title</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                        <a href="#" class="btn btn-primary">View More</a>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-4 col-sm-6">
                                <div class="card shadow-sm">
                                    <img src="../../assets/rental.jpg" class="card-img-top" alt="Rental Property">
                                    <div class="card-body">
                                        <h5 class="card-title">Card title</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                        <a href="#" class="btn btn-primary">View More</a>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-4 col-sm-6">
                                <div class="card shadow-sm">
                                    <img src="../../assets/rental.jpg" class="card-img-top" alt="Rental Property">
                                    <div class="card-body">
                                        <h5 class="card-title">Card title</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                        <a href="#" class="btn btn-primary">View More</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-5">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h1>Popular post</h1>
                                <div class="d-flex gap-2 mb-3">
                                    <button class="btn btn-outline-secondary shadow-sm">Recent post</button>
                                    <button class="btn btn-outline-secondary shadow-sm">Preferences</button>
                                    <button class="btn btn-primary ms-auto">See More</button>
                                </div>
                            </div>

                            <div class="card-body overflow-auto"  style="max-height: 400px;">
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
            </div>

            <!-- Right Component -->
            <div class="col-4 border-start">

                <div class="card border-0 bg-secondary-subtle shadow-sm">
                    <div class="card-header text-center">
                        <h4>Recent Post</h4>
                    </div>

                    <div class="card-body overflow-auto" style="max-height: 400px;">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex align-items-center">
                                <img src="../../assets/hotel.jpg" alt="thumb" class="rounded me-3" style="width:60px; height:60px; object-fit:cover;">
                                <div>
                                <h6 class="mb-1">Post title</h6>
                                <small class="text-muted">2 mins ago</small>
                                </div>
                            </li>
                            <li class="list-group-item d-flex align-items-center">
                                <img src="../../assets/hotel.jpg" alt="thumb" class="rounded me-3" style="width:60px; height:60px; object-fit:cover;">
                                <div>
                                <h6 class="mb-1">Another post</h6>
                                <small class="text-muted">5 mins ago</small>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="card mt-4 border-0 shadow-sm">
                    <div class="card-header text-center">
                        <h4>Trending Tags</h4>
                    </div>
                    <div class="card-body">
                        <span class="badge bg-primary m-1">Boarding House</span>
                        <span class="badge bg-success m-1">Apartment</span>
                        <span class="badge bg-warning m-1">Near School</span>
                        <span class="badge bg-info m-1">Cheap Rent</span>
                    </div>
                </div>

                <div class="card mt-4 border-0 shadow-sm">
                    <div class="card-header text-center">
                        <h4>Top Rated</h4>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                        Cozy Apartment <span class="badge bg-success">4.9 ★</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                        Budget Room <span class="badge bg-success">4.7 ★</span>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
        

    </div>

</template>

<script>
    import Header from '@/components/Header.vue';
    export default {
        name: "Experience",
        components: {
            Header
        }
    }

</script>