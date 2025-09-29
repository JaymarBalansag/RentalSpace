<template>
  <div class="container py-3">
    <!-- Back Button -->
    <RouterLink class="btn btn-outline-secondary fw-bold mb-3" to="/">
      <i class="bi bi-arrow-90deg-left me-1"></i> Back
    </RouterLink>

    <!-- Profile Card -->
    <div class="card shadow border-0 rounded-3">
      <div class="card-header bg-white border-0 text-center">
      <!-- Avatar Circle -->
      <div class="d-flex justify-content-center">
          <div class="profile-circle mb-3">
            <img
            v-if="user.user_img_url"
            :src="user.user_img_url"
            alt="Profile"
            class="img-fluid rounded-circle"
            style="width: 100%; height: 100%; object-fit: cover;"
            @error="$event.target.src = placeholderImg"
          />
          <i v-else class="bi bi-person text-secondary"></i>
          </div>
        </div>
        <h3 class="mb-0 fs-2 fw-bold">{{ name }}</h3>
        <p class="text-muted mb-2">{{ email }}</p>
      </div>

      <!-- If profile is incomplete -->
      <div v-if="this.isComplete == 0" class="card-body text-center py-5">
        <h4 class="fw-bold mb-3">Complete Your Profile to Unlock More Features</h4>
        <RouterLink to="/completion" class="btn btn-primary btn-lg">
          <i class="bi bi-pencil-square me-2"></i> Complete Profile
        </RouterLink>
      </div>

      <!-- If profile is complete -->
      <div v-else class="card-body">
        <div class="row g-4">
          <!-- Map -->
          <div class="col-lg-6">
            <div id="map" class="rounded shadow-sm" style="height: 50vh;"></div>
          </div>

          <!-- User Info -->
          <div class="col-lg-6">
            <div class="list-group shadow-sm rounded">
              <div class="list-group-item">
                <i class="bi bi-telephone me-2"></i> {{ this.user.phone_number }}
              </div>
              <div class="list-group-item">
                <i class="bi bi-signpost me-2"></i> {{ this.user.streets}}
              </div>
              <div class="list-group-item">
                <i class="bi bi-building me-2"></i> {{ this.user.muncity }}
              </div>
              <div class="list-group-item">
                <i class="bi bi-geo me-2"></i> {{ this.user.province }}
              </div>
            </div>
          </div>
        </div>

        <hr class="my-5">

        <!-- Preferences Section -->
        <div>
          <h3 class="fw-bold mb-4">Preferences</h3>
          <div class="row">
            <div class="col-md-6 mb-4">
              <h5 class="fw-semibold">Amenities</h5>
              <hr>
              <div class="d-flex gap-3 align-items-center">
                <i class="bi bi-wifi fs-3"></i>
                <span>Wi-Fi</span>
              </div>
            </div>
            <div class="col-md-6 mb-4">
              <h5 class="fw-semibold">Property Type</h5>
              <hr>
              <div class="d-flex gap-3 align-items-center">
                <i class="bi bi-house fs-3"></i>
                <span>Boarding House</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { getUserProfile } from "@/api/user";
import L from "leaflet";
import { useUserInfo } from "@/store/userInfo";

export default {
  name: "Profile",
  components: { RouterLink },
  data() {
    return {
      user: {
        streets: null,
        barangay: null,
        province:null,
        muncity: null,
        phone_number: null,
        latitude: null,
        longitude: null
      },
      isComplete: null,
      location: null,
      map: null,
    };
  },
  computed: {
    name() {
      const info = useUserInfo();
      return info.first_name + " " + info.last_name
    },
    email() {
      const info = useUserInfo();
      return info.email
    },
  },
  mounted() {
    this.fetchUserProfile();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleLocationSuccess,
        this.handleLocationError
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await getUserProfile();
        console.log(response)
        const data = response.data.user[0]
        this.user.phone_number = data.phone_number;
        this.user.province = data.provDesc
        this.user.streets = data.streets
        this.user.muncity = data.muncityDesc
        this.isComplete = data.isComplete;
        this.user.latitude = data.latitude;
        this.user.longitude = data.longitude
        this.user.user_img_url = data.user_img_url;
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },
    handleLocationSuccess(position) {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.initMap(this.location.lat, this.location.lng);
    },
    initMap(lat, lng) {
      let latitude = lat; 
      let longitude = lng;


      if(parseFloat(this.user.latitude) && parseFloat(this.user.longitude)){
        latitude = this.user.latitude
        longitude = this.user.longitude
      }
      
      if (this.map) return; // Prevent re-init
      this.map = L.map("map", { zoomControl: false }).setView([latitude, longitude], 15);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);

      L.marker([latitude, longitude]).addTo(this.map).bindPopup("You are here!").openPopup();

      // Custom zoom controls bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(this.map);
    },
    handleLocationError(error) {
      alert("Failed to get location: " + error.message);
    },
  },
};
</script>

<style scoped>
.profile-circle {
  width: 120px;
  height: 120px;
  background-color: #fff;
  border: 2px solid #dee2e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.profile-circle i {
  font-size: 3rem;
  line-height: 1;
}
</style>
