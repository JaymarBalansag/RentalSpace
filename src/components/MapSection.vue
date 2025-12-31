<template>
  <div class="map-wrapper container">
    <div ref="mapEl" class="map"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'MapSection',
  props: {
    properties: {
      type: Array,
      required: true
    },
    center: {
      type: Object, // { lat, lng }
      default: null
    }
  },
  data() {
    return {
      map: null,
      markers: []
    };
  },
  mounted() {
    this.initMap();
  },
  watch: {
    properties: {
      handler() {
        this.renderMarkers();
      },
      deep: true
    }
  },
  methods: {
    initMap() {
      this.map = L.map(this.$refs.mapEl).setView(
        this.center ? [this.center.lat, this.center.lng] : [10.7, 124.8], // Leyte fallback
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      this.renderMarkers();
    },

    renderMarkers() {
      if (!this.map) return;

      // Clear old markers
      this.markers.forEach(m => this.map.removeLayer(m));
      this.markers = [];

      this.properties.forEach(property => {
        if (!property.latitude || !property.longitude) return;

        const marker = L.marker([property.latitude, property.longitude])
          .addTo(this.map)
          .bindPopup(this.popupContent(property));

        this.markers.push(marker);
      });

      // Auto-fit bounds if there are markers
      if (this.markers.length) {
        const group = L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
      }
    },
    popupContent(property) {
      const imgSrc = property.image_url;
      const placeholder = this.placeholderImg;
      return `
        <div class="card shadow-sm border-0" style="width: 220px;">
          <img src="${imgSrc}"
              onerror="this.onerror=null;this.src='${placeholder}';"
              class="card-img-top rounded-top" 
              alt="Property Image"/>

          <div class="card-body p-2">
            <h6 class="card-title text-truncate mb-1" style="font-size: 14px;">
              ${property.title || 'Untitled Property'}
            </h6>
            <p class="card-text fw-bold text-success mb-2" style="font-size: 13px;">
              $${property.price || 'N/A'}
            </p>
            <div class="d-grid">
              <a href="/property/${property.id}" 
                class="btn btn-sm btn-primary text-light">
                View Details
              </a>
            </div>
          </div>
        </div>
      `;
    }
  }
};
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 450px;
}

.map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>
