<template>
  <div class="route-map-page">
    <div class="container-fluid px-3 px-md-4 py-3 py-md-4">
      <section class="route-shell" :class="{ 'is-loading': loading || !!loadError }">
        <aside class="route-sidebar" v-if="!loading && !loadError">
          <router-link :to="backTarget" class="back-link">
            <i class="bi bi-arrow-left me-2"></i>Back to Property
          </router-link>

          <div class="route-title-block">
            <div class="title-row">
              <div class="title-copy">
                <p class="eyebrow mb-2">Route Overview</p>
                <h2 class="route-heading mb-1">Full View Map</h2>
                <p class="route-subheading mb-0">
                  {{ property?.title || routeTitle || "Property Route" }}
                </p>
              </div>
              <span class="route-status-pill" :class="`status-${mapRouteStatus}`">
                {{ statusLabel }}
              </span>
            </div>
          </div>

          <div class="route-copy">
            <p class="summary-title mb-1">Route to this property</p>
            <p class="summary-message mb-0">{{ mapRouteMessage }}</p>
          </div>

          <div class="summary-meta">
            <span class="route-chip">
              <i class="bi bi-geo-alt me-1"></i>{{ routeSourceLabel }}
            </span>
            <span v-if="mapRouteStatus === 'ready'" class="route-chip">
              <i class="bi bi-signpost-split me-1"></i>{{ formatDistance(routeSummary.distanceMeters) }}
            </span>
            <span v-if="mapRouteStatus === 'ready'" class="route-chip">
              <i class="bi bi-clock-history me-1"></i>{{ formatDuration(routeSummary.durationSeconds) }}
            </span>
          </div>

          <div class="route-actions">
            <button
              type="button"
              class="btn btn-primary rounded-pill action-btn"
              :disabled="mapRouteStatus === 'resolving-location' || mapRouteStatus === 'routing'"
              @click="useCurrentLocationRoute"
            >
              Use My Current Location
            </button>
            <button
              v-if="canResetToSavedLocation"
              type="button"
              class="btn btn-outline-secondary rounded-pill action-btn"
              @click="useSavedProfileLocation"
            >
              Use Saved Location
            </button>
          </div>
        </aside>

        <div v-if="loading" class="state-card text-center">
          <div class="spinner-border text-primary mb-3" role="status"></div>
          <p class="text-muted mb-0">Loading map details...</p>
        </div>

        <div v-else-if="loadError" class="state-card">
          <div class="alert alert-danger mb-0">{{ loadError }}</div>
        </div>

        <div v-else class="map-stage">
          <div class="mobile-route-panel">
            <router-link :to="backTarget" class="back-link">
              <i class="bi bi-arrow-left me-2"></i>Back to Property
            </router-link>
            <div class="title-row">
              <div class="title-copy">
                <p class="eyebrow mb-2">Route Overview</p>
                <h2 class="route-heading mb-1">Full View Map</h2>
                <p class="route-subheading mb-0">
                  {{ property?.title || routeTitle || "Property Route" }}
                </p>
              </div>
              <span class="route-status-pill" :class="`status-${mapRouteStatus}`">
                {{ statusLabel }}
              </span>
            </div>
            <div class="route-copy mt-3">
              <p class="summary-title mb-1">Route to this property</p>
              <p class="summary-message mb-0">{{ mapRouteMessage }}</p>
            </div>
            <div class="summary-meta mt-3">
              <span class="route-chip">
                <i class="bi bi-geo-alt me-1"></i>{{ routeSourceLabel }}
              </span>
              <span v-if="mapRouteStatus === 'ready'" class="route-chip">
                <i class="bi bi-signpost-split me-1"></i>{{ formatDistance(routeSummary.distanceMeters) }}
              </span>
              <span v-if="mapRouteStatus === 'ready'" class="route-chip">
                <i class="bi bi-clock-history me-1"></i>{{ formatDuration(routeSummary.durationSeconds) }}
              </span>
            </div>
            <div class="route-actions mt-3">
              <button
                type="button"
                class="btn btn-primary rounded-pill action-btn"
                :disabled="mapRouteStatus === 'resolving-location' || mapRouteStatus === 'routing'"
                @click="useCurrentLocationRoute"
              >
                Use My Current Location
              </button>
              <button
                v-if="canResetToSavedLocation"
                type="button"
                class="btn btn-outline-secondary rounded-pill action-btn"
                @click="useSavedProfileLocation"
              >
                Use Saved Location
              </button>
            </div>
          </div>

          <div class="map-card">
          <PropertyMap
            v-if="hasPropertyCoords"
            :lat="propertyCoords.lat"
            :lng="propertyCoords.lng"
            :title="property?.title || routeTitle || 'Property Location'"
            :user-lat="userCoords.lat"
            :user-lng="userCoords.lng"
            :auto-route="true"
            height="70vh"
            @route-ready="onRouteReady"
            @route-error="onRouteError"
          />
          <div v-else class="state-card h-100 d-flex align-items-center justify-content-center text-center">
            <div>
              <i class="bi bi-geo-alt display-6 text-muted"></i>
              <p class="text-muted mt-3 mb-0">Property coordinates are unavailable for this listing.</p>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import PropertyMap from "@/components/propertyMap.vue";
