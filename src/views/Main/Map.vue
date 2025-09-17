<template>
  <Header />

  <div class="container-fluid p-4 bg-light">
    <div class="row">

      <!-- Side Filters -->
      <aside class="col-lg-3 col-md-4">
        <div class="filters sticky-top">
          
          <!-- Property Type -->
          <div class="filter-card mb-3">
            <h5 class="fw-bold">Property Type</h5>
            <div class="form-check" v-for="(type, i) in propertyTypes" :key="i">
              <input class="form-check-input" type="checkbox" :id="'ptype-' + i">
              <label class="form-check-label fw-light" :for="'ptype-' + i">{{ type }}</label>
            </div>
          </div>

          <!-- Agreement Type -->
          <div class="filter-card mb-3">
            <h5 class="fw-bold">Agreement Type</h5>
            <div class="form-check" v-for="(agreement, i) in agreements" :key="i">
              <input class="form-check-input" type="radio" name="agreement" :id="'agreement-' + i">
              <label class="form-check-label fw-light" :for="'agreement-' + i">{{ agreement }}</label>
            </div>
          </div>

          <!-- Price Range -->
          <div class="filter-card mb-3">
            <h5 class="fw-bold">Price Range</h5>
            <label for="priceRange" class="form-label small text-muted">Adjust to filter results</label>
            <input type="range" class="form-range" min="0" max="1000" step="50" v-model="price">
            <div class="d-flex justify-content-between small text-muted">
              <span>Min: $0</span>
              <span>Up to: ${{ price }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Map -->
      <div class="col-lg-9 col-md-8">
        <div class="rounded shadow-sm" id="map" style="height:80vh"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import L from "leaflet";

export default {
  name: 'Map',
  components: { Header },
  data() {
    return {
      location: null,
      price: 500,
      propertyTypes: ["Boarding House", "Apartment", "Dormitory"],
      agreements: ["Rental", "Lease"],
    };
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleLocationSuccess,
        this.handleLocationError,
      );
    } else {
      this.setMap(8.228, 124.245); // default coords (Iligan City)
    }
  },
  methods: {
    handleLocationSuccess(position) {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.setMap(this.location.lat, this.location.lng);
    },
    setMap(lat, lng) {
      const map = L.map("map", { zoomControl: false }).setView([lat, lng], 15);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      L.control.zoom({ position: "topright" }).addTo(map);
    },
    handleLocationError(error) {
      alert("Failed to get location: " + error.message);
      this.setMap(8.228, 124.245); // fallback center
    },
  },
};
</script>

<style scoped>
.filters {
  max-height: 80vh;
  overflow-y: auto;
}
.filter-card {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
</style>
