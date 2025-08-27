<template>
  <div class="card shadow-sm">
    <div class="card-header fw-bold bg-white">
      <h5>User Address</h5>
    </div>
    <div class="card-body">
      <div class="row">
        <!-- Map -->
        <div class="col-8">
          <div id="map" style="height: 400px; border-radius: 8px;"></div>
          
        </div>

        <!-- Input -->
        <div class="col-4">
          <!-- For Addresses -->
          <form action="">
              <div class="mb-1">
                <label class="form-label">Latitude</label>
                <input type="text" v-model="latitude" class="form-control" readonly />
              </div>
              <div class="mb-1">
                <label class="form-label">Longitude</label>
                <input type="text" v-model="longitude" class="form-control" readonly />
              </div>
            <!-- For Regions -->
              <div class="mb-1">
                <label for="regions">Region:</label>
                <select class="form-select" v-model="Selectedregions" @change="fetchProvinces">
                  <option disabled selected>Select Regions</option>
                <option v-for="r in regions" :key="r.psgc_id" :value="r.psgc_id">
                  {{ r.name }}
                </option>
              </select>
              </div>
            <!-- For Provinces -->
             <div class="mb-1">
                <label for="provinces">Provinces:</label>
                <select class="form-select" v-model="Selectedprovinces" @change="fetchCities">
                  <option disabled selected>Select Provinces</option>
                  <option v-for="p in provinces" :key="p.psgc_id" :value="p.psgc_id">
                    {{ p.name }}
                  </option>
                </select>
             </div>
             
             <div class="mb-1">
                <label for="city/municipal">City/Municipal:</label>
                <select class="form-select" v-model="Selectedcities" @change="fetchBarangays">
                  <option disabled selected>Select Cities/Municipalities</option>
                  <option v-for="c in cities" :key="c.psgc_id" :value="c.psgc_id">
                    {{ c.name }}
                  </option>
                </select>
             </div>

             <div class="mb-1">
                <label for="barangays">Barangays:</label>
                <select class="form-select" v-model="Selectedbarangays" >
                  <option disabled selected>Select Barangays</option>
                  <option v-for="b in barangays" :key="b.psgc_id" :value="b.psgc_id">
                    {{ b.name }}
                  </option>
                </select>
             </div>

             <button class="btn mb-1 btn-success">
              Submit
             </button>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import { fetchRegions, fetchProvinces, fetchCities, fetchBarangays } from "@/api/location"; // Assume this function fetches regions from an API

export default {
  name: "address",
  data() {
    return {
      map: null,
      marker: null,
      latitude: "",
      longitude: "",

      Selectedregions : null,
      Selectedcities : null,
      Selectedbarangays : null,
      Selectedprovinces : null,

      regions: [],
      provinces: [], 
      cities: [],
      barangays: []

    };
  },
  mounted() {
    // Use browser geolocation to center map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleLocationSuccess,
        this.handleLocationError
      );
    } else {
      alert("Geolocation not supported by this browser.");
    }
    this.fetchRegions();
  },
  methods: {
    handleLocationSuccess(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.latitude = lat.toFixed(6);
      this.longitude = lng.toFixed(6);

      this.initMap(lat, lng);
    },
    handleLocationError(error) {
      alert("Failed to get location: " + error.message);
      // fallback center (Manila)
      this.initMap(14.5995, 120.9842);
    },
    initMap(lat, lng) {
      this.map = L.map("map").setView([lat, lng], 15);

      // Tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
      }).addTo(this.map);

      // Drop initial marker at user location
      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

      this.marker.on("dragend", (event) => {
        const pos = event.target.getLatLng();
        this.latitude = pos.lat.toFixed(6);
        this.longitude = pos.lng.toFixed(6);
      });

      // Click on map → move marker
      this.map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        this.latitude = lat.toFixed(6);
        this.longitude = lng.toFixed(6);
        this.marker.setLatLng([lat, lng]);
      });
    },
    async fetchRegions() {
      try {
        const response = await fetchRegions();
        const data = response;
        this.regions = data;
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    },
    async fetchProvinces() {
      try {
        const response = await fetchProvinces(this.Selectedregions);
        const data = response;
        this.provinces = data;
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    },
    async fetchCities() {
      try {
        const response = await fetchCities(this.Selectedprovinces);
        const data = response;
        this.cities = data;
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    },
    async fetchBarangays() {
      try {
        const response = await fetchBarangays(this.Selectedcities);
        const data = response;
        this.barangays = data;
      } catch (error) {
        console.error("Error fetching barangays:", error);
      }
    }
  }
}
</script>
