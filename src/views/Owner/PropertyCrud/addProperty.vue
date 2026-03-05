<template>
  <div class="property-wizard-shell">
    <div class="wizard-page-header mb-3">
      <h4 class="mb-1">Add Property</h4>
      <p class="mb-0 text-muted small">Create a listing with complete details and documents.</p>
    </div>

    <div v-if="subscriptionState?.is_expiring_soon" class="alert alert-warning py-2 px-3 mt-2 mb-3">
      {{ subscriptionState.message || `Your subscription will expire in ${subscriptionState.days_left} day(s).` }}
    </div>
    <div v-if="ownerVerificationStatus !== 'verified'" class="alert alert-info py-2 px-3 mt-2 mb-3">
      <strong>Owner verification:</strong> {{ ownerVerificationMessage }}
    </div>

    <!-- Message about required fields -->
    <div class="mb-3 text-muted">
      <small><span class="text-danger">*</span> denotes required fields</small>
    </div>

    <div v-if="validationSummary.length" ref="validationSummary" class="wizard-validation-summary mb-3">
      <div class="alert alert-danger border-0 shadow-sm mb-0 py-2">
        <p class="mb-1 fw-semibold small">Please fix {{ validationSummary.length }} issue(s) before continuing.</p>
        <ul class="mb-0 ps-3 small">
          <li v-for="(item, idx) in validationSummary" :key="`validation-${idx}`">{{ item }}</li>
        </ul>
      </div>
    </div>

    <div class="wizard-step-rail mb-3">
      <div
        v-for="s in stepsMeta"
        :key="`step-meta-${s.step}`"
        class="wizard-step-pill"
        :class="stepStatusClass(s.step)"
      >
        <span class="wizard-step-index">{{ s.step }}</span>
        <div class="wizard-step-copy">
          <p class="mb-0 fw-semibold small">{{ s.label }}</p>
          <small class="text-muted">{{ stepStatusText(s.step) }}</small>
        </div>
      </div>
    </div>

    <!-- Step Navigation -->
    <div class="mb-3 wizard-nav-row">
      <button class="btn btn-outline-dark me-2 rounded-pill px-3" @click="prevStep" :disabled="step === 1">
        <i class="bi bi-arrow-left"></i> Previous
      </button>
    </div>

    <!-- Step 1: Basic Info -->
    <div v-if="step === 1" class="card border-0 shadow-sm overflow-hidden">
      <div class="card-header bg-white py-3 border-bottom-0">
        <h6 class="mb-0 fw-bold">Step 1: Property Basics</h6>
        <small class="text-muted">Fill in the essential details about your listing.</small>
      </div>

      <div class="card-body p-3 p-md-4">
        <div class="step1-checklist mb-4">
          <p class="mb-2 fw-semibold small text-uppercase text-muted">Step 1 Checklist</p>
          <div class="d-flex flex-wrap gap-2">
            <button
              v-for="item in step1Checklist"
              :key="`step1-check-${item.key}`"
              type="button"
              class="step1-chip"
              :class="`is-${item.status}`"
              @click="scrollToStep1Anchor(item.anchor)"
            >
              <span class="dot"></span>
              {{ item.label }}: {{ item.statusLabel }}
            </button>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-12 col-lg-6">
            <div class="step1-pane h-100">
              <div ref="step1TitleField" class="mb-4">
                <label class="form-label fw-semibold small text-uppercase">Property Name <span class="text-muted">(Title)</span></label>
                <input 
                  type="text" 
                  v-model="form.title" 
                  class="form-control form-control-lg shadow-none border-2" 
                  placeholder="e.g. Modern 2-Bedroom Apartment"
                  required 
                />
                <small v-if="errors.title" class="field-error-text">{{ errors.title }}</small>
              </div>

              <div ref="step1DescriptionField" class="mb-0">
                <label class="form-label fw-semibold small text-uppercase">Description <span class="text-danger">*</span></label>
                <textarea 
                  v-model="form.description" 
                  class="form-control shadow-none border-2" 
                  rows="8"
                  placeholder="Describe the features, amenities, and neighborhood..."
                  required
                ></textarea>
                <small class="text-muted d-block mt-2">Tip: include nearby landmarks, transport access, and house rules.</small>
                <small v-if="errors.description" class="field-error-text">{{ errors.description }}</small>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6">
            <div class="step1-pane h-100 d-flex flex-column gap-3">
              <div ref="step1ThumbnailField" class="upload-card">
                <label class="form-label fw-semibold small text-uppercase">Main Thumbnail <span class="text-danger">*</span></label>
                <div class="upload-container position-relative">
                  <input type="file" class="file-input-overlay" @change="handleThumbnail" accept="image/*" />
                  <div class="upload-placeholder border-dashed rounded-3 p-4 text-center">
                    <div v-if="!previewThumbnail">
                      <i class="bi bi-cloud-arrow-up fs-2 text-primary"></i>
                      <p class="mb-0 small fw-medium">Upload main cover image</p>
                    </div>
                    <div v-else class="position-relative">
                      <img :src="previewThumbnail" alt="Preview" class="img-fluid rounded-2 shadow-sm" style="max-height: 170px;" />
                      <div class="upload-badge">Main Photo</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="upload-card">
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

              <div ref="step1PermitField" class="upload-card">
                <label class="form-label fw-semibold small text-uppercase">Business Permit <span class="text-danger">*</span></label>
                <div class="upload-container position-relative">
                  <input type="file" class="file-input-overlay" @change="handleBusinessPermit" accept=".jpg,.jpeg,.png,.pdf,image/*,application/pdf" />
                  <div class="upload-placeholder border-dashed rounded-3 p-4 text-center">
                    <div v-if="!previewBusinessPermitName">
                      <i class="bi bi-file-earmark-check fs-2 text-primary"></i>
                      <p class="mb-0 small fw-medium">Upload business permit (JPG, PNG, or PDF)</p>
                    </div>
                    <div v-else>
                      <p class="mb-2 small fw-semibold">{{ previewBusinessPermitName }}</p>
                      <img
                        v-if="previewBusinessPermitType === 'image' && previewBusinessPermitUrl"
                        :src="previewBusinessPermitUrl"
                        alt="Business permit preview"
                        class="img-fluid rounded border shadow-sm"
                        style="max-height: 180px;"
                      />
                      <iframe
                        v-else-if="previewBusinessPermitType === 'pdf' && previewBusinessPermitUrl"
                        :src="previewBusinessPermitUrl"
                        title="Business permit PDF preview"
                        class="w-100 rounded border bg-white"
                        style="height: 180px;"
                      ></iframe>
                      <p v-else class="mb-0 text-muted small">Preview unavailable for this file type.</p>
                    </div>
                  </div>
                </div>
                <small class="d-block text-muted mt-1" style="font-size:0.75rem;">Accepted: JPG, PNG, PDF (max 5MB)</small>
                <small v-if="errors.business_permit" class="field-error-text">{{ errors.business_permit }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Property Details -->
    <div v-if="step === 2" class="card border-0 shadow-sm overflow-hidden">
      <div class="card-header bg-white py-3 border-bottom-0">
        <h6 class="mb-0 fw-bold">Step 2: Specifications & Amenities</h6>
      </div>

      <div class="card-body p-3 p-md-4">
        <div class="step2-checklist mb-4">
          <p class="mb-2 fw-semibold small text-uppercase text-muted">Step 2 Checklist</p>
          <div class="d-flex flex-wrap gap-2">
            <button
              v-for="item in step2Checklist"
              :key="`step2-check-${item.key}`"
              type="button"
              class="step2-chip"
              :class="`is-${item.status}`"
              @click="scrollToStep2Anchor(item.anchor)"
            >
              <span class="dot"></span>
              {{ item.label }}: {{ item.statusLabel }}
            </button>
          </div>
        </div>
        <div class="row g-4">
          
          <div class="col-12 col-lg-7">
            
            <div ref="step2AgreementField" class="step2-pane mb-3">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label fw-bold small">Agreement Type <span class="text-danger">*</span></label>
                <select v-model="form.agreement_type" class="form-select border-2">
                  <option value="rental">Rental</option>
                  <option disabled value="lease">Lease </option>
                </select>
                <small v-if="errors.agreement_type" class="field-error-text">{{ errors.agreement_type }}</small>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label fw-bold small">Property Type</label>
                <select v-model="form.property_type_id" class="form-select border-2">
                  <option disabled selected value="">Select Property Type</option>
                  <option v-for="type in property_types" :key="type.id" :value="type.id">
                    {{ type.type_name }}
                  </option>
                </select>
                <small v-if="errors.property_type_id" class="field-error-text">{{ errors.property_type_id }}</small>
              </div>
            </div>
            </div>

            <div ref="step2FeaturesAccordion" class="accordion step2-accordion border rounded-3" id="propertyDetailsAccordion">
              
              <div class="accordion-item border-0 border-bottom">
                <h2 class="accordion-header">
                  <button class="accordion-button bg-light-subtle fw-bold shadow-none d-flex justify-content-between" type="button" data-bs-toggle="collapse" data-bs-target="#collapseUtils">
                    <span>Utilities</span>
                    <span class="step2-count-badge">{{ form.utilities.length + form.custom_utilities.length }}</span>
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
                  <button class="accordion-button collapsed bg-light-subtle fw-bold shadow-none d-flex justify-content-between" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAmen">
                    <span>Amenities</span>
                    <span class="step2-count-badge">{{ form.property_amenities.length + form.custom_amenities.length }}</span>
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
                  <button class="accordion-button collapsed bg-light-subtle fw-bold shadow-none d-flex justify-content-between" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFac">
                    <span>Facilities</span>
                    <span class="step2-count-badge">{{ form.property_facilities.length + form.custom_facilities.length }}</span>
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
            
            <div ref="step2SpecsField" class="step2-pane d-flex flex-column gap-3">
            <div class="step2-subcard">
              <label class="form-label fw-bold small">Furnishing</label>
              <select v-model="form.furnishing" class="form-select border-2">
                <option value="fully-furnished">Furnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>

            <div v-if="showBedrooms" class="step2-subcard">
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
                <small v-if="errors.bed_type" class="field-error-text">{{ errors.bed_type }}</small>
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
                <small v-if="errors.single_bed" class="field-error-text">{{ errors.single_bed }}</small>
              </div>
            </div>

            <div v-if="showBathrooms" class="step2-subcard">
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
                <small v-if="errors.bath_type" class="field-error-text">{{ errors.bath_type }}</small>
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
                <small v-if="errors.public_bath" class="field-error-text">{{ errors.public_bath }}</small>
              </div>
            </div>

            <div class="step2-subcard">
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
                    <span class="input-group-text">m2</span>
                  </div>
                  <small v-if="errors.floor_area" class="field-error-text">{{ errors.floor_area }}</small>
                </div>
                <div class="col-6">
                  <label class="form-label small fw-bold">Lot Area (sqm)</label>
                  <div class="input-group input-group-sm">
                    <input type="number" v-model="form.lot_area" class="form-control" />
                    <span class="input-group-text">m2</span>
                  </div>
                  <small v-if="errors.lot_area" class="field-error-text">{{ errors.lot_area }}</small>
                </div>
                <div class="col-12 mt-3">
                  <label class="form-label small fw-bold">Maximum Occupants</label>
                  <input type="number" v-model="form.max_size" class="form-control" />
                </div>
              </div>
            </div>
            </div>

            <div ref="step2RulesField" class="step2-pane mt-3">
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

    <!-- Step 3: Price -->
    <div v-if="step === 3" class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3 border-bottom-0">
        <h6 class="mb-0 fw-bold text-primary">
          <i class="bi bi-tags-fill me-2"></i>
          {{ form.agreement_type === 'rental' ? 'Rental Pricing' : 'Lease Details' }}
        </h6>
        <small class="text-muted">Set clear pricing and contract terms before publishing.</small>
      </div>

      <div class="card-body p-3 p-md-4">
        <div class="step3-checklist mb-3">
          <div class="d-flex flex-wrap gap-2">
            <button
              v-for="item in step3Checklist"
              :key="item.key"
              type="button"
              class="btn step3-chip"
              :class="`is-${item.status}`"
              @click="scrollToStep3Anchor(item.anchor)"
            >
              <span class="dot"></span>
              <span>{{ item.label }}</span>
              <small class="text-muted">{{ item.statusLabel }}</small>
            </button>
          </div>
        </div>

        <div ref="step3CorePricingField" class="step3-pane mb-3">
          <h6 class="fw-bold mb-1">Core Pricing</h6>
          <small class="text-muted d-block mb-3">Set how renters will be billed and your base rate.</small>
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
              <small v-if="errors.payment_frequency" class="field-error-text">{{ errors.payment_frequency }}</small>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label fw-semibold small text-uppercase">
                Base Price <small class="text-primary fw-bold">({{ frequecyText }})</small>
              </label>
              <div class="input-group">
                <span class="input-group-text bg-primary text-white border-primary">PHP</span>
                <input
                  v-model="form.price"
                  type="number"
                  min="1"
                  class="form-control border-2 shadow-none"
                  placeholder="0.00"
                  required
                />
              </div>
              <small v-if="errors.price" class="field-error-text">{{ errors.price }}</small>
            </div>
          </div>
        </div>

        <div
          v-if="form.agreement_type === 'rental'"
          ref="step3RentalTermsField"
          class="step3-pane animate__animated animate__fadeIn"
        >
          <h6 class="fw-bold mb-1">Rental Terms</h6>
          <small class="text-muted d-block mb-3">Define upfront payment expectations for tenants.</small>
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label fw-semibold small text-uppercase">Advance Payment</label>
              <div class="input-group">
                <span class="input-group-text border-2">PHP</span>
                <input
                  v-model="form.advance_payment_months"
                  type="number"
                  min="0"
                  class="form-control border-2 shadow-none"
                  placeholder="Amount"
                />
              </div>
              <small class="text-muted d-block mt-1">Initial payment amount</small>
              <small v-if="errors.advance_payment_months" class="field-error-text">{{ errors.advance_payment_months }}</small>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label fw-semibold small text-uppercase">Security Deposit</label>
              <div class="input-group">
                <span class="input-group-text border-2">PHP</span>
                <input
                  v-model="form.deposit_required"
                  type="number"
                  min="0"
                  class="form-control border-2 shadow-none"
                  placeholder="0.00"
                />
              </div>
              <small class="text-muted d-block mt-1">Refundable deposit amount</small>
              <small v-if="errors.deposit_required" class="field-error-text">{{ errors.deposit_required }}</small>
            </div>
          </div>
        </div>

        <div
          v-if="form.agreement_type === 'lease'"
          ref="step3LeaseTermsField"
          class="step3-pane animate__animated animate__fadeIn"
        >
          <h6 class="fw-bold mb-1">Lease Terms</h6>
          <small class="text-muted d-block mb-3">Provide contract duration and notice details.</small>
          <div class="row g-3">
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
              <small v-if="errors.lease_term_months" class="field-error-text">{{ errors.lease_term_months }}</small>
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label fw-semibold small text-uppercase">Renewal Option</label>
              <select v-model="form.renewal_option" class="form-select border-2 shadow-none">
                <option value="none">None</option>
                <option value="manual">Manual Renewal</option>
                <option value="auto">Auto Renewal</option>
              </select>
              <small v-if="errors.renewal_option" class="field-error-text">{{ errors.renewal_option }}</small>
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
              <small v-if="errors.notice_period" class="field-error-text">{{ errors.notice_period }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 4: Location Details -->
    <div v-if="step === 4" class="card border-0 shadow-sm overflow-hidden">
      <div class="card-header bg-white py-3 border-bottom-0">
        <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <div>
            <h6 class="mb-0 fw-bold text-primary">Step 4: Property Location</h6>
            <small class="text-muted">Pin your exact map location and confirm address details.</small>
          </div>
          <button
            class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm"
            type="button"
            @click="requestCurrentLocation"
            :disabled="isGeocoding || isSubmitting || isCheckingAccess"
          >
            <i class="bi bi-geo-alt-fill me-1"></i> My Location
          </button>
        </div>

        <div class="step4-checklist mt-3">
          <div class="d-flex flex-wrap gap-2">
            <button
              v-for="item in step4Checklist"
              :key="item.key"
              type="button"
              class="btn step4-chip"
              :class="`is-${item.status}`"
              @click="scrollToStep4Anchor(item.anchor)"
            >
              <span class="dot"></span>
              <span>{{ item.label }}</span>
              <small class="text-muted">{{ item.statusLabel }}</small>
            </button>
          </div>
        </div>
      </div>

      <div class="card-body p-3">
        <div ref="step4MapField" class="step4-map-shell mb-3">
          <div class="step-status-badge mb-2">
            <span v-if="isGeocoding">
              <span class="spinner-border spinner-border-sm me-1"></span>
              Resolving address...
            </span>
            <span v-else>
              <i class="bi bi-info-circle me-1"></i>
              Drag marker or click map to set location
            </span>
          </div>
          <div
            class="property-map rounded-3"
            ref="propertyMap"
            style="height: 45vh; min-height: 350px;"
          ></div>
        </div>

        <div ref="step4CoordsField" class="step4-pane mb-3">
          <h6 class="fw-bold mb-2">Coordinates</h6>
          <div class="row g-2">
            <div class="col-6">
              <div class="form-floating mb-0">
                <input type="number" v-model="form.latitude" class="form-control bg-light border-0 shadow-none" id="lat" placeholder="Lat" readonly />
                <label for="lat" class="small text-muted">Latitude</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-0">
                <input type="number" v-model="form.longitude" class="form-control bg-light border-0 shadow-none" id="lng" placeholder="Lng" readonly />
                <label for="lng" class="small text-muted">Longitude</label>
              </div>
            </div>
          </div>
          <small v-if="errors.latitude || errors.location" class="field-error-text">{{ errors.latitude || errors.location }}</small>
        </div>

        <div ref="step4AddressField" class="step4-address-card">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
            <h6 class="fw-bold mb-0">Address Summary</h6>
            <small class="text-muted">
              <span v-if="isGeocoding">Address lookup in progress...</span>
              <span v-else-if="form.region_name || form.state_name || form.town_name || form.village_name">Address resolved</span>
              <span v-else>Address details are still missing</span>
            </small>
          </div>
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

      <!-- Final Step: Review and Submit -->
    <div v-if="step === 5" class="card border-0 shadow-sm animate__animated animate__fadeIn">
      <div class="card-header bg-white py-3">
        <h6 class="mb-0 fw-bold text-success">
          <i class="bi bi-clipboard-check-fill me-2"></i> Review Your Property Details
        </h6>
        <small class="text-muted">Double-check every section before submission.</small>
      </div>

      <div class="card-body p-3 p-md-4">
        <div class="step5-grid">
          <section class="step5-card">
            <div class="step5-card-head">
              <div>
                <h6 class="mb-1 fw-bold">Basics</h6>
                <small class="text-muted">Title, summary, agreement, and property type.</small>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="step5-status-pill" :class="`is-${reviewStatus.basics.status}`">{{ reviewStatus.basics.label }}</span>
                <button type="button" class="btn btn-sm step5-edit-chip" @click="step = 1">Edit Basics</button>
              </div>
            </div>
            <div class="step5-kv">
              <div class="step5-row">
                <span>Title</span>
                <strong>{{ form.title || "Not set" }}</strong>
              </div>
              <div class="step5-row align-items-start">
                <span>Description</span>
                <p class="mb-0 step5-truncate">{{ form.description || "No description added." }}</p>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle text-capitalize">{{ form.agreement_type || "N/A" }}</span>
                <span class="badge bg-light text-dark border">{{ property_types.find(p => p.id === form.property_type_id)?.type_name || "Property type missing" }}</span>
              </div>
            </div>
          </section>

          <section class="step5-card">
            <div class="step5-card-head">
              <div>
                <h6 class="mb-1 fw-bold">Pricing</h6>
                <small class="text-muted">Base price and agreement-specific terms.</small>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="step5-status-pill" :class="`is-${reviewStatus.pricing.status}`">{{ reviewStatus.pricing.label }}</span>
                <button type="button" class="btn btn-sm step5-edit-chip" @click="step = 3">Edit Pricing</button>
              </div>
            </div>
            <div class="step5-kv">
              <div class="step5-row">
                <span>Base Price</span>
                <strong>PHP {{ Number(form.price || 0).toLocaleString() }} <small class="text-muted fw-normal">/ {{ form.payment_frequency || "N/A" }}</small></strong>
              </div>
              <template v-if="form.agreement_type === 'rental'">
                <div class="step5-row">
                  <span>Advance Payment</span>
                  <strong>PHP {{ Number(form.advance_payment_months || 0).toLocaleString() }}</strong>
                </div>
                <div class="step5-row">
                  <span>Deposit</span>
                  <strong>PHP {{ Number(form.deposit_required || 0).toLocaleString() }}</strong>
                </div>
              </template>
              <template v-else>
                <div class="step5-row">
                  <span>Lease Term</span>
                  <strong>{{ form.lease_term_months || 0 }} month(s)</strong>
                </div>
                <div class="step5-row">
                  <span>Renewal</span>
                  <strong class="text-capitalize">{{ form.renewal_option || "none" }}</strong>
                </div>
                <div class="step5-row">
                  <span>Notice Period</span>
                  <strong>{{ form.notice_period || 0 }} day(s)</strong>
                </div>
              </template>
            </div>
          </section>

          <section class="step5-card">
            <div class="step5-card-head">
              <div>
                <h6 class="mb-1 fw-bold">Property Specs</h6>
                <small class="text-muted">Features, setup, and house rules.</small>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="step5-status-pill" :class="`is-${reviewStatus.details.status}`">{{ reviewStatus.details.label }}</span>
                <button type="button" class="btn btn-sm step5-edit-chip" @click="step = 2">Edit Details</button>
              </div>
            </div>
            <div class="step5-kv">
              <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-light text-dark border text-capitalize">{{ form.furnishing?.replace("-", " ") || "N/A" }}</span>
                <span class="badge bg-light text-dark border">{{ form.bedrooms || 0 }} BR</span>
                <span class="badge bg-light text-dark border">{{ form.bed_space || 0 }} Max Occupants</span>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <span class="badge rounded-pill bg-light text-dark border">{{ form.utilities?.length || 0 }} Utilities</span>
                <span class="badge rounded-pill bg-light text-dark border">{{ form.property_amenities?.length || 0 }} Amenities</span>
                <span class="badge rounded-pill bg-light text-dark border">{{ form.property_facilities?.length || 0 }} Facilities</span>
              </div>
              <div class="step5-row align-items-start">
                <span>Rules</span>
                <p class="mb-0">{{ form.rules || "No specific rules set." }}</p>
              </div>
            </div>
          </section>

          <section class="step5-card">
            <div class="step5-card-head">
              <div>
                <h6 class="mb-1 fw-bold">Location</h6>
                <small class="text-muted">Address and coordinate resolution.</small>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="step5-status-pill" :class="`is-${reviewStatus.location.status}`">{{ reviewStatus.location.label }}</span>
                <button type="button" class="btn btn-sm step5-edit-chip" @click="step = 4">Edit Location</button>
              </div>
            </div>
            <div class="step5-kv">
              <div class="step5-row">
                <span>Address</span>
                <strong>{{ form.village_name || "-" }}, {{ form.town_name || "-" }}, {{ form.state_name || "-" }}, {{ form.region_name || "-" }}</strong>
              </div>
              <div class="step5-row">
                <span>Coordinates</span>
                <strong>{{ form.latitude || "-" }} , {{ form.longitude || "-" }}</strong>
              </div>
            </div>
          </section>

          <section class="step5-card">
            <div class="step5-card-head">
              <div>
                <h6 class="mb-1 fw-bold">Media & Documents</h6>
                <small class="text-muted">Thumbnail, gallery photos, and permit status.</small>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="step5-status-pill" :class="`is-${reviewStatus.media.status}`">{{ reviewStatus.media.label }}</span>
                <button type="button" class="btn btn-sm step5-edit-chip" @click="step = 1">Edit Basics</button>
              </div>
            </div>
            <div class="step5-kv">
              <div class="step5-media-strip">
                <div class="step5-thumb">
                  <img v-if="previewThumbnail" :src="previewThumbnail" alt="Thumbnail preview" />
                  <span v-else class="text-muted small">No thumbnail</span>
                </div>
                <div class="d-flex flex-wrap gap-2 align-items-center">
                  <div v-for="(img, idx) in previewPropertyImages.slice(0, 3)" :key="`review-gallery-${idx}`" class="step5-gallery-thumb">
                    <img :src="img" alt="Gallery preview" />
                  </div>
                  <span v-if="previewPropertyImages.length > 3" class="badge bg-light text-dark border">+{{ previewPropertyImages.length - 3 }} more</span>
                </div>
              </div>
              <div class="step5-row">
                <span>Business Permit</span>
                <strong>{{ form.business_permit ? "Uploaded" : "Missing" }}</strong>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div class="card-footer bg-white py-3 border-top-0 step5-footer-bar">
        <div class="d-grid gap-2">
          <button
            class="btn btn-success btn-lg shadow-sm py-3 fw-bold"
            @click="validateForm"
            :disabled="isValidating || isSubmitting || isCheckingAccess"
          >
            <template v-if="isValidating || isSubmitting || isCheckingAccess">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ submitButtonText }}
            </template>
            <template v-else>
              <i class="bi bi-cloud-arrow-up-fill me-2"></i> SUBMIT PROPERTY
            </template>
          </button>
          <small v-if="isSubmitting && submitStatusMessage" class="text-muted text-center">{{ submitStatusMessage }}</small>
          <button class="btn btn-link btn-sm text-muted text-decoration-none" @click="step = 4">
            Go back and edit
          </button>
        </div>
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
      :loading="isSubmitting || isCheckingAccess"
      title="Confirm Property Info"
      message="Are you sure all the information you entered is correct?"
      confirm-text="Yes, I'm Sure"
      @confirm="submitForm"
      @cancel="closeConfirmModal"
    />
  </div>
  
