<template>
    <div class="container d-flex justify-content-start mt-5 bg-white shadow-sm p-3">
        <div class="input-group">


            <select class="form-select rounded-0" aria-label="Property Type">
                <!-- Placeholder option for larger screens -->
                <option value="" selected disabled class="d-none d-sm-block">Property Type</option>

                <option value="1">Boarding House</option>
                <option value="2">Hotel</option>
                <option value="3">Commercial Space</option>
            </select>

            <input type="text" aria-label="Location" placeholder="Location" class="form-control d-sm-block d-none">
            <button class="btn btn-secondary"><i class="bi bi-search"></i></button>
            <button class="btn">
                <i class="bi bi-funnel"></i>
            </button>
        </div>
    </div>

    <!-- <div class="d-flex gap-2 py-2 p-3 bg-white shadow">
            
        </div> -->
</template>

<script>

export default {
    name: 'PropertyFilter',


}

</script>