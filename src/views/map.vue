<template>
  <div class="container-fluid map-container my-1 position-relative" >
    <MapFilter v-if="!offcanvasState.isOpen"></MapFilter>
    <div id="map" class="" style="height: 85vh"></div>
  </div>
</template>

<script>
import L from "leaflet";
import MapFilter from "@/components/MapFilter.vue";
import { offcanvasState } from "@/store/offCanvasState";

export default {
  name: "Map",
  components: {
    MapFilter
  },
  setup(){
    return {offcanvasState}
  },
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
        var map = L.map('map',{
          zoomControl: false
        }).setView([lat, lng],15);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.control.zoom(false)
    },
    handleLocationError(error) {
      alert("Failed to get location: " + error.message);
    },
  },
};
</script>

<style src="../assets/component-style/mapStyle.css"></style>