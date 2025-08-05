<template>
  <div class="map-filter-container position-absolute top-0 start-50 translate-middle-x p-3 z-top">
    <div class="d-flex gap-2 w-auto rounded-5 bg-white shadow p-3">
      <div class="input-group">
        <select class="form-select" aria-label="Property Type">
          <option selected>Property Type</option>
          <option value="1">Boarding House</option>
          <option value="2">Hotel</option>
          <option value="3">Commercial Space</option>
        </select>
        <input type="text" aria-label="Location" placeholder="Location" class="form-control" />
        <button class="btn btn-secondary">
          <i class="bi bi-search"></i>
        </button>
        <button class="btn">
          <i class="bi bi-filter-circle"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MapFilter"
};
</script>

<style scoped>
.z-top {
  z-index: 1055; /* higher than leaflet tile layers and bootstrap modal */
}
</style>
