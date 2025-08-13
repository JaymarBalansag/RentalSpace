<template>
  <div>
    <!-- Filter Button -->
    <button
      class="btn btn-primary position-absolute z-top m-2"
      data-bs-toggle="modal"
      data-bs-target="#filterModal"
    >
      <i class="bi bi-list"></i> Filters
    </button>

    <!-- Filter Modal -->
    <div
      class="modal fade"
      id="filterModal"
      tabindex="-1"
      aria-labelledby="filterModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="filterModalLabel">Filter Options</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <!-- Your filter fields here -->
            <div class="mb-3">
              <label class="form-label">Price Range</label>
              <input type="range" class="form-range" min="0" max="5000" />
            </div>

            <div class="mb-3">
              <label class="form-label">Location</label>
              <select class="form-select">
                <option>Any</option>
                <option>Downtown</option>
                <option>Suburbs</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Amenities</label>
              <div>
                <input type="checkbox" id="wifi" /> <label for="wifi">Wi-Fi</label>
              </div>
              <div>
                <input type="checkbox" id="parking" /> <label for="parking">Parking</label>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" class="btn btn-primary" @click="applyFilters">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MapFilter",
  methods: {
    applyFilters() {
      // Add your filter logic here
      console.log("Filters applied!");
      // Close modal manually if needed:
      const modalEl = document.getElementById("filterModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    },
  },
};
</script>

<style scoped>
.z-top {
  z-index: 1055; /* higher than leaflet tile layers and bootstrap modal */
}
</style>
