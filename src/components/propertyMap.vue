<template>
  <div ref="mapEl" class="property-map"></div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon issue (important)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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
    this.initMap();
  },
  methods: {
    initMap() {
      const map = L.map(this.$refs.mapEl).setView(
        [this.lat, this.lng],
        15
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.marker([this.lat, this.lng])
        .addTo(map)
        .bindPopup(this.title)
        .openPopup();
    },
  },
};
</script>

<style scoped>
.property-map {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: 12px;
}
</style>
