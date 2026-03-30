<template>
  <Header />

  <successToast v-if="showSuccess" message="🎉 Login successful, Welcome!" />
  <successToast v-if="subSuccess" message="🎉 You are an owner now!" />

  <section class="search-hero pt-5 pb-4 mb-4">
    <div class="container">
      <div class="hero-shell">
        <p class="hero-eyebrow mb-2">Search and Compare</p>
        <h2 class="hero-title fw-bold mb-2">Discover Spaces Built For Your Needs</h2>
        <p class="hero-subtitle mb-4">
          Browse verified listings by type, agreement, and location with map-aware search.
        </p>
      </div>
      <div class="search-box p-3 rounded-4 row g-2 align-items-center mx-0">
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
  </section>

  <OwnerSubscriptionExpiredBanner />
  <SubscriptionWarningBanner />

  <div v-if="showMap" class="container-md container-sm px-0 mb-4 map-shell">
    <MapSection :properties="properties" />
  </div>

  <div class="container my-5 home-shell">
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
        <button class="btn btn-mobile-filter w-100 d-flex justify-content-between align-items-center px-4 py-3 rounded-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileFilters" aria-controls="mobileFilters">
          <span><i class="bi bi-sliders2-vertical me-2"></i> Refine Search</span>
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>

      <!-- Property Listings -->
      <div class="col-lg-9">
        <!-- Result count -->
        <div class="result-header d-flex justify-content-between align-items-center mb-4">
          <div>
            <p class="result-eyebrow mb-1">Available Now</p>
            <h5 class="fw-bold mb-0" v-if="!loading">{{ total }} results found</h5>
          </div>
          <div v-if="loading" class="placeholder col-2"></div>
        </div>

        <!-- Loading PlaceHolder -->
        <div class="row g-4">
          <div v-if="loading" class="col-12" v-for="n in 4" :key="'skel-'+n">
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden loading-card">
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
                  <button
                    v-if="canShowBookmarkAction"
                    class="bookmark-btn"
                    :class="{ active: isBookmarked(property.id) }"
                    type="button"
                    :disabled="bookmarkBusyId === property.id"
                    @click.stop="toggleBookmark(property.id)"
                  >
                    <i class="bi" :class="isBookmarked(property.id) ? 'bi-heart-fill' : 'bi-heart'"></i>
                  </button>
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
                        <span class="badge bg-primary px-3 py-2 rounded-3">
                          {{ getPropertyAverageRating(property).toFixed(1) }}
                        </span>
                        <p class="small text-muted mb-0">
                          {{ getPropertyTotalReviews(property) }} review{{ getPropertyTotalReviews(property) === 1 ? "" : "s" }}
                        </p>
                      </div>
                    </div>
                    <p class="text-muted small mb-3">
                      <i class="bi bi-geo-alt text-danger me-1"></i> {{ property.town_name }}, {{ property.state_name }}
                    </p>
                    <div class="mb-2">
                      <span
                        class="badge rounded-pill"
                        :class="ownerVerificationBadgeClass(property)"
                      >
                        {{ ownerVerificationLabel(property) }}
                      </span>
                    </div>
                    <p class="text-secondary small flex-grow-1 text-truncate-custom">
                      {{ property.description }}
                    </p>
                    <div v-if="property.display_chips && property.display_chips.length" class="d-flex flex-wrap gap-2 mb-2">
                      <span
                        v-for="chip in property.display_chips"
                        :key="`${property.id}-${chip}`"
                        class="feature-chip"
                      >
                        {{ chip }}
                      </span>
                      <span v-if="(property.display_chips_more_count || 0) > 0" class="feature-chip feature-chip-more">
                        +{{ property.display_chips_more_count }} more
                      </span>
                    </div>
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
            <button @click="resetPriceFilter" class="btn btn-primary rounded-pill px-4 mt-2 fw-bold">Clear All Filters</button>
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

  <div class="offcanvas offcanvas-start mobile-filters-offcanvas" tabindex="-1" id="mobileFilters" aria-labelledby="mobileFiltersLabel">
    <div class="offcanvas-header border-bottom mobile-filters-header">
      <div>
        <p class="result-eyebrow mb-1">Search Controls</p>
        <h5 class="offcanvas-title fw-bold mb-0" id="mobileFiltersLabel">Filters</h5>
      </div>
      <button
        type="button"
        class="btn mobile-close-btn rounded-pill d-inline-flex align-items-center gap-2"
        data-bs-dismiss="offcanvas"
        aria-label="Close filters"
      >
        <i class="bi bi-x-lg"></i>
        <span>Close</span>
      </button>
    </div>
    <div class="offcanvas-body mobile-filters-body">
      <p class="small text-muted mobile-filters-copy">Refine your search results without losing your place.</p>
      <aside class="col-lg-3 d-lg-block">
        <div class="sticky-top" style="top: 100px; z-index: 10;">
          <div class="filter-card mobile-filter-card p-3 border rounded-4 shadow-sm bg-white mb-3">
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

          <div class="filter-card mobile-filter-card p-3 border rounded-4 shadow-sm bg-white mb-3">
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

          <div class="filter-card mobile-filter-card p-3 border rounded-4 shadow-sm bg-white">
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
      <div class="mobile-filters-footer">
        <button
          type="button"
          class="btn btn-primary rounded-pill fw-bold px-4 flex-fill"
          data-bs-dismiss="offcanvas"
        >
          Done
        </button>
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
  getFilterPropertyByType,
  searchProperties,
  recordView
} from '@/api/property';
import { bookmarkProperty, getBookmarkedPropertyIds, removeBookmarkedProperty } from '@/api/bookmarks';
import successToast from '@/components/successToast.vue';
import Header from '@/components/Header.vue';
import MapSection from '@/components/MapSection.vue';
import SubscriptionWarningBanner from '@/components/SubscriptionWarningBanner.vue';
import OwnerSubscriptionExpiredBanner from '@/components/OwnerSubscriptionExpiredBanner.vue';
import { useUserInfo } from '@/store/userInfo';
import Swal from 'sweetalert2';

