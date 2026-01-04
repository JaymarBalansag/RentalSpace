<template>
  <div class="map-wrapper container">
    <div ref="mapEl" class="property-map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { nextTick } from "vue"

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

  },
  mounted() {
    nextTick(() => {
      // console.log("PropertyMap mounted", this.lat, this.lng);
      this.initMap();
    });
  },
  methods: {
    handleLocationChange() {
      if (!this.lat || !this.lng) alert("Invalid coordinates");

      this.$nextTick(() => {
        this.initMap();
      });
    },
    initMap() {
      if (!this.lat || !this.lng) return;
      // console.log("Initializing map at:", this.lat, this.lng);
      const latitude = this.lat;
      const longitude = this.lng;
      // Map already exists → just update
      if (this.map) {
        // console.log("Updating map location");
        this.map.setView([latitude, longitude], 15);
        this.marker.setLatLng([latitude, longitude]);
        this.map.invalidateSize();
        return;
      }
      // console.log("Creating map");
      // Create map
      this.map = L.map(this.$refs.mapEl).setView(
        [latitude, longitude],
        15
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.map);

      this.marker = L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup(this.title)
        .openPopup();

      // 🔑 Fix grey map
      setTimeout(() => {
        this.map.invalidateSize();
      }, 300);
    },
  },
  watch: {
    lat() {
      this.handleLocationChange();
    },
    lng() {
      this.handleLocationChange();
    },
  }
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
    height: 300px;
  }

  .map {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
</style>
