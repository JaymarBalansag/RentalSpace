<template>
    <div class="container properties-parent">
        <PropertyFilter></PropertyFilter>
        <!-- Boarding House -->
        <div class="row mx-3 my-3">
            <h1 class="h1">Boarding House</h1>
            <div class="col">
                <div class="card">
                    <img src="../assets/rental.jpg" alt="" class="card-img-top">
                    <div class="card-body">
                        <h1 class="card-title">Boarding House</h1>
                        <div class="card-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et, ipsam.</div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <img src="../assets/rental.jpg" alt="" class="card-img-top">
                    <div class="card-body">
                        <h1 class="card-title">Boarding House</h1>
                        <div class="card-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et, ipsam.</div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <img src="../assets/rental.jpg" alt="" class="card-img-top">
                    <div class="card-body">
                        <h1 class="card-title">Boarding House</h1>
                        <div class="card-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et, ipsam.</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Hotels -->
        <div class="row mx-3 my-3">
            <h1 class="h1">Hotel</h1>
            <div class="col">
                <div class="card">
                    <img src="../assets/hotel.jpg" alt="" class="card-img-top">
                    <div class="card-body">
                        <h1 class="card-title">Hotel</h1>
                        <div class="card-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et, ipsam.</div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <img src="../assets/hotel.jpg" alt="" class="card-img-top">
                    <div class="card-body">
                        <h1 class="card-title">Hotel</h1>
                        <div class="card-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et, ipsam.</div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <img src="../assets/hotel.jpg" alt="" class="card-img-top">
                    <div class="card-body">
                        <h1 class="card-title">Hotel</h1>
                        <div class="card-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et, ipsam.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="../assets/component-style/propertiesStyle.css"></style>

<script>
import PropertyFilter from '@/components/PropertyFilter.vue';
export default {
    name: 'properties',
    components: {
        PropertyFilter,
    }

}

</script>