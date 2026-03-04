<template>

  <div class="container py-4">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h4 class="fw-bold mb-0 text-primary">🏠 Edit Property Listing</h4>
      <span class="badge bg-dark rounded-pill px-3 shadow-sm">ID: {{ $route.params.id }}</span>
    </div>

    <div v-if="initialLoading" class="text-center py-5 my-5">
      <div class="spinner-grow text-primary" role="status"></div>
      <p class="mt-3 text-muted fw-bold">Retrieving property details...</p>
    </div>

    <template v-else>
      
      <div class="row mb-4 align-items-center">
        <div class="col-md-8">
          <div class="progress rounded-pill" style="height: 10px;">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                 :style="{ width: (step / maxStep) * 100 + '%' }"></div>
          </div>
          <p class="small text-muted mt-2 mb-0">Step {{ step }} of {{ maxStep }}: {{ stepTitle }}</p>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-outline-dark me-2 rounded-pill px-3" @click="prevStep" :disabled="step === 1">
            <i class="bi bi-chevron-left"></i> Back
          </button>
          <button class="btn btn-primary rounded-pill px-4 fw-bold" @click="nextStep" v-if="step < maxStep">
            Next <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div v-if="step === 1" class="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
        <div class="card-header bg-white py-3 border-bottom-0">
          <h6 class="mb-0 fw-bold">Step 1: Property Basics</h6>
          <small class="text-muted">Fill in the essential details about your listing.</small>
        </div>

        <div class="card-body p-3 p-md-4">
          <div class="mb-4">
            <label class="form-label fw-semibold small text-uppercase">Property Name <span class="text-muted">(Title)</span></label>
            <input 
              type="text" 
              v-model="form.title" 
              class="form-control form-control-lg shadow-none border-2" 
              placeholder="e.g. Modern 2-Bedroom Apartment"
              required 
            />
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold small text-uppercase">Description <span class="text-danger">*</span></label>
            <textarea 
              v-model="form.description" 
              class="form-control shadow-none border-2" 
              rows="4"
              placeholder="Describe the features, amenities, and neighborhood..."
              required
            ></textarea>
          </div>

          <div class="row g-4">
            <div class="col-12 col-md-6">
              <label class="form-label fw-semibold small text-uppercase">Main Thumbnail <span class="text-danger">*</span></label>
              <div class="upload-container position-relative">
                <input type="file" class="file-input-overlay" @change="handleThumbnail" accept="image/*" />
                <div class="upload-placeholder border-dashed rounded-3 p-4 text-center">
                  <div v-if="!previewThumbnail">
                    <i class="bi bi-cloud-arrow-up fs-2 text-primary"></i>
                    <p class="mb-0 small fw-medium">Click to upload main image</p>
                  </div>
                  <div v-else class="position-relative">
                    <img :src="previewThumbnail" alt="Preview" class="img-fluid rounded-2 shadow-sm" style="max-height: 180px;" />
                    <div class="upload-badge">Main Photo</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label fw-semibold small text-uppercase">Gallery Images</label>
              <div class="upload-container position-relative">
                <input type="file" class="file-input-overlay" multiple @change="handlePropertyImages" accept="image/*" />
                <div class="upload-placeholder border-dashed rounded-3 p-4 text-center h-100">
                  <i class="bi bi-images fs-2 text-muted"></i>
                  <p class="mb-0 small fw-medium">Add more photos</p>
                  
                  <div v-if="previewPropertyImages.length > 0" class="row g-2 mt-2">
                    <div v-for="(img, idx) in previewPropertyImages.slice(0, 4)" :key="idx" class="col-3">
                      <div class="ratio ratio-1x1">
                        <img :src="img" class="object-fit-cover rounded border" />
                      </div>
                    </div>
                    <div v-if="previewPropertyImages.length > 4" class="col-3">
                      <div class="ratio ratio-1x1 bg-dark rounded d-flex align-items-center justify-content-center text-white small">
                        +{{ previewPropertyImages.length - 4 }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <label class="form-label fw-semibold small text-uppercase">Business Permit</label>
            <div class="upload-container position-relative">
              <input type="file" class="file-input-overlay" @change="handleBusinessPermit" accept=".jpg,.jpeg,.png,.pdf,image/*,application/pdf" />
              <div class="upload-placeholder border-dashed rounded-3 p-4 text-center">
                <div v-if="!previewBusinessPermitName && !businessPermitUrl">
                  <i class="bi bi-file-earmark-check fs-2 text-primary"></i>
                  <p class="mb-0 small fw-medium">Upload or replace business permit (JPG, PNG, PDF)</p>
                </div>
                <div v-else>
                  <p v-if="previewBusinessPermitName" class="mb-1 small fw-semibold">{{ previewBusinessPermitName }}</p>
                  <a
                    v-else-if="businessPermitUrl"
                    :href="businessPermitUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="small fw-semibold text-decoration-none"
                    @click.stop
                  >
                    View current business permit
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="step === 2" class="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
         <div class="card-header bg-white py-3 border-bottom-0">
          <h6 class="mb-0 fw-bold">Step 2: Specifications & Amenities</h6>
        </div>

        <div class="card-body p-3 p-md-4">
          <div class="row g-4">
            
            <div class="col-12 col-lg-7">
              
              <div class="row g-3 mb-4">
                <div class="col-12 col-md-6">
                  <label class="form-label fw-bold small">Agreement Type <span class="text-danger">*</span></label>
                  <select v-model="form.agreement_type" class="form-select border-2">
                    <option value="rental">Rental</option>
                    <option disabled value="lease">Lease </option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label fw-bold small">Property Type</label>
                  <select v-model="form.property_type_id" class="form-select border-2">
                    <option disabled selected value="">Select Property Type</option>
                    <option v-for="type in property_types" :key="type.id" :value="type.id">
                      {{ type.type_name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="accordion border rounded-3" id="propertyDetailsAccordion">
                
                <div class="accordion-item border-0 border-bottom">
                  <h2 class="accordion-header">
                    <button class="accordion-button bg-light-subtle fw-bold shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseUtils">
                      Utilities
                    </button>
                  </h2>
                  <div id="collapseUtils" class="accordion-collapse collapse show" data-bs-parent="#propertyDetailsAccordion">
                    <div class="accordion-body">
                      <label class="form-label d-block small fw-bold">Utilities Included</label>
                      <div class="row">
                        <div v-for="utility in utilitiesList" :key="utility.value" class="col-6 col-md-4 mb-2">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" :id="'utility-' + utility.value" :value="utility.value" v-model="form.utilities" />
                            <label class="form-check-label small" :for="'utility-' + utility.value">{{ utility.label }}</label>
                          </div>
                        </div>
                      </div>
                      <hr class="my-3">
                      <label class="form-label d-block small fw-bold">Add Other Utilities</label>
                      <div class="d-flex gap-2 mb-3">
                        <input type="text" class="form-control" v-model="customUtility" placeholder="e.g. Solar Backup" @keyup.enter="addCustomUtility" />
                        <button type="button" class="btn btn-outline-primary" @click="addCustomUtility">Add</button>
                      </div>
                      <div v-if="form.custom_utilities.length">
                        <span v-for="(utility, index) in form.custom_utilities" :key="index" class="badge bg-secondary me-2 mb-2 p-2">
                          {{ utility }}
                          <button type="button" class="btn-close btn-close-white ms-2" @click="removeCustomUtility(index)"></button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="accordion-item border-0 border-bottom">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed bg-light-subtle fw-bold shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAmen">
                      Amenities
                    </button>
                  </h2>
                  <div id="collapseAmen" class="accordion-collapse collapse" data-bs-parent="#propertyDetailsAccordion">
                    <div class="accordion-body">
                      <div class="row">
                        <div v-for="amenity in amenities" :key="amenity.id" class="col-6 col-md-4 mb-2">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" :id="'amenity-' + amenity.id" :value="amenity.id" v-model="form.property_amenities" />
                            <label class="form-check-label small" :for="'amenity-' + amenity.id">{{ amenity.amenity_name }}</label>
                          </div>
                        </div>
                      </div>
                      <hr class="my-3">
                      <label class="form-label d-block small fw-bold">Add Other Amenities</label>
                      <div class="d-flex gap-2 mb-3">
                        <input type="text" class="form-control" v-model="customAmenity" placeholder="e.g. Swimming Pool" @keyup.enter="addCustomAmenity" />
                        <button type="button" class="btn btn-outline-primary" @click="addCustomAmenity">Add</button>
                      </div>
                      <div v-if="form.custom_amenities.length">
                        <span v-for="(amenity, index) in form.custom_amenities" :key="index" class="badge bg-secondary me-2 mb-2 p-2">
                          {{ amenity }}
                          <button type="button" class="btn-close btn-close-white ms-2" @click="removeCustomAmenity(index)"></button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="accordion-item border-0">
                  <h2 class="accordion-header">
                    <button class="accordion-button collapsed bg-light-subtle fw-bold shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFac">
                      Facilities
                    </button>
                  </h2>
                  <div id="collapseFac" class="accordion-collapse collapse" data-bs-parent="#propertyDetailsAccordion">
                    <div class="accordion-body">
                      <div class="row">
                        <div v-for="facility in facilities" :key="facility.id" class="col-6 col-md-4 mb-2">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" :id="'facility-' + facility.id" :value="facility.id" v-model="form.property_facilities" />
                            <label class="form-check-label small" :for="'facility-' + facility.id">{{ facility.facility_name }}</label>
                          </div>
                        </div>
                      </div>
                      <hr class="my-3">
                      <label class="form-label d-block small fw-bold">Add Other Facilities</label>
                      <div class="d-flex gap-2 mb-3">
                        <input type="text" class="form-control" v-model="customFacility" placeholder="e.g. Gym" @keyup.enter="addCustomFacility" />
                        <button type="button" class="btn btn-outline-primary" @click="addCustomFacility">Add</button>
                      </div>
                      <div v-if="form.custom_facilities.length">
                        <span v-for="(facility, index) in form.custom_facilities" :key="index" class="badge bg-secondary me-2 mb-2 p-2">
                          {{ facility }}
                          <button type="button" class="btn-close btn-close-white ms-2" @click="removeCustomFacility(index)"></button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-5">
              
              <div class="mb-4">
                <label class="form-label fw-bold small">Furnishing</label>
                <select v-model="form.furnishing" class="form-select border-2">
                  <option value="fully-furnished">Furnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>

              <div v-if="showBedrooms" class="card shadow-sm mb-3">
                <div class="card-header bg-light d-flex align-items-center">
                  <label class="mb-0 me-2 small fw-bold">Bedrooms:</label>
                  <input type="number" min="1" v-model="form.bedrooms" @input="fillMaxOccupants" class="form-control form-control-sm w-25" />
                </div>
                <div class="card-body">
                  <label class="form-label small fw-bold">Bed Types</label>
                  <div class="row g-2">
                    <div v-for="bed in bed_types" :key="bed" class="col-6 mb-2">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" :id="'bed-' + bed" :value="bed" v-model="form.bed_type" />
                        <label class="form-check-label small" :for="'bed-' + bed">{{ bed }}</label>
                      </div>
                    </div>
                  </div>
                  <div class="row g-2 mt-2">
                    <div v-if="form.bed_type.includes('Single Bed')" class="col-6">
                      <label class="small text-muted">Single Beds</label>
                      <input type="number" v-model="form.single_bed" @input="fillMaxOccupants" class="form-control form-control-sm" />
                    </div>
                    <div v-if="form.bed_type.includes('Double Bed')" class="col-6">
                      <label class="small text-muted">Double Beds</label>
                      <input type="number" v-model="form.double_bed" @input="fillMaxOccupants" class="form-control form-control-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="showBathrooms" class="card shadow-sm mb-3">
                <div class="card-header bg-light py-2"><label class="mb-0 fw-bold small">Bathrooms</label></div>
                <div class="card-body">
                  <div class="row g-2 mb-2">
                    <div v-for="bath in bath_types" :key="bath" class="col-6 mb-1">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" :id="'bath-' + bath" :value="bath" v-model="form.bath_type" />
                        <label class="form-check-label small" :for="'bath-' + bath">{{ bath }}</label>
                      </div>
                    </div>
                  </div>
                  <div class="row g-2 mt-2">
                    <div v-if="form.bath_type.includes('Private')" class="col-6">
                      <label class="small text-muted">Private</label>
                      <input type="number" v-model="form.private_bath" class="form-control form-control-sm" />
                    </div>
                    <div v-if="form.bath_type.includes('Public')" class="col-6">
                      <label class="small text-muted">Public</label>
                      <input type="number" v-model="form.public_bath" class="form-control form-control-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-light p-3 rounded-3 border mb-3">
                <div v-if="showBedSpace" class="mb-3">
                  <label class="form-label small fw-bold">Max Occupants (Bed Space)</label>
                  <input type="number" disabled v-model="form.bed_space" class="form-control" />
                  <small class="text-muted d-block mt-1">Total people on the property</small>
                </div>

                <div v-if="showSizeFiels" class="row g-2">
                  <div class="col-6">
                    <label class="form-label small fw-bold">Floor Area (sqm)</label>
                    <div class="input-group input-group-sm">
                      <input type="number" v-model="form.floor_area" class="form-control" />
                      <span class="input-group-text">m²</span>
                    </div>
                  </div>
                  <div class="col-6">
                    <label class="form-label small fw-bold">Lot Area (sqm)</label>
                    <div class="input-group input-group-sm">
                      <input type="number" v-model="form.lot_area" class="form-control" />
                      <span class="input-group-text">m²</span>
                    </div>
                  </div>
                  <div class="col-12 mt-3">
                    <label class="form-label small fw-bold">Maximum Occupants</label>
                    <input type="number" v-model="form.max_size" class="form-control" />
                  </div>
                </div>
              </div>

              <div class="card shadow-sm border-0 bg-white shadow-sm p-3">
                <h6 class="fw-bold mb-3">Other Rules</h6>
                <div class="mb-3">
                  <label class="form-label small">House Rules</label>
                  <textarea v-model="form.rules" class="form-control" rows="3" placeholder="e.g. No smoking..."></textarea>
                </div>

                <div class="mb-2">
                  <label class="form-label small fw-bold">Is there a curfew?</label>
                  <select v-model="form.has_curfew" class="form-select">
                    <option :value="false">No</option>
                    <option :value="true">Yes</option>
                  </select>
                </div>

                <div v-if="form.has_curfew" class="row g-2 animate__animated animate__fadeIn">
                  <div class="col-6">
                    <label class="small text-muted">From</label>
                    <input type="time" v-model="form.curfew_from" class="form-control" />
                  </div>
                  <div class="col-6">
                    <label class="small text-muted">To</label>
                    <input type="time" v-model="form.curfew_to" class="form-control" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div v-if="step === 3" class="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
         <div class="card-header bg-white py-3 border-bottom-0">
          <h6 class="mb-0 fw-bold text-primary">
            <i class="bi bi-tags-fill me-2"></i>
            {{ form.agreement_type === 'rental' ? 'Rental Pricing' : 'Lease Details' }}
          </h6>
          <small class="text-muted">Set your rates and contract terms.</small>
        </div>

        <div class="card-body p-3 p-md-4">
          
          <div v-if="form.agreement_type === 'rental'" class="animate__animated animate__fadeIn">
            <div class="row g-3">
              
              <div class="col-12 col-md-6">
                <label class="form-label fw-semibold small text-uppercase">Payment Frequency</label>
                <select v-model="form.payment_frequency" class="form-select border-2 shadow-none">
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                  <option value="per_night">Per Night</option>
                  <option value="per_day">Per Day</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label fw-semibold small text-uppercase">
                  Base Price <small class="text-primary fw-bold">({{ frequecyText }})</small>
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-primary text-white border-primary">₱</span>
                  <input
                    v-model="form.price"
                    type="number"
                    min="1"
                    class="form-control border-2 shadow-none"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div class="col-12">
                <div class="p-3 rounded-3 bg-light border">
                  <div class="row g-3">
                    <div class="col-12 col-md-6">
                      <label class="form-label fw-semibold small text-uppercase">Advance Payment</label>
                      <div class="input-group">
                        <span class="input-group-text border-2">₱</span>
                        <input
                          v-model="form.advance_payment_months"
                          type="number"
                          min="0"
                          class="form-control border-2 shadow-none"
                          placeholder="Amount"
                        />
                      </div>
                      <small class="text-muted mt-1 d-block">Initial payment amount</small>
                    </div>

                    <div class="col-12 col-md-6">
                      <label class="form-label fw-semibold small text-uppercase">Security Deposit</label>
                      <div class="input-group">
                        <span class="input-group-text border-2">₱</span>
                        <input
                          v-model="form.deposit_required"
                          type="number"
                          min="0"
                          class="form-control border-2 shadow-none"
                          placeholder="0.00"
                        />
                      </div>
                      <small class="text-muted mt-1 d-block">Refundable deposit amount</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="form.agreement_type === 'lease'" class="animate__animated animate__fadeIn">
            <div class="row g-4">
              
              <div class="col-12 col-md-4">
                <label class="form-label fw-semibold small text-uppercase">Lease Term</label>
                <div class="input-group">
                  <input
                    v-model="form.lease_term_months"
                    type="number"
                    min="1"
                    class="form-control border-2 shadow-none"
                  />
                  <span class="input-group-text border-2 bg-white text-muted">months</span>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label fw-semibold small text-uppercase">Renewal Option</label>
                <select v-model="form.renewal_option" class="form-select border-2 shadow-none">
                  <option value="none">None</option>
                  <option value="manual">Manual Renewal</option>
                  <option value="auto">Auto Renewal</option>
                </select>
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label fw-semibold small text-uppercase">Notice Period</label>
                <div class="input-group">
                  <input
                    v-model="form.notice_period"
                    type="number"
                    min="0"
                    class="form-control border-2 shadow-none"
                  />
                  <span class="input-group-text border-2 bg-white text-muted">days</span>
                </div>
                <small class="text-muted d-block mt-1">Days before move-out notice</small>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div v-if="step === 4" class="card border-0 shadow-sm overflow-hidden">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom-0">
          <div>
            <h6 class="mb-0 fw-bold text-primary">Step 4: Property Location</h6>
            <small v-if="isGeocoding" class="text-primary animate__animated animate__pulse animate__infinite">
              <span class="spinner-border spinner-border-sm me-1"></span> Fetching details...
            </small>
            <small v-else class="text-muted">Pin the exact location of your property.</small>
          </div>

          <button
            class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm"
            type="button"
            @click="requestCurrentLocation"
            :disabled="isGeocoding || isValidating || isSubmitting"
          >
            <i class="bi bi-geo-alt-fill me-1"></i> My Location
          </button>
        </div>

        <div class="card-body p-0 p-md-3">
          <div class="position-relative">
            <div
              class="property-map border-top border-bottom border-md rounded-md-3"
              ref="propertyMap"
              style="height: 45vh; min-height: 350px;"
            ></div>
            
            <div class="position-absolute bottom-0 start-0 w-100 p-2 pointer-events-none">
              <div class="badge bg-dark bg-opacity-75 text-wrap w-100 py-2 fw-normal">
                <i class="bi bi-info-circle me-1"></i> Drag marker or click map to set location
              </div>
            </div>
          </div>

          <div class="p-3">
            <div class="row g-2">
              <div class="col-6">
                <div class="form-floating mb-2">
                  <input type="number" v-model="form.latitude" class="form-control bg-light border-0 shadow-none" id="lat" placeholder="Lat" readonly />
                  <label for="lat" class="small text-muted">Latitude</label>
                </div>
              </div>
              <div class="col-6">
                <div class="form-floating mb-2">
                  <input type="number" v-model="form.longitude" class="form-control bg-light border-0 shadow-none" id="lng" placeholder="Lng" readonly />
                  <label for="lng" class="small text-muted">Longitude</label>
                </div>
              </div>

              <div class="col-12 mt-2">
                <div class="card bg-light border-0 rounded-3 p-2">
                  <div class="row g-2">
                    <div class="col-6 col-md-3">
                      <label class="form-label text-uppercase mb-0 smaller fw-bold text-muted">Region</label>
                      <input type="text" v-model="form.region_name" class="form-control-plaintext py-0 fw-semibold" readonly />
                    </div>
                    <div class="col-6 col-md-3">
                      <label class="form-label text-uppercase mb-0 smaller fw-bold text-muted">State</label>
                      <input type="text" v-model="form.state_name" class="form-control-plaintext py-0 fw-semibold" readonly />
                    </div>
                    <div class="col-6 col-md-3 border-top border-md-top-0 pt-2 pt-md-0">
                      <label class="form-label text-uppercase mb-0 smaller fw-bold text-muted">Town</label>
                      <input type="text" v-model="form.town_name" class="form-control-plaintext py-0 fw-semibold" readonly />
                    </div>
                    <div class="col-6 col-md-3 border-top border-md-top-0 pt-2 pt-md-0">
                      <label class="form-label text-uppercase mb-0 smaller fw-bold text-muted">Village</label>
                      <input type="text" v-model="form.village_name" class="form-control-plaintext py-0 fw-semibold" readonly />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="step === 5" class="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
        <div class="card-header bg-white py-3 border-0">
          <h6 class="mb-0 fw-bold text-success"><i class="bi bi-check2-circle me-2"></i>Final Confirmation</h6>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4" style="width: 35%;">Category</th>
                  <th class="pe-4">Current Selection</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="ps-4 small text-muted text-uppercase fw-bold">Property Title</td>
                  <td class="pe-4 fw-bold">{{ form.title }}</td>
                </tr>

                <tr>
                  <td class="ps-4 small text-muted text-uppercase fw-bold">Pricing</td>
                  <td class="pe-4">
                    <span class="text-success fw-bold">₱{{ form.price?.toLocaleString() }}</span>
                    <span class="text-muted small"> / {{ form.payment_frequency }}</span>
                  </td>
                </tr>

                <tr>
                  <td class="ps-4 small text-muted text-uppercase fw-bold">Space Details</td>
                  <td class="pe-4">
                    <div class="d-flex flex-wrap gap-2">
                      <span class="badge bg-primary-subtle text-primary border border-primary-subtle">
                        {{ form.bedrooms }} BR
                      </span>
                      <span class="badge bg-info-subtle text-info-emphasis border border-info-subtle">
                        {{ form.bed_space }} Max Occupants
                      </span>
                      <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
                        {{ form.furnishing?.replace('-', ' ') }}
                      </span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td class="ps-4 small text-muted text-uppercase fw-bold">Location Pin</td>
                  <td class="pe-4 small">
                    <i class="bi bi-geo-alt-fill text-danger"></i>
                    <strong>{{ form.region_name }}, {{ form.state_name }}</strong><br>
                    <span class="text-muted">{{ form.town_name }} {{ form.village_name }}</span>
                  </td>
                </tr>

                <tr>
                  <td class="ps-4 small text-muted text-uppercase fw-bold">Inclusions</td>
                  <td class="pe-4">
                    <div class="small">
                      <span v-if="form.property_amenities.length" class="me-2">
                        <i class="bi bi-check-circle text-success"></i> {{ form.property_amenities.length }} Amenities
                      </span>
                      <span v-if="form.property_facilities.length">
                        <i class="bi bi-check-circle text-success"></i> {{ form.property_facilities.length }} Facilities
                      </span>
                      <p v-if="!form.property_amenities.length && !form.property_facilities.length" class="text-muted mb-0 italic">
                        No specific inclusions selected
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td class="ps-4 small text-muted text-uppercase fw-bold">Media Update</td>
                  <td class="pe-4">
                    <span v-if="form.thumbnail" class="badge bg-warning text-dark me-2">
                      <i class="bi bi-image"></i> New Thumbnail
                    </span>
                    <span v-else class="text-muted small">Keeping existing thumbnail</span>
                    <br>
                    <span v-if="form.images.length" class="badge bg-warning text-dark mt-1">
                      <i class="bi bi-images"></i> {{ form.images.length }} New Gallery Photos
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-3">
            <div class="alert alert-warning border-0 bg-warning-subtle rounded-3 d-flex align-items-center mb-0 shadow-sm" role="alert">
              <i class="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
              <div class="small">
                <strong>Review carefully:</strong> Once you save these changes, they will be visible to all potential tenants immediately.
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer bg-white py-4 border-0 text-center">
          <button
            class="btn btn-success btn-lg rounded-pill px-5 fw-bold shadow"
            @click="validateForm"
            :disabled="isValidating || isSubmitting"
          >
            <template v-if="isValidating || isSubmitting">
              <span class="spinner-border spinner-border-sm me-2"></span>
              {{ submitButtonText }}
            </template>
            <template v-else>
              SAVE ALL CHANGES
            </template>
          </button>
          <small v-if="isSubmitting && submitStatusMessage" class="d-block text-muted mt-2">{{ submitStatusMessage }}</small>
        </div>
      </div>

    </template>

    <confirmModal
      :show="showConfirmModal"
      :loading="isSubmitting"
      title="Save Changes?"
      message="This will update your listing live on RentaHub. Continue?"
      confirm-text="Yes, Update"
      @confirm="submitForm"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import confirmModal from "@/components/confirmModal.vue";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAmenities, getFacilities, getPropertyTypes } from "@/api/property";
import { fetchPropertyData, updatePropertyData } from "@/api/Owner/property";


export default {
  name: "EditProperty",
  components: { Header, confirmModal },
  data() {
    return {
      initialLoading: true, 
      frequecyText: "Monthly",
      isValidating: false,
      isSubmitting: false,
      isGeocoding: false,
      submitStatusMessage: "",
      step: 1,
      maxStep: 5,
      showConfirmModal: false,
      map: null,
      marker: null,
      location: null,
      customUtility: "",
      customAmenity: "",
      customFacility: "",
      bed_types: ["Single Bed", "Double Bed"],
      bath_types: ["Private", "Public"],
      amenities: [],
      facilities: [],
      property_types: [],
      // FORM STRUCTURE (Same as addProperty)
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
        business_permit: null,
        images: [],
      },
      previewThumbnail: null,
      previewPropertyImages: [],
      businessPermitUrl: "",
      previewBusinessPermitName: "",
      timeoutId: null,
      maxField : false,
    };
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
    handleBusinessPermit(event) {
      const file = event.target.files[0];
      this.form.business_permit = file || null;
      this.previewBusinessPermitName = file ? file.name : "";
    },
    // UI Navigation
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
          return
        }
        if(this.form.lot_area <= 0){
          alert("Atleast specify lot area greater than 0 for Commercial Spaces")
          return
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
    closeConfirmModal(){
      if (this.isSubmitting) return;
      this.showConfirmModal = false;
    },
    // Leaflet Logic
    async setAddressFields() {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      if (!this.form.latitude || !this.form.longitude) return;
      this.isGeocoding = true;

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
        } catch (error) {
          console.warn("Failed to fetch reverse geocoded address", error);
        } finally {
          this.isGeocoding = false;
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

      this.isGeocoding = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.isGeocoding = false;
          this.handleLocationSuccess(position);
        },
        () => {
          this.isGeocoding = false;
          // Silent fallback — no alert needed
          console.warn("User denied geolocation.");
        }
      );
    },

    // Form Action Placeholders
    async validateForm() {
      this.isValidating = true;
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
        if (
          this.isGeocoding &&
          (!this.form.region_name || !this.form.state_name || !this.form.town_name || !this.form.village_name)
        ) {
          alert("Location details are still being fetched. Please wait a moment and submit again.");
          return;
        }

        // ✅ If all validations pass, proceed to submit

        this.showConfirmModal = true;
      } catch (error) {
        console.error("Validation Error:", error);
        alert("Something went wrong during validation.");
      } finally {
        this.isValidating = false;
      }
    },
    async submitForm() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      this.submitStatusMessage = "Preparing update payload...";

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
        this.submitStatusMessage = "Updating property details...";
        this.showConfirmModal = false;
        const id = this.$route.params.id;
        await updatePropertyData(id, fd);
        // console.log("Property added successfully:", response);
        sessionStorage.setItem("propertyUpdate", true);
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
      } finally {
        this.isSubmitting = false;
        this.submitStatusMessage = "";
      }
    },
    fillMaxOccupants(){
      if(this.form.bedrooms <= 0){
        return;
      }
      if(this.form.single_bed > 0 || this.form.double_bed > 0){
        let bedrooms = this.form.bedrooms;
        let single = this.form.single_bed;
        let double = this.form.double_bed * 2;
        let max = 0;
        if(this.form.single_bed > 0) {
          max += bedrooms * single;
          this.form.bed_space = max; 
        }
        if(this.form.double_bed > 0) {
          max += bedrooms * double;
          this.form.bed_space = max; 
        }
      }
    },

    async getPropertyData(){
      this.initialLoading =true;
      try {

        const id = this.$route.params.id;
        const response = await fetchPropertyData(id);
        const data = response.data.property;
        console.log(data)
        this.asignData(data);
      } catch (error) {
        console.error("Failed to fetch property details:", error);
        alert("Unable to load property details. Please try again.");
        this.$router.push("/properties");
      } finally{
        this.initialLoading = false;
      }
    },
    asignData(data){
        this.form.bed_type = [];
        this.form.bath_type = [];

        // Step 1
        // Basic Info
        this.form.title = data.title;
        this.form.description = data.description;
        // Images
        this.previewThumbnail = data.thumbnail_url; 
        this.previewPropertyImages = data.images;
        this.form.thumbnail = null; 
        this.form.business_permit = null;
        this.form.images = [];
        this.businessPermitUrl = data.business_permit_url || "";
        this.previewBusinessPermitName = "";

        // Step 2
        this.form.agreement_type = data.agreement_type
        this.form.property_type_id = data.property_type_id
        this.form.furnishing = data.furnishing
      
        this.form.utilities = data.utilities;
        this.form.custom_utilities = data.custom_utilities;
        
        this.form.property_amenities = data.amenities;
        this.form.custom_amenities = data.custom_amenities;

        this.form.property_facilities = data.facilities;
        this.form.custom_facilities = data.custom_facilities;

        if(this.showSizeFiels){
          this.form.floor_area = data.floor_area;
          this.form.lot_area = data.lot_area;
          this.form.max_size = data.max_size;
        } else {
          // Else if the property types is not Commercial Space
          this.form.bedrooms = data.bedrooms;
          // Assigning the data of Beds
          if(data.single_bed > 0){
            this.form.bed_type.push("Single Bed");
            this.form.single_bed = data.single_bed;
          }
          
          if(data.double_bed > 0){
            this.form.bed_type.push("Double Bed");
            this.form.double_bed = data.double_bed;
          }

          // For Baths
          if(data.public_bath > 0){
            this.form.public_bath = data.public_bath;
            this.form.bath_type.push("Public");
          }

          if(data.private_bath > 0){
            this.form.bath_type.push("Private");
            this.form.private_bath = data.private_bath;
          }

          this.form.bed_space = data.bed_space;
        }

        // Step 3
        // For Rental assign for now
        // Lease is not implemented yet

        this.form.price = data.price;
        this.form.payment_frequency = data.payment_frequency
        this.form.advance_payment_months = data.advance_payment_months;
        this.form.deposit_required = data.deposit_required;


        // Step 4
        // Location / Address

        this.form.latitude = data.latitude;
        this.form.longitude = data.longitude;
        this.form.region_name = data.region_name || "";
        this.form.state_name = data.state_name || "";
        this.form.town_name = data.town_name || "";
        this.form.village_name = data.village_name || "";
        


    }
  },
  mounted() {
    this.getAmenities();
    this.getFacilities();
    this.getPropertyTypes();
    this.getPropertyData();

  },
  watch: {step(newStep) {
      if (newStep === 4) {
        if (!this.form.latitude || !this.form.longitude) return;
        this.$nextTick(() => {
          this.setMap(this.form.latitude, this.form.longitude);
        });
        this.setAddressFields();
      }
    },
    "form.latitude"() {
      if (this.step === 4) {
        this.setAddressFields();
      }
    },
    "form.longitude"() {
      if (this.step === 4) {
        this.setAddressFields();
      }
    },
    // 'form.bed_type': {
    //   handler(newVal) {
    //     // If "Single Bed" is unchecked, reset its count to 0
    //     if (!newVal.includes('Single Bed')) {
    //       this.form.single_bed = 0;
    //     }
    //     // If "Double Bed" is unchecked, reset its count to 0
    //     if (!newVal.includes('Double Bed')) {
    //       this.form.double_bed = 0;
    //     }
    //     // Recalculate whenever the checkboxes change
    //     this.fillMaxOccupants();
    //   },
    //   deep: true
    // },
    // 'form.bath_type': {
    //   handler(newVal) {
    //     // If "Single Bed" is unchecked, reset its count to 0
    //     if (!newVal.includes('Private')) {
    //       this.form.private_bath = 0;
    //     }
    //     // If "Double Bed" is unchecked, reset its count to 0
    //     if (!newVal.includes('Public')) {
    //       this.form.public_bath = 0;
    //     }
    //   },
    //   deep: true
    // },
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
    },
  },
  computed: {
    stepTitle() {
      const titles = ["Basics", "Details", "Pricing", "Location", "Review"];
      return titles[this.step - 1];
    },
    submitButtonText() {
      if (this.isSubmitting) return "Saving changes...";
      return "Validating...";
    },
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
      const excludedTypes = ['commercial space', 'hotel'];

      // Return false if the selected type is in the excluded list
      return !excludedTypes.includes(this.selectedPropertyName.toLowerCase());
    },
    showBathrooms(){
      if (!this.selectedPropertyName) return false;
      return this.selectedPropertyName.toLowerCase() !== 'commercial space';
    },
    showSizeFiels(){
      if (!this.selectedPropertyName) return false;
      const includedTypes = ['commercial space', 'hotel'];
      return includedTypes.includes(this.selectedPropertyName.toLowerCase());
    },
  }
};
</script>

