<template>
  <div class="container p-3">
    <RouterLink class="btn fs-4 fw-bold" to="/"><i class="bi bi-arrow-90deg-left me-1"></i>Back</RouterLink>
  </div>
  <div class="container">
    <div class="card">
      <div class="card-header d-flex flex-column align-items-center">
        <h3 class="card-title fs-1 my-3">User Profile</h3>
        <div class="circle">
          <i class="bi bi-person-fill fs-1"></i>
        </div>
        <h4 class="mt-2 fs-3">Jaymar Balansag</h4>
        <p class="text-muted">jaymar@gmail.com</p>
      </div>
      <div v-if="isComplete == false" class="card-body d-flex flex-column align-items-center">
        <h2>Complete Your Profile To Use Other Features</h2>
        <button class="btn bg-secondary-subtle fs-5">
          <i class="bi bi-pencil-square me-1"></i>Complete Profile
        </button>
      </div>
      <div v-else-if="isComplete == true" class="card-body d-flex flex-column align-items-space justify-content-start mb-5">
        <div class="row">
          <div class="col-6 overflow-hidden">
            <div id="map" class="" style="height: 50vh; width:40vw;"></div>
          </div>
          <div class="col-6">
            <div class="list-group">
              <button class="list-group-item list-group-item-action">
                <i class="bi bi-telephone"></i>
                09771405584
              </button>
              <button  class="list-group-item list-group-item-action">
                <i class="bi bi-signpost"></i>
                Sitio.Canario
              </button>
              <button  class="list-group-item list-group-item-action">
                <i class="bi bi-building"></i>
                Abuyog
              </button>
              <button  class="list-group-item list-group-item-action">
                <i class="bi bi-geo"></i>
                Leyte
              </button>
            </div>
            <!-- Location Information Below -->
            


          </div>
        </div>
        <hr></hr>
        <div class="row mb-5">
          <div class="container mb-5">
            <h1 class="">Preferences</h1>
          </div>
          <div class="col-6">
            <div class="container">
              <p class="">Amenities</p>
              <hr>
              <div class="row">
                <div class="col-1">
                  <i class="bi bi-wifi fs-3"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="container">
              <p class="">Property Type</p>
              <hr>
              <div class="row">
                <div class="col-12 "> 
                  <i class="bi bi-house fs-3"></i>
                  Boarding House
                </div>
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
import { getUserProfile } from "@/api/user";
import L from "leaflet";

export default {
    name: "profile",
    components: {

    },
    data() {
        return {

          isComplete : null,
          location: null,
        }
    },
    mounted() {
      this.fetchUserProfile();

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
      async fetchUserProfile() {
        try {
          const response = await getUserProfile();

          this.isComplete = response.isComplete;
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      },
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
    }
}
</script>

<style scoped>
.circle {
  width: 15vw;
  height: 30vh;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