import { getPropertyById } from "@/api/property";
import { getUserProfile } from "@/api/user";
import { useUserInfo } from "@/store/userInfo";

export default {
  name: "PropertyRouteMap",
  components: { PropertyMap },
  data() {
    return {
      loading: false,
      loadError: "",
      property: null,
      userCoords: { lat: null, lng: null },
      savedProfileCoords: { lat: null, lng: null },
      mapRouteStatus: "idle",
      mapRouteMessage: "We will try to map your route to this property.",
      routeSummary: {
        distanceMeters: null,
        durationSeconds: null,
      },
      routeSource: "none",
      routeGuardTimer: null,
    };
  },
  computed: {
    propertyId() {
      return this.$route.params.id;
    },
    routeTitle() {
      return String(this.$route.query.title || "").trim();
    },
    propertyCoords() {
      const fallbackLat = this.normalizeCoordinate(this.$route.query.lat);
      const fallbackLng = this.normalizeCoordinate(this.$route.query.lng);
      const lat = this.normalizeCoordinate(this.property?.latitude ?? fallbackLat);
      const lng = this.normalizeCoordinate(this.property?.longitude ?? fallbackLng);
      return { lat, lng };
    },
    hasPropertyCoords() {
      return this.isValidLatLng(this.propertyCoords.lat, this.propertyCoords.lng);
    },
    routeSourceLabel() {
      if (this.routeSource === "saved") return "Saved Location";
      if (this.routeSource === "live") return "Current Location";
      return "Property Only";
    },
    canResetToSavedLocation() {
      return this.routeSource === "live" && this.isValidLatLng(this.savedProfileCoords.lat, this.savedProfileCoords.lng);
    },
    statusLabel() {
      if (this.mapRouteStatus === "ready") return "Ready";
      if (this.mapRouteStatus === "routing") return "Routing";
      if (this.mapRouteStatus === "resolving-location") return "Locating";
      if (this.mapRouteStatus === "route-error") return "Route Error";
      return "Property Only";
    },
    backTarget() {
      return `/property/${this.propertyId}`;
    },
  },
  methods: {
    normalizeCoordinate(value) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    },
    isValidLatLng(lat, lng) {
      const parsedLat = Number(lat);
      const parsedLng = Number(lng);
      if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) return false;
      if (parsedLat < -90 || parsedLat > 90) return false;
      if (parsedLng < -180 || parsedLng > 180) return false;
      if (Math.abs(parsedLat) < 0.000001 && Math.abs(parsedLng) < 0.000001) return false;
      return true;
    },
    async requestBrowserLocation() {
      if (!("geolocation" in navigator)) return null;

      return await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: Number(position.coords.latitude),
              lng: Number(position.coords.longitude),
            });
          },
          () => resolve(null),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      });
    },
    async loadSavedProfileCoords() {
      const info = useUserInfo();
      if (!info.isLoggedIn) {
        this.savedProfileCoords = { lat: null, lng: null };
        return null;
      }

      try {
        const response = await getUserProfile();
        const profilePayload = response?.data?.user;
        const profile = Array.isArray(profilePayload) ? profilePayload[0] || {} : (profilePayload || response?.data || {});
        const lat = this.normalizeCoordinate(profile.latitude);
        const lng = this.normalizeCoordinate(profile.longitude);

        if (this.isValidLatLng(lat, lng)) {
          this.savedProfileCoords = { lat, lng };
          return { lat, lng };
        }
      } catch (error) {
        console.error("Unable to fetch profile location:", error);
      }

      this.savedProfileCoords = { lat: null, lng: null };
      return null;
    },
    applyRouteSource(coords, source, message) {
      if (this.routeGuardTimer) {
        clearTimeout(this.routeGuardTimer);
        this.routeGuardTimer = null;
      }

      this.userCoords = { lat: coords.lat, lng: coords.lng };
      this.routeSource = source;
      this.mapRouteStatus = "routing";
      this.mapRouteMessage = message;
      this.routeSummary = { distanceMeters: null, durationSeconds: null };

      this.routeGuardTimer = setTimeout(() => {
        if (this.mapRouteStatus === "routing") {
          this.onRouteError();
        }
      }, 15000);
    },
    async useCurrentLocationRoute() {
      if (!this.hasPropertyCoords) return;

      this.mapRouteStatus = "resolving-location";
      this.mapRouteMessage = "Fetching your current location...";
      const browserCoords = await this.requestBrowserLocation();

      if (this.isValidLatLng(browserCoords?.lat, browserCoords?.lng)) {
        this.applyRouteSource(
          { lat: browserCoords.lat, lng: browserCoords.lng },
          "live",
          "Calculating route from your current location..."
        );
        return;
      }

      if (this.isValidLatLng(this.savedProfileCoords.lat, this.savedProfileCoords.lng)) {
        this.applyRouteSource(
          { ...this.savedProfileCoords },
          "saved",
          "Current location unavailable. Reverted to your saved profile location."
        );
        return;
      }

      this.routeSource = "none";
      this.userCoords = { lat: null, lng: null };
      this.mapRouteStatus = "no-location";
      this.mapRouteMessage = "Current location is unavailable. Showing property location only.";
      this.routeSummary = { distanceMeters: null, durationSeconds: null };
    },
    useSavedProfileLocation() {
      if (!this.isValidLatLng(this.savedProfileCoords.lat, this.savedProfileCoords.lng)) return;
      this.applyRouteSource(
        { ...this.savedProfileCoords },
        "saved",
        "Calculating route from your saved profile location..."
      );
    },
    async resolveUserLocationForRoute() {
      if (!this.hasPropertyCoords) {
        this.routeSource = "none";
        this.mapRouteStatus = "no-location";
        this.mapRouteMessage = "Property coordinates are unavailable for route preview.";
        return;
      }

      this.userCoords = { lat: null, lng: null };
      this.routeSummary = { distanceMeters: null, durationSeconds: null };
      this.routeSource = "none";
      this.mapRouteStatus = "resolving-location";
      this.mapRouteMessage = "Resolving your location for route preview...";

      const savedCoords = await this.loadSavedProfileCoords();
      if (this.isValidLatLng(savedCoords?.lat, savedCoords?.lng)) {
        this.applyRouteSource(savedCoords, "saved", "Calculating route from your saved profile location...");
        return;
      }

      const browserCoords = await this.requestBrowserLocation();
      if (this.isValidLatLng(browserCoords?.lat, browserCoords?.lng)) {
        this.applyRouteSource(
          { lat: browserCoords.lat, lng: browserCoords.lng },
          "live",
          "Saved location is not set. Calculating route from your current location..."
        );
        return;
      }

      this.routeSource = "none";
      this.mapRouteStatus = "no-location";
      this.mapRouteMessage = "Location access denied or unavailable. Showing property location only.";
    },
    onRouteReady(payload) {
      if (this.routeGuardTimer) {
        clearTimeout(this.routeGuardTimer);
        this.routeGuardTimer = null;
      }
      this.routeSummary = {
        distanceMeters: Number(payload?.distanceMeters || 0),
        durationSeconds: Number(payload?.durationSeconds || 0),
      };
      this.mapRouteStatus = "ready";
      this.mapRouteMessage = this.routeSource === "live"
        ? "Route preview is ready from your current location."
        : "Route preview is ready from your saved profile location.";
    },
    onRouteError() {
      if (this.routeGuardTimer) {
        clearTimeout(this.routeGuardTimer);
        this.routeGuardTimer = null;
      }
      this.routeSummary = { distanceMeters: null, durationSeconds: null };
      this.mapRouteStatus = "route-error";
      this.mapRouteMessage = "Unable to calculate route right now. Showing map markers only.";
    },
    formatDistance(meters) {
      const safeMeters = Number(meters || 0);
      if (!Number.isFinite(safeMeters) || safeMeters <= 0) return "-";
      if (safeMeters >= 1000) return `${(safeMeters / 1000).toFixed(1)} km`;
      return `${Math.round(safeMeters)} m`;
    },
    formatDuration(seconds) {
      const safeSeconds = Number(seconds || 0);
      if (!Number.isFinite(safeSeconds) || safeSeconds <= 0) return "-";

      const totalMinutes = Math.round(safeSeconds / 60);
      if (totalMinutes < 60) return `${totalMinutes} min`;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;
    },
    async loadProperty() {
      const queryTitle = this.routeTitle;
      const queryLat = this.normalizeCoordinate(this.$route.query.lat);
      const queryLng = this.normalizeCoordinate(this.$route.query.lng);

      if (queryTitle || this.isValidLatLng(queryLat, queryLng)) {
        this.property = {
          id: this.propertyId,
          title: queryTitle || "Property Route",
          latitude: queryLat,
          longitude: queryLng,
        };
      }

      this.loading = true;
      this.loadError = "";

      try {
        const response = await getPropertyById(this.propertyId);
        const propertyPayload = response?.data?.property || response?.data;
        if (!propertyPayload) {
          throw new Error("Property details were not found.");
        }
        this.property = propertyPayload;
      } catch (error) {
        if (!this.property) {
          this.loadError = error?.response?.data?.message || "Failed to load property route details.";
        }
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    await this.loadProperty();
    if (!this.loadError) {
      await this.resolveUserLocationForRoute();
    }
  },
  beforeUnmount() {
    if (this.routeGuardTimer) {
      clearTimeout(this.routeGuardTimer);
      this.routeGuardTimer = null;
    }
  },
};
</script>

