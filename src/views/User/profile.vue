<template>
  <Header></Header>

  <div class="container py-4">
    <!-- Back Button -->
    <RouterLink class="btn btn-outline-secondary fw-semibold mb-3" to="/">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <!-- Profile Card -->
    <div class="card shadow border-0 rounded-4 position-relative">
      <!-- Edit Button (Top Right) -->
      <RouterLink
        to="/profile/edit"
        class="btn btn-sm btn-outline-primary position-absolute end-0 mt-3 me-3"
        v-if="this.isComplete"
      >
        <i class="bi bi-pencil"></i> Edit
      </RouterLink>

      <!-- Header -->
      <div class="card-header bg-white border-0 text-center pt-4">
        <div class="d-flex justify-content-center mb-3">
          <div class="profile-circle">
            <img
              v-if="user.user_img_url"
              :src="user.user_img_url"
              alt="Profile"
              class="img-fluid rounded-circle"
              @error="$event.target.src = placeholderImg"
            />
            <i v-else class="bi bi-person text-secondary"></i>
          </div>
        </div>

        <h3 class="fw-bold mb-1">{{ name }}</h3>
        <p class="text-muted mb-2">{{ email }}</p>

        <!-- Profile Status -->
        <span
          class="badge px-3 py-2"
          :class="isComplete ? 'bg-success' : 'bg-warning text-dark'"
        >
          {{ isComplete ? 'Profile Complete' : 'Profile Incomplete' }}
        </span>
      </div>

      <!-- Body -->
      <div class="card-body">
        <!-- Incomplete Profile -->
        <div v-if="!isComplete" class="text-center py-5">
          <h5 class="fw-bold mb-3">
            Complete your profile to unlock full features
          </h5>
          <RouterLink to="/completion" class="btn btn-primary btn-lg">
            <i class="bi bi-pencil-square me-2"></i> Complete Profile
          </RouterLink>
        </div>

        <!-- Complete Profile -->
        <div v-else>
          <!-- User Info -->
          <div class="row g-4 mb-5">
            <div class="col-lg-6">
              <div class="card shadow-sm border-0 h-100">
                <div class="card-body">
                  <h5 class="fw-semibold mb-3">
                    <i class="bi bi-person-lines-fill me-2"></i> Contact Information
                  </h5>

                  <div class="list-group list-group-flush">
                    <div class="list-group-item">
                      <i class="bi bi-telephone me-2"></i>
                      {{ user.phone_number || 'Not provided' }}
                    </div>
                    <div class="list-group-item">
                      <i class="bi bi-signpost me-2"></i>
                      {{ user.streets || 'Not provided' }}
                    </div>
                    <div class="list-group-item">
                      <i class="bi bi-building me-2"></i>
                      {{ user.town_name || 'Not provided' }}
                    </div>
                    <div class="list-group-item">
                      <i class="bi bi-geo-alt me-2"></i>
                      {{ user.state_name || 'Not provided' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Map -->
            <div class="col-lg-6">
              <div class="card shadow-sm border-0 h-100">
                <div class="card-body">
                  <h5 class="fw-semibold mb-3 d-flex align-items-center">
                    <i class="bi bi-map me-2"></i> Location
                    <RouterLink
                      to="/profile"
                      class="btn btn-sm btn-outline-primary ms-auto"
                      v-if="this.isComplete"
                      
                    >
                      <i class="bi bi-pencil " ></i> Edit
                    </RouterLink>
                  </h5>
                  
                  <div id="map" class="rounded-3" ref="mapEl" style="height: 320px;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div class="card shadow-sm border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-semibold mb-0">
                  <i class="bi bi-sliders me-2"></i> Preferences
                </h5>

                <RouterLink
                  to="/profile/preferences/edit"
                  class="btn btn-sm btn-outline-primary"
                >
                  <i class="bi bi-pencil"></i> Edit
                </RouterLink>
              </div>

              <div class="row g-4">

              <!-- Amenities -->
              <div class="col-md-6">
                <h6 class="fw-semibold mb-2">Amenities</h6>

                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="(amenity, index) in amenities"
                    :key="'amenity-' + index"
                    class="badge rounded-pill bg-light text-dark border"
                  >
                    {{ amenity }}
                  </span>

                  <span v-if="!amenities.length" class="text-muted small">
                    No preferences set
                  </span>
                </div>
              </div>

              <!-- Property Types -->
              <div class="col-md-6">
                <h6 class="fw-semibold mb-2">Property Type</h6>

                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="(type, index) in propertyTypes"
                    :key="'type-' + index"
                    class="badge rounded-pill bg-light text-dark border"
                  >
                    {{ type }}
                  </span>

                  <span v-if="!propertyTypes.length" class="text-muted small">
                    No preferences set
                  </span>
                </div>
              </div>

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
import { getUserPreferences, getUserProfile } from "@/api/user";
import L from "leaflet";
import { useUserInfo } from "@/store/userInfo";
import Header from "@/components/Header.vue";
import 'leaflet/dist/leaflet.css';
import { nextTick } from "vue";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    'leaflet/dist/images/marker-icon-2x.png',
    import.meta.url
  ).href,
  iconUrl: new URL(
    'leaflet/dist/images/marker-icon.png',
    import.meta.url
  ).href,
  shadowUrl: new URL(
    'leaflet/dist/images/marker-shadow.png',
    import.meta.url
  ).href,
});


export default {
  name: "Profile",
  components: { RouterLink, Header },
  data() {
    return {
      user: {
        streets: null,
        state_name: null,
        town_name: null,
        phone_number: null,
        latitude: null,
        longitude: null,
        user_img_url: null,
      },
      isComplete: false,
      map: null,
      amenities: [],
      propertyTypes: [],
    };
  },
  computed: {
    name() {
      const info = useUserInfo();
      return `${info.first_name} ${info.last_name}`;
    },
    email() {
      return useUserInfo().email;
    },
  },
  mounted() {
    this.fetchUserProfile();
    this.fetchPreferences();

  },
  methods: {
    async fetchUserProfile() {
      const response = await getUserProfile();
      const data = response.data.user[0];

      Object.assign(this.user, {
        phone_number: data.phone_number,
        state_name: data.state_name,
        streets: data.streets,
        town_name: data.town_name,
        latitude: data.latitude,
        longitude: data.longitude,
        user_img_url: data.user_img_url,
      });

      this.isComplete = data.isComplete;

      await nextTick(); // 🔑 wait for DOM
      this.initMap();
    },
    initMap() {
      if (this.map) return;
      if (!this.$refs.mapEl) return;

      const lat = Number(this.user.latitude);
      const lng = Number(this.user.longitude);

      // 🔐 Validate coordinates
      const isValid =
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat !== 0 &&
        lng !== 0;

      const latitude = isValid ? lat : 14.5995;
      const longitude = isValid ? lng : 120.9842;

      this.map = L.map(this.$refs.mapEl, {
        zoomControl: false,
        attributionControl: false,
      }).setView([latitude, longitude], isValid ? 15 : 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map);

      L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup(
          isValid ? "Registered location" : "Default location (profile incomplete)"
        );

      L.control.zoom({ position: "bottomright" }).addTo(this.map);
    },
    async fetchPreferences() {
      try {
        const response = await getUserPreferences();

        this.amenities = response.data.amenities;
        this.propertyTypes = response.data.property_types;

      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    }
  },
};
</script>

<style scoped>
.profile-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-circle i {
  font-size: 3rem;
}
</style>
