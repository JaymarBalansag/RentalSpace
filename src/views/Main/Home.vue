<template>
  <Header />

  <successToast v-if="showSuccess" message="🎉 Login successful, Welcome!" />
  <successToast v-if="subSuccess" message="🎉 You are an owner now!" />

  <div class="search-hero bg-primary-gradient pt-5 pb-4 mb-4">
    <div class="container text-white">
      <h2 class="fw-bold mb-3">Find Your Perfect Space</h2>
      <div class="search-box p-3 bg-white rounded-4 shadow-lg row g-2 align-items-center mx-0">
        <div class="col-md-3 border-end-md">
          <label class="small text-muted d-block ms-2 fw-bold">Type</label>
          <select class="form-select border-0 shadow-none custom-select" v-model="selectedType">
            <option v-for="(type, index) in property_types" :key="index" :value="type.id">
              {{ type.type_name }}
            </option>
          </select>
        </div>

        <div class="col-md-3 border-end-md">
          <label class="small text-muted d-block ms-2 fw-bold">Agreement</label>
          <select class="form-select border-0 shadow-none custom-select" v-model="selectedAgreement">
            <option value="">Any Agreement</option>
            <option value="rental">Rental</option>
            <option value="lease">Lease</option>
          </select>
        </div>

        <div class="col-md-4">
          <label class="small text-muted d-block ms-2 fw-bold">Location</label>
          <input 
            type="text" 
            class="form-control border-0 shadow-none" 
            v-model="searchQuery" 
            placeholder="Where are you going?"
            @keyup.enter="searchByQuery(1)"
          >
        </div>

        <div class="col-md-2 d-flex gap-2">
          <button class="btn btn-primary rounded-3 w-100 py-2 fw-bold" @click="searchByQuery(1)">
            <i class="bi bi-search"></i>
          </button>
          <button 
            class="btn btn-outline-primary rounded-3 w-100 py-2" 
            @click="showMap = !showMap"
            v-if="properties.length"
          >
            <i class="bi" :class="showMap ? 'bi-list-ul' : 'bi-map'"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showMap" class="container-md container-sm px-0 mb-4 animate-fade-in">
    <MapSection :properties="properties" />
  </div>

  <div class="container my-5">
    <div class="row g-4">
      <aside class="col-lg-3 d-none d-lg-block">
        <div class="sticky-top" style="top: 100px; z-index: 10;">
          <div class="filter-card p-3 border rounded-4 shadow-sm bg-white mb-4">
            <h6 class="fw-bold mb-3 d-flex align-items-center">
              <i class="bi bi-tags me-2 text-primary"></i> Price Range
            </h6>
            <div class="row g-2 mb-3">
              <div class="col-6">
                <input type="number" v-model.number="min_price" class="form-control form-control-sm rounded-3" placeholder="Min">
              </div>
              <div class="col-6">
                <input type="number" v-model.number="max_price" class="form-control form-control-sm rounded-3" placeholder="Max">
              </div>
            </div>
            <button @click="applyPriceFilter" class="btn btn-primary btn-sm w-100 rounded-3 fw-bold mb-2">Apply</button>
            <button @click="resetPriceFilter" class="btn btn-link btn-sm w-100 text-muted text-decoration-none">Reset Price</button>
          </div>

          <div class="filter-card p-3 border rounded-4 shadow-sm bg-white mb-4">
            <h6 class="fw-bold mb-3">Amenities</h6>
            <div v-if="loadingAmenities" class="placeholder-glow">
              <div v-for="n in 5" :key="n" class="placeholder col-10 mb-2 rounded"></div>
            </div>
            <div v-else class="filter-list scroll-custom">
              <div class="form-check mb-2" v-for="(amenity, index) in amenities" :key="index">
                <input class="form-check-input" type="checkbox" :id="'amenity-'+index" :value="amenity.id" v-model="selectedAmenities">
                <label class="form-check-label small" :for="'amenity-'+index">{{ amenity.amenity_name }}</label>
              </div>
            </div>
          </div>

          <div class="filter-card p-3 border rounded-4 shadow-sm bg-white">
            <h6 class="fw-bold mb-3">Facilities</h6>
            <div v-if="loadingFacilities" class="placeholder-glow">
              <div v-for="n in 5" :key="n" class="placeholder col-10 mb-2 rounded"></div>
            </div>
            <div v-else class="filter-list scroll-custom">
              <div class="form-check mb-2" v-for="(facility, index) in facilities" :key="index">
                <input class="form-check-input" type="checkbox" :id="'fac-'+index" :value="facility.id" v-model="selectedFacilities">
                <label class="form-check-label small" :for="'fac-'+index">{{ facility.facility_name }}</label>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Filter button on Mobile -->
      <div class="col-12 d-lg-none mb-3">
        <button class="btn btn-outline-dark w-100 d-flex justify-content-between align-items-center px-4 py-2 rounded-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileFilters">
          <span><i class="bi bi-sliders2-vertical me-2"></i> Filters</span>
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>

      <!-- Property Listings -->
      <div class="col-lg-9">
        <!-- Result count -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="fw-bold mb-0" v-if="!loading">{{ total }} results found</h5>
          <div v-else class="placeholder col-2"></div>
        </div>

        <!-- Loading PlaceHolder -->
        <div class="row g-4">
          <div v-if="loading" class="col-12" v-for="n in 4" :key="'skel-'+n">
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div class="row g-0">
                <div class="col-md-4 bg-light placeholder-glow">
                  <div class="placeholder w-100 h-100" style="min-height: 200px;"></div>
                </div>
                <div class="col-md-8 p-4">
                  <div class="placeholder col-6 mb-2"></div>
                  <div class="placeholder col-4 mb-3"></div>
                  <div class="placeholder col-12 mb-2"></div>
                  <div class="placeholder col-10"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actual Property if found -->
          <div class="col-12" v-for="(property, index) in properties" :key="index">
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden property-horizontal-card h-100" @click="checkDetails(property.id)">
              <div class="row g-0 h-100">
                <div class="col-md-4 position-relative">
                  <div class="property-image-wrapper"> <img 
                      :src="property.image_url || placeholderImg" 
                      @error="$event.target.src = placeholderImg" 
                      class="img-fluid property-image" 
                      alt="Property"
                    >
                  </div>
                  <div class="badge-overlay position-absolute top-0 start-0 p-3">
                    <span class="badge bg-white text-dark shadow-sm py-2 px-3 rounded-pill small">
                      {{ toTitle(property.agreement_type) }}
                    </span>
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="card-body p-4 d-flex flex-column h-100">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <h5 class="fw-bold text-dark mb-0">{{ property.title }}</h5>
                      <div class="text-end">
                        <span class="badge bg-primary px-3 py-2 rounded-3">8.7</span>
                      </div>
                    </div>
                    <p class="text-muted small mb-3">
                      <i class="bi bi-geo-alt text-danger me-1"></i> {{ property.town_name }}, {{ property.state_name }}
                    </p>
                    <p class="text-secondary small flex-grow-1 text-truncate-custom">
                      {{ property.description }}
                    </p>
                    <div class="d-flex justify-content-between align-items-end border-top pt-3 mt-3">
                      <div>
                        <span class="text-primary fw-bold fs-4">{{ property.price }}</span>
                        <span class="text-muted small"> / {{ toTitle(property.payment_frequency) }}</span>
                      </div>
                      <button class="btn btn-outline-primary px-4 rounded-pill fw-bold btn-sm">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No property Result -->
          <div v-if="!loading && properties.length === 0" class="col-12 text-center py-5">
            <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" alt="No data" style="width: 120px; opacity: 0.5;">
            <h5 class="mt-4 fw-bold text-muted">No Properties Found</h5>
            <p class="text-muted">Try adjusting your filters or search query to find more results.</p>
            <button @click="resetPriceFilter" class="btn btn-primary rounded-pill px-4 mt-2">Clear All Filters</button>
          </div>
        </div>

        <!-- Navigation for pagination -->
        <nav v-if="lastPage > 1 && !loading" class="mt-5">
          <ul class="pagination justify-content-center custom-pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link shadow-none" @click="changePage(currentPage - 1)">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            <li v-for="page in lastPage" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <button class="page-link shadow-none" @click="changePage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === lastPage }">
              <button class="page-link shadow-none" @click="changePage(currentPage + 1)">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>

  <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileFilters" aria-labelledby="mobileFiltersLabel">
    <div class="offcanvas-header border-bottom">
      <h5 class="offcanvas-title fw-bold" id="mobileFiltersLabel">Filters</h5>
      <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <p class="small text-muted my-4">Refine your search results</p>
      <aside class="col-lg-3 d-lg-block">
        <div class="sticky-top" style="top: 100px; z-index: 10;">
          <div class="filter-card p-3 border rounded-4 shadow-sm bg-white mb-4">
            <h6 class="fw-bold mb-3 d-flex align-items-center">
              <i class="bi bi-tags me-2 text-primary"></i> Price Range
            </h6>
            <div class="row g-2 mb-3">
              <div class="col-6">
                <input type="number" v-model.number="min_price" class="form-control form-control-sm rounded-3" placeholder="Min">
              </div>
              <div class="col-6">
                <input type="number" v-model.number="max_price" class="form-control form-control-sm rounded-3" placeholder="Max">
              </div>
            </div>
            <button @click="applyPriceFilter" class="btn btn-primary btn-sm w-100 rounded-3 fw-bold mb-2">Apply</button>
            <button @click="resetPriceFilter" class="btn btn-link btn-sm w-100 text-muted text-decoration-none">Reset Price</button>
          </div>

          <div class="filter-card p-3 border rounded-4 shadow-sm bg-white mb-4">
            <h6 class="fw-bold mb-3">Amenities</h6>
            <div v-if="loadingAmenities" class="placeholder-glow">
              <div v-for="n in 5" :key="n" class="placeholder col-10 mb-2 rounded"></div>
            </div>
            <div v-else class="filter-list scroll-custom">
              <div class="form-check mb-2" v-for="(amenity, index) in amenities" :key="index">
                <input class="form-check-input" type="checkbox" :id="'amenity-'+index" :value="amenity.id" v-model="selectedAmenities">
                <label class="form-check-label small" :for="'amenity-'+index">{{ amenity.amenity_name }}</label>
              </div>
            </div>
          </div>

          <div class="filter-card p-3 border rounded-4 shadow-sm bg-white">
            <h6 class="fw-bold mb-3">Facilities</h6>
            <div v-if="loadingFacilities" class="placeholder-glow">
              <div v-for="n in 5" :key="n" class="placeholder col-10 mb-2 rounded"></div>
            </div>
            <div v-else class="filter-list scroll-custom">
              <div class="form-check mb-2" v-for="(facility, index) in facilities" :key="index">
                <input class="form-check-input" type="checkbox" :id="'fac-'+index" :value="facility.id" v-model="selectedFacilities">
                <label class="form-check-label small" :for="'fac-'+index">{{ facility.facility_name }}</label>
              </div>
            </div>
          </div>
        </div>
      </aside>
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
  searchProperties,
  recordView
} from '@/api/property';
import successToast from '@/components/successToast.vue';
import Header from '@/components/Header.vue';
import MapSection from '@/components/MapSection.vue';

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
      property_types: [{ "id": null, "type_name": "Property Types" }],
      properties: [],
      placeholderImg: placeholderImg,
      selectedAmenities: [],
      selectedFacilities: [],
      selectedType: null,
      selectedAgreement: "",
      min_price: null,
      max_price: null,
      loading: true,
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
      if (this.min_price > 0 && this.max_price > 0 && this.min_price > this.max_price) {
        [this.min_price, this.max_price] = [this.max_price, this.min_price];
      }
      this.currentPage = 1;
      this.getFilteredProperties(1);
    },
    resetPriceFilter() {
      this.min_price = null;
      this.max_price = null;
      this.selectedAmenities = [];
      this.selectedFacilities = [];
      this.selectedType = null;
      this.selectedAgreement = "";
      this.searchQuery = "";
      this.currentPage = 1;
      this.getProperties(1);
    },
    toTitle(text) {
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
    },
    async checkDetails(id) {
      await recordView(id);
      this.$router.push(`/property/${id}`)
    },
    changePage(page) {
      if (page < 1 || page > this.lastPage) return;
      this.currentPage = page;
      const hasFilters = this.selectedAmenities.length || this.selectedFacilities.length || this.selectedType || this.selectedAgreement || this.min_price || this.max_price;
      hasFilters ? this.getFilteredProperties(page) : this.getProperties(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async getProperties(page = 1) {
      this.loading = true;
      try {
        const response = await getProperties(page);
        const paginated = response.data.properties;
        this.properties = paginated.data;
        this.currentPage = paginated.current_page;
        this.lastPage = paginated.last_page;
        this.total = paginated.total;
      } catch (error) {
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
      } finally {
        this.loadingAmenities = false;
      }
    },
    async getFacilities() {
      this.loadingFacilities = true;
      try {
        const response = await getFacilities();
        this.facilities = response;
      } finally {
        this.loadingFacilities = false;
      }
    },
    async getPropertyTypes() {
      try {
        const response = await getPropertyTypes();
        this.property_types = [{ "id": null, "type_name": "Property Types" }, ...response];
      } catch (error) {
        console.error(error);
      }
    },
    async getFilteredProperties(page = 1) {
      this.loading = true;
      try {
        const response = await getFilteredProperties(
          this.selectedAmenities,
          this.selectedFacilities,
          this.min_price,
          this.max_price,
          this.selectedType,
          this.selectedAgreement,
          page
        );
        const paginated = response.data.properties;
        this.properties = paginated.data;
        this.currentPage = paginated.current_page;
        this.lastPage = paginated.last_page;
        this.total = paginated.total;
      } finally {
        this.loading = false;
      }
    },
    async searchByQuery(page = 1) {
      if (!this.searchQuery.trim()) return this.getProperties(1);
      this.loading = true;
      try {
        const response = await searchProperties(this.searchQuery, page);
        const paginated = response.data.properties;
        this.properties = paginated.data;
        this.currentPage = paginated.current_page;
        this.lastPage = paginated.last_page;
        this.total = paginated.total;
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

    if (success) { this.showSuccess = true; sessionStorage.removeItem('loginSuccess'); }
    if (subSuccess) { this.subSuccess = true; sessionStorage.removeItem('subscriptionSuccess'); }
  },
  watch: {
    selectedType() { this.currentPage = 1; this.getFilteredProperties(1); },
    selectedAgreement() { this.currentPage = 1; this.getFilteredProperties(1); },
    selectedAmenities: { handler() { this.currentPage = 1; this.getFilteredProperties(1); }, deep: true },
    selectedFacilities: { handler() { this.currentPage = 1; this.getFilteredProperties(1); }, deep: true },
  }
};
</script>

<style scoped>


.bg-primary-gradient {
  background: linear-gradient(135deg, #4780d9 0%, #366ac2 100%);
}

.search-box {
  border-bottom: 4px solid #ffd166;
}

.border-end-md {
  border-right: 1px solid #eef2f6;
}

.custom-select {
  font-weight: 500;
  cursor: pointer;
}

.property-horizontal-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0 !important;
}

.property-horizontal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
  border-color: #4780d9 !important;
}

.text-truncate-custom {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.filter-list {
  max-height: 200px;
  overflow-y: auto;
}

.scroll-custom::-webkit-scrollbar {
  width: 5px;
}
.scroll-custom::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 10px;
}

.custom-pagination .page-link {
  border: none;
  color: #666;
  margin: 0 5px;
  border-radius: 8px !important;
  padding: 8px 16px;
}

.custom-pagination .active .page-link {
  background-color: #4780d9;
  color: white;
}

/* Container for the image to ensure consistent height */
.property-image-wrapper {
  height: 250px; /* Set a fixed height for all images */
  width: 100%;
  overflow: hidden;
}

/* Force the image to cover the area like a background-image */
.property-image {
  width: 100%;
  height: 100% !important;
  object-fit: cover; /* This is the secret sauce */
  object-position: center;
}

/* Adjustments for mobile: images can be shorter if you prefer */
@media (max-width: 768px) {
  .property-image-wrapper {
    height: 200px;
  }
}

/* Ensure the horizontal card aligns properly */
.property-horizontal-card .row.g-0 {
  align-items: stretch; /* Makes sure the text side matches the image height */
}

@media (max-width: 768px) {
  .border-end-md { border-right: none; border-bottom: 1px solid #f0f0f0; }
  .search-hero { padding-top: 2rem !important; }
}
</style>