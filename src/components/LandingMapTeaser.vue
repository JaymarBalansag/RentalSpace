<template>
  <section class="map-teaser">
    <div class="row g-4 align-items-stretch">
      <div class="col-lg-8">
        <div ref="mapEl" class="teaser-map"></div>
      </div>
      <div class="col-lg-4">
        <div class="legend-card h-100">
          <h3 class="fw-bold h4 mb-2">Map Snapshot</h3>
          <p class="text-muted small mb-4">
            Visual preview only. Explore listings in full search for live availability.
          </p>

          <ul class="list-unstyled mb-4">
            <li v-for="area in areaHighlights" :key="area.name" class="d-flex justify-content-between align-items-center area-item">
              <span class="fw-semibold">{{ area.name }}</span>
              <span class="badge rounded-pill text-bg-light border">{{ area.count }} sample</span>
            </li>
          </ul>

          <div class="note small">
            <i class="bi bi-info-circle me-1"></i>
            Map interactions are disabled on this landing preview.
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

export default {
  name: "LandingMapTeaser",
  props: {
    pins: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      map: null,
      markers: [],
      areaHighlights: [
        { name: "Tacloban City", count: 3 },
        { name: "Ormoc City", count: 2 },
        { name: "Palo, Leyte", count: 1 },
      ],
    };
  },
  mounted() {
    this.initMap();
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.markers = [];
    }
  },
  methods: {
    initMap() {
      this.map = L.map(this.$refs.mapEl, {
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false,
        zoomControl: false,
      }).setView([11.2427, 125.0003], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.map);

      this.renderPins();
    },
    renderPins() {
      if (!this.map) return;

      this.markers.forEach((marker) => this.map.removeLayer(marker));
      this.markers = [];

      this.pins.forEach((pin) => {
        if (!pin.lat || !pin.lng) return;

        const marker = L.marker([pin.lat, pin.lng]).addTo(this.map);
        marker.bindPopup(
          `<div style="font-size: 13px;">
            <strong>${pin.title}</strong><br>
            <span>${pin.price}</span>
          </div>`
        );
        this.markers.push(marker);
      });

      if (this.markers.length) {
        const group = L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds(), { padding: [28, 28] });
      }
    },
  },
  watch: {
    pins: {
      handler() {
        this.renderPins();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.map-teaser {
  background: linear-gradient(150deg, #eff5ff 0%, #f8fbff 100%);
  border: 1px solid #dce8fb;
  border-radius: 24px;
  padding: 1.25rem;
}

.teaser-map {
  height: 360px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid #d8e6fb;
  filter: saturate(1.05);
}

.legend-card {
  background: #fff;
  border: 1px solid #e6eefb;
  border-radius: 16px;
  padding: 1.1rem;
}

.area-item {
  padding: 0.55rem 0;
  border-bottom: 1px dashed #ebf1fc;
}

.area-item:last-child {
  border-bottom: 0;
}

.note {
  background: #f3f7ff;
  border: 1px solid #dce8fb;
  border-radius: 10px;
  padding: 0.55rem 0.7rem;
  color: #31528f;
}

@media (max-width: 991px) {
  .teaser-map {
    height: 290px;
  }
}
</style>