<style scoped>
.route-map-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(47, 110, 229, 0.12), transparent 30%),
    linear-gradient(180deg, #f7faff 0%, #eef4fb 100%);
}

.route-shell {
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 1rem;
  align-items: stretch;
}

.route-shell.is-loading {
  grid-template-columns: 1fr;
}

.route-sidebar,
.mobile-route-panel,
.map-card {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(209, 220, 235, 0.9);
  border-radius: 1.5rem;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(10px);
}

.route-title-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  min-width: 0;
}

.title-copy {
  min-width: 0;
}

.route-sidebar {
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 74vh;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
}

.back-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  color: #2f6ee5;
  font-size: 0.95rem;
}

.route-heading {
  font-weight: 800;
  color: #0f172a;
  font-size: clamp(1.7rem, 2vw, 2.35rem);
  line-height: 1.05;
}

.route-subheading {
  color: #64748b;
  margin-top: 0.15rem;
  word-break: break-word;
}

.summary-title {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.98rem;
}

.summary-message {
  color: #475569;
  line-height: 1.45;
}

.route-copy {
  min-width: 0;
}

.summary-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.route-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: auto;
}

.action-btn {
  width: 100%;
  min-width: 0;
  font-weight: 600;
  padding: 0.58rem 0.95rem;
  font-size: 0.92rem;
}

