<template>
    <div class="container d-flex justify-content-center mt-5 sticky-top top-10">
        <div class="d-flex gap-2 py-2 w-auto rounded-5 p-3 bg-white shadow">
            <div class="input-group">
                <select class="form-select" aria-label="Property Type">
                    <option selected>Property Type</option>
                    <option value="1">Boarding House</option>
                    <option value="2">Hotel</option>
                    <option value="3">Commercial Space</option>
                    </select>
                <input type="text" aria-label="Location" placeholder="Location" class="form-control">
                <button class="btn btn-secondary"><i class="bi bi-search"></i></button>
                <button class="btn">
                    <i class="bi bi-filter-circle"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'PropertyFilter',


}

</script>