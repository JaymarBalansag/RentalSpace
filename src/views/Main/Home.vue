<template>
  <Header />

  <!-- Success Toast -->
  <successToast v-if="showSuccess" message="🎉 Login successful, Welcome!" />
  <successToast v-if="subSuccess" message="🎉 You are a owner now!" />

  <!-- Search Filter -->
  <div class="container-fluid bg-light pt-5 mb-2 pb-3">
    <div class="container ">
      <h1 class="fw-bold text-primary mb-3">Find Your Perfect Space</h1>
      <div class="row g-3 align-items-center ">
        <!-- Property Type -->
        <div class="col-md-3">
          <select class="form-select shadow-sm" v-model="selectedType">
            
            <option v-for="(type, index) in property_types" :key="index" :value="type.id">
              {{ type.type_name }}
            </option>
          </select>
        </div>

        <!-- Agreement Type -->
        <div class="col-md-3">
          <select class="form-select shadow-sm" v-model="selectedAgreement">
            <option selected value="">Agreement Type</option>
            <option value="rental">Rental</option>
            <option value="lease">Lease</option>
          </select>
        </div>

        <!-- Search -->
        <div class="col-md-3">
          <div class="input-group shadow-sm">
            <input type="text" class="form-control" v-model="searchQuery" placeholder="Search by location or name">
            <button class="btn btn-outline-primary" @click="searchByQuery(1)">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>

        <!-- Map Toggle -->
        <div class="col-12 col-md-2">
          <button
            class="btn btn-outline-primary shadow-sm d-md-block w-100"
            @click="showMap = !showMap"
            v-if="properties.length"
          >
            <i class="bi bi-map"></i>
            {{ showMap ? 'Hide Map' : 'View Map' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  

  <!-- Map Section -->
  <div v-if="showMap" class="container-md container-sm px-0 mb-4">
    <MapSection :properties="properties" />
  </div>


  <!-- Main Content -->
  <div class="container my-5">
    <div class="row g-4">
      <!-- Side Filters -->
      <aside class="col-lg-3 d-lg-block d-md-none d-sm-none d-none">
        <!-- Amenities -->
        <div class="p-3 border rounded shadow-sm mb-4 bg-white">
          <h5 class="fw-bold mb-3">Amenities</h5>

          <!-- Skeleton -->
          <div v-if="loadingAmenities">
            <div
              v-for="n in 5"
              :key="'amenity-skel-' + n"
              class="d-flex align-items-center mb-2 placeholder-glow"
            >
              <span class="placeholder rounded me-2" style="width:16px;height:16px;"></span>
              <span class="placeholder col-6"></span>
            </div>
          </div>

          <!-- Actual -->
          <div v-else>
            <div
              class="form-check"
              v-for="(amenity, index) in amenities"
              :key="index"
            >
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

        <!-- Facilities -->
        <div class="p-3 border rounded shadow-sm bg-white mb-4">
        <h5 class="fw-bold mb-3">Facilities</h5>

        <!-- Skeleton -->
        <div v-if="loadingFacilities">
          <div
            v-for="n in 5"
            :key="'facility-skel-' + n"
            class="d-flex align-items-center mb-2 placeholder-glow"
          >
            <span class="placeholder rounded me-2" style="width:16px;height:16px;"></span>
            <span class="placeholder col-6"></span>
          </div>
        </div>

        <!-- Actual -->
        <div v-else>
          <div
            class="form-check"
            v-for="(facility, index) in facilities"
            :key="index"
          >
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

        <!-- Price Range -->
      <div class="p-3 border rounded shadow-sm bg-white mb-4">
        <h5 class="fw-bold mb-3" style="font-size: 1rem;">Price Range</h5>
        
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label small text-muted mb-1">Min Price</label>
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light text-secondary">$</span>
              <input 
                type="number" 
                v-model.number="min_price" 
                class="form-control" 
                placeholder="0"
                @keyup.enter="applyPriceFilter"
              />
            </div>
          </div>

          <div class="col-6">
            <label class="form-label small text-muted mb-1">Max Price</label>
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light text-secondary">$</span>
              <input 
                type="number" 
                v-model.number="max_price" 
                class="form-control" 
                placeholder="Any"
                @keyup.enter="applyPriceFilter"
              />
            </div>
          </div>
        </div>

        <div class="d-flex gap-2">
          <button 
            @click="applyPriceFilter" 
            class="btn btn-primary btn-sm flex-grow-1 fw-bold"
          >
            Apply Filter
          </button>
          
          <button 
            @click="resetPriceFilter" 
            class="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
            style="width: 40px;"
            title="Reset Price"
          >
            <i class="bi bi-arrow-clockwise"></i>
          </button>
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

                <div v-if="loadingAmenities">
                  <div v-for="n in 4" :key="n" class="placeholder-glow mb-2">
                    <span class="placeholder col-7"></span>
                  </div>
                </div>

                <div v-else class="form-check" v-for="(amenity, index) in amenities" :key="index">
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
                <div class="p-3 border rounded shadow-sm bg-white mb-4">
                  <h5 class="fw-bold mb-3" style="font-size: 1rem;">Price Range</h5>
                  
                  <div class="row g-2 mb-3">
                    <div class="col-6">
                      <label class="form-label small text-muted mb-1">Min Price</label>
                      <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light text-secondary">$</span>
                        <input 
                          type="number" 
                          v-model.number="min_price" 
                          class="form-control" 
                          placeholder="0"
                          @keyup.enter="applyPriceFilter"
                        />
                      </div>
                    </div>

                    <div class="col-6">
                      <label class="form-label small text-muted mb-1">Max Price</label>
                      <div class="input-group input-group-sm">
                        <span class="input-group-text bg-light text-secondary">$</span>
                        <input 
                          type="number" 
                          v-model.number="max_price" 
                          class="form-control" 
                          placeholder="Any"
                          @keyup.enter="applyPriceFilter"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    <button 
                      @click="applyPriceFilter" 
                      class="btn btn-primary btn-sm flex-grow-1 fw-bold"
                    >
                      Apply Filter
                    </button>
                    
                    <button 
                      @click="resetPriceFilter" 
                      class="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
                      style="width: 40px;"
                      title="Reset Price"
                    >
                      <i class="bi bi-arrow-clockwise"></i>
                    </button>
                  </div>
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
                
                <div v-if="loadingAmenities">
                  <div v-for="n in 4" :key="n" class="placeholder-glow mb-2">
                    <span class="placeholder col-7"></span>
                  </div>
                </div>

                <div v-else class="form-check" v-for="(facility, index) in facilities" :key="index">
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
          <div
            v-if="loading"
            class="col-12 mb-3"
            v-for="n in 5"
            :key="'ph-' + n"
          >
            <div class="card shadow-sm property-card">
              <div class="row g-0">
                <!-- Image placeholder -->
                <div class="col-md-4">
                  <svg
                    class="bd-placeholder-img w-100 h-100 rounded-start"
                    height="180"
                    role="img"
                  >
                    <rect width="100%" height="100%" fill="#e9ecef"></rect>
                  </svg>
                </div>

                <!-- Details -->
                <div class="col-md-5 p-3">
                  <h5 class="placeholder-glow">
                    <span class="placeholder col-8"></span>
                  </h5>
                  <p class="placeholder-glow">
                    <span class="placeholder col-10"></span>
                    <span class="placeholder col-6"></span>
                  </p>
                </div>

                <!-- Rating -->
                <div class="col-md-1 d-flex align-items-center justify-content-center">
                  <span class="placeholder col-8"></span>
                </div>

                <!-- Price + button -->
                <div class="col-md-2 p-3 text-end">
                  <p class="placeholder-glow mb-2">
                    <span class="placeholder col-10"></span>
                  </p>
                  <span class="btn btn-outline-primary btn-sm disabled placeholder col-12"></span>
                </div>
              </div>
            </div>
          </div>


          <!-- Actual properties -->
          <div class="col-12 mb-3" v-for="(property, index) in properties" :key="index">
            <div class="card shadow-sm property-card h-100 overflow-hidden" role="button" @click="checkDetails(property.id)">
              <div class="row g-0 h-100">
                <div class="col-md-4">
                  <div class="ratio ratio-16x9 h-md-100">
                    <img
                      :src="property.image_url || placeholderImg"
                      @error="$event.target.src = placeholderImg"
                      class="w-100 h-100 object-fit-cover"
                      alt="Property"
                    />
                  </div>
                </div>

                <div class="col-md-8">
                  <div class="d-flex flex-column h-100">
                    
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 class="card-title fw-bold mb-1">
                            {{ property.title }}
                          </h5>
                          <p class="text-muted small mb-2">
                            <i class="bi bi-geo-alt-fill me-1"></i>{{ property.town_name }}, {{ property.state_name }}
                          </p>
                        </div>
                        
                        <div class="text-end">
                          <span class="badge bg-success fs-6">8.7</span>
                          <div class="small text-muted d-none d-sm-block">Excellent</div>
                        </div>
                      </div>

                      <p class="card-text text-muted small mb-0 mt-2 text-truncate-custom">
                        {{ property.description }}
                      </p>
                    </div>

                    <div class="mt-auto p-3 bg-light-subtle border-top border-md-start-0">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <div class="fw-bold text-primary fs-5">
                            {{ property.price }}
                          </div>
                          <small class="text-muted">
                            {{ toTitle(property.agreement_type) }} /
                            {{ toTitle(property.payment_frequency) }}
                          </small>
                        </div>  
                        
                        <div class="d-md-none">
                          <span class="btn btn-sm btn-outline-primary px-3">View</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div> 
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
      <hr>
      <!-- Pagination -->
      <nav v-if="lastPage >= 1" class="mt-4">
        <ul class="pagination justify-content-center">

          <!-- Prev -->
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">
              Previous
            </button>
          </li>

          <!-- Pages -->
          <li
            v-for="page in lastPage"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="changePage(page)">
              {{ page }}
            </button>
          </li>

          <!-- Next -->
          <li class="page-item" :class="{ disabled: currentPage === lastPage }">
            <button class="page-link" @click="changePage(currentPage + 1)">
              Next
            </button>
          </li>

        </ul>
      </nav>
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
  getFilterPropertyByType,
  searchProperties
} from '@/api/property';
import successToast from '@/components/successToast.vue';
import Header from '@/components/Header.vue';
import MapSection from '@/components/MapSection.vue';
import { prevRoute } from '@/router';

export default {
  name: 'Home',
  components: { RouterLink, successToast, Header, MapSection },
  data() {
    return {
      showMap: false,
      showSuccess: false,
      subSuccess: false,
      amenities: [],
      facilities: [],
      property_types: [
        {
            "id": null,
            "type_name": "Property Types",
            "created_at": null,
            "updated_at": null
        }
      ],
      properties: [],
      message: '',
      placeholderImg : placeholderImg ,
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
      selectedAgreement: "",
      min_price: 0,             // ensure these exist
      max_price: 0,
      loading: true,          // controls placeholders
      loadingAmenities: true,
      loadingFacilities: true,
      currentPage: 1,
      lastPage: 1,
      total: 0,
      searchQuery: '',
    };
  },
  methods: {
    applyPriceFilter() {
      // 1. Logic check: Swap values if Min is greater than Max
      if (this.min_price > 0 && this.max_price > 0 && this.min_price > this.max_price) {
        const temp = this.min_price;
        this.min_price = this.max_price;
        this.max_price = temp;
      }

      // 2. Trigger Search
      this.currentPage = 1;
      this.getFilteredProperties(1);
    },

    // Triggered by your "Reset" button
    resetPriceFilter() {
      this.min_price = null;
      this.max_price = null;
      this.currentPage = 1;

      // Refresh the list
      // If other filters are active, use getFiltered, otherwise use standard get
      if (this.selectedAmenities.length || this.selectedType || this.selectedAgreement) {
        this.getFilteredProperties(1);
      } else {
        this.getProperties(1);
      }
    },
    toTitle(text){
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : "asd";
    },
    checkDetails(id){
      this.$router.push(`/property/${id}`)
    },
    changePage(page) {
      // Prevent out of bounds
      if (page < 1 || page > this.lastPage) return;

      this.currentPage = page;

      // Logic check: Is any filter currently active?
      const hasFilters = 
        this.selectedAmenities.length > 0 ||
        this.selectedFacilities.length > 0 ||
        this.selectedType ||
        this.selectedAgreement ||
        this.min_price || 
        this.max_price;

      if (hasFilters) {
        this.getFilteredProperties(page);
      } else {
        this.getProperties(page);
      }
    },
    async getProperties(page = 1) {
      this.loading = true;
      try {
        this.properties = [];
        const response = await getProperties(page);

        const paginated = response.data.properties;
        // console.log(response, "Response");
        // console.log(paginated, "Paginated Data");

        this.properties = paginated.data;
        this.currentPage = paginated.current_page;
        this.lastPage = paginated.last_page;
        this.total = paginated.total;

      } catch (error) {
        console.log(error);
        this.properties = [];
      } finally {
        this.loading = false;
      }
    },
    async getAmenities() {
      this.loadingAmenities = true;
      try {
        const response = await getAmenities();
        this.amenities = response;
      } catch (error) {
        console.log('Amenities Error:', error);
      } finally {
        this.loadingAmenities = false;
      }
    },
    async getFacilities() {
      this.loadingFacilities = true;
      try {
        const response = await getFacilities();
        this.facilities = response;
      } catch (error) {
        console.log('Facilities Error:', error);
      } finally {
        this.loadingFacilities = false;
      }
    },
    async getPropertyTypes() {
      try {
        const response = await getPropertyTypes();
        this.property_types = [
          ...this.property_types, 
          ...response // Note: usually Axios data is in .data, check your API structure
        ];
      } catch (error) {
        console.log('Property Types Error: ' + error);
      }
    },
    async getFilteredProperties(page = 1) {
      this.loading = true;
      try {
        this.properties = [];
        const response = await getFilteredProperties(
          this.selectedAmenities,
          this.selectedFacilities,
          this.min_price,
          this.max_price,
          this.selectedType,
          this.selectedAgreement,
          page
        );

        // Standard Laravel pagination response structure
        const paginated = response.data.properties;
        this.properties = paginated.data;
        this.currentPage = paginated.current_page;
        this.lastPage = paginated.last_page;
        this.total = paginated.total;

      } catch (error) {
        console.error("Filter Error:", error);
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
    },
    async searchByQuery(page = 1) {
      if (!this.searchQuery.trim()) return; // ignore empty searches

      this.loading = true;
      this.currentPage = page;

      try {
      // console.log('Searching for:', this.searchQuery);
        const response = await searchProperties(this.searchQuery, page);
        console.log(response, "Search Response");

        const paginated = response.data.properties;

        this.properties = paginated.data;
        this.currentPage = paginated.current_page;
        this.lastPage = paginated.last_page;
        this.total = paginated.total;

      } catch (error) {
        // console.log('Search Error: ', error);
        this.properties = [];
      } finally {
        this.loading = false;
      }
    },
    
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
      min_price(newVal) {
      if (newVal < 0) {
        this.min_price = 0;
      }
      // Optional: Ensure min doesn't exceed max when max is set
      if (this.max_price && newVal > this.max_price) {
        // You can either reset it or show a warning
        this.min_price = this.max_price; 
      }
    },

    // Watches max_price for changes
    max_price(newVal) {
      if (newVal < 0) {
        this.max_price = 0;
      }
    },
    properties() {
      this.showMap = false;
    },
    selectedType() {
      this.currentPage = 1;
      this.getFilteredProperties(1);
    },
    selectedAgreement() {
      this.currentPage = 1;
      this.getFilteredProperties(1);
    },
    selectedAmenities: {
      handler() {
        this.currentPage = 1;
        this.getFilteredProperties(1);
      },
      deep: true
    },
    selectedFacilities: {
      handler() {
        this.currentPage = 1;
        this.getFilteredProperties(1);
      },
      deep: true
    },
    
  }
};
</script>

<style scoped>
.property-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.property-card .card-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;   
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important;
}

.property-card .card-img-top {
  height: 200px;          /* adjust as needed */
  object-fit: cover;      /* crop to fit without distortion */
  width: 100%;            /* ensure full card width */
}


/* .placeholder {
  Bootstrap default is #dee2e6; override if needed
} */
</style>
