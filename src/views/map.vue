<template>
  <div class="container mt-5 mb-5 map-container">
    <div id="map" style="height: "></div>
  </div>
</template>

<script>
import L from "leaflet";


export default {
  name: "Map",
  data() {
    return {
      location: null,
    };
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleLocationSuccess,
        this.handleLocationError,
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
      this.setMap(this.location.lat, this.location.lng)
    },
    setMap(lat, lng){
        var map = L.map('map').setView([lat, lng],15);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    },
    handleLocationError(error) {
      alert("Failed to get location: " + error.message);
    },
  },
};
</script>

