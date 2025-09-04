<template>
    <Header></Header>

    <div class="container-fluid p-5 bg-secondary-subtle">
        <div class="row">

            <!-- Side Filters -->
            <div class="col-3 border-end border-primary">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <h2>Property Type</h2>
                        <ul class="nav flex-column p-3 ">
                            <li class="nav-item">
                                <div class="form-check fs-5">
                                    <input class="form-check-input" type="checkbox" value="" id="checkDefault">
                                    <label class="form-check-label fw-light" for="checkDefault">
                                        Boarding House
                                    </label>
                                </div>
                            </li>
                            <li class="nav-item">
                                <div class="form-check fs-5">
                                    <input class="form-check-input" type="checkbox" value="" id="checkDefault">
                                    <label class="form-check-label fw-light" for="checkDefault">
                                        Apartment
                                    </label>
                                </div>
                            </li>
                            <li class="nav-item">
                                <div class="form-check fs-5 ">
                                    <input class="form-check-input" type="checkbox" value="" id="checkDefault">
                                    <label class="form-check-label fw-light" for="checkDefault">
                                        Dormitory
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <h2>Agreement Type</h2>
                        <ul class="nav flex-column p-3">
                            <li class="nav-item">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1">
                                    <label class="form-check-label fs-5 fw-light" for="radioDefault1">
                                        Rental
                                    </label>
                                    </div>
                                    <div class="form-check">
                                    <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault2">
                                    <label class="form-check-label fs-5 fw-light" for="radioDefault2">
                                        Lease
                                    </label>
                                </div>
                            </li>

                        </ul>
                    </li>
                </ul>
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <h2>Price</h2>
                        <ul class="nav flex-column p-3">
                            <li class="nav-item">
                                <label for="range3" class="form-label">Price:</label><br>
                                <label for="range3" class="form-label">Min: 0</label><br>
                                <label for="range3" class="form-label">Price: 500</label>
                                <input type="range" class="form-range" min="0" max="5" step="0.5" id="range3">
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <!-- Map -->
            <div class="col-9">
                <div class="rounded" id="map" style="height:80vh"></div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import L from "leaflet";
 export default {
    name: 'Map',
    components: {
        Header
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
 }

</script>