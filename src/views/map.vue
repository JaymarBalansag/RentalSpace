<template>
  <Header />

  <div class="container-fluid map-container my-1 position-relative">

    <!-- Map -->
    <div id="map" style="height: 85vh"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // make sure map styles load
import Header from "@/components/Header.vue";

export default {
  name: "Map",
  components: {
    MapFilter,
    Header,
  },
  setup() {
    return { offcanvasState };
  },
  data() {
    return {
      location: null,
      map: null,
      // Example property data (later replace with API call)
      properties: [
        {
          id: 1,
          title: "Cozy Apartment",
          lat: 10.975,
          lng: 125.032,
          price: "₱5,000 / month",
          img: "https://via.placeholder.com/120x80.png?text=Apartment",
        },
        {
          id: 2,
          title: "Boarding House Room",
          lat: 10.978,
          lng: 125.028,
          price: "₱2,500 / month",
          img: "https://via.placeholder.com/120x80.png?text=Room",
        },
      ],
    };
  },
  mounted() {
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
    handleLocationSuccess(position) {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.initMap(this.location.lat, this.location.lng);
      this.addPropertyMarkers();
    },
    initMap(lat, lng) {
      this.map = L.map("map", {
        zoomControl: false,
      }).setView([lat, lng], 15);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      L.control.zoom({ position: "bottomright" }).addTo(this.map);

      // Add user location marker
      L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup("<b>You are here</b>")
        .openPopup();
    },
    addPropertyMarkers() {
      this.properties.forEach((property) => {
        const popupContent = `
          <div style="width: 200px">
            <img src="${property.img}" alt="image" style="width: 100%; height: 100px; object-fit: cover; border-radius: 6px; margin-bottom: 5px;" />
            <h6 style="margin: 0; font-size: 14px;">${property.title}</h6>
            <p style="margin: 0; color: green; font-weight: bold;">${property.price}</p>
          </div>
        `;

        L.marker([property.lat, property.lng])
          .addTo(this.map)
          .bindPopup(popupContent);
      });
    },
    handleLocationError(error) {
      alert("Failed to get location: " + error.message);
      // fallback map location
      this.initMap(10.975, 125.032);
      this.addPropertyMarkers();
    },
  },
};
</script>

<style src="../assets/component-style/mapStyle.css"></style>
