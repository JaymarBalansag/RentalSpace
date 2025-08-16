<template>
    <Header></Header>
    <div class="container properties-parent position-relative">
        <PropertyFilter></PropertyFilter>
        <!-- Boarding House -->
        <div class="row mx-3 my-5 gy-3">
            <div class="container-fluid d-flex ">
                <h1 class="h2 me-auto">Boarding House</h1>
                <RouterLink class="link-primary ms-auto">See more <i class="bi bi-three-dots-vertical"></i></RouterLink>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card">
                    <img src="../assets/rental.jpg" alt="" class="card-img-top img-fluid">
                    <div class="card-body">
                        <h5 class="card-title">Bogart's Boarding House</h5>
                        <p class="card-text ">
                            Price: &#8369; 150.00 <br></br>
                            Location: Guintagbucan, Abuyog, Leyte 
                        </p>
                        <p class="card-text "></p>
                        <button class="btn btn-outline-success ">
                            View More!
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card">
                    <img src="../assets/rental.jpg" alt="" class="card-img-top img-fluid">
                    <div class="card-body">
                        <h5 class="card-title">Bogart's Boarding House</h5>
                        <p class="card-text ">
                            Price: &#8369; 150.00 <br></br>
                            Location: Guintagbucan, Abuyog, Leyte 
                        </p>
                        <p class="card-text "></p>
                        <button class="btn btn-outline-success ">
                            View More!
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card">
                    <img src="../assets/rental.jpg" alt="" class="card-img-top img-fluid">
                    <div class="card-body">
                        <h5 class="card-title">Bogart's Boarding House</h5>
                        <p class="card-text ">
                            Price: &#8369; 150.00 <br></br>
                            Location: Guintagbucan, Abuyog, Leyte 
                        </p>
                        <p class="card-text "></p>
                        <button class="btn btn-outline-success ">
                            View More!
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card">
                    <img src="../assets/rental.jpg" alt="" class="card-img-top img-fluid">
                    <div class="card-body">
                        <h5 class="card-title">Bogart's Boarding House</h5>
                        <p class="card-text ">
                            Price: &#8369; 150.00 <br></br>
                            Location: Guintagbucan, Abuyog, Leyte 
                        </p>
                        <p class="card-text "></p>
                        <button class="btn btn-outline-success ">
                            View More!
                        </button>
                    </div>
                </div>
            </div>  
        </div>
        <!-- Hotels -->
        <div class="row mx-3 my-5 gy-3">
            <div class="container-fluid d-flex ">
                <h1 class="h2 me-auto">Boarding House</h1>
                <RouterLink class="link-primary ms-auto">See more <i class="bi bi-three-dots-vertical"></i></RouterLink>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card">
                    <img src="../assets/hotel.jpg" alt="" class="card-img-top img-fluid">
                    <div class="card-body">
                        <h5 class="card-title">Bogart's Luxury Hotel</h5>
                        <p class="card-text ">
                            Price: &#8369; 150.00 <br></br>
                            Location: Guintagbucan, Abuyog, Leyte 
                        </p>
                        <p class="card-text "></p>
                        <button class="btn btn-outline-success ">
                            View More!
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card">
                    <img src="../assets/hotel.jpg" alt="" class="card-img-top img-fluid">
                    <div class="card-body">
                        <h5 class="card-title">Bogart's Luxury Hotel</h5>
                        <p class="card-text ">
                            Price: &#8369; 150.00 <br></br>
                            Location: Guintagbucan, Abuyog, Leyte 
                        </p>
                        <p class="card-text "></p>
                        <button class="btn btn-outline-success ">
                            View More!
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card">
                    <img src="../assets/hotel.jpg" alt="" class="card-img-top img-fluid">
                    <div class="card-body">
                        <h5 class="card-title">Bogart's Luxury Hotel</h5>
                        <p class="card-text ">
                            Price: &#8369; 150.00 <br></br>
                            Location: Guintagbucan, Abuyog, Leyte 
                        </p>
                        <p class="card-text "></p>
                        <button class="btn btn-outline-success ">
                            View More!
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card">
                    <img src="../assets/hotel.jpg" alt="" class="card-img-top img-fluid">
                    <div class="card-body">
                        <h5 class="card-title">Bogart's Luxury Hotel</h5>
                        <p class="card-text ">
                            Price: &#8369; 150.00 <br></br>
                            Location: Guintagbucan, Abuyog, Leyte 
                        </p>
                        <p class="card-text "></p>
                        <button class="btn btn-outline-success ">
                            View More!
                        </button>
                    </div>
                </div>
            </div>  
        </div>
    </div>
</template>

<style src="../assets/component-style/propertiesStyle.css"></style>

<script>
import Header from '@/components/Header.vue';
import PropertyFilter from '@/components/PropertyFilter.vue';
export default {
    name: 'properties',
    components: {
        PropertyFilter,
        Header,
    }

}

</script>