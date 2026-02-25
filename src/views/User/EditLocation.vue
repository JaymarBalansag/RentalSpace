<template>
  <Header />
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-1">
                <li class="breadcrumb-item"><RouterLink to="/profile">Profile</RouterLink></li>
                <li class="breadcrumb-item active">Edit Location</li>
              </ol>
            </nav>
            <h2 class="fw-bold text-dark">Update Address</h2>
          </div>
          <button class="btn btn-outline-secondary rounded-pill px-4" @click="this.$router.push('/profile')">
            Cancel
          </button>
        </div>

        <div class="row g-4">
          <div class="col-md-7">
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
              <div class="card-header bg-white border-0 pt-3 px-4 d-flex justify-content-between align-items-center">
                <span class="fw-bold small text-muted text-uppercase letter-spacing-1">
                  <i class="bi bi-geo-alt-fill text-danger me-1"></i> Drag marker to pin location
                </span>
                <div v-if="loadingMap" class="spinner-border spinner-border-sm text-primary"></div>
              </div>
              <div id="map" style="height: 450px; z-index: 1;" ref="mapEl"></div>
            </div>
          </div>

          <div class="col-md-5">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <form @submit.prevent="handleUpdateLocation">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">Street Name / Building #</label>
                  <input type="text" class="form-control custom-input" v-model="form.streets" placeholder="e.g. 123 Rizal St.">
                </div>

                <div class="row g-2 mb-3">
                  <div class="col-12">
                    <label class="form-label small fw-bold text-muted">Barangay</label>
                    <input type="text" class="form-control bg-light" v-model="form.village_name" disabled>
                  </div>
                  <div class="col-12">
                    <label class="form-label small fw-bold text-muted">City / Municipality</label>
                    <input type="text" class="form-control bg-light" v-model="form.town_name" disabled>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label small fw-bold text-muted">Province / State</label>
                  <input type="text" class="form-control bg-light" v-model="form.state_name" disabled>
                </div>

                <div class="mb-4">
                  <label class="form-label small fw-bold text-muted">Region</label>
                  <input type="text" class="form-control bg-light" v-model="form.region_name" disabled>
                </div>

                <div class="alert alert-info py-2 small border-0 bg-info-subtle text-info-emphasis mb-4">
                  <i class="bi bi-info-circle-fill me-2"></i>
                  City and Province are automatically updated based on the map pin.
                </div>

                <button type="submit" class="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center" :disabled="saving">
                  <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                  Save New Location
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import Header from "@/components/Header.vue";
import { getUserProfile, updateUserLocation } from "@/api/user"; // Ensure these API helpers exist
import 'leaflet/dist/leaflet.css';
import Swal from "sweetalert2";

export default {
  components: { Header },
  data() {
    return {
      map: null,
      marker: null,
      loadingMap: false,
      saving: false,
      form: {
        streets: "",
        town_name: "",
        village_name: "",
        state_name: "",
        region_name: "",
        latitude: null,
        longitude: null
      }
    };
  },
  async mounted() {
    await this.fetchCurrentLocation();
    this.initMap();
  },
  methods: {
    async fetchCurrentLocation() {
      try {
        const res = await getUserProfile();
        const data = res.data.user[0];
        this.form = {
          streets: data.streets,
          town_name: data.town_name,
          village_name: data.village_name,
          state_name: data.state_name,
          region_name: data.region_name,
          latitude: data.latitude || 14.5995,
          longitude: data.longitude || 120.9842
        };
      } catch (e) {
        console.error("Error loading profile", e);
      }
    },
    initMap() {
      this.map = L.map(this.$refs.mapEl, { zoomControl: false }).setView([this.form.latitude, this.form.longitude], 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map);
      L.control.zoom({ position: 'bottomright' }).addTo(this.map);

      this.marker = L.marker([this.form.latitude, this.form.longitude], { draggable: true }).addTo(this.map);

      this.marker.on("dragend", (e) => {
        const pos = e.target.getLatLng();
        this.updateCoords(pos.lat, pos.lng);
      });

      this.map.on("click", (e) => {
        this.marker.setLatLng(e.latlng);
        this.updateCoords(e.latlng.lat, e.latlng.lng);
      });
    },
    async updateCoords(lat, lng) {
      this.form.latitude = lat;
      this.form.longitude = lng;
      this.loadingMap = true;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2`);
        const data = await res.json();
        const addr = data.address;
        this.form.region_name = addr.region || "";
        this.form.village_name = addr.village || addr.suburb || addr.neighborhood || "";
        this.form.town_name = addr.city || addr.town || addr.municipality || "";
        this.form.state_name = addr.state || addr.province || "";
      } finally {
        this.loadingMap = false;
      }
    },
    async handleUpdateLocation() {
      this.saving = true;
      if(!this.form.streets){
        await Swal.fire({
          icon: "warning",
          title: "Street Required",
          text: "Streets cannot be empty",
        });
        this.saving = false;
        return;
      }
      if(!this.form.region_name){
        await Swal.fire({
          icon: "warning",
          title: "Region Required",
          text: "Region cannot be empty",
        });
        this.saving = false;
        return;
      }
      if(!this.form.state_name){
        await Swal.fire({
          icon: "warning",
          title: "State Required",
          text: "State cannot be empty",
        });
        this.saving = false;
        return;
      }
      if(!this.form.village_name){
        await Swal.fire({
          icon: "warning",
          title: "Village Required",
          text: "Village cannot be empty",
        });
        this.saving = false;
        return;
      }
      try {
        // Replace with your actual API call
        await updateUserLocation(this.form); 
        await Swal.fire({
          icon: "success",
          title: "Location Updated",
          text: "Location updated successfully!",
        });
        this.$router.push("/profile");
      } catch (e) {
        await Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update location.",
        });
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.custom-input {
  border: 1.5px solid #eef2f6;
  padding: 0.75rem 1rem;
  transition: all 0.2s;
}
.custom-input:focus {
  border-color: #4780d9;
  box-shadow: 0 0 0 3px rgba(71, 128, 217, 0.1);
}
.letter-spacing-1 { letter-spacing: 1px; }
</style>