</template>

<script>
import { createProperty, getAmenities, getFacilities, getPropertyTypes } from "@/api/property";
import { getOwnerSubscriptionStatus } from "@/api/subscription";
import { useUserInfo } from "@/store/userInfo";
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
        business_permit: null,
        images: [],
      },
      previewThumbnail: null,
      previewPropertyImages: [],
      previewBusinessPermitName: "",
      previewBusinessPermitUrl: "",
      previewBusinessPermitType: "",
      timeoutId: null,
      isValidating: false,
      isSubmitting: false,
      isGeocoding: false,
      isCheckingAccess: false,
      submitStatusMessage: "",
      maxField : false,
      subscriptionState: null,
      errors: {},
      validationSummary: [],
      stepsMeta: [
        { step: 1, label: "Basics" },
        { step: 2, label: "Details" },
        { step: 3, label: "Pricing" },
        { step: 4, label: "Location" },
        { step: 5, label: "Review" },
      ],
    };
  },
  components: {
    confirmModal
  },
  methods: {
    async ensureOwnerCanManageProperties(options = { redirectIfBlocked: true }) {
      this.isCheckingAccess = true;
      try {
        const subscription = await getOwnerSubscriptionStatus();
        this.subscriptionState = subscription;

        if (!subscription?.can_manage_properties) {
          alert(subscription?.message || "Subscription expired or inactive. Renew to manage properties.");
          if (options.redirectIfBlocked) {
            this.$router.push("/overview");
          }
          return false;
        }

        return true;
      } catch (error) {
        alert("Unable to verify subscription status. Please try again.");
        if (options.redirectIfBlocked) {
          this.$router.push("/overview");
        }
        return false;
      } finally {
        this.isCheckingAccess = false;
      }
    },
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
    handleBusinessPermit(event) {
      const file = event.target.files[0];
      if (this.previewBusinessPermitUrl) {
        URL.revokeObjectURL(this.previewBusinessPermitUrl);
      }
      this.form.business_permit = file || null;
      this.previewBusinessPermitName = file ? file.name : "";
      this.previewBusinessPermitUrl = file ? URL.createObjectURL(file) : "";
      this.previewBusinessPermitType = file
        ? file.type.startsWith("image/")
          ? "image"
          : file.type === "application/pdf"
            ? "pdf"
            : ""
        : "";
    },

    resetValidation() {
      this.errors = {};
      this.validationSummary = [];
    },
    pushValidation(field, message) {
      if (!this.errors[field]) {
        this.errors[field] = message;
      }
      if (!this.validationSummary.includes(message)) {
        this.validationSummary.push(message);
      }
    },
    scrollToValidationSummary() {
      this.$nextTick(() => {
        const target = this.$refs.validationSummary;
        if (target && typeof target.scrollIntoView === "function") {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    },
    scrollToStep1Anchor(anchorRef) {
      this.$nextTick(() => {
        const target = this.$refs[anchorRef];
        if (target && typeof target.scrollIntoView === "function") {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    },
    scrollToStep2Anchor(anchorRef) {
      this.$nextTick(() => {
        const target = this.$refs[anchorRef];
        if (target && typeof target.scrollIntoView === "function") {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    },
    scrollToStep3Anchor(anchorRef) {
      this.$nextTick(() => {
        const target = this.$refs[anchorRef];
        if (target && typeof target.scrollIntoView === "function") {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    },
    scrollToStep4Anchor(anchorRef) {
      this.$nextTick(() => {
        const target = this.$refs[anchorRef];
        if (target && typeof target.scrollIntoView === "function") {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    },
    stepStatusClass(step) {
      if (step < this.step) return "is-completed";
      if (step === this.step) return "is-active";
      return "is-upcoming";
    },
    stepStatusText(step) {
      if (step < this.step) return "Completed";
      if (step === this.step) {
        return this.validationSummary.length ? "Needs attention" : "In progress";
      }
      return "Pending";
    },
    validateStep(step) {
      let hasError = false;

      if (step === 1) {
        if (!this.form.title || this.form.title.trim() === "") {
          this.pushValidation("title", "Property title is required.");
          hasError = true;
        }
        if (!this.form.description || this.form.description.trim() === "") {
          this.pushValidation("description", "Property description is required.");
          hasError = true;
        }
        if (!this.form.business_permit) {
          this.pushValidation("business_permit", "Business permit is required before listing this property.");
          hasError = true;
        }
      }

      if (step === 2) {
        if (!this.form.agreement_type) {
          this.pushValidation("agreement_type", "Agreement type is required.");
          hasError = true;
        }
        if (!this.form.property_type_id) {
          this.pushValidation("property_type_id", "Property type is required.");
          hasError = true;
        }

        if (this.selectedPropertyName !== "Commercial Space") {
          const bath = this.form.bath_type || [];
          const bed = this.form.bed_type || [];
          if (bed.length <= 0) {
            this.pushValidation("bed_type", "Select at least one bed type.");
            hasError = true;
          }
          if (bath.length <= 0) {
            this.pushValidation("bath_type", "Select at least one bath type.");
            hasError = true;
          }

          if ((this.form.single_bed || 0) <= 0 && (this.form.double_bed || 0) <= 0) {
            this.pushValidation("single_bed", "Include at least 1 bed.");
            hasError = true;
          }
          if ((this.form.public_bath || 0) <= 0 && (this.form.private_bath || 0) <= 0) {
            this.pushValidation("public_bath", "Include at least 1 bathroom.");
            hasError = true;
          }
        }

        if (this.selectedPropertyName === "Commercial Space") {
          if ((this.form.floor_area || 0) <= 0) {
            this.pushValidation("floor_area", "Specify floor area greater than 0 for Commercial Space.");
            hasError = true;
          }
          if ((this.form.lot_area || 0) <= 0) {
            this.pushValidation("lot_area", "Specify lot area greater than 0 for Commercial Space.");
            hasError = true;
          }
        }
      }

      if (step === 3) {
        if (!this.form.price || this.form.price <= 0) {
          this.pushValidation("price", "Price must be greater than 0.");
          hasError = true;
        }
      }

      if (step === 4) {
        if (!this.form.latitude || !this.form.longitude) {
          this.pushValidation("latitude", "Property coordinates are required.");
          hasError = true;
        }
        if (!this.form.region_name || !this.form.state_name || !this.form.town_name || !this.form.village_name) {
          if (this.isGeocoding) {
            this.pushValidation("location", "Location details are still being fetched. Please wait and try again.");
          } else {
            this.pushValidation("location", "Complete location details are required.");
          }
          hasError = true;
        }
      }

      return !hasError;
    },
    // Navigation
    nextStep() {
      this.resetValidation();
      if (!this.validateStep(this.step)) {
        this.scrollToValidationSummary();
        return;
      }
      if (this.step < this.maxStep) this.step++;
    },
    prevStep() {
      if (this.step > 1) this.step--;
    },

    async validateForm() {
      this.isValidating = true;
      try {
        this.resetValidation();
        const stepsToValidate = [1, 2, 3, 4];
        let firstInvalidStep = null;

        stepsToValidate.forEach((step) => {
          const stepIsValid = this.validateStep(step);
          if (!stepIsValid && firstInvalidStep === null) {
            firstInvalidStep = step;
          }
        });

        if (firstInvalidStep !== null) {
          this.step = firstInvalidStep;
          this.scrollToValidationSummary();
          return;
        }

        if (this.form.agreement_type === "rental") {
          if (this.form.advance_payment_months < 0) {
            this.pushValidation("advance_payment_months", "Advance payment months cannot be negative.");
          }
          if (this.form.deposit_required < 0) {
            this.pushValidation("deposit_required", "Deposit required cannot be negative.");
          }
          if (!this.form.payment_frequency) {
            this.pushValidation("payment_frequency", "Payment frequency is required for rentals.");
          }
        }

        if (this.form.agreement_type === "lease") {
          if (!this.form.lease_term_months || this.form.lease_term_months <= 0) {
            this.pushValidation("lease_term_months", "Lease term must be greater than 0.");
          }
          if (!this.form.renewal_option) {
            this.pushValidation("renewal_option", "Renewal option is required.");
          }
          if (this.form.notice_period < 0) {
            this.pushValidation("notice_period", "Notice period cannot be negative.");
          }
        }
        if (this.validationSummary.length) {
          this.scrollToValidationSummary();
          return;
        }

        this.showConfirmModal = true;
      } catch (error) {
        console.error("Validation Error:", error);
        this.pushValidation("form", "Something went wrong during validation.");
        this.scrollToValidationSummary();
      } finally {
        this.isValidating = false;
      }
    },
    closeConfirmModal(){
      if (this.isSubmitting || this.isCheckingAccess) return;
      this.showConfirmModal = false;
    },

    // Submit form
    async submitForm() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      this.submitStatusMessage = "Checking subscription status...";

      const canManage = await this.ensureOwnerCanManageProperties({ redirectIfBlocked: false });
      if (!canManage) {
        this.isSubmitting = false;
        this.submitStatusMessage = "";
        return;
      }

      const fd = new FormData();
      this.submitStatusMessage = "Preparing property payload...";

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
        this.submitStatusMessage = "Uploading property details...";
        await createProperty(fd);
        // console.log("Property added successfully:", response);
        sessionStorage.setItem("propertyCreated", true);
        this.showConfirmModal = false;
        // alert("Property created successfully!");
        this.$router.push("/properties")
      } catch (error) {
        if (error.response && error.response.status === 403) {
          const subscriptionPayload = error.response?.data?.subscription || null;
          if (subscriptionPayload) {
            this.subscriptionState = subscriptionPayload;
          }

          alert(error.response?.data?.message || "Subscription expired or inactive. Renew to continue.");
          this.$router.push("/overview");
          return;
        }

        if (error.response && error.response.status === 422) {
          const backendErrors = error.response.data.errors || {};
          this.resetValidation();
          Object.keys(backendErrors).forEach((field) => {
            const message = Array.isArray(backendErrors[field]) ? backendErrors[field][0] : String(backendErrors[field]);
            this.pushValidation(field, `${field}: ${message}`);
          });
          if (["title", "description", "business_permit", "thumbnail"].some((f) => this.errors[f])) this.step = 1;
          else if (["agreement_type", "property_type_id", "bed_type", "bath_type", "single_bed", "public_bath", "floor_area", "lot_area"].some((f) => this.errors[f])) this.step = 2;
          else if (["price", "payment_frequency", "advance_payment_months", "deposit_required", "lease_term_months", "renewal_option", "notice_period"].some((f) => this.errors[f])) this.step = 3;
          else if (["latitude", "longitude", "location", "region_name", "state_name", "town_name", "village_name"].some((f) => this.errors[f])) this.step = 4;
          this.scrollToValidationSummary();
          console.error("Validation Errors:", backendErrors);
        } else {
          console.error("Error submitting property:", error);
          alert("Something went wrong. Check console.");
        }
      } finally {
        this.isSubmitting = false;
        this.submitStatusMessage = "";
      }
    },

    async setAddressFields() {
      if (this.timeoutId) clearTimeout(this.timeoutId);
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

        // Ã°Å¸Â§Â¹ Destroy existing map if it exists
        if (this.map) {
          this.map.remove();
          this.map = null;
          this.marker = null;
        }

        // Ã°Å¸â€”ÂºÃ¯Â¸Â Initialize map again
        this.map = L.map(mapContainer).setView([lat, lng], 15);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(this.map);

        this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

        // Ã¢Å“â€¦ Update coordinates when dragging
        this.marker.on("dragend", (e) => {
          const { lat, lng } = e.target.getLatLng();
          this.form.latitude = lat.toFixed(6);
          this.form.longitude = lng.toFixed(6);
        });

        // Ã¢Å“â€¦ Update coordinates when clicking
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
          // Silent fallback Ã¢â‚¬â€ no alert needed
          console.warn("User denied geolocation.");
        }
      );
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
  beforeUnmount() {
    if (this.previewBusinessPermitUrl) {
      URL.revokeObjectURL(this.previewBusinessPermitUrl);
    }
  },
  mounted() {
    const userInfoRaw = localStorage.getItem("userInfo");
    if (userInfoRaw) {
      try {
        const cached = JSON.parse(userInfoRaw);
        this.subscriptionState = cached?.subscription || null;
      } catch (error) {
        this.subscriptionState = null;
      }
    }

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
    ownerVerificationStatus() {
      const info = useUserInfo();
      const status = String(info?.owner_verification_status || "unverified").toLowerCase().trim();
      return ["verified", "pending", "rejected", "unverified"].includes(status) ? status : "unverified";
    },
    ownerVerificationMessage() {
      if (this.ownerVerificationStatus === "pending") {
        return "Your documents are under admin review. You can still add properties.";
      }
      if (this.ownerVerificationStatus === "rejected") {
        return "Your previous submission was rejected. Update your documents to get verified.";
      }
      return "Your account is not yet verified by admin. You can still add properties.";
    },
    step1Checklist() {
      return [
        {
          key: "title",
          label: "Title",
          anchor: "step1TitleField",
          status: this.form.title && this.form.title.trim() ? "complete" : "missing",
          statusLabel: this.form.title && this.form.title.trim() ? "Complete" : "Missing",
        },
        {
          key: "description",
          label: "Description",
          anchor: "step1DescriptionField",
          status: this.form.description && this.form.description.trim() ? "complete" : "missing",
          statusLabel: this.form.description && this.form.description.trim() ? "Complete" : "Missing",
        },
        {
          key: "thumbnail",
          label: "Thumbnail",
          anchor: "step1ThumbnailField",
          status: this.previewThumbnail ? "complete" : "missing",
          statusLabel: this.previewThumbnail ? "Complete" : "Missing",
        },
        {
          key: "business_permit",
          label: "Business Permit",
          anchor: "step1PermitField",
          status: this.form.business_permit ? "complete" : "required",
          statusLabel: this.form.business_permit ? "Complete" : "Required",
        },
      ];
    },
    step2Checklist() {
      const hasAgreement = !!this.form.agreement_type;
      const hasPropertyType = !!this.form.property_type_id;
      const hasFeatures =
        this.form.utilities.length > 0 ||
        this.form.property_amenities.length > 0 ||
        this.form.property_facilities.length > 0 ||
        this.form.custom_utilities.length > 0 ||
        this.form.custom_amenities.length > 0 ||
        this.form.custom_facilities.length > 0;
      const isCommercial = (this.selectedPropertyName || "").toLowerCase() === "commercial space";
      const hasResidentialSpec =
        this.form.bed_type.length > 0 &&
        this.form.bath_type.length > 0 &&
        ((this.form.single_bed || 0) > 0 || (this.form.double_bed || 0) > 0) &&
        ((this.form.public_bath || 0) > 0 || (this.form.private_bath || 0) > 0);
      const hasCommercialSpec = (this.form.floor_area || 0) > 0 && (this.form.lot_area || 0) > 0;
      const hasRulesSetup =
        (this.form.rules && this.form.rules.trim().length > 0) ||
        this.form.has_curfew !== null;

      const specStatus = !hasPropertyType
        ? "required"
        : isCommercial
          ? (hasCommercialSpec ? "complete" : "missing")
          : (hasResidentialSpec ? "complete" : "missing");

      const labels = { complete: "Complete", missing: "Missing", required: "Required" };

      return [
        { key: "agreement", label: "Agreement Type", anchor: "step2AgreementField", status: hasAgreement ? "complete" : "required", statusLabel: hasAgreement ? labels.complete : labels.required },
        { key: "property_type", label: "Property Type", anchor: "step2AgreementField", status: hasPropertyType ? "complete" : "required", statusLabel: hasPropertyType ? labels.complete : labels.required },
        { key: "features", label: "Features", anchor: "step2FeaturesAccordion", status: hasFeatures ? "complete" : "missing", statusLabel: hasFeatures ? labels.complete : labels.missing },
        { key: "specs", label: "Specs Setup", anchor: "step2SpecsField", status: specStatus, statusLabel: labels[specStatus] },
        { key: "rules", label: "Rules or Curfew", anchor: "step2RulesField", status: hasRulesSetup ? "complete" : "required", statusLabel: hasRulesSetup ? labels.complete : labels.required },
      ];
    },
    step3Checklist() {
      const labels = { complete: "Complete", missing: "Missing", required: "Required" };
      const hasFrequency = !!this.form.payment_frequency;
      const hasPrice = (this.form.price || 0) > 0;
      const isRental = this.form.agreement_type === "rental";
      const isLease = this.form.agreement_type === "lease";
      const hasRentalTerms =
        (this.form.advance_payment_months || 0) >= 0 &&
        (this.form.deposit_required || 0) >= 0;
      const hasLeaseTerms =
        (this.form.lease_term_months || 0) > 0 &&
        !!this.form.renewal_option &&
        (this.form.notice_period || 0) >= 0;

      return [
        { key: "payment_frequency", label: "Payment Frequency", anchor: "step3CorePricingField", status: hasFrequency ? "complete" : "required", statusLabel: hasFrequency ? labels.complete : labels.required },
        { key: "base_price", label: "Base Price", anchor: "step3CorePricingField", status: hasPrice ? "complete" : "required", statusLabel: hasPrice ? labels.complete : labels.required },
        { key: "rental_terms", label: "Advance & Deposit", anchor: "step3RentalTermsField", status: !isRental ? "required" : (hasRentalTerms ? "complete" : "missing"), statusLabel: !isRental ? labels.required : (hasRentalTerms ? labels.complete : labels.missing) },
        { key: "lease_terms", label: "Lease Terms", anchor: "step3LeaseTermsField", status: !isLease ? "required" : (hasLeaseTerms ? "complete" : "missing"), statusLabel: !isLease ? labels.required : (hasLeaseTerms ? labels.complete : labels.missing) },
      ];
    },
    step4Checklist() {
      const labels = { complete: "Complete", missing: "Missing", required: "Required" };
      const hasPin = this.form.latitude !== null && this.form.longitude !== null;
      const hasCoords = !Number.isNaN(Number(this.form.latitude)) && !Number.isNaN(Number(this.form.longitude));
      const hasAddress =
        !!(this.form.region_name || "").trim() ||
        !!(this.form.state_name || "").trim() ||
        !!(this.form.town_name || "").trim() ||
        !!(this.form.village_name || "").trim();
      const hasRegionSet =
        !!(this.form.region_name || "").trim() &&
        !!(this.form.state_name || "").trim() &&
        !!(this.form.town_name || "").trim() &&
        !!(this.form.village_name || "").trim();

      return [
        { key: "map_pin", label: "Map Pin", anchor: "step4MapField", status: hasPin ? "complete" : "required", statusLabel: hasPin ? labels.complete : labels.required },
        { key: "coords", label: "Coordinates", anchor: "step4CoordsField", status: hasCoords ? "complete" : "missing", statusLabel: hasCoords ? labels.complete : labels.missing },
        { key: "address_resolution", label: "Address Resolution", anchor: "step4AddressField", status: hasAddress ? "complete" : "missing", statusLabel: hasAddress ? labels.complete : labels.missing },
        { key: "region_setup", label: "Region/State/Town/Village", anchor: "step4AddressField", status: hasRegionSet ? "complete" : "required", statusLabel: hasRegionSet ? labels.complete : labels.required },
      ];
    },
    reviewStatus() {
      const basicsReady =
        !!(this.form.title || "").trim() &&
        !!(this.form.description || "").trim() &&
        !!this.form.agreement_type &&
        !!this.form.property_type_id;
      const pricingReady =
        (this.form.price || 0) > 0 &&
        !!this.form.payment_frequency &&
        (
          this.form.agreement_type === "rental"
            ? (this.form.advance_payment_months || 0) >= 0 && (this.form.deposit_required || 0) >= 0
            : (this.form.lease_term_months || 0) > 0 && !!this.form.renewal_option && (this.form.notice_period || 0) >= 0
        );
      const detailsReady =
        (this.form.utilities?.length || 0) > 0 ||
        (this.form.property_amenities?.length || 0) > 0 ||
        (this.form.property_facilities?.length || 0) > 0 ||
        !!(this.form.rules || "").trim();
      const locationReady =
        this.form.latitude !== null &&
        this.form.longitude !== null &&
        !!(this.form.region_name || "").trim() &&
        !!(this.form.state_name || "").trim() &&
        !!(this.form.town_name || "").trim() &&
        !!(this.form.village_name || "").trim();
      const mediaReady =
        !!this.previewThumbnail &&
        !!this.form.business_permit &&
        (this.previewPropertyImages?.length || 0) > 0;

      return {
        basics: { status: basicsReady ? "complete" : "missing", label: basicsReady ? "Complete" : "Missing" },
        pricing: { status: pricingReady ? "complete" : "missing", label: pricingReady ? "Complete" : "Missing" },
        details: { status: detailsReady ? "complete" : "warning", label: detailsReady ? "Complete" : "Needs attention" },
        location: { status: locationReady ? "complete" : "missing", label: locationReady ? "Complete" : "Missing" },
        media: { status: mediaReady ? "complete" : "missing", label: mediaReady ? "Complete" : "Missing" },
      };
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
    submitButtonText() {
      if (this.isCheckingAccess) return "Checking access...";
      if (this.isSubmitting) return "Submitting...";
      return "Validating...";
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
      if (this.step === 4) {
        this.setAddressFields();
      }
    },
    "form.longitude"() {
      if (this.step === 4) {
        this.setAddressFields();
      }
    },
    'form.bed_type': {
      handler(newVal) {
        // If "Single Bed" is unchecked, reset its count to 0
        if (!newVal.includes('Single Bed')) {
          this.form.single_bed = 0;
        }
        // If "Double Bed" is unchecked, reset its count to 0
        if (!newVal.includes('Double Bed')) {
          this.form.double_bed = 0;
        }
        // Recalculate whenever the checkboxes change
        this.fillMaxOccupants();
      },
      deep: true
    },
    'form.bath_type': {
      handler(newVal) {
        // If "Single Bed" is unchecked, reset its count to 0
        if (!newVal.includes('Private')) {
          this.form.private_bath = 0;
        }
        // If "Double Bed" is unchecked, reset its count to 0
        if (!newVal.includes('Public')) {
          this.form.public_bath = 0;
        }
      },
      deep: true
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
.property-wizard-shell {
  background:
    radial-gradient(1200px 500px at -10% -20%, rgba(13, 110, 253, 0.08), transparent 55%),
    radial-gradient(800px 380px at 110% -10%, rgba(25, 135, 84, 0.08), transparent 60%);
  border-radius: 1.1rem;
}

.wizard-page-header {
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 1rem;
  backdrop-filter: blur(6px);
  padding: 0.9rem 1rem;
}

.wizard-step-rail {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.55rem;
}

.wizard-step-pill {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-radius: 999px;
  border: 1px solid #dbe5f2;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.45rem 0.65rem;
  min-height: 58px;
}

.wizard-step-pill.is-active {
  border-color: rgba(13, 110, 253, 0.5);
  box-shadow: 0 8px 22px rgba(13, 110, 253, 0.14);
}

.wizard-step-pill.is-completed {
  border-color: rgba(25, 135, 84, 0.35);
  background: rgba(25, 135, 84, 0.08);
}

.wizard-step-index {
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.74rem;
  font-weight: 700;
  background: #eaf1ff;
  color: #0d6efd;
}

.wizard-step-pill.is-completed .wizard-step-index {
  background: #e9f8ef;
  color: #198754;
}

.wizard-step-copy {
  min-width: 0;
}

.wizard-step-copy p,
.wizard-step-copy small {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wizard-nav-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.field-error-text {
  color: #b42318;
  font-size: 0.78rem;
  display: block;
  margin-top: 0.35rem;
}

.step1-pane {
  border: 1px solid #e6edf7;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.85);
  padding: 1rem;
}

.step1-checklist {
  border: 1px solid #e7eef9;
  border-radius: 0.9rem;
  background: #f8fbff;
  padding: 0.8rem;
}

.step1-chip {
  border: 1px solid #d4deeb;
  border-radius: 999px;
  background: #fff;
  padding: 0.28rem 0.66rem;
  font-size: 0.73rem;
  font-weight: 600;
  color: #2e4057;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.18s ease;
}

.step1-chip:hover {
  border-color: #8cb5ef;
  color: #0d6efd;
}

.step1-chip .dot {
  width: 0.46rem;
  height: 0.46rem;
  border-radius: 50%;
  background: #c2cad6;
}

.step1-chip.is-complete .dot {
  background: #20a36a;
}

.step1-chip.is-missing .dot {
  background: #dc3545;
}

.step1-chip.is-required .dot {
  background: #fd7e14;
}

.step2-checklist {
  border: 1px solid #e7eef9;
  border-radius: 0.9rem;
  background: #f8fbff;
  padding: 0.8rem;
}

.step2-chip {
  border: 1px solid #d4deeb;
  border-radius: 999px;
  background: #fff;
  padding: 0.3rem 0.68rem;
  font-size: 0.73rem;
  font-weight: 600;
  color: #2e4057;
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  transition: all 0.18s ease;
}

.step2-chip:hover {
  border-color: #8cb5ef;
  color: #0d6efd;
}

.step2-chip .dot {
  width: 0.46rem;
  height: 0.46rem;
  border-radius: 50%;
  background: #c2cad6;
}

.step2-chip.is-complete .dot {
  background: #20a36a;
}

.step2-chip.is-missing .dot {
  background: #dc3545;
}

.step2-chip.is-required .dot {
  background: #fd7e14;
}

.step2-pane {
  border: 1px solid #e6edf7;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.85);
  padding: 1rem;
}

.step2-subcard {
  border: 1px solid #e8eff8;
  border-radius: 0.75rem;
  background: rgba(248, 251, 255, 0.8);
  padding: 0.85rem;
}

.step2-accordion .accordion-item {
  background: transparent;
}

.step2-accordion .accordion-button {
  gap: 0.75rem;
  align-items: center;
}

.step2-accordion .accordion-button:not(.collapsed) {
  background: #eef5ff;
  color: #0d6efd;
}

.step2-accordion .accordion-body {
  max-height: 360px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.step2-count-badge {
  margin-left: auto;
  min-width: 1.7rem;
  height: 1.45rem;
  border-radius: 999px;
  background: #e6f0ff;
  border: 1px solid #b7d1fa;
  color: #0d6efd;
  font-size: 0.72rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.45rem;
}

.step3-checklist,
.step4-checklist {
  border: 1px solid #e7eef9;
  border-radius: 0.9rem;
  background: #f8fbff;
  padding: 0.8rem;
}

.step3-chip,
.step4-chip {
  border: 1px solid #d4deeb;
  border-radius: 999px;
  background: #fff;
  padding: 0.3rem 0.68rem;
  font-size: 0.73rem;
  font-weight: 600;
  color: #2e4057;
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  transition: all 0.18s ease;
}

.step3-chip:hover,
.step4-chip:hover {
  border-color: #8cb5ef;
  color: #0d6efd;
}

.step3-chip .dot,
.step4-chip .dot {
  width: 0.46rem;
  height: 0.46rem;
  border-radius: 50%;
  background: #c2cad6;
}

.step3-chip.is-complete .dot,
.step4-chip.is-complete .dot {
  background: #20a36a;
}

.step3-chip.is-missing .dot,
.step4-chip.is-missing .dot {
  background: #dc3545;
}

.step3-chip.is-required .dot,
.step4-chip.is-required .dot {
  background: #fd7e14;
}

.step3-pane,
.step4-pane {
  border: 1px solid #e6edf7;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.85);
  padding: 1rem;
}

.step4-map-shell {
  border: 1px solid #dde7f5;
  border-radius: 0.95rem;
  background: #f9fbff;
  padding: 0.75rem;
}

.step-status-badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid #d7e4f6;
  border-radius: 999px;
  background: #ffffff;
  color: #355070;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.7rem;
}

.step4-address-card {
  border: 1px solid #e6edf7;
  border-radius: 0.9rem;
  background: rgba(248, 251, 255, 0.9);
  padding: 1rem;
}

.step5-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

.step5-card {
  border: 1px solid #e6edf7;
  border-radius: 0.95rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.9rem;
}

.step5-card-head {
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
  align-items: flex-start;
  margin-bottom: 0.7rem;
}

.step5-status-pill {
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.69rem;
  font-weight: 700;
  border: 1px solid #d6deea;
  background: #f8fafc;
  color: #44546a;
}

.step5-status-pill.is-complete {
  background: #e9f8ef;
  border-color: #b9e4ca;
  color: #1e7c4d;
}

.step5-status-pill.is-missing {
  background: #fdecec;
  border-color: #f1c0c0;
  color: #b42318;
}

.step5-status-pill.is-warning {
  background: #fff6e9;
  border-color: #f3dbb1;
  color: #b25f0f;
}

.step5-edit-chip {
  border: 1px solid #cdd9ea;
  border-radius: 999px;
  background: #fff;
  color: #355070;
  font-size: 0.72rem;
  font-weight: 600;
}

.step5-kv {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.step5-row {
  display: flex;
  justify-content: space-between;
  gap: 0.65rem;
  font-size: 0.86rem;
  color: #41566f;
}

.step5-row > span {
  color: #6b7f95;
  min-width: 110px;
}

.step5-media-strip {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.step5-thumb {
  width: 68px;
  height: 68px;
  border-radius: 0.75rem;
  border: 1px solid #d9e4f2;
  background: #f4f8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.step5-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.step5-gallery-thumb {
  width: 48px;
  height: 48px;
  border-radius: 0.6rem;
  border: 1px solid #d9e4f2;
  overflow: hidden;
  background: #f4f8ff;
}

.step5-gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.step5-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.step5-footer-bar {
  border-top: 1px solid #e9eff8 !important;
}

.upload-card {
  border: 1px solid #e6edf7;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.85);
  padding: 0.75rem;
}

.upload-placeholder {
  min-height: 150px;
}

@media (max-width: 992px) {
  .wizard-step-rail {
    grid-template-columns: 1fr;
  }

  .step1-pane,
  .step2-pane,
  .step5-card,
  .step2-subcard,
  .upload-card {
    padding: 0.85rem;
  }

  .step5-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wizard-step-pill,
  .step2-chip,
  .step5-edit-chip,
  .step2-accordion .accordion-button,
  .upload-placeholder,
  .card {
    transition: none !important;
  }
}

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
</style>



