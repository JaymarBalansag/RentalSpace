<template>
  <Header />

  <!-- Success Toast -->
  <successToast v-if="showSuccess" message="🎉 Login successful, Welcome!" />
  <successToast v-if="subSuccess" message="🎉 You are a owner now!" />

  <!-- Search Filter -->
  <div class="container-fluid bg-light pt-5 mb-2">
    <div class="container">
      <h1 class="fw-bold text-primary mb-3">Find Your Perfect Space</h1>
      <div class="row g-3 align-items-center">
        <!-- Property Type -->
        <div class="col-md-3">
          <select class="form-select shadow-sm" v-model="selectedType">
            <option value="">Property Type</option>
            <option v-for="(type, index) in property_types" :key="index" :value="type.id">
              {{ type.type_name }}
            </option>
          </select>
        </div>

        <!-- Agreement Type -->
        <div class="col-md-3">
          <select class="form-select shadow-sm" v-model="selectedAgreement">
            <option value="">Agreement Type</option>
            <option value="rental">Rental</option>
            <option value="lease">Lease</option>
          </select>
        </div>

        <!-- Search -->
        <div class="col-md-4">
          <div class="input-group shadow-sm">
            <input type="text" class="form-control" placeholder="Search by location or name">
            <button class="btn btn-outline-primary">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>

        <!-- Search Button -->
        <div class="col-md-2 d-grid">
          <button class="btn btn-primary shadow-sm">Search</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="container my-5">
    <div class="row g-4">
      <!-- Side Filters -->
      <aside class="col-lg-3 d-lg-block d-md-none d-sm-none d-none">
        <!-- Amenities -->
        <div class="p-3 border rounded shadow-sm mb-4 bg-white">
          <h5 class="fw-bold mb-3">Amenities</h5>
          <div class="form-check" v-for="(amenity, index) in amenities" :key="index">
            <input
              class="form-check-input"
              type="checkbox"
              :id="'amenity-' + index"
              :value="amenity.id"
              v-model="selectedAmenities"
            />
            <label class="form-check-label" :for="'amenity-' + index">
              {{ amenity.amenity_name }}
            </label>
          </div>
        </div>

        <!-- Facilities -->
        <div class="p-3 border rounded shadow-sm bg-white mb-4">
          <h5 class="fw-bold mb-3">Facilities</h5>
          <div class="form-check" v-for="(facility, index) in facilities" :key="index">
            <input
              class="form-check-input"
              type="checkbox"
              :id="'facility-' + index"
              :value="facility.id"
              v-model="selectedFacilities"
            />
            <label class="form-check-label" :for="'facility-' + index">
              {{ facility.facility_name }}
            </label>
          </div>
        </div>

        <!-- Price Range -->
        <div class="p-3 border rounded shadow-sm bg-white mb-4">
          <h5 class="fw-bold mb-3">Price Range</h5>
          <div class="form-check" v-for="(range, index) in priceRanges" :key="index">
            <input
              class="form-check-input"
              type="radio"
              :id="'price-' + index"
              :value="range"
              v-model="selectedPriceRange"
            />
            <label class="form-check-label" :for="'price-' + index">
              {{ range.label }}
            </label>
          </div>
        </div>
      </aside>

      <!-- Mobile Filters -->
      <aside class="col-lg-3 d-lg-none d-md-block d-sm-block mb-4">
        <div class="accordion" id="accordionExample">

          <!-- Filter Section 1 -->
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#filterType"
                aria-expanded="false"
                aria-controls="filterType"
              >
                Amenities
              </button>
            </h2>
            <div
              id="filterType"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <!-- Your filter inputs here -->
                 <h5 class="fw-bold mb-3">Amenities</h5>
                <div class="form-check" v-for="(amenity, index) in amenities" :key="index">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'amenity-' + index"
                    :value="amenity.id"
                    v-model="selectedAmenities"
                  />
                  <label class="form-check-label" :for="'amenity-' + index">
                    {{ amenity.amenity_name }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Filter Section 2 -->
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#filterPrice"
                aria-expanded="false"
                aria-controls="filterPrice"
              >
                Price Range
              </button>
            </h2>
            <div
              id="filterPrice"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <!-- Price inputs -->
                 <div class="form-check" v-for="(range, index) in priceRanges" :key="index">
                  <input
                    class="form-check-input"
                    type="radio"
                    :id="'price-' + index"
                    :value="range"
                    v-model="selectedPriceRange"
                  />
                  <label class="form-check-label" :for="'price-' + index">
                    {{ range.label }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Filter Section 3 -->
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#filterAmenities"
                aria-expanded="false"
                aria-controls="filterAmenities"
              >
                Facilities
              </button>
            </h2>
            <div
              id="filterAmenities"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <!-- Facilities checkboxes -->
                 <div class="form-check" v-for="(facility, index) in facilities" :key="index">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'facility-' + index"
                    :value="facility.id"
                    v-model="selectedFacilities"
                  />
                  <label class="form-check-label" :for="'facility-' + index">
                    {{ facility.facility_name }}
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>
      </aside>


      

      <!-- Property Listings -->
      <div class="col-lg-9">
        <div class="row g-4">
          <!-- Placeholders while loading -->
          <div v-if="loading" class="col-md-6 col-lg-4" v-for="n in 6" :key="'ph-' + n">
            <div class="card h-100 shadow-sm property-card">
              <svg class="bd-placeholder-img card-img-top" width="100%" height="180" role="img" aria-label="Image placeholder">
                <rect width="100%" height="100%" fill="#e9ecef"></rect>
              </svg>
              <div class="card-body">
                <h5 class="card-title placeholder-glow">
                  <span class="placeholder col-6"></span>
                </h5>
                <p class="card-text placeholder-glow">
                  <span class="placeholder col-7"></span>
                  <span class="placeholder col-4"></span>
                  <span class="placeholder col-5"></span>
                </p>
                <p class="fw-bold text-primary mb-2 placeholder-glow">
                  <span class="placeholder col-4"></span>
                </p>
                <div class="d-grid">
                  <span class="btn btn-outline-primary btn-sm disabled placeholder col-6"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actual properties -->
          <div v-else class="col-md-6 col-lg-4" v-for="(property, index) in properties" :key="index">
            <div class="card h-100 shadow-sm property-card">
              <img :src="property.image_url" @error="$event.target.src = placeholderImg" class="card-img-top" alt="Property">
              <div class="card-body">
                <h5 class="card-title">{{ property.title }}</h5>
                <p class="card-text text-muted small">{{ property.description }}</p>
                <p class="fw-bold text-primary mb-2">{{ property.price }} / {{ property.payment_frequency }}</p>
                <RouterLink :to="`/property/${property.id}`" class="btn btn-outline-primary btn-sm">View Details</RouterLink>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!loading && properties.length === 0" class="col-12">
            <div class="alert alert-light border text-muted">
              No properties match your filters. Try adjusting your selections.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import placeholderImg from '@/assets/Placeholder/thumbnail_placeholder.jpg';
import {
  getProperties,
  getPropertyTypes,
  getAmenities,
  getFacilities,
  getFilteredProperties,
  getFilterPropertyByType
} from '@/api/property';
import successToast from '@/components/successToast.vue';
import Header from '@/components/Header.vue';

export default {
  name: 'Home',
  components: { RouterLink, successToast, Header },
  data() {
    return {
      showSuccess: false,
      subSuccess: false,
      amenities: [],
      facilities: [],
      property_types: [],
      properties: [],
      message: '',
      placeholderImg,
      selectedAmenities: [],
      selectedFacilities: [],
      priceRanges: [
        { label: '₱0 - ₱1,000', min: 0, max: 1000 },
        { label: '₱1,001 - ₱5,000', min: 1001, max: 5000 },
        { label: '₱5,001 - ₱10,000', min: 5001, max: 10000 },
        { label: '₱10,000+', min: 10001, max: 999999 }
      ],
      selectedPriceRange: null,
      selectedType: null,
      selectedAgreement: null,
      min_price: 0,            // ensure these exist
      max_price: 0,
      loading: true            // controls placeholders
    };
  },
  methods: {
    async getProperties() {
      this.loading = true;
      try {
        const response = await getProperties();
        this.properties = response.data.properties;
        this.message = response.data.message;
      } catch (error) {
        console.log('Properties Error: ' + error);
        this.properties = [];
      } finally {
        this.loading = false;
      }
    },
    async getAmenities() {
      try {
        const response = await getAmenities();
        this.amenities = response;
      } catch (error) {
        console.log('Amenities Error: ' + error);
      }
    },
    async getFacilities() {
      try {
        const response = await getFacilities();
        this.facilities = response;
      } catch (error) {
        console.log('Facilities Error: ' + error);
      }
    },
    async getPropertyTypes() {
      try {
        const response = await getPropertyTypes();
        this.property_types = response;
      } catch (error) {
        console.log('Property Types Error: ' + error);
      }
    },
    async getFilteredProperties() {
      this.loading = true; // show placeholders during filter fetch
      try {
        const response = await getFilteredProperties(
          this.selectedAmenities,
          this.selectedFacilities,
          this.min_price,
          this.max_price,
          this.selectedType,
          this.selectedAgreement
        );
        this.properties = response.data.properties;
        this.message = response.data.message;
      } catch (error) {
        console.log('Filtered Properties Error: ' + error);
        this.properties = [];
      } finally {
        this.loading = false;
      }
    },
    async getFilterPropertyByType() {
      this.loading = true;
      try {
        const response = await getFilterPropertyByType(this.selectedType, this.selectedAgreement);
        this.properties = response.properties;
      } catch (error) {
        console.log('Filtered Properties Error: ' + error);
        this.properties = [];
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.getAmenities();
    this.getFacilities();
    this.getPropertyTypes();
    this.getProperties();

    const success = sessionStorage.getItem('loginSuccess');
    const subSuccess = sessionStorage.getItem('subscriptionSuccess');

    if (success) {
      this.showSuccess = true;
      sessionStorage.removeItem('loginSuccess');
    }
    if (subSuccess) {
      this.subSuccess = true;
      sessionStorage.removeItem('subscriptionSuccess');
    }
  },
  watch: {
    selectedType() {
      this.getFilteredProperties();
    },
    selectedAgreement() {
      this.getFilteredProperties();
    },
    selectedAmenities: {
      handler() {
        this.getFilteredProperties();
      },
      deep: true
    },
    selectedFacilities: {
      handler() {
        this.getFilteredProperties();
      },
      deep: true
    },
    selectedPriceRange(newVal) {
      if (newVal) {
        this.min_price = newVal.min;
        this.max_price = newVal.max;
      } else {
        this.min_price = 0;
        this.max_price = 0;
      }
      this.getFilteredProperties();
    }
  }
};
</script>

<style scoped>
.property-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

/* .placeholder {
  Bootstrap default is #dee2e6; override if needed
} */
</style>
