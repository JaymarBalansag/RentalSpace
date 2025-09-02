<template>

    <div class="container d-flex justify-content-start mt-5 bg-white shadow-bottom p-3 gap-3">
        <div class="input-group w-50 shadow-sm">
            <input type="text" aria-placeholder="Search" placeholder="Search" class="form-control bg-secondary-subtle rounded-0 border-0">
            <button class="btn rounded-0 bg-secondary-subtle"><i class="bi bi-search"></i></button>
        </div>

        <button class="btn bg-secondary-subtle rounded-0">Recent</button>
        <button class="btn bg-secondary-subtle rounded-0">Popular</button>
        <button class="btn bg-secondary-subtle rounded-0">Amenities</button>
    </div>  

</template>

<script>
import { RouterLink } from 'vue-router';
export default {
    name: "ExperienceFilter"
}

</script>


<style scoped>

.shadow-bottom {
    box-shadow: 0px 7px 6px rgba(0, 0, 0, 0.1);
}

</style>