export default {
  name: 'Home',
  components: { RouterLink, successToast, Header, MapSection, SubscriptionWarningBanner, OwnerSubscriptionExpiredBanner },
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
      bookmarkBusyId: null,
      bookmarkedPropertyIds: [],
      currentPage: 1,
      lastPage: 1,
      total: 0,
      searchQuery: '',
    };
  },
  methods: {
    normalizeOwnerVerificationStatus(property) {
      const raw =
        property?.owner_verification_status ??
        property?.verification_status ??
        property?.owner_status ??
        null;
      const status = String(raw || "unverified").toLowerCase().trim();
      return ["verified", "pending", "rejected", "unverified"].includes(status) ? status : "unverified";
    },
    ownerVerificationLabel(property) {
      const status = this.normalizeOwnerVerificationStatus(property);
      if (status === "verified") return "Verified Owner";
      if (status === "pending") return "Verification Pending";
      if (status === "rejected") return "Verification Rejected";
      return "Unverified Owner";
    },
    ownerVerificationBadgeClass(property) {
      const status = this.normalizeOwnerVerificationStatus(property);
      if (status === "verified") return "bg-success-subtle text-success";
      if (status === "pending") return "bg-warning-subtle text-warning-emphasis";
      if (status === "rejected") return "bg-danger-subtle text-danger";
      return "bg-secondary-subtle text-secondary";
    },
    async loadBookmarks() {
      if (!this.canShowBookmarkAction) {
        this.bookmarkedPropertyIds = [];
        return;
      }

      try {
        const response = await getBookmarkedPropertyIds();
        this.bookmarkedPropertyIds = Array.isArray(response?.data?.data)
          ? response.data.data.map((id) => Number(id))
          : [];
      } catch (error) {
        console.error("Unable to load bookmarks:", error);
      }
    },
    isBookmarked(propertyId) {
      return this.bookmarkedPropertyIds.includes(Number(propertyId));
    },
    async toggleBookmark(propertyId) {
      if (!this.canShowBookmarkAction || this.bookmarkBusyId === propertyId) return;

      this.bookmarkBusyId = propertyId;
      try {
        let response;
        if (this.isBookmarked(propertyId)) {
          response = await removeBookmarkedProperty(propertyId);
          this.bookmarkedPropertyIds = this.bookmarkedPropertyIds.filter((id) => id !== Number(propertyId));
        } else {
          response = await bookmarkProperty(propertyId);
          this.bookmarkedPropertyIds = [...new Set([...this.bookmarkedPropertyIds, Number(propertyId)])];
        }

        await Swal.fire({
          icon: "success",
          title: this.isBookmarked(propertyId) ? "Property saved" : "Bookmark removed",
          text: response?.data?.message || "Bookmark updated successfully.",
          timer: 1600,
          showConfirmButton: false,
        });
      } catch (error) {
        if (error?.response?.status === 401) {
          await Swal.fire({
            icon: "info",
            title: "Login required",
            text: "Please sign in first to save properties.",
          });
          this.$router.push("/login");
        } else {
          await Swal.fire({
            icon: "error",
            title: "Bookmark failed",
            text: error?.response?.data?.message || "Unable to update this bookmark right now.",
          });
        }
      } finally {
        this.bookmarkBusyId = null;
      }
    },
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
    getPropertyAverageRating(property) {
      const value = Number(property?.average_rating ?? property?.avg_rating ?? 0);
      return Number.isFinite(value) ? value : 0;
    },
    getPropertyTotalReviews(property) {
      const value = Number(property?.total_reviews ?? property?.review_count ?? 0);
      return Number.isFinite(value) ? value : 0;
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
    isPropertyVisible(property) {
      const status = String(property?.status || "").toLowerCase();
      return property?.is_available !== false && status !== "pending";
    },
    async getProperties(page = 1) {
      this.loading = true;
      try {
        const response = await getProperties(page);
        const paginated = response.data.properties;
        this.properties = (paginated.data || []).filter(this.isPropertyVisible);
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
        this.properties = (paginated.data || []).filter(this.isPropertyVisible);
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
        this.properties = (paginated.data || []).filter(this.isPropertyVisible);
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
    this.loadBookmarks();
  },
  watch: {
    selectedType() { this.currentPage = 1; this.getFilteredProperties(1); },
    selectedAgreement() { this.currentPage = 1; this.getFilteredProperties(1); },
    selectedAmenities: { handler() { this.currentPage = 1; this.getFilteredProperties(1); }, deep: true },
    selectedFacilities: { handler() { this.currentPage = 1; this.getFilteredProperties(1); }, deep: true },
  },
  computed: {
    canShowBookmarkAction() {
      const info = useUserInfo();
      const role = String(info.role || "").toLowerCase();
      return info.isLoggedIn && !["owner", "admin"].includes(role);
    },
  }
};
</script>

<style scoped>
.home-shell {
  background: radial-gradient(circle at 20% 0, #edf4ff 0%, #f8fbff 30%, #ffffff 100%);
}

.search-hero {
  background:
    linear-gradient(145deg, rgba(20, 51, 98, 0.84), rgba(38, 90, 168, 0.78)),
    url("../../assets/Main/home.avif");
  background-size: cover;
  background-position: center;
}

.hero-shell {
  margin-bottom: 1rem;
}

.hero-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-size: 0.74rem;
  font-weight: 700;
  color: #dce9ff;
}

.hero-title {
  color: #ffffff;
  letter-spacing: -0.015em;
}

.hero-subtitle {
  color: rgba(240, 247, 255, 0.9);
  max-width: 62ch;
}

.search-box {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #dce8fb;
  box-shadow: 0 12px 24px rgba(23, 54, 99, 0.08);
  backdrop-filter: blur(3px);
}

.border-end-md {
  border-right: 1px solid #eaf0f9;
}

.custom-select {
  font-weight: 500;
  cursor: pointer;
}

.custom-select:focus,
input.form-control:focus {
  box-shadow: none;
  outline: 2px solid #bfd5ff;
  outline-offset: 0;
}

.map-shell {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #dce8fb;
  box-shadow: 0 12px 24px rgba(23, 54, 99, 0.08);
}

.btn-mobile-filter {
  border: 1px solid #d6e4fb;
  color: #204884;
  background: #f7fbff;
  font-weight: 700;
  box-shadow: 0 10px 20px rgba(23, 54, 99, 0.08);
}

.btn-mobile-filter:hover {
  background: #eef5ff;
}

.mobile-filters-offcanvas {
  width: min(88vw, 360px);
  border-right: 1px solid #dce8fb;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  overflow: hidden;
  box-shadow: 14px 0 34px rgba(16, 45, 88, 0.16);
}

.mobile-filters-header {
  position: sticky;
  top: 0;
  z-index: 30;
  padding: 1rem 1rem 0.95rem;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
}

.mobile-close-btn {
  border: 1px solid #d8e6fb;
  background: #eff5ff;
  color: #204884;
  font-weight: 700;
  padding: 0.55rem 0.9rem;
}

.mobile-close-btn:hover {
  background: #e3eefc;
}

.mobile-filters-body {
  padding: 1rem 1rem calc(1rem + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(180deg, #f9fbff 0%, #ffffff 100%);
  overflow-y: auto;
}

.mobile-filters-body .sticky-top {
  position: static !important;
  top: auto !important;
  z-index: auto !important;
}

.mobile-filters-copy {
  margin: 0 0 1rem;
  color: #6a85ac;
}

.mobile-filter-card {
  padding: 1rem !important;
}

.mobile-filters-footer {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  padding-bottom: calc(0.25rem + env(safe-area-inset-bottom, 0px));
  margin-top: 1rem;
  background: linear-gradient(180deg, rgba(249, 251, 255, 0) 0%, #f9fbff 24%, #f9fbff 100%);
}

.filter-card {
  border: 1px solid #e1ebfb !important;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 18px rgba(21, 48, 88, 0.05);
}

.result-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.7rem;
  font-weight: 700;
  color: #4a6da5;
}

.property-horizontal-card {
  cursor: pointer;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s ease, border-color 0.55s ease;
  border: 1px solid #e4ecf8 !important;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.bookmark-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 3;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  color: #d14b68;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
}

.bookmark-btn.active {
  background: #d14b68;
  color: #fff;
}

.bookmark-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.property-horizontal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 30px rgba(16, 45, 88, 0.12) !important;
  border-color: #bfd5fb !important;
}

.loading-card {
  border: 1px solid #e7eef8 !important;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.text-truncate-custom {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feature-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #1d4d97;
  background: #edf4ff;
  border: 1px solid #d5e4ff;
}

.feature-chip-more {
  color: #5f6b7a;
  background: #f3f5f8;
  border-color: #e0e6ee;
}

.filter-list {
  max-height: 200px;
  overflow-y: auto;
}

.scroll-custom::-webkit-scrollbar {
  width: 5px;
}

.scroll-custom::-webkit-scrollbar-thumb {
  background: #d6deea;
  border-radius: 10px;
}

.custom-pagination .page-link {
  border: 1px solid #d9e6fb;
  color: #4b668e;
  margin: 0 5px;
  border-radius: 999px !important;
  padding: 8px 16px;
  background: #fff;
}

.custom-pagination .active .page-link {
  background-color: #3f73cb;
  border-color: #3f73cb;
  color: #fff;
}

.property-image-wrapper {
  height: 250px;
  width: 100%;
  overflow: hidden;
}

.property-image {
  width: 100%;
  height: 100% !important;
  object-fit: cover;
  object-position: center;
  transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}

.property-horizontal-card:hover .property-image {
  transform: scale(1.045);
}

.property-horizontal-card .row.g-0 {
  align-items: stretch;
}

@media (max-width: 768px) {
  .property-image-wrapper {
    height: 200px;
  }

  .border-end-md {
    border-right: none;
    border-bottom: 1px solid #eef3fb;
  }

  .search-hero {
    padding-top: 2rem !important;
  }

  .mobile-filters-offcanvas {
    width: min(92vw, 340px);
    border-top-right-radius: 22px;
    border-bottom-right-radius: 22px;
  }

  .mobile-filter-card .filter-list {
    max-height: 180px;
  }
}

@media (max-width: 420px) {
  .mobile-filters-offcanvas {
    width: calc(100vw - 18px);
  }

  .mobile-close-btn span {
    display: none;
  }

  .mobile-close-btn {
    padding-inline: 0.8rem;
  }

  .mobile-filters-footer {
    gap: 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .property-horizontal-card,
  .property-image,
  .btn,
  .card,
  .pagination .page-link {
    transition: none !important;
    animation: none !important;
  }
}
</style>
