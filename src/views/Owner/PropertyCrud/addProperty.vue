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

        <div class="col-6 ">
          <!-- Utilities -->
          <div class="card shadow-sm mb-3">
          <div class="card-header bg-light">
            <label class="form-label fs-5 mb-0">Utilities</label>
          </div>

          <div class="card-body">
            <label class="form-label d-block">Utilities Included</label>

            <!-- DEFAULT UTILITIES -->
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
                  />
                  <label class="form-check-label " :for="'utility-' + utility.value">
                    {{ utility.label }}
                  </label>
                </div>
              </div>
            </div>

            <!-- DIVIDER -->
            <hr class="my-3">

            <!-- CUSTOM UTILITIES -->
            <label class="form-label d-block">Add Other Utilities</label>

            <div class="d-flex gap-2 mb-3">
              <input
                type="text"
                class="form-control"
                v-model="customUtility"
                placeholder="e.g. Solar Backup, Free Drinking Water"
                @keyup.enter="addCustomUtility"
              />
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="addCustomUtility"
              >
                Add
              </button>
            </div>

            <!-- CUSTOM UTILITIES LIST -->
            <div v-if="form.custom_utilities.length">
              <span
                v-for="(utility, index) in form.custom_utilities"
                :key="index"
                class="badge bg-secondary me-2 mb-2"
              >
                {{ utility }}
                <button
                  type="button"
                  class="btn-close btn-close-white ms-2"
                  aria-label="Remove"
                  @click="removeCustomUtility(index)"
                ></button>
              </span>
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
              <!-- DEFAULT AMENITIES -->
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

              <!-- DIVIDER -->
              <hr class="my-3">

              <!-- CUSTOM AMENITIES -->
              <label class="form-label d-block">Add Other Amenities</label>

              <div class="d-flex gap-2 mb-3">
                <input
                  type="text"
                  class="form-control"
                  v-model="customAmenity"
                  placeholder="e.g. Swimming Pool, Study Area"
                  @keyup.enter="addCustomAmenity"
                />
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="addCustomAmenity"
                >
                  Add
                </button>
              </div>

              <!-- CUSTOM AMENITIES LIST -->
              <div v-if="form.custom_amenities.length">
                <span
                  v-for="(amenity, index) in form.custom_amenities"
                  :key="index"
                  class="badge bg-secondary me-2 mb-2"
                >
                  {{ amenity }}
                  <button
                    type="button"
                    class="btn-close btn-close-white ms-2"
                    aria-label="Remove"
                    @click="removeCustomAmenity(index)"
                  ></button>
                </span>
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

              <!-- DIVIDER -->
              <hr class="my-3">

              <!-- CUSTOM FACILITIES -->
              <label class="form-label d-block">Add Other Facilities</label>

              <div class="d-flex gap-2 mb-3">
                <input
                  type="text"
                  class="form-control"
                  v-model="customFacility"
                  placeholder="e.g. Swimming Pool, Study Area"
                  @keyup.enter="addCustomFacility"
                />
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="addCustomFacility"
                >
                  Add
                </button>
              </div>

              <!-- CUSTOM FACILITIES LIST -->
              <div v-if="form.custom_facilities.length">
                <span
                  v-for="(facility, index) in form.custom_facilities"
                  :key="index"
                  class="badge bg-secondary me-2 mb-2"
                >
                  {{ facility }}
                  <button
                    type="button"
                    class="btn-close btn-close-white ms-2"
                    aria-label="Remove"
                    @click="removeCustomFacility(index)"
                  ></button>
                </span>
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

          <!-- Bedrooms -->
          <div v-if="showBedrooms" class="card shadow-sm mb-3">
            <div class="card-header d-flex align-content-center justify-content-center bg-light">
              <div class="input-group">
                <label class="input-group-text fs-5 mb-0">Bedrooms</label>
                <input
                  type="number"
                  min="1"
                  v-model="form.bedrooms"
                  class="form-control"
                />
              </div>
            </div>

            <div class="card-body">
              <label class="form-label d-block">Bed Types</label>

              <!-- DEFAULT UTILITIES -->
              <div class="row">
                <div 
                  v-for="bed in bed_types" 
                  :key="bed" 
                  class="col-md-4 col-sm-6 mb-2"
                >
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      :id="'bed-' + bed" 
                      :value="bed"
                      v-model="form.bed_type"
                    />
                    <label class="form-check-label " :for="'bed-' + bed">
                      {{ bed }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="row">
                <div v-if="form.bed_type.includes('Single Bed')"  class="col-6">
                  <label class="form-label">Number of Single Bed</label>
                  <input
                    type="number"
                    min="1"
                    v-model="form.single_bed"
                    class="form-control"
                  />
                </div>
                <div v-if="form.bed_type.includes('Double Bed')"  class="col-6">
                  <label class="form-label">Number of Double Bed</label>
                  <input
                    type="number"
                    min="1"
                    v-model="form.double_bed"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Bathrooms -->
          <div v-if="showBathrooms" class="card shadow-sm mb-3">
            <div class="card-header bg-light">
              <label class="form-label fs-5 mb-0">Bathrooms</label>
            </div>

            <div class="card-body">
              <label class="form-label d-block">Bathroom Types</label>

              <!-- DEFAULT UTILITIES -->
              <div class="row">
                <div 
                  v-for="bath in bath_types" 
                  :key="bath" 
                  class="col-md-4 col-sm-6 mb-2"
                >
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      :id="'bath-' + bath" 
                      :value="bath"
                      v-model="form.bath_type"
                    />
                    <label class="form-check-label " :for="'bath-' + bath">
                      {{ bath }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="row">
                <div v-if="form.bath_type.includes('Private')"  class="col-6">
                  <label class="form-label">Number of Private Bathroom</label>
                  <input
                    type="number"
                    min="1"
                    v-model="form.private_bath"
                    class="form-control"
                  />
                </div>
                <div v-if="form.bath_type.includes('Public')"  class="col-6">
                  <label class="form-label">Number of Public Bathroom</label>
                  <input
                    type="number"
                    min="1"
                    v-model="form.public_bath"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Max Occupants ( Bed Space ) -->
          <div v-if="showBedSpace" class="mb-3">
            <label class="form-label">Maximum Occupants</label>
            <small class="text-muted">
              (Bed Space)
            </small>
            <input
              type="number"
              min="1"
              v-model="form.bed_space"
              class="form-control"
            />
            <small class="text-muted">
              Total number of people allowed to stay
            </small>
          </div>

          <!-- Floor Area -->
          <div v-if="showSizeFiels" class="mb-3">
            <label class="form-label">Floor Area</label>
            <small class="text-muted">
              (sqm)
            </small>
            <div class="input-group">
              <input
                type="number"
                min="1"
                v-model="form.floor_area"
                class="form-control"
              />
              <span class="input-group-text">m²</span>
            </div>
          </div>

          <!-- Lot Area -->
          <div v-if="showSizeFiels" class="mb-3">
            <label class="form-label">Lot Area</label>
            <small class="text-muted">
              (sqm)
            </small>
            <div class="input-group">
              <input
                type="number"
                min="1"
                v-model="form.lot_area"
                class="form-control"
              />
              <span class="input-group-text">m²</span>
            </div>
          </div>

          <!-- Max Occupants  -->
          <div class="mb-3" v-if="showSizeFiels">
            <label class="form-label">Maximum Occupants</label>
            <input
              type="number"
              min="1"
              v-model="form.max_size"
              class="form-control"
            />
            <small class="text-muted">
              Total number of people allowed to stay
            </small>
          </div>

          <h5 class="mb-3">Others</h5>

          <!-- Rules -->
          <div class="mb-3">
            <label class="form-label">Rules</label>
            <textarea
              v-model="form.rules"
              class="form-control"
              rows="3"
              placeholder="e.g. No smoking, No loud music after 10 PM"
            ></textarea>
          </div>

          <!-- Curfew -->
          <div class="mb-3">
            <label class="form-label">Is there a curfew?</label>
            <select v-model="form.has_curfew" class="form-select">
              <option :value="false">No</option>
              <option :value="true">Yes</option>
            </select>
          </div>

          <!-- CURFEW RANGE -->
          <div v-if="form.has_curfew" class="mb-3">
            <label class="form-label">Curfew Time</label>
            <div class="row">
              <div class="col-6">
                <label class="form-label text-muted">From</label>
                <input
                  type="time"
                  v-model="form.curfew_from"
                  class="form-control"
                />
              </div>
              <div class="col-6">
                <label class="form-label text-muted">To</label>
                <input
                  type="time"
                  v-model="form.curfew_to"
                  class="form-control"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- End of right -->
      </div>


    </div>

    <!-- Step 3: Price -->
    <div v-if="step === 3" class="card p-3 shadow-sm">

      <!-- RENTAL PRICING -->
      <div v-if="form.agreement_type === 'rental'">

        <h5 class="mb-3">Rental Pricing</h5>

        <!-- PAYMENT FREQUENCY -->
        <div class="mb-3">
          <label class="form-label">Payment Frequency</label>
          <select v-model="form.payment_frequency" class="form-select">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
            <option value="per_night">Per Night</option>
            <option value="per_day">Per Day</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <!-- PRICE -->
        <div class="mb-3">
          <label class="form-label">
            Price
            <small class="text-muted">({{ frequecyText }})</small>
          </label>

          <div class="input-group">
            <span class="input-group-text">₱</span>
            <input
              v-model="form.price"
              type="number"
              min="1"
              class="form-control"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <!-- ADVANCE PAYMENT -->
        <div class="mb-3">
          <label class="form-label">Advance Payment</label>
          <div class="input-group">
            <span class="input-group-text">₱</span>
            <input
              v-model="form.advance_payment_months"
              type="number"
              min="0"
              class="form-control"
            />

          </div>
          <small class="text-muted">
            Amount of money to pay in advance
          </small>
        </div>

        <!-- SECURITY DEPOSIT -->
        <div class="mb-3">
          <label class="form-label">Security Deposit</label>
          <small class="text-muted"> (Deposit)</small>
          <div class="input-group">
            <span class="input-group-text">₱</span>
            <input
              v-model="form.deposit_required"
              type="number"
              min="0"
              class="form-control"
              placeholder="0.00"
            />
          </div>
        </div>

      </div>

      <!-- LEASE PRICING -->
      <div v-if="form.agreement_type === 'lease'">

        <h5 class="mb-3">Lease Details</h5>

        <!-- LEASE TERM -->
        <div class="mb-3">
          <label class="form-label">Lease Term</label>
          <div class="input-group">
            <input
              v-model="form.lease_term_months"
              type="number"
              min="1"
              class="form-control"
            />
            <span class="input-group-text">months</span>
          </div>
        </div>

        <!-- RENEWAL OPTION -->
        <div class="mb-3">
          <label class="form-label">Renewal Option</label>
          <select v-model="form.renewal_option" class="form-select">
            <option value="none">None</option>
            <option value="manual">Manual Renewal</option>
            <option value="auto">Auto Renewal</option>
          </select>
        </div>

        <!-- NOTICE PERIOD -->
        <div class="mb-3">
          <label class="form-label">Notice Period</label>
          <div class="input-group">
            <input
              v-model="form.notice_period"
              type="number"
              min="0"
              class="form-control"
            />
            <span class="input-group-text">days</span>
          </div>
        </div>

      </div>

    </div>




    <!-- Step 4: Location Details -->
    <div v-if="step === 4" class="card p-3 shadow-sm">

    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">Location Details 
        <div v-if="this.loading" class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </h5>

      <button
        class="btn btn-outline-primary btn-sm"
        type="button"
        @click="requestCurrentLocation"
      >
        📍 Use My Current Location
      </button>
    </div>

    <!-- MAP -->
    <div class="mb-3">
      <div
        class="rounded border"
        ref="propertyMap"
        style="height: 60vh;"
      ></div>
      <small class="text-muted">
        Drag the marker or click on the map to adjust the exact location.
      </small>
    </div>

    <!-- LOCATION DETAILS -->
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Latitude</label>
        <input type="number" v-model="form.latitude" class="form-control" readonly />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Longitude</label>
        <input type="number" v-model="form.longitude" class="form-control" readonly />
      </div>

      <div class="col-md-3 mb-3">
        <label class="form-label">Region</label>
        <input type="text" v-model="form.region_name" class="form-control" readonly />
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label">State</label>
        <input type="text" v-model="form.state_name" class="form-control" readonly />
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label">Town</label>
        <input type="text" v-model="form.town_name" class="form-control" readonly />
      </div>
      <div class="col-md-3 mb-3">
        <label class="form-label">Village</label>
        <input type="text" v-model="form.village_name" class="form-control" readonly />
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
                {{ this.form.region_name }},
                {{ this.form.state_name }},
                {{ this.form.town_name }},
                {{ this.form.village_name }}
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
    <div v-if="step !== maxStep" class="mt-3 d-flex justify-content-end">
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
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


export default {
  data() {
    return {
      showConfirmModal: false,
      frequecyText: "Monthly",
      map: null,
      marker: null,
      step: 1,
      maxStep: 5,
      location: null,
      amenities: [],
      facilities: [],
      property_types: [],
      customUtility: "",
      customAmenity: "",
      customFacility: "",
      bed_types: ["Single Bed", "Double Bed"],
      bath_types: ["Private", "Public"],
      form: {
        bath_type: [],
        bed_type: [],
        custom_utilities: [],
        custom_amenities: [],
        custom_facilities: [],
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
        single_bed: 0,
        double_bed: 0,
        bedrooms: 0,
        bathrooms: 0,
        private_bath: 0,
        public_bath: 0,
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
        region_name: "",
        state_name: "",
        town_name: "",
        village_name: "",

        // Adds not on migrations
        has_curfew: null,
        curfew_from: null,
        curfew_to: null,
        // Adds not on migrations
        
        property_facilities: [],
        property_amenities: [],
        rules: "",
        thumbnail: null,
        images: [],
      },
      previewThumbnail: null,
      previewPropertyImages: [],
      timeoutId: null,
      loading: false,

    };
  },
  components: {
    confirmModal
  },
  methods: {
    // For Custom Amenity
    addCustomAmenity() {
      if (!this.customAmenity.trim()) return;

      const value = this.customAmenity.trim();

      if (this.form.custom_amenities.includes(value)) return;

      this.form.custom_amenities.push(value);
      this.customAmenity = "";
    },
    removeCustomAmenity(index) {
      this.form.custom_amenities.splice(index, 1);
    },
    // For Custom Facilities
    addCustomFacility() {
      if (!this.customFacility.trim()) return;

      const value = this.customFacility.trim();

      if (this.form.custom_facilities.includes(value)) return;

      this.form.custom_facilities.push(value);
      this.customFacility = "";
    },
    removeCustomFacility(index) {
      this.form.custom_facilities.splice(index, 1);
    },
    // For Custom Utility
    addCustomUtility() {
      if (!this.customUtility.trim()) return;

      const value = this.customUtility.trim();

      // prevent duplicates
      if (this.form.custom_utilities.includes(value)) return;

      this.form.custom_utilities.push(value);
      this.customUtility = "";
    },
    removeCustomUtility(index) {
      this.form.custom_utilities.splice(index, 1);
    },
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

      if(this.step === 1) {
        // Title & Description
        if (!this.form.title || this.form.title.trim() === "") {
          alert("Title is required");
          return;
        }
        if (!this.form.description || this.form.description.trim() === "") {
          alert("Description is required");
          return;
        }
      }
      if(this.step === 2) {
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

        if(this.selectedPropertyName !== "Commercial Space"){

          const bath = this.form.bath_type
          const bed = this.form.bed_type
          if(bed.length <= 0){
            alert("Select atleast one bed type")
            return
          }
          if(bath.length <= 0){
            alert("Select atleast one bath type")
            return
          }

          
          const single_bed = this.form.single_bed
          const double_bed = this.form.double_bed
          const pub_bath = this.form.public_bath
          const priv_bath = this.form.private_bath

          if(single_bed <= 0 && double_bed <= 0){
            alert("Include atleast 1 bed")
            return
          }
          if(pub_bath <= 0 && priv_bath <= 0){
            alert("Include atleast 1 bed")
            return
          }
        }

        if(this.selectedPropertyName === "Commercial Space"){
          if(this.form.floor_area <= 0){
            alert("Atleast specify floor area greater than 0 for Commercial Spaces")
          }
          if(this.form.lot_area <= 0){
            alert("Atleast specify lot area greater than 0 for Commercial Spaces")
          }
        }

      }

      if(this.step === 3){
        if(this.form.price <= 0){
          alert("Price must be greater than 0")
          return
        }
      }

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
        if (!this.form.region_name || !this.form.state_name || !this.form.town_name || !this.form.village_name) {
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

    async setAddressFields() {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.loading = true;

      this.timeoutId = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${this.form.latitude}&lon=${this.form.longitude}&format=jsonv2`
          );
          const data = await res.json();

          this.form.region_name = data.address.region || "";
          this.form.state_name = data.address.state || "";
          this.form.town_name = data.address.city || data.address.town || "";
          this.form.village_name = data.address.village || data.address.suburb || "";
        } finally {
          this.loading = false;
        }
      }, 1000);
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
    requestCurrentLocation() {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      this.loading = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.loading = false;
          this.handleLocationSuccess(position);
        },
        () => {
          this.loading = false;
          // Silent fallback — no alert needed
          console.warn("User denied geolocation.");
        }
      );
    },

    // Code for Property Details
    async getAmenities(){
      try {
        const response = await getAmenities();
        this.amenities = response;
      } catch (error) {
        console.log(`Amenity Error`)
      }
    },
    async getFacilities(){
      try {
        const response = await getFacilities();
        this.facilities = response
      } catch (error) {
        console.log(`Facilities error`);
      }
    },
    async getPropertyTypes(){
      try {
        // console.log("getting tpyes")
        const response = await getPropertyTypes();
        // console.log("got the tpyes")
        this.property_types = response
      } catch (error) {
        console.log(`Property Type`)
      }
    }
  },
  mounted() {
    this.getAmenities();
    this.getFacilities();
    this.getPropertyTypes();

    // Default location: Manila
    const defaultLat = 14.5995;
    const defaultLng = 120.9842;

    this.form.latitude = defaultLat.toFixed(6);
    this.form.longitude = defaultLng.toFixed(6);

    // this.$nextTick(() => {
    //   this.setMap(defaultLat, defaultLng);
    // });
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
      if (newStep === 4) {
        this.$nextTick(() => {
          this.setMap(this.form.latitude, this.form.longitude);
        });
        this.setAddressFields()
      }
    },
    "form.latitude"() {
      this.setAddressFields();
    },
    "form.longitude"() {
      this.setAddressFields();
    },
    'form.bedrooms'(newVal) {
      if (newVal < 0) {
        this.form.bedrooms = 0
      }
    },
    'form.single_bed'(newVal) {
      if (newVal < 0) {
        this.form.single_bed = 0
      }
    },
    'form.double_bed'(newVal) {
      if (newVal < 0) {
        this.form.double_bed = 0
      }
    },
    'form.bathrooms'(newVal) {
      if (newVal < 0) {
        this.form.bathrooms = 0
      }
    },
    'form.private_bath'(newVal) {
      if (newVal < 0) {
        this.form.private_bath = 0
      }
    },
    'form.public_bath'(newVal) {
      if (newVal < 0) {
        this.form.public_bath = 0
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
      console.log(newVal)
      if(newVal === "quarterly"){
        this.frequecyText = "Quarterly"
      }
      if(newVal === "yearly"){
        this.frequecyText = "Yearly"
      }
      if(newVal === "monthly"){
        this.frequecyText = "Monthly"
      }
      if(newVal === "per_night"){
        this.frequecyText = "Per_Night"
      }
      if(newVal === "per_day"){
        this.frequecyText = "Per_Day"
      }
      if(newVal === "per_week"){
        this.frequecyText = "Weekly"
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
