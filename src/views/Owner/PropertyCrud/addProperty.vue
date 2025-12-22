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

    <!-- Step 2: Property Details -->
    <div v-if="step === 2" class="card p-3 shadow-sm">

      <div class="row">
        <!-- Agreement Type -->
        <div class="col-6">
          <label class="form-label">Agreement Type <span class="text-danger">*</span></label>
          <select v-model="form.agreement_type" class="form-select">
            <option value="rental">Rental</option>
            <option value="lease">Lease</option>
          </select>
        </div>

        <!-- Property Type -->
         <div class="col-6">
          <label class="form-label">Property Type</label>
          <select v-model="form.property_type_id" class="form-select">
            <option disabled selected value="">Select Property Type</option>
            <option 
              v-for="type in property_types" 
              :key="type.id" 
              :value="type.id"
            >
              {{ type.type_name }}
            </option>
          </select>

          
         </div>
      </div>

      <!-- Utilities/ Amenities/ Facilities Included -->
      <div class="row mb-3 mt-3">

        <!-- Utilities -->
        <div class="col-6 ">
          <div class="card shadow-sm mb-3">
            <div class="card-header bg-light">
              <label for="" class="form-label fs-5 mb-0">Utilities</label>
            </div>

            <div class="card-body">
              <label class="form-label d-block">Utilities Included</label>

              <div class="row">
                <div 
                  v-for="utility in utilitiesList" 
                  :key="utility.value" 
                  class="col-md-4 col-sm-6 mb-2"
                >
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      :id="'utility-' + utility.value" 
                      :value="utility.value"
                      v-model="form.utilities"
                      @change="updateUtilitiesIncluded"
                    />
                    <label class="form-check-label" :for="'utility-' + utility.value">
                      {{ utility.label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Utilities End -->

          <!-- Amenities -->
          <div class="card shadow-sm mb-3">
            <div class="card-header bg-light">
              <label class="form-label fs-5 mb-0">Amenities</label>
            </div>
            <div class="card-body">
              <div class="row">
                <div
                  v-for="amenity in amenities"
                  :key="amenity.id"
                  class="col-md-6 col-sm-12 mb-2"
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
          <!-- Amenities End -->

           <!-- Facilities -->
          <div class="card shadow-sm mb-3">
            <div class="card-header bg-light">
              <label class="form-label fs-5 mb-0">Facilities</label>
            </div>
            <div class="card-body">
              <div class="row">
                <div
                  v-for="facility in facilities"
                  :key="facility.id"
                  class="col-md-6 col-sm-12 mb-2"
                >
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
          <!-- FAcilities end -->
        </div>

        <!-- Right Fields -->
        <div class="col-6">
          <div class="mb-3">
            <label class="form-label">Furnishing</label>
            <select v-model="form.furnishing" class="form-select">
              <option value="fully-furnished">Furnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Parking</label>
            <select v-model="form.parking" class="form-select">
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </div>
          <div class="col mb-3" v-if="showBedrooms">
              <label class="form-label">Bedrooms</label>
              <input v-model="form.bedrooms" type="number" class="form-control" required />
          </div>
          <div class="col mb-3" v-if="showBathrooms"  >
              <label class="form-label">Bathrooms</label>
              <input v-model="form.bathrooms" type="number" class="form-control" required />
          </div>
          <div class="col mb-3" v-if="showBedSpace">
              <label class="form-label">Bed Space</label>
              <input v-model="form.bed_space" type="number" class="form-control" required />
          </div>

          <div class="col mb-3" v-if="showSizeFiels">
            <label class="form-label">Floor Area</label>
            <input v-model="form.floor_area" type="number" class="form-control" required />
          </div>
          <div class="col mb-3" v-if="showSizeFiels">
            <label class="form-label">Lot Area</label>
            <input v-model="form.lot_area" type="number" class="form-control" required />
          </div>
          <div class="col mb-3" v-if="showSizeFiels">
            <label class="form-label">Max Size</label>
            <input v-model="form.max_size" type="number" class="form-control" required />
          </div>
          <h5 class="mb-3">Others</h5>
          <div class="col mb-3">
              <label class="form-label">Rules</label>
              <textarea v-model="form.rules" class="form-control" required></textarea>
          </div>
          <div class="col mb-3">       
            <label class="form-label">Is there a curfew?</label>
            <select v-model="form.has_curfew" class="form-select">
              <option :value="false">No</option>
              <option :value="true">Yes</option>
            </select> 

            <!-- Show time input only if curfew is Yes -->
            <div v-if="form.has_curfew" class="mt-3">
              <label class="form-label">Curfew Time</label>
              <input type="time" v-model="form.curfew_time" class="form-control" />
            </div>
          </div>
        </div>
        <!-- End of right -->
      </div>


      <div class="row">
        
      </div>

      <div class="row">
        
      </div>


    </div>

    <!-- Step 3: Price -->
    <div v-if="step === 3" class="card p-3 shadow-sm">

      <div class="mb-3" v-if="form.agreement_type === 'rental'">
        <label class="form-label">Payment Frequency</label>
        <select v-model="form.payment_frequency" class="form-select">
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div class="mb-3" >
        <label class="form-label">Price <span class="text-danger">*</span></label>
        <input v-model="form.price" type="number" class="form-control" required />
      </div>
      <div class="mb-3" v-if="form.agreement_type === 'rental'">
        <label class="form-label">Advance Payment ({{ this.frequecyText }})</label>
        <input v-model="form.advance_payment_months" type="number" class="form-control" />
      </div>
      <div class="mb-3" v-if="form.agreement_type === 'rental'">
        <label class="form-label">Deposit Required</label>
        <input v-model="form.deposit_required" type="number" class="form-control" />
      </div>
      

      <!-- This is for lease details -->
      <div class="mb-3" v-if="form.agreement_type === 'lease'">
        <label class="form-label">Lease Term (Months)</label>
        <input v-model="form.lease_term_months" type="number" class="form-control" />
      </div>
      <div class="mb-3" v-if="form.agreement_type === 'lease'">
        <label class="form-label">Renewal Option</label>
        <select v-model="form.renewal_option" class="form-select">
          <option value="none">None</option>
          <option value="manual">Manual Renewal</option>
          <option value="auto">Auto Renewal</option>
        </select>
      </div>
      <div class="mb-3" v-if="form.agreement_type === 'lease'">
        <label class="form-label">Notice Period (Days)</label>
        <input v-model="form.notice_period" type="number" class="form-control" />
      </div>
    
    </div>



      <!-- Step 4: Location Details -->
    <div v-if="step === 4" class="card p-3 shadow-sm">
      <h5>Location Details</h5>
      <div class="row mb-3">
        <div class="col">
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

        <div class="col">
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

        <div class="col">
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

        <div class="col">
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
      
      <div class="row mb-3">
        <div class="col-9 align-self-center">
          <div class="rounded" ref="propertyMap" style="height:80vh"></div>
        </div>
        <div class="col-3">
          <!-- Location inputs -->
          <div class="mb-3">
            <label class="form-label">Latitude</label>
            <input type="number" v-model="form.latitude" class="form-control" step="0.000001" />
          </div>
          <div class="mb-3">
            <label class="form-label">Longitude</label>
            <input type="number" v-model="form.longitude" class="form-control" step="0.000001" />
          </div>
          <!-- Region, Province, Municipality, Barangay -->
          <!-- <div class="mb-3">
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
            </div> -->
          </div>
      </div>
    </div>

      <!-- Final Step: Review and Submit -->
    <div v-if="step === 5" class="card p-3 shadow-sm">
      <h5 class="mb-3">📋 Review Your Property Details</h5>

      <div class="table-responsive">
        <table class="table table-bordered align-middle">
          <tbody>
            <tr>
              <th>Title</th>
              <td>{{ form.title }}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{{ form.description }}</td>
            </tr>
            <tr>
              <th>Agreement Type</th>
              <td>{{ form.agreement_type }}</td>
            </tr>
            <tr>
              <th>Property Type</th>
              <td>
                {{ property_types.find(p => p.id === form.property_type_id)?.type_name || 'N/A' }}
              </td>
            </tr>
            <tr>
              <th>Price</th>
              <td>₱{{ form.price?.toLocaleString() }}</td>
            </tr>
            <tr v-if="form.agreement_type === 'rental'">
              <th>Advance Payment</th>
              <td>{{ form.advance_payment_months || 0 }} month(s)</td>
            </tr>
            <tr v-if="form.agreement_type === 'rental'">
              <th>Deposit Required</th>
              <td>{{ form.deposit_required || 0 }}</td>
            </tr>
            <tr v-if="form.agreement_type === 'rental'">
              <th>Payment Frequency</th>
              <td>{{ form.payment_frequency }}</td>
            </tr>
            <tr v-if="form.agreement_type === 'lease'">
              <th>Lease Term</th>
              <td>{{ form.lease_term_months || 0 }} month(s)</td>
            </tr>
            <tr v-if="form.agreement_type === 'lease'">
              <th>Renewal Option</th>
              <td>{{ form.renewal_option }}</td>
            </tr>
            <tr v-if="form.agreement_type === 'lease'">
              <th>Notice Period</th>
              <td>{{ form.notice_period || 0 }} day(s)</td>
            </tr>
            <tr>
              <th>Furnishing</th>
              <td>{{ form.furnishing?.replace('-', ' ') || 'N/A' }}</td>
            </tr>
            <tr>
              <th>Parking</th>
              <td>{{ form.parking ? 'Yes' : 'No' }}</td>
            </tr>
            <tr>
              <th>Utilities</th>
              <td>
                <span v-if="form.utilities && form.utilities.length">
                  {{ form.utilities.join(', ') }}
                </span>
                <span v-else>No utilities selected</span>
              </td>
            </tr>
            <tr>
              <th>Amenities</th>
              <td>
                <span v-if="form.property_amenities.length">
                  {{ form.property_amenities.length }} selected
                </span>
                <span v-else>None</span>
              </td>
            </tr>
            <tr>
              <th>Facilities</th>
              <td>
                <span v-if="form.property_facilities.length">
                  {{ form.property_facilities.length }} selected
                </span>
                <span v-else>None</span>
              </td>
            </tr>
            <tr>
              <th>Rules</th>
              <td>{{ form.rules || 'N/A' }}</td>
            </tr>
            <tr>
              <th>Curfew</th>
              <td>
                <span v-if="form.has_curfew">Yes ({{ form.curfew_time }})</span>
                <span v-else>No</span>
              </td>
            </tr>
            <tr>
              <th>Location</th>
              <td>
                {{ regions.find(r => r.id === form.region_id)?.regDesc }},
                {{ provinces.find(p => p.id === form.province_id)?.provDesc }},
                {{ muncities.find(m => m.id === form.muncity_id)?.muncityDesc }},
                {{ barangays.find(b => b.id === form.barangay_id)?.brgyDesc }}
              </td>
            </tr>
            <tr>
              <th>Coordinates</th>
              <td>Lat: {{ form.latitude }} | Lng: {{ form.longitude }}</td>
            </tr>
            <tr>
              <th>Images</th>
              <td>
                <span v-if="form.thumbnail">✅ Thumbnail selected</span><br />
                <span>{{ form.images.length }} additional image(s)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-end">
        <button class="btn btn-success px-4" @click="validateForm">
          <i class="bi bi-check-circle"></i> Submit Property
        </button>
      </div>
    </div>

    <!-- Step Navigation -->
    <div class="mt-3 d-flex justify-content-end">
      <button class="btn btn-outline-dark just" @click="nextStep" :disabled="step === maxStep">
        Next <i class="bi bi-arrow-right"></i>
      </button>
    </div>

    <!-- Confirm Modal -->
    <confirmModal
      :show="showConfirmModal"
      title="Confirm Property Info"
      message="Are you sure all the information you entered is correct?"
      confirm-text="Yes, I'm Sure"
      @confirm="submitForm"
      @cancel="closeConfirmModal"
    />
  </div>
  
</template>

<script>
import axios from "axios";
import { createProperty, getRegion, getProvinces, getBarangays, getMunCities, getAmenities, getFacilities, getPropertyTypes } from "@/api/property";
import confirmModal from "@/components/confirmModal.vue";
export default {
  data() {
    return {
      showConfirmModal: false,
      frequecyText: null,
      map: null,
      marker: null,
      step: 1,
      maxStep: 5,
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
        utilities: [],
        utilities_included: null,
        advance_payment_months: 0,
        deposit_required: 0,
        payment_frequency: "monthly",

        // Lease
        lease_term_months: 0,
        renewal_option: "none",
        notice_period: 0,
        // Lease

        property_type_id: "",
        furnishing: "unfurnished",
        parking: null,
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

        // Adds not on migrations
        has_curfew: null,
        curfew_time: null,
        // Adds not on migrations
        
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
  components: {
    confirmModal
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

    async validateForm() {
      try {
        // Title & Description
        if (!this.form.title || this.form.title.trim() === "") {
          alert("Title is required");
          return;
        }
        if (!this.form.description || this.form.description.trim() === "") {
          alert("Description is required");
          return;
        }

        // Agreement Type
        if (!this.form.agreement_type) {
          alert("Agreement type is required");
          return;
        }

        // Property Type
        if (!this.form.property_type_id) {
          alert("Property type is required");
          return;
        }

        // Price
        if (!this.form.price || this.form.price <= 0) {
          alert("Price must be greater than 0");
          return;
        }

        // Rental-specific validations
        if (this.form.agreement_type === "rental") {
          if (this.form.advance_payment_months < 0) {
            alert("Advance payment months cannot be negative");
            return;
          }
          if (this.form.deposit_required < 0) {
            alert("Deposit required cannot be negative");
            return;
          }
          if (!this.form.payment_frequency) {
            alert("Payment frequency is required for rentals");
            return;
          }
        }

        // Lease-specific validations
        if (this.form.agreement_type === "lease") {
          if (!this.form.lease_term_months || this.form.lease_term_months <= 0) {
            alert("Lease term must be greater than 0");
            return;
          }
          if (!this.form.renewal_option) {
            alert("Renewal option is required");
            return;
          }
          if (this.form.notice_period < 0) {
            alert("Notice period cannot be negative");
            return;
          }
        }

        // Location
        if (!this.form.region_id || !this.form.province_id || !this.form.muncity_id || !this.form.barangay_id) {
          alert("Complete location details are required");
          return;
        }
        if (!this.form.latitude || !this.form.longitude) {
          alert("Coordinates are required");
          return;
        }

        // ✅ If all validations pass, proceed to submit

        this.showConfirmModal = true;
        // await this.submitForm();

      } catch (error) {
        console.error("Validation Error:", error);
        alert("Something went wrong during validation.");
      }
    },
    closeConfirmModal(){
      this.showConfirmModal = false;
    },

    // Submit form
    async submitForm() {
      const fd = new FormData();

      for (const key in this.form) {
        const value = this.form[key];

        // Handle images array
        if (key === "images") {
          value.forEach((img, idx) => {
            fd.append(`images[${idx}]`, img);
          });
        }
        // Handle thumbnail
        else if (key === "thumbnail") {
          if (value) fd.append("thumbnail", value);
        }
        // Handle array fields properly
        else if (Array.isArray(value)) {
          value.forEach((v) => {
            fd.append(`${key}[]`, v);
          });
        }
        // Handle booleans -> cast to 1/0
        else if (typeof value === "boolean") {
          fd.append(key, value ? 1 : 0);
        }
        // Handle numbers and strings
        else if (value !== null && value !== undefined) {
          fd.append(key, value);
        }
      }

      try {
        this.showConfirmModal = false;
        const response = await createProperty(fd);
        // console.log("Property added successfully:", response);
        sessionStorage.setItem("propertyCreated", true);
        // alert("Property created successfully!");
        this.$router.push("/properties")
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
          let message = "";
          for (const field in errors) {
            message += `${field}: ${errors[field].join(", ")}\n`;
          }
          alert(`Validation Errors:\n${message}`);
          console.error("Validation Errors:", errors);
        } else {
          console.error("Error submitting property:", error);
          alert("Something went wrong. Check console.");
        }
      }
    },

    // Location Details
    handleLocationSuccess(position) {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      console.log(this.location)

      // Update form values para hindi default Manila
      this.form.latitude = this.location.lat.toFixed(6);
      this.form.longitude = this.location.lng.toFixed(6);

      this.$nextTick(() => {
        this.setMap(this.location.lat, this.location.lng);
      });
    },
    setMap(lat, lng) {
      this.$nextTick(() => {
        const mapContainer = this.$refs.propertyMap;
        if (!mapContainer) {
          console.error("Map container not found.");
          return;
        }

        // 🧹 Destroy existing map if it exists
        if (this.map) {
          this.map.remove();
          this.map = null;
          this.marker = null;
        }

        // 🗺️ Initialize map again
        this.map = L.map(mapContainer).setView([lat, lng], 15);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);

        this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

        // ✅ Update coordinates when dragging
        this.marker.on("dragend", (e) => {
          const { lat, lng } = e.target.getLatLng();
          this.form.latitude = lat.toFixed(6);
          this.form.longitude = lng.toFixed(6);
        });

        // ✅ Update coordinates when clicking
        this.map.on("click", (e) => {
          const { lat, lng } = e.latlng;
          this.marker.setLatLng([lat, lng]);
          this.form.latitude = lat.toFixed(6);
          this.form.longitude = lng.toFixed(6);
        });
      });
    },
    handleLocationError(error) {
      alert("Failed to get location: " + error.message);
    },
    async geocodeLocation(query) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Philippines')}`);
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          this.form.latitude = parseFloat(lat).toFixed(6);
          this.form.longitude = parseFloat(lon).toFixed(6);

            this.setMap(lat, lon);
        } else {
          console.warn("No coordinates found for:", query);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      }
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
        console.log("getting tpyes")
        const response = await getPropertyTypes();
        console.log("got the tpyes")
        this.property_types = response
      } catch (error) {
        console.log(`Property Type: ${error}`)
      }
    }
  },
  mounted() {
        // Run these regardless of geolocation
      this.getRegions();
      this.getAmenities();
      this.getFacilities();
      this.getPropertyTypes();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log('Geolocation Position:', pos.coords); // Add this log
            this.location = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            this.form.latitude = this.location.lat.toFixed(6);
            this.form.longitude = this.location.lng.toFixed(6);
            this.$nextTick(() => {
              this.setMap(this.location.lat, this.location.lng);
            });
          },
          this.handleLocationError
        );
      }
  },
  computed: {
    utilitiesList() {
      return [
        { value: 'electricity', label: 'Electricity' },
        { value: 'water', label: 'Water' },
        { value: 'internet', label: 'Internet' },
        { value: 'cooking_gas', label: 'Cooking Gas' },
      ];
    },
    selectedPropertyName() {
      const selected = this.property_types.find(type => type.id === this.form.property_type_id);
      return selected ? selected.type_name : "";
    },
    showBedrooms() {
      if (!this.selectedPropertyName) return false;
      return this.selectedPropertyName.toLowerCase() !== 'commercial space';
    },
    showBedSpace() {
      if (!this.selectedPropertyName) return false;

      // Hide bedrooms for these property types:
      const excludedTypes = ['commercial space', 'hotel', 'apartment', 'condo'];

      // Return false if the selected type is in the excluded list
      return !excludedTypes.includes(this.selectedPropertyName.toLowerCase());
    },
    showBathrooms(){
      if (!this.selectedPropertyName) return false;
      return this.selectedPropertyName.toLowerCase() !== 'commercial space';
    },
    showSizeFiels(){
      if (!this.selectedPropertyName) return false;
      const includedTypes = ['apartment', 'condo', 'commercial space', 'hotel'];
      return includedTypes.includes(this.selectedPropertyName.toLowerCase());
    },
    
    

  },
  watch: {
    step(newStep) {
      if (newStep === 4 && this.location) {
        this.$nextTick(() => {
          this.setMap(this.form.latitude || this.location.lat, this.form.longitude || this.location.lng);
        });
      }
    },
    'form.bedrooms'(newVal) {
      if (newVal < 0) {
        this.form.bedrooms = 0
      }
    },
    'form.bathrooms'(newVal) {
      if (newVal < 0) {
        this.form.bathrooms = 0
      }
    },
    'form.bed_space'(newVal) {
      if (newVal < 0) {
        this.form.bed_space = 0
      }
    },
    'form.floor_area'(newVal) {
      if (newVal < 0) {
        this.form.floor_area = 0
      }
    },
    'form.lot_area'(newVal) {
      if (newVal < 0) {
        this.form.lot_area = 0
      }
    },
    'form.max_size'(newVal) {
      if (newVal < 0) {
        this.form.max_size = 0
      }
    },
    'form.price'(newVal) {
      if (newVal < 0) {
        this.form.price = 0
      }
    },
    'form.advance_payment_months'(newVal) {
      if (newVal < 0) {
        this.form.advance_payment_months = 0
      }
    },
    'form.deposit_required'(newVal) {
      if (newVal < 0) {
        this.form.deposit_required = 0
      }
    },


    // For functionality
    'form.payment_frequency'(newVal){
      if(newVal === "quarterly"){
        this.frequecyText = "Quarterly"
      }
      if(newVal === "yearly"){
        this.frequecyText = "Yearly"
      }
      if(newVal === "monthly"){
        this.frequecyText = "Monthly"
      }
    }
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