<style scoped>

/* Add custom styles here for better UX */

/* Custom styling for Step 4 */
.smaller {
  font-size: 0.65rem;
}

.form-control-plaintext {
  outline: none;
  font-size: 0.9rem;
}

.pointer-events-none {
  pointer-events: none;
}

@media (max-width: 768px) {
  /* On mobile, remove card padding to give more room to the map */
  .property-map {
    border-left: 0;
    border-right: 0;
  }
}

/* Floating labels adjustments for readonly */
.form-floating > .form-control:focus ~ label, 
.form-floating > .form-control:not(:placeholder-shown) ~ label {
  transform: scale(.85) translateY(-0.75rem) translateX(0.15rem);
}


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

/* Better touch experience for checkboxes on mobile */
.custom-check {
  background: #ffffff;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.custom-check:hover {
  border-color: #0d6efd;
  background-color: #f1f6ff;
}

.form-check-input:checked + .form-check-label {
  color: #0d6efd;
  font-weight: bold;
}

/* Accordion Styling */
.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
  color: #0d6efd;
}

.accordion-button::after {
  background-size: 1rem;
}

/* Scrollable container if list is too long */
.accordion-body {
  max-height: 300px;
  overflow-y: auto;
}

.rounded-4 { border-radius: 1rem !important; }
.animate-fade-in { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
