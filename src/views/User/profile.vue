<template>
  <Header />

  <div class="profile-page container py-4">
    <div class="mb-2">
      <button class="btn btn-link text-decoration-none p-0 text-muted fw-semibold" @click="this.$router.push('/home')">
        <i class="bi bi-arrow-left me-1"></i> Back to Home
      </button>
    </div>

    <section class="profile-hero card border-0 shadow-sm rounded-4 p-4 p-lg-5 mb-4 overflow-hidden">
      <div class="hero-glow"></div>
      <div class="row g-4 align-items-center position-relative">
        <div class="col-lg-7">
          <div class="d-flex align-items-center gap-3">
            <div class="profile-circle shadow-sm border border-4 border-white bg-white flex-shrink-0">
              <img
                v-if="user.user_img_url"
                :src="user.user_img_url"
                alt="Profile"
                class="img-fluid rounded-circle"
                @error="$event.target.src = placeholderImg"
              />
              <i v-else class="bi bi-person-fill text-secondary"></i>
            </div>
            <div>
              <p class="text-white-50 small text-uppercase mb-1 letter-spacing-1">Profile Center</p>
              <h2 class="fw-bold text-white mb-1">{{ name }}</h2>
              <p class="text-white-50 mb-2 small">{{ email || "No email available" }}</p>
              <div class="d-flex flex-wrap gap-2">
                <span class="badge rounded-pill py-2 px-3 border status-badge"
                  :class="isComplete ? 'bg-success-subtle text-success border-success-subtle' : 'bg-warning-subtle text-warning-emphasis border-warning-subtle'">
                  <i class="bi me-1" :class="isComplete ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'"></i>
                  {{ isComplete ? 'Profile Complete' : 'Profile Incomplete' }}
                </span>
                <span class="badge rounded-pill py-2 px-3 border role-badge">
                  <i class="bi bi-person-badge me-1"></i>{{ userRole }}
                </span>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="d-flex justify-content-between align-items-center text-white-50 small mb-2">
              <span>Profile Completion</span>
              <span class="fw-semibold text-white">{{ completionPercent }}%</span>
            </div>
            <div class="progress completion-progress">
              <div class="progress-bar" role="progressbar" :style="{ width: `${completionPercent}%` }"></div>
            </div>
            <div class="d-flex flex-wrap gap-2 mt-3">
              <span
                v-for="item in completionChecklist"
                :key="item.label"
                class="check-chip"
                :class="item.done ? 'chip-done' : 'chip-pending'"
              >
                <i :class="item.done ? 'bi bi-check-circle-fill' : 'bi bi-dash-circle'"></i>
                {{ item.label }}
              </span>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="action-shell p-3 p-md-4 rounded-4">
            <p class="small text-white-50 mb-3">Quick Actions</p>
            <div class="d-grid gap-2">
              <RouterLink to="/profile/edit" class="btn btn-light rounded-pill fw-semibold">
                <i class="bi bi-pencil-square me-2"></i>Edit Profile
              </RouterLink>
              <RouterLink to="/profile/location/edit" class="btn btn-outline-light rounded-pill fw-semibold">
                <i class="bi bi-geo-alt me-2"></i>Update Location
              </RouterLink>
              <RouterLink to="/profile/preferences/edit" class="btn btn-outline-light rounded-pill fw-semibold">
                <i class="bi bi-sliders me-2"></i>Update Preferences
              </RouterLink>
              <RouterLink v-if="!isComplete" to="/completion" class="btn btn-warning rounded-pill fw-semibold text-dark">
                <i class="bi bi-check2-square me-2"></i>Complete Profile
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="row g-4">
      <div class="col-lg-4">
        <div class="profile-card card border-0 shadow-sm rounded-4 p-4 h-100">
          <div class="card-head">
            <h6 class="fw-bold text-uppercase small mb-0"><i class="bi bi-person-lines-fill me-2 text-primary"></i>Contact Details</h6>
          </div>
          <div class="mt-3 d-grid gap-3">
            <div class="info-row">
              <small>Phone Number</small>
              <p>{{ user.phone_number || "Not provided" }}</p>
            </div>
            <div class="info-row">
              <small>Street</small>
              <p>{{ user.streets || "Not provided" }}</p>
            </div>
            <div class="info-row">
              <small>City / Province</small>
              <p>{{ `${user.town_name || "-"}, ${user.state_name || "-"}` }}</p>
            </div>
            <div class="info-row">
              <small>Region</small>
              <p>{{ user.region_name || "Not provided" }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="profile-card card border-0 shadow-sm rounded-4 p-4 h-100">
          <div class="card-head d-flex justify-content-between align-items-center">
            <h6 class="fw-bold text-uppercase small mb-0"><i class="bi bi-person-check me-2 text-success"></i>Account Snapshot</h6>
            <span class="small text-muted">Profile</span>
          </div>
          <div class="mt-3 d-grid gap-3">
            <div class="snapshot-tile">
              <small>Profile Progress</small>
              <p class="mb-0">{{ completionPercent }}% completed</p>
            </div>
            <div class="snapshot-tile">
              <small>Contact Status</small>
              <p class="mb-0">{{ user.phone_number ? "Phone number added" : "Phone number missing" }}</p>
            </div>
            <div class="snapshot-tile">
              <small>Location Pin</small>
              <p class="mb-0">{{ hasValidLocation ? "Saved location available" : "No saved location yet" }}</p>
            </div>
            <p class="small text-muted mb-0">
              Profile actions are managed here. Security and app preferences are in the <strong>Settings</strong> menu from the header dropdown.
            </p>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="profile-card card border-0 shadow-sm rounded-4 p-4 h-100">
          <div class="card-head d-flex justify-content-between align-items-center">
            <h6 class="fw-bold text-uppercase small mb-0"><i class="bi bi-geo-alt-fill me-2 text-danger"></i>Primary Location</h6>
            <RouterLink to="/profile/location/edit" class="btn btn-sm btn-light border rounded-pill px-3">
              Update
            </RouterLink>
          </div>
          <div class="d-flex align-items-center flex-wrap gap-2 mt-3 mb-2">
            <span class="location-chip">{{ hasValidLocation ? "Saved Pin" : "No Saved Pin" }}</span>
            <small class="text-muted">Used for map routing and nearby recommendations</small>
          </div>
          <div id="map" class="rounded-3 border overflow-hidden shadow-inner" ref="mapEl" style="height: 190px; z-index: 1;"></div>
        </div>
      </div>
    </div>

    <div class="row g-4 mt-1">
      <div class="col-12">
        <div class="profile-card card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <h6 class="fw-bold text-uppercase small mb-0"><i class="bi bi-stars me-2 text-warning"></i>My Preferences</h6>
            <RouterLink to="/profile/preferences/edit" class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold">
              Adjust Preferences
            </RouterLink>
          </div>

          <div class="row g-4">
            <div class="col-md-6 border-end-md">
              <p class="small fw-bold text-dark mb-3">Favorite Amenities</p>
              <div v-if="amenities.length" class="d-flex flex-wrap gap-2">
                <span v-for="amenity in amenities" :key="amenity" class="custom-badge">{{ amenity }}</span>
              </div>
              <div v-else class="empty-state">
                <i class="bi bi-stars"></i>
                <p class="mb-0">No amenities selected yet.</p>
              </div>
            </div>

            <div class="col-md-6 ps-md-4">
              <p class="small fw-bold text-dark mb-3">Preferred Property Types</p>
              <div v-if="propertyTypes.length" class="d-flex flex-wrap gap-2">
                <span v-for="type in propertyTypes" :key="type" class="custom-badge">{{ type }}</span>
              </div>
              <div v-else class="empty-state">
                <i class="bi bi-house-heart"></i>
                <p class="mb-0">No property interests specified yet.</p>
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
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";

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
        region_name: null,
        user_img_url: null,
      },
      placeholderImg,
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
    userRole() {
      const role = useUserInfo().role || "User";
      return role.charAt(0).toUpperCase() + role.slice(1);
    },
    hasValidLocation() {
      const lat = Number(this.user.latitude);
      const lng = Number(this.user.longitude);
      return Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;
    },
    completionChecklist() {
      return [
        { label: "Profile Photo", done: !!this.user.user_img_url },
        { label: "Phone Number", done: !!this.user.phone_number },
        { label: "Location", done: this.hasValidLocation },
        { label: "Preferences", done: this.amenities.length > 0 || this.propertyTypes.length > 0 },
      ];
    },
    completionPercent() {
      const doneCount = this.completionChecklist.filter((item) => item.done).length;
      return Math.round((doneCount / this.completionChecklist.length) * 100);
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
          region_name: data.region_name,
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
.profile-page {
  background: radial-gradient(circle at top right, rgba(71, 128, 217, 0.08) 0%, rgba(255, 255, 255, 0) 55%);
}

.profile-hero {
  background: linear-gradient(125deg, #2f65bd 0%, #4a86e6 55%, #5b97ef 100%);
  position: relative;
}

.hero-glow {
  position: absolute;
  inset: auto -80px -120px auto;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  filter: blur(8px);
}

.profile-circle {
  width: 108px;
  height: 108px;
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

.action-shell {
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(20, 52, 102, 0.34);
  backdrop-filter: blur(3px);
}

.status-badge {
  backdrop-filter: blur(4px);
}

.role-badge {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.35) !important;
}

.completion-progress {
  height: 0.55rem;
  background-color: rgba(255, 255, 255, 0.24);
}

.completion-progress .progress-bar {
  background: linear-gradient(90deg, #ffd15b 0%, #ffeb99 100%);
}

.check-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.chip-done {
  background: rgba(214, 255, 235, 0.94);
  color: #0c6a4b;
}

.chip-pending {
  background: rgba(255, 240, 204, 0.95);
  color: #8d5f00;
}

.profile-card {
  border: 1px solid #edf2fb !important;
}

.card-head h6 {
  letter-spacing: 0.05em;
  color: #4d5a73;
}

.info-row small {
  display: block;
  color: #6b7280;
  margin-bottom: 0.25rem;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.info-row p {
  margin-bottom: 0;
  font-weight: 600;
  color: #1f2a44;
}

.snapshot-tile {
  border: 1px solid #e8edf7;
  border-radius: 14px;
  padding: 0.75rem 0.9rem;
  background: #f9fbff;
}

.snapshot-tile small {
  display: block;
  color: #64748b;
  font-size: 0.76rem;
  margin-bottom: 0.2rem;
}

.location-chip {
  border-radius: 999px;
  background: #eef5ff;
  color: #2d5daa;
  border: 1px solid #d9e7ff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.28rem 0.66rem;
}

.custom-badge {
  background: #f7faff;
  color: #243451;
  border: 1px solid #dfe8f7;
  padding: 5px 15px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.empty-state {
  min-height: 92px;
  border: 1px dashed #d9e5fa;
  border-radius: 14px;
  display: grid;
  place-items: center;
  text-align: center;
  color: #6b7a92;
  background: #f8fbff;
  padding: 1rem;
}

.empty-state i {
  font-size: 1.15rem;
  margin-bottom: 0.35rem;
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
    width: 84px;
    height: 84px;
  }

  .profile-hero .btn {
    width: 100%;
  }
}
</style>
