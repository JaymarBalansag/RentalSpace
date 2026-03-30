<template>
  <div class="map-wrapper">
    <div ref="mapEl" class="property-map" :style="mapStyle"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { nextTick } from "vue";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

export default {
  name: "PropertyMap",
  props: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      default: "Property Location",
    },
    userLat: {
      type: Number,
      default: null,
    },
    userLng: {
      type: Number,
      default: null,
    },
    autoRoute: {
      type: Boolean,
      default: true,
    },
    height: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      map: null,
      marker: null,
      userMarker: null,
      routeLine: null,
      routeRequestId: 0,
    };
  },
  mounted() {
    nextTick(() => {
      this.initMap();
    });
  },
  beforeUnmount() {
    this.routeRequestId += 1;
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
      this.userMarker = null;
      this.routeLine = null;
    }
  },
  computed: {
    mapStyle() {
      return this.height ? { height: this.height } : {};
    },
  },
  methods: {
    isValidCoords(lat, lng) {
      const parsedLat = Number(lat);
      const parsedLng = Number(lng);
      if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) return false;
      if (parsedLat < -90 || parsedLat > 90) return false;
      if (parsedLng < -180 || parsedLng > 180) return false;
      if (Math.abs(parsedLat) < 0.000001 && Math.abs(parsedLng) < 0.000001) return false;
      return true;
    },
    clearRoute() {
      if (this.routeLine && this.map) {
        this.map.removeLayer(this.routeLine);
      }
      this.routeLine = null;
    },
    updatePropertyMarker() {
      if (!this.map || !this.isValidCoords(this.lat, this.lng)) return;
      const point = [Number(this.lat), Number(this.lng)];

      if (!this.marker) {
        this.marker = L.marker(point).addTo(this.map).bindPopup(this.title);
      } else {
        this.marker.setLatLng(point).setPopupContent(this.title);
      }
    },
    updateUserMarker() {
      if (!this.map) return;

      if (!this.isValidCoords(this.userLat, this.userLng)) {
        if (this.userMarker) {
          this.map.removeLayer(this.userMarker);
          this.userMarker = null;
        }
        return;
      }

      const point = [Number(this.userLat), Number(this.userLng)];
      const markerStyle = {
        radius: 8,
        color: "#f59e0b",
        fillColor: "#fbbf24",
        fillOpacity: 0.9,
        weight: 2,
      };

      if (!this.userMarker) {
        this.userMarker = L.circleMarker(point, markerStyle)
          .addTo(this.map)
          .bindPopup("Your location");
      } else {
        this.userMarker.setLatLng(point);
      }
    },
    fitMapToLayers() {
      if (!this.map) return;

      const layers = [];
      if (this.marker) layers.push(this.marker);
      if (this.userMarker) layers.push(this.userMarker);
      if (this.routeLine) layers.push(this.routeLine);

      if (!layers.length) return;

      const group = L.featureGroup(layers);
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
      }
    },
    async drawRoute() {
      if (!this.map || !this.autoRoute) return;
      if (!this.isValidCoords(this.lat, this.lng)) {
        this.$emit("route-error", { reason: "invalid_property_coordinates" });
        return;
      }

      const hasUser = this.isValidCoords(this.userLat, this.userLng);
      if (!hasUser) {
        this.clearRoute();
        this.fitMapToLayers();
        return;
      }

      const requestId = ++this.routeRequestId;
      const sourceLat = Number(this.userLat);
      const sourceLng = Number(this.userLng);
      const destinationLat = Number(this.lat);
      const destinationLng = Number(this.lng);

      const url = `https://router.project-osrm.org/route/v1/driving/${sourceLng},${sourceLat};${destinationLng},${destinationLat}?overview=full&geometries=geojson`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Route request failed with status ${response.status}`);
        }
        const payload = await response.json();
        if (requestId !== this.routeRequestId) return;

        const route = payload?.routes?.[0];
        const coordinates = route?.geometry?.coordinates;
        if (!route || !Array.isArray(coordinates) || !coordinates.length) {
          throw new Error("No route geometry found");
        }

        const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
        this.clearRoute();
        this.routeLine = L.polyline(latLngs, {
          color: "#2f6ee5",
          weight: 5,
          opacity: 0.82,
          lineJoin: "round",
          lineCap: "round",
        }).addTo(this.map);

        this.fitMapToLayers();
        this.$emit("route-ready", {
          distanceMeters: Number(route.distance || 0),
          durationSeconds: Number(route.duration || 0),
        });
      } catch (error) {
        if (requestId !== this.routeRequestId) return;
        this.clearRoute();
        this.fitMapToLayers();
        this.$emit("route-error", {
          reason: error?.message || "Unable to draw route",
        });
      } finally {
        clearTimeout(timeoutId);
      }
    },
    initMap() {
      if (!this.isValidCoords(this.lat, this.lng)) {
        this.$emit("route-error", { reason: "invalid_property_coordinates" });
        return;
      }

      const propertyPoint = [Number(this.lat), Number(this.lng)];
      if (!this.map) {
        this.map = L.map(this.$refs.mapEl).setView(propertyPoint, 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(this.map);
      }

      this.updatePropertyMarker();
      this.updateUserMarker();
      this.drawRoute();

      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 250);
    },
    refreshMap() {
      if (!this.map && this.isValidCoords(this.lat, this.lng)) {
        this.initMap();
        return;
      }

      this.updatePropertyMarker();
      this.updateUserMarker();
      this.drawRoute();
    },
  },
  watch: {
    lat() {
      this.refreshMap();
    },
    lng() {
      this.refreshMap();
    },
    userLat() {
      this.refreshMap();
    },
    userLng() {
      this.refreshMap();
    },
  },
};
</script>

<style scoped>
.property-map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.map-wrapper {
  width: 100%;
  height: 320px;
}

@media (max-width: 767px) {
  .map-wrapper {
    height: 280px;
  }
}
</style>
