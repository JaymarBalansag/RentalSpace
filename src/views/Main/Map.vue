<template>

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
import { getProperties } from '@/api/property';
import L from "leaflet";
import placeholderImg from '@/assets/Placeholder/thumbnail_placeholder.jpg'; 
import { RouterLink } from 'vue-router';


export default {
  name: 'Map',
  components: {  },
  data() {
    return {
      location: null,
      price: 500,
      propertyTypes: ["Boarding House", "Apartment", "Dormitory"],
      agreements: ["Rental", "Lease"],
      properties: [],
      map: null,
      placeholderImg,
    };
  },
  async mounted() {
    await this.getProperties();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleLocationSuccess,
        this.handleLocationError,
      );
    } else {
      this.setMap(8.228, 124.245); // fallback coords (Iligan City)
    }
  },
  methods: {
    async getProperties() {
      try {
        const response = await getProperties();
        this.properties = response.data.properties;
      } catch (error) {
        console.log("Map Properties Error: " + error);
      }
    },
    handleLocationSuccess(position) {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.setMap(this.location.lat, this.location.lng);
    },
    handleLocationError(error) {
      alert("Failed to get location: " + error.message);
      this.setMap(8.228, 124.245); // fallback center
    },
    setMap(lat, lng) {
      this.map = L.map("map", { zoomControl: false }).setView([lat, lng], 15);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      // Add property markers
      this.properties.forEach(property => {
        if (property.latitude && property.longitude) {
          L.marker([property.latitude, property.longitude])
            .addTo(this.map)
            .bindPopup(this.popupContent(property));
        }
      });

      L.control.zoom({ position: "topright" }).addTo(this.map);
    },
    popupContent(property) {
      const imgSrc = property.image_url;
      const placeholder = this.placeholderImg;
      return `
        <div class="card shadow-sm border-0" style="width: 220px;">
          <img src="${imgSrc}"
              onerror="this.onerror=null;this.src='${placeholder}';"
              class="card-img-top rounded-top" 
              alt="Property Image"/>

          <div class="card-body p-2">
            <h6 class="card-title text-truncate mb-1" style="font-size: 14px;">
              ${property.title || 'Untitled Property'}
            </h6>
            <p class="card-text fw-bold text-success mb-2" style="font-size: 13px;">
              $${property.price || 'N/A'}
            </p>
            <div class="d-grid">
              <a href="/property/${property.id}" 
                class="btn btn-sm btn-primary text-light">
                View Details
              </a>
            </div>
          </div>
        </div>
      `;
    }

  }
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
