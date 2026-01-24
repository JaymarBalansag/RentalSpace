<template>
  <Header />

  <div class="container py-4">
    <div class="mb-3">
      <button class="btn btn-link text-decoration-none p-0 text-muted fw-semibold" @click="this.$router.push('/home')">
        <i class="bi bi-arrow-left me-1"></i> Back to Home
      </button>
    </div>

    <div class="row g-4">
      <div class="col-lg-4">
        <div class="card shadow-sm border-0 rounded-4 text-center p-4 position-relative overflow-hidden h-100">
          <div class="profile-accent-bg"></div>
          
          <div class="d-flex justify-content-center mb-3 mt-4">
            <div class="profile-circle shadow-sm border border-4 border-white bg-white">
              <img
                v-if="user.user_img_url"
                :src="user.user_img_url"
                alt="Profile"
                class="img-fluid rounded-circle"
                @error="$event.target.src = placeholderImg"
              />
              <i v-else class="bi bi-person-fill text-secondary"></i>
            </div>
          </div>

          <h3 class="fw-bold mb-1 text-dark">{{ name }}</h3>
          <p class="text-muted small mb-3">{{ email }}</p>

          <div class="mb-4">
            <span
              class="badge rounded-pill py-2 px-3 border"
              :class="isComplete ? 'bg-success-subtle text-success border-success-subtle' : 'bg-warning-subtle text-warning-emphasis border-warning-subtle'"
            >
              <i class="bi me-1" :class="isComplete ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'"></i>
              {{ isComplete ? 'Verified Account' : 'Incomplete Profile' }}
            </span>
          </div>

          <div v-if="isComplete" class="d-grid">
            <RouterLink to="/profile/edit" class="btn btn-outline-primary btn-sm rounded-pill fw-bold">
              <i class="bi bi-pencil-square me-1"></i> Update Account Info
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        
        <div v-if="!isComplete" class="card border-0 shadow-sm rounded-4 mb-4 bg-primary text-white overflow-hidden p-4">
          <div class="d-flex align-items-center gap-4">
            <div class="flex-grow-1">
              <h5 class="fw-bold mb-1">Complete your profile!</h5>
              <p class="small opacity-75 mb-0">Unlocks property booking, owner messaging, and personalized stay recommendations.</p>
            </div>
            <RouterLink to="/completion" class="btn btn-light rounded-pill px-4 fw-bold shadow-sm text-primary">
              Setup Now
            </RouterLink>
          </div>
        </div>

        <div v-else class="d-flex flex-column gap-4">
          
          <div class="row g-4">
            <div class="col-md-6">
              <div class="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">
                <h6 class="fw-bold text-muted text-uppercase small mb-4 letter-spacing-1">
                  <i class="bi bi-person-lines-fill me-2 text-primary"></i>Contact Details
                </h6>
                
                <div class="info-group mb-3">
                  <small class="text-muted d-block mb-1">Phone Number</small>
                  <p class="fw-bold text-dark mb-0">{{ user.phone_number || 'Not provided' }}</p>
                </div>
                
                <div class="info-group mb-3">
                  <small class="text-muted d-block mb-1">Current Address</small>
                  <p class="fw-bold text-dark mb-0">{{ user.streets || 'Not provided' }}</p>
                </div>

                <div class="info-group">
                  <small class="text-muted d-block mb-1">Region / Province</small>
                  <p class="fw-bold text-dark mb-0">{{ user.town_name }}, {{ user.state_name }}</p>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="fw-bold text-muted text-uppercase small mb-0 letter-spacing-1">
                    <i class="bi bi-geo-alt-fill me-2 text-danger"></i>Primary Location
                  </h6>
                  <RouterLink to="/profile/location/edit" class="btn btn-sm btn-light p-1 px-2 rounded-3 text-primary shadow-none">
                    <i class="bi bi-pencil small"></i>
                  </RouterLink>
                </div>
                <div id="map" class="rounded-3 border overflow-hidden shadow-inner" ref="mapEl" style="height: 180px; z-index: 1;"></div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0 rounded-4 p-4 bg-white">
            <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <h6 class="fw-bold text-muted text-uppercase small mb-0 letter-spacing-1">
                <i class="bi bi-stars me-2 text-warning"></i>My Preferences
              </h6>
              <RouterLink to="/profile/preferences/edit" class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold shadow-none">
                Adjust
              </RouterLink>
            </div>

            <div class="row g-4">
              <div class="col-sm-6 border-end-md">
                <p class="small fw-bold text-dark mb-3">Favorite Amenities</p>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="amenity in amenities" :key="amenity" class="custom-badge shadow-sm">
                    {{ amenity }}
                  </span>
                  <p v-if="!amenities.length" class="text-muted small italic">No amenities selected.</p>
                </div>
              </div>

              <div class="col-sm-6 ps-md-4">
                <p class="small fw-bold text-dark mb-3">Preferred Property Types</p>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="type in propertyTypes" :key="type" class="custom-badge shadow-sm">
                    {{ type }}
                  </span>
                  <p v-if="!propertyTypes.length" class="text-muted small italic">No interests specified.</p>
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

// Fix for Leaflet default marker icons not appearing in some builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
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
    BackToPrevPage() {
      if (window.history.length > 1) { this.$router.back(); } 
      else { this.$router.push("/home"); }
    },
    async fetchUserProfile() {
      try {
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

        await nextTick();
        this.initMap();
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },
    initMap() {
      if (this.map || !this.$refs.mapEl) return;

      const lat = Number(this.user.latitude);
      const lng = Number(this.user.longitude);

      const isValid = Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;

      // Default to Manila coordinates if not valid
      const latitude = isValid ? lat : 14.5995;
      const longitude = isValid ? lng : 120.9842;

      this.map = L.map(this.$refs.mapEl, {
        zoomControl: false,
        attributionControl: false,
      }).setView([latitude, longitude], isValid ? 15 : 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map);

      L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup(isValid ? "My Registered Location" : "Default Map View");

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
  width: 130px;
  height: 130px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.profile-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-circle i {
  font-size: 3.5rem;
}

.profile-accent-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90px;
  background: linear-gradient(135deg, #4780d9 0%, #2a5298 100%);
  opacity: 0.1;
}

.custom-badge {
  background: #f8fafc;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  padding: 5px 15px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.shadow-inner {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.italic { font-style: italic; }

@media (min-width: 768px) {
  .border-end-md {
    border-right: 1px solid #f1f5f9 !important;
  }
}

@media (max-width: 991px) {
  .profile-circle {
    width: 110px;
    height: 110px;
  }
}
</style>