.route-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: #eff4ff;
  color: #1d4ed8;
  padding: 0.45rem 0.8rem;
  font-size: 0.86rem;
  font-weight: 600;
}

.route-status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.42rem 0.78rem;
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-ready {
  background: #dcfce7;
  color: #166534;
}

.status-routing,
.status-resolving-location {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-route-error {
  background: #fee2e2;
  color: #b91c1c;
}

.status-no-location,
.status-idle {
  background: #e2e8f0;
  color: #334155;
}

.map-card {
  overflow: hidden;
  height: 100%;
  min-height: 74vh;
}

.map-stage {
  min-width: 0;
}

.mobile-route-panel {
  display: none;
  padding: 1rem;
  margin-bottom: 0.85rem;
}

.state-card {
  min-height: 360px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(209, 220, 235, 0.9);
  border-radius: 1.5rem;
}

@media (max-width: 991px) {
  .route-shell {
    grid-template-columns: 1fr;
  }

  .route-sidebar {
    display: none;
  }

  .mobile-route-panel {
    display: block;
  }

  .map-card {
    min-height: 68vh;
  }
}

@media (max-width: 767px) {
  .mobile-route-panel {
    padding: 0.9rem;
  }

  .title-row {
    flex-direction: column;
    align-items: stretch;
  }

  .route-actions {
    margin-top: 0.75rem;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
