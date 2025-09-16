<template>
  <div>
    <h4>🏠 Add Property</h4>

    <!-- Message about required fields -->
    <div class="mb-3 text-muted">
      <small><span class="text-danger">*</span> denotes required fields</small>
    </div>

    <!-- Step Navigation -->
    <div class="mb-3">
      <button class="btn btn-outline-dark me-2" @click="prevStep" :disabled="step === 1">
        <i class="bi bi-arrow-left"></i> Previous
      </button>
      <button class="btn btn-outline-dark" @click="nextStep" :disabled="step === maxStep">
        Next <i class="bi bi-arrow-right"></i>
      </button>
    </div>

    <!-- Step 1: Basic Info -->
    <div v-if="step === 1" class="card p-3 shadow-sm">
      <div class="mb-3">
        <label class="form-label">Title <span class="text-danger">*</span></label>
        <input type="text" v-model="form.title" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Description <span class="text-danger">*</span></label>
        <textarea v-model="form.description" class="form-control" required></textarea>
      </div>

      <!-- Thumbnail Upload -->
      <div class="mb-3">
        <label class="form-label">Thumbnail <span class="text-danger">*</span></label>
        <input type="file" class="form-control" @change="handleThumbnail" />
        <div v-if="previewThumbnail" class="mt-2">
          <img :src="previewThumbnail" alt="Preview" class="img-thumbnail" style="max-height: 150px;" />
        </div>
      </div>

      <!-- Additional Images Upload -->
      <div class="mb-3">
        <label class="form-label">Property Images</label>
        <input type="file" class="form-control" multiple @change="handlePropertyImages" />
        <div class="d-flex gap-2 mt-2 flex-wrap">
          <img v-for="(img, idx) in previewPropertyImages" :key="idx" :src="img" class="img-thumbnail" style="max-height: 100px;" />
        </div>
      </div>
    </div>

    <!-- Step 2: Agreement, Pricing & Uploads -->
    <div v-if="step === 2" class="card p-3 shadow-sm">
      <div class="mb-3">
        <label class="form-label">Agreement Type <span class="text-danger">*</span></label>
        <select v-model="form.agreement_type" class="form-select">
          <option value="rental">Rental</option>
          <option value="lease">Lease</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Price <span class="text-danger">*</span></label>
        <input v-model="form.price" type="number" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label d-block">Utilities Included</label>
        <div class="form-check form-check-inline">
          <input v-model="form.utilities_included" class="form-check-input" type="radio" :value="true" id="utilitiesYes" />
          <label class="form-check-label" for="utilitiesYes">Yes</label>
        </div>
        <div class="form-check form-check-inline">
          <input v-model="form.utilities_included" class="form-check-input" type="radio" :value="false" id="utilitiesNo" />
          <label class="form-check-label" for="utilitiesNo">No</label>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Advance Payment (Months)</label>
        <input v-model="form.advance_payment_months" type="number" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Deposit Required</label>
        <input v-model="form.deposit_required" type="number" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Payment Frequency</label>
        <select v-model="form.payment_frequency" class="form-select">
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
    </div>

    <!-- Step 3: Lease Details & Features -->
    <div v-if="step === 3" class="card p-3 shadow-sm">
      <div v-if="form.agreement_type === 'lease'">
        <div class="mb-3">
          <label class="form-label">Lease Term (Months)</label>
          <input v-model="form.lease_term_months" type="number" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">Start Date</label>
          <input v-model="form.start_date" type="date" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">End Date</label>
          <input v-model="form.end_date" type="date" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">Renewal Option</label>
          <select v-model="form.renewal_option" class="form-select">
            <option value="none">None</option>
            <option value="manual">Manual Renewal</option>
            <option value="auto">Auto Renewal</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Notice Period (Days)</label>
          <input v-model="form.notice_period" type="number" class="form-control" />
        </div>
      </div>

      <!-- Property Features -->
      <div class="mb-3">
        <label class="form-label">Property Type</label>
          <select v-model="form.property_id" class="form-select">
            <option selected>Select Property Type</option>
            <option 
              v-for="type in types" 
              :key="type.id" 
              :value="type.id"
            >
              {{ type.type_name }}
            </option>
          </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Furnishing</label>
        <select v-model="form.furnishing" class="form-select">
          <option value="furnished">Furnished</option>
          <option value="semi">Semi-Furnished</option>
          <option value="unfurnished">Unfurnished</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Parking</label>
        <select v-model="form.parking" class="form-select">
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
    </div>

    <!-- Step 5: Property Details -->
    <div v-if="step === 4" class="card p-3 shadow-sm">
      <h5>Property Details</h5>
      <div class="mb-3">
        <div class="card p-3 shadow-sm">
          <div class="card-header">
            <label class="form-label fs-5">Amenities</label>

          </div>
          <div class="card-body">
            <div class="row">
              <div 
                v-for="amenity in amenities" 
                :key="amenity.id" 
                class="col-md-4 col-sm-6 mb-2"
              >
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :id="'amenity-' + amenity.id" 
                    :value="amenity.id"
                    v-model="form.property_amenities"
                  />
                  <label class="form-check-label" :for="'amenity-' + amenity.id">
                    {{ amenity.amenity_name }}
                  </label>
                </div>
              </div>
            </div>
          </div>
      </div>
      <div class="mb-3">
        <div class="card p-3 shadow-sm">
          <div class="card-header">
            <label class="form-label fs-5">Facilities</label>
          </div>

          <div class="card-body">
            <div class="row">
              <div 
                v-for="facility in facilities" 
                :key="facility.id" 
                class="col-md-4 col-sm-6 mb-2">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :id="'facility-' + facility.id" 
                    :value="facility.id"
                    v-model="form.property_facilities"
                  />
                  <label class="form-check-label" :for="'facility-' + facility.id">
                    {{ facility.facility_name }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      
    </div>

    <!-- Step 5: Location Details -->
    <div v-if="step === 5" class="card p-3 shadow-sm">
      <h5>Location Details</h5>
      <div class="row mb-3">
        <div class="col-6 align-self-center">
          <div class="rounded" id="propertyMap" style="height:80vh"></div>
        </div>
        <div class="col-6">
          <div class="mb-3">
            <label class="form-label">Latitude</label>
            <input type="number" v-model="form.latitude" class="form-control" step="0.000001" />
          </div>
          <div class="mb-3">
            <label class="form-label">Longitude</label>
            <input type="number" v-model="form.longitude" class="form-control" step="0.000001" />
          </div>
          <div class="mb-3">
            <label class="form-label">Region</label>
              <select v-model="form.region_id" class="form-select" @change="getProvinces">
                <option value="" disabled>Select Region</option>
                <option 
                  v-for="region in regions" 
                  :key="region.id" 
                  :value="region.id"
                  :data-code="region.regCode"
                >
                  {{ region.regDesc }}
                </option>
              </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Province</label>
              <select v-model="form.province_id" class="form-select" @change="getMuncities">
                <option value="" disabled>Select Province</option>
                <option 
                  v-for="province in provinces" 
                  :key="province.id" 
                  :value="province.id"
                  :data-code="province.provCode"
                >
                  {{ province.provDesc }}
                </option>
              </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Municipal and Cities</label>
              <select v-model="form.muncity_id" class="form-select" @change="getBarangays">
                <option value="" disabled>Select Municipal / City</option>
                <option 
                  v-for="muncity in muncities" 
                  :key="muncity.id" 
                  :value="muncity.id"
                  :data-code="muncity.muncityCode"
                >
                  {{ muncity.muncityDesc }}
                </option>
              </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Barangays</label>
              <select v-model="form.barangay_id" class="form-select">
                <option value="" disabled>Select Barangays</option>
                <option 
                  v-for="brgy in barangays" 
                  :key="brgy.id" 
                  :value="brgy.id"
                >
                  {{ brgy.brgyDesc }}
                </option>
              </select>
          </div>
        </div>

      </div>
      
    </div>


    <!-- Final Step: Review and Submit -->
    <div v-if="step === 6" class="card p-3 shadow-sm">
      <p><strong>Review Your Property:</strong></p>
      <ul>
        <li>Title: {{ form.title }}</li>
        <li>Description: {{ form.description }}</li>
        <li v-if="form.thumbnail">Thumbnail selected ✅</li>
        <li>{{ form.images.length }} additional images selected ✅</li>
        <li>Price: {{ form.price }} </li>
        <li>Utilities Included: {{ form.utilities_included ? 'Yes' : 'No' }}</li>
        <li>Advance Payment: {{ form.advance_payment_months }} months</li>
        <li>Deposit Required: {{ form.deposit_required }}</li>
      </ul>
      <button class="btn btn-success" @click="submitForm">Submit Property</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { createProperty, getRegion, getProvinces, getBarangays, getMunCities, getAmenities, getFacilities, getPropertyTypes } from "@/api/property";

export default {
  data() {
    return {
      step: 1,
      maxStep: 6,
      location: null,
      regions: [],
      provinces: [],
      muncities:[],
      barangays: [],
      amenities: [],
      facilities: [],
      property_types: [],

      form: {
        title: "",
        description: "",
        agreement_type: "rental",
        price: null,
        utilities_included: null,
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
        curfew: null,
        property_facilities: [],
        property_amenities: [],
        rules: "",
        thumbnail: null,
        images: [],
      },
      previewThumbnail: null,
      previewPropertyImages: [],
    };
  },
  methods: {
    // Handle thumbnail upload
    handleThumbnail(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.thumbnail = file;
        this.previewThumbnail = URL.createObjectURL(file);
      }
    },

    // Handle multiple property images
    handlePropertyImages(event) {
      const files = Array.from(event.target.files);
      this.form.images = files;
      this.previewPropertyImages = files.map((f) => URL.createObjectURL(f));
    },

    // Navigation
    nextStep() {
      if (this.step < this.maxStep) this.step++;
    },
    prevStep() {
      if (this.step > 1) this.step--;
    },

    // Submit form
    async submitForm() {
      const fd = new FormData();
      for (const key in this.form) {
        if (key === "images") {
          this.form.images.forEach((img, idx) => {
            fd.append(`images[${idx}]`, img);
          });
        } else if (key === "thumbnail") {
          if (this.form.thumbnail) fd.append("thumbnail", this.form.thumbnail);
        } else {
          fd.append(key, this.form[key]);
        }
      }

      try {
        const response = await createProperty(fd);
        console.log("Property added successfully:", response.data);
      } catch (error) {
        console.error("Error submitting property:", error);
      }
    },

    // Location Details
    handleLocationSuccess(position) {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.setMap(this.location.lat, this.location.lng)
    },
    setMap(lat, lng){
        var map = L.map('propertyMap',{
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
    // Code for getting psgc adresses
    async getRegions() {
      try {
        const res = await getRegion();
        this.regions = res; // make sure your API returns list
      } catch (error) {
        console.error(`Region Error: ${error}`)
      }
      
    },

    async getProvinces(event) {
      const regCode = event.target.options[event.target.selectedIndex].dataset.code;
      const res = await getProvinces(regCode);
      this.provinces = res;
      this.muncities = [];
      this.barangays = [];
      this.form.province_id = "";
      this.form.muncity_id = "";
      this.form.barangay_id = "";
    },

    async getMuncities(event) {
      const provCode = event.target.options[event.target.selectedIndex].dataset.code;
      const res = await getMunCities(provCode);
      this.muncities = res;
      this.barangays = [];
      this.form.muncity_id = "";
      this.form.barangay_id = "";
    },

    async getBarangays(event) {
      const muncityCode = event.target.options[event.target.selectedIndex].dataset.code;
      const res = await getBarangays(muncityCode);
      this.barangays = res;
      this.form.barangay_id = "";
    },

    // Code for Property Details
    async getAmenities(){
      try {
        const response = await getAmenities();
        this.amenities = response;
      } catch (error) {
        console.log(`Amenity Error: ${error}`)
      }
    },
    async getFacilities(){
      try {
        const response = await getFacilities();
        this.facilities = response
      } catch (error) {
        console.log(`Facilities error: ${error}`);
      }
    },
    async getPropertyTypes(){
      try {
        const response = await getPropertyTypes();
        
      } catch (error) {
        console.log(`Property Type: ${error}`)
      }
    }
  },
  mounted() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        // Only try to init map if step 4 is already active
        if (this.step === 4) {
          this.$nextTick(() => {
            this.setMap(this.location.lat, this.location.lng);
          });
        }
      },
      this.handleLocationError,

      this.getRegions(),

      // Gettting property Details
      this.getAmenities(),
      this.getFacilities(),
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
  },
  watch: {
    step(newStep) {
      if (newStep === 4 && this.location) {
        this.$nextTick(() => {
          this.setMap(this.location.lat, this.location.lng);
        });
      }
    },
  },
};
</script>


<style scoped>
/* Add custom styles here for better UX */


.card-header {
  background-color: #f1f1f1;
  font-weight: bold;
}

.card-body {
  padding: 20px;
}

input[type="text"], input[type="number"], input[type="file"], textarea, select {
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

button {
  font-weight: bold;
}

button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>
