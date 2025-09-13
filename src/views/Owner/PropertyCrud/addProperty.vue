<template>
  <div class="container my-5">
    <h2 class="mb-4">Add Property</h2>

    <form @submit.prevent="submitProperty">
      <!-- Basic Info -->
      <div class="card mb-3 shadow-sm">
        <div class="card-header fw-bold">Basic Information</div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Title</label>
            <input v-model="form.title" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea v-model="form.description" class="form-control" rows="3"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Thumbnail</label>
            <input type="file" @change="handleThumbnail" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Property Images</label>
            <input type="file" multiple @change="handleImages" class="form-control" />
          </div>
        </div>
      </div>

      <!-- Agreement Type -->
      <div class="card mb-3 shadow-sm">
        <div class="card-header fw-bold">Agreement</div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Agreement Type</label>
            <select v-model="form.agreement_type" class="form-select" required>
              <option value="rental">Rental</option>
              <option value="lease">Lease</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Pricing & Payment -->
      <div class="card mb-3 shadow-sm">
        <div class="card-header fw-bold">Pricing & Payment</div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Price</label>
              <input v-model="form.price" type="number" class="form-control" required />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Utilities Included</label>
              <input v-model="form.utilities_included" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Advance Payment (Months)</label>
              <input v-model="form.advance_payment_months" type="number" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Deposit Required</label>
              <input v-model="form.deposit_required" type="number" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Payment Frequency</label>
              <select v-model="form.payment_frequency" class="form-select">
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Lease Details (Show only if lease) -->
      <div v-if="form.agreement_type === 'lease'" class="card mb-3 shadow-sm">
        <div class="card-header fw-bold">Lease Details</div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Lease Term (Months)</label>
              <input v-model="form.lease_term_months" type="number" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Start Date</label>
              <input v-model="form.start_date" type="date" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">End Date</label>
              <input v-model="form.end_date" type="date" class="form-control" />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Renewal Option</label>
              <select v-model="form.renewal_option" class="form-select">
                <option value="none">None</option>
                <option value="manual">Manual Renewal</option>
                <option value="auto">Auto Renewal</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Notice Period (Days)</label>
              <input v-model="form.notice_period" type="number" class="form-control" />
            </div>
          </div>
        </div>
      </div>

      <!-- Property Features -->
      <div class="card mb-3 shadow-sm">
        <div class="card-header fw-bold">Property Features</div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Type</label>
              <select v-model="form.property_type_id" class="form-select">
                <option value="1">Boarding House</option>
                <option value="2">Apartment</option>
                <option value="3">Condo</option>
              </select>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Furnishing</label>
              <select v-model="form.furnishing" class="form-select">
                <option value="furnished">Furnished</option>
                <option value="semi">Semi-Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Parking</label>
              <select v-model="form.parking" class="form-select">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <!-- Boarding House shows bed space -->
            <div v-if="form.property_type_id == 1" class="col-md-3 mb-3">
              <label class="form-label">Bed Space</label>
              <input v-model="form.bed_space" type="number" class="form-control" />
            </div>

            <!-- Apartment/Condo show bedrooms/bathrooms -->
            <div v-if="form.property_type_id == 2 || form.property_type_id == 3" class="col-md-3 mb-3">
              <label class="form-label">Bedrooms</label>
              <input v-model="form.bedrooms" type="number" class="form-control" />
            </div>
            <div v-if="form.property_type_id == 2 || form.property_type_id == 3" class="col-md-3 mb-3">
              <label class="form-label">Bathrooms</label>
              <input v-model="form.bathrooms" type="number" class="form-control" />
            </div>

            <div class="col-md-3 mb-3">
              <label class="form-label">Max Occupants</label>
              <input v-model="form.max_size" type="number" class="form-control" />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Floor Area (sqm)</label>
              <input v-model="form.floor_area" type="number" class="form-control" />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Lot Area (sqm)</label>
              <input v-model="form.lot_area" type="number" class="form-control" />
            </div>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div class="card mb-3 shadow-sm">
        <div class="card-header fw-bold">Location</div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Region</label>
              <select v-model="form.region_id" class="form-select">
                <option value="">Select Region</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Province</label>
              <select v-model="form.province_id" class="form-select"></select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Municipality/City</label>
              <select v-model="form.muncity_id" class="form-select"></select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Barangay</label>
              <select v-model="form.barangay_id" class="form-select"></select>
            </div>
          </div>

          <!-- Map -->
          <div id="map" style="height: 400px; border-radius: 8px;" class="mb-3"></div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Latitude</label>
              <input v-model="form.latitude" type="text" class="form-control" readonly />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Longitude</label>
              <input v-model="form.longitude" type="text" class="form-control" readonly />
            </div>
          </div>
        </div>
      </div>

      <!-- Rules -->
      <div class="card mb-3 shadow-sm">
        <div class="card-header fw-bold">Rules</div>
        <div class="card-body">
          <textarea v-model="form.rules" class="form-control" rows="3"></textarea>
        </div>
      </div>

      <!-- Submit -->
      <button type="submit" class="btn btn-primary">Submit Property</button>
    </form>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  data() {
    return {
      map: null,
      marker: null,
      form: {
        title: "",
        description: "",
        thumbnail: null,
        images: [],
        agreement_type: "rental",
        price: null,
        utilities_included: "",
        advance_payment_months: 0,
        deposit_required: 0,
        payment_frequency: "monthly",
        lease_term_months: 0,
        start_date: "",
        end_date: "",
        renewal_option: "none",
        notice_period: 0,
        property_type_id: "",
        furnishing: "unfurnished",
        parking: "no",
        bedrooms: 0,
        bathrooms: 0,
        bed_space: 0,
        floor_area: 0,
        lot_area: 0,
        max_size: 0,
        latitude: null,
        longitude: null,
        region_id: "",
        province_id: "",
        muncity_id: "",
        barangay_id: "",
        rules: "",
      },
    };
  },
  mounted() {
    // this.initMap();
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
    handleThumbnail(e) {
      this.form.thumbnail = e.target.files[0];
    },
    handleImages(e) {
      this.form.images = Array.from(e.target.files);
    },
    handleLocationSuccess(position) {
        this.form.latitude = position.coords.latitude
        this.form.longitude = position.coords.longitude,
        this.setMap(this.form.latitude, this.form.longitude)
    },
    setMap(lat, lng){
        if (this.map) {
        this.map.remove(); // Remove old map if reloaded
        }

        this.map = L.map("map", {
        zoomControl: true,
        }).setView([lat, lng], 15);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        // Add draggable marker
        this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

        // Update form lat/lng when marker is dragged
        this.marker.on("dragend", (e) => {
        const coords = e.target.getLatLng();
        this.form.latitude = coords.lat;
        this.form.longitude = coords.lng;
        });
    },
    handleLocationError(error) {
      alert("Failed to get location: " + error.message);
        // fallback to a default location
        this.setMap(10.3157, 123.8854); // Cebu coords example
    },
    submitProperty() {
      console.log("Submitting property:", this.form);
      // axios POST to backend
    },
  },
};
</script>
