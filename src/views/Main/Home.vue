<template>
  <Header />

  <successToast v-if="showSuccess" message="Login successful, welcome!" />
  <successToast v-if="subSuccess" message="You are an owner now!" />

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
            <option v-for="type in property_types" :key="type.id ?? 'all-types'" :value="type.id">
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
            v-model="searchQuery"
            type="text"
            class="form-control border-0 shadow-none"
            placeholder="Where are you going?"
            @keyup.enter="applyFilters()"
          >
        </div>

        <div class="col-md-2 d-flex gap-2">
          <button class="btn btn-primary rounded-3 w-100 py-2 fw-bold" @click="applyFilters()">
            <i class="bi bi-search"></i>
          </button>
          <button
            v-if="properties.length"
            class="btn btn-outline-primary rounded-3 w-100 py-2"
            @click="toggleMap()"
          >
            <i class="bi" :class="showMap ? 'bi-list-ul' : 'bi-map'"></i>
          </button>
        </div>
      </div>
    </div>
  </section>

  <OwnerSubscriptionExpiredBanner />
  <SubscriptionWarningBanner />

  <div v-if="showMap && shouldRenderMap" class="container-md container-sm px-0 mb-4 map-shell">
    <MapSection :properties="properties" />
  </div>

  <div class="container my-5 home-shell">
    <div class="row g-4">
      <aside class="col-lg-3 d-none d-lg-block">
        <div class="sticky-top" style="top: 100px; z-index: 10;">
          <HomeFiltersPanel
            id-prefix="desktop"
            :amenities="amenities"
            :facilities="facilities"
            :loading-amenities="loadingAmenities"
            :loading-facilities="loadingFacilities"
            :selected-amenities="selectedAmenities"
            :selected-facilities="selectedFacilities"
            :min-price="min_price"
            :max-price="max_price"
            @update:selected-amenities="selectedAmenities = $event"
            @update:selected-facilities="selectedFacilities = $event"
            @update:min-price="min_price = $event"
            @update:max-price="max_price = $event"
            @apply="applyFilters()"
            @reset="resetAllFilters()"
          />
        </div>
      </aside>

      <div class="col-12 d-lg-none mb-3">
        <button
          class="btn btn-mobile-filter w-100 d-flex justify-content-between align-items-center px-4 py-3 rounded-4"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileFilters"
          aria-controls="mobileFilters"
        >
          <span><i class="bi bi-sliders2-vertical me-2"></i> Refine Search</span>
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>

      <div class="col-lg-9">
        <div class="result-header d-flex justify-content-between align-items-center mb-4">
          <div>
            <p class="result-eyebrow mb-1">Available Now</p>
            <h5 v-if="!loading" class="fw-bold mb-0">{{ total }} results found</h5>
          </div>
          <div v-if="loading" class="placeholder col-2"></div>
        </div>

        <div class="row g-4">
          <div v-for="n in 4" v-if="loading" :key="`skel-${n}`" class="col-12">
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

          <div v-for="property in properties" v-else :key="property.id" class="col-12">
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
                  <div class="property-image-wrapper">
                    <img
                      :src="getPropertyCardImage(property)"
                      :alt="property.title || 'Property'"
                      class="img-fluid property-image"
                      loading="lazy"
                      decoding="async"
                      @error="$event.target.src = placeholderImg"
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
                          {{ property.average_rating_value.toFixed(1) }}
                        </span>
                        <p class="small text-muted mb-0">
                          {{ property.total_reviews_value }} review{{ property.total_reviews_value === 1 ? "" : "s" }}
                        </p>
                      </div>
                    </div>
                    <p class="text-muted small mb-3">
                      <i class="bi bi-geo-alt text-danger me-1"></i> {{ property.town_name }}, {{ property.state_name }}
                    </p>
                    <div class="mb-2">
                      <span class="badge rounded-pill" :class="property.owner_verification_badge_class">
                        {{ property.owner_verification_label }}
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

          <div v-if="!loading && properties.length === 0" class="col-12 text-center py-5">
            <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" alt="No data" style="width: 120px; opacity: 0.5;">
            <h5 class="mt-4 fw-bold text-muted">No Properties Found</h5>
            <p class="text-muted">Try adjusting your filters or search query to find more results.</p>
            <button class="btn btn-primary rounded-pill px-4 mt-2 fw-bold" @click="resetAllFilters()">Clear All Filters</button>
          </div>
        </div>

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
        <h5 id="mobileFiltersLabel" class="offcanvas-title fw-bold mb-0">Filters</h5>
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
      <HomeFiltersPanel
        id-prefix="mobile"
        panel-class="mobile-filter-panel"
        :amenities="amenities"
        :facilities="facilities"
        :loading-amenities="loadingAmenities"
        :loading-facilities="loadingFacilities"
        :selected-amenities="selectedAmenities"
        :selected-facilities="selectedFacilities"
        :min-price="min_price"
        :max-price="max_price"
        @update:selected-amenities="selectedAmenities = $event"
        @update:selected-facilities="selectedFacilities = $event"
        @update:min-price="min_price = $event"
        @update:max-price="max_price = $event"
        @apply="applyFilters()"
        @reset="resetAllFilters()"
      />
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
import { defineAsyncComponent } from "vue";
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";
import { recordView } from "@/api/property";
import { bookmarkProperty, getBookmarkedPropertyIds, removeBookmarkedProperty } from "@/api/bookmarks";
import { fetchHomeListings, loadHomeFilterOptions } from "@/api/homeListings";
import HomeFiltersPanel from "@/components/HomeFiltersPanel.vue";
import successToast from "@/components/successToast.vue";
import Header from "@/components/Header.vue";
import SubscriptionWarningBanner from "@/components/SubscriptionWarningBanner.vue";
import OwnerSubscriptionExpiredBanner from "@/components/OwnerSubscriptionExpiredBanner.vue";
import { useUserInfo } from "@/store/userInfo";
import Swal from "sweetalert2";

const MapSection = defineAsyncComponent(() => import("@/components/MapSection.vue"));

const DEFAULT_PROPERTY_TYPES = [{ id: null, type_name: "Property Types" }];

export default {
  name: "Home",
  components: {
    successToast,
    Header,
    HomeFiltersPanel,
    MapSection,
    SubscriptionWarningBanner,
    OwnerSubscriptionExpiredBanner,
  },
  data() {
    return {
      showMap: false,
      shouldRenderMap: false,
      showSuccess: false,
      subSuccess: false,
      amenities: [],
      facilities: [],
      property_types: DEFAULT_PROPERTY_TYPES,
      properties: [],
      placeholderImg,
      selectedAmenities: [],
      selectedFacilities: [],
      selectedType: null,
      selectedAgreement: "",
      min_price: null,
      max_price: null,
      activeQuery: "",
      activeFilters: {
        amenities: [],
        facilities: [],
        selectedType: null,
        selectedAgreement: "",
        minPrice: null,
        maxPrice: null,
      },
      searchQuery: "",
      loading: true,
      loadingAmenities: false,
      loadingFacilities: false,
      bookmarkBusyId: null,
      bookmarkedPropertyIds: [],
      currentPage: 1,
      lastPage: 1,
      total: 0,
      latestListingsRequestId: 0,
      mobileFiltersElement: null,
      desktopMediaQuery: null,
      hasLoadedExtendedFilters: false,
      isLoadingExtendedFilters: false,
    };
  },
  computed: {
    canShowBookmarkAction() {
      const info = useUserInfo();
      const role = String(info.role || "").toLowerCase();
      return info.isLoggedIn && !["owner", "admin"].includes(role);
    },
  },
  watch: {
    canShowBookmarkAction: {
      immediate: true,
      async handler(canShowBookmarks) {
        if (canShowBookmarks) {
          await this.loadBookmarks();
          return;
        }

        this.bookmarkedPropertyIds = [];
      },
    },
  },
  async mounted() {
    this.setupFilterOptionLoading();

    await Promise.all([
      this.loadInitialFilterOptions(),
      this.fetchListings({ page: 1 }),
    ]);

    const success = sessionStorage.getItem("loginSuccess");
    const subscriptionSuccess = sessionStorage.getItem("subscriptionSuccess");

    if (success) {
      this.showSuccess = true;
      sessionStorage.removeItem("loginSuccess");
    }

    if (subscriptionSuccess) {
      this.subSuccess = true;
      sessionStorage.removeItem("subscriptionSuccess");
    }
  },
  beforeUnmount() {
    if (this.mobileFiltersElement) {
      this.mobileFiltersElement.removeEventListener("show.bs.offcanvas", this.handleMobileFiltersShow);
    }

    if (this.desktopMediaQuery) {
      if (typeof this.desktopMediaQuery.removeEventListener === "function") {
        this.desktopMediaQuery.removeEventListener("change", this.handleViewportChange);
      } else if (typeof this.desktopMediaQuery.removeListener === "function") {
        this.desktopMediaQuery.removeListener(this.handleViewportChange);
      }
    }
  },
  methods: {
    isDesktopViewport() {
      return window.matchMedia("(min-width: 992px)").matches;
    },
    toTitle(text) {
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
    },
    getPropertyCardImage(property) {
      const raw = String(property?.image_url || "").trim();
      if (!raw || ["null", "undefined"].includes(raw.toLowerCase())) {
        return this.placeholderImg;
      }
      return raw;
    },
    createFilterSnapshot() {
      return {
        amenities: [...this.selectedAmenities],
        facilities: [...this.selectedFacilities],
        selectedType: this.selectedType || null,
        selectedAgreement: this.selectedAgreement || "",
        minPrice: this.min_price || null,
        maxPrice: this.max_price || null,
      };
    },
    normalizePriceRange() {
      if (this.min_price > 0 && this.max_price > 0 && this.min_price > this.max_price) {
        [this.min_price, this.max_price] = [this.max_price, this.min_price];
      }
    },
    async loadInitialFilterOptions() {
      const result = await loadHomeFilterOptions({
        includeExtended: this.isDesktopViewport(),
      });

      this.property_types = result.propertyTypes;

      if (this.isDesktopViewport()) {
        this.amenities = result.amenities;
        this.facilities = result.facilities;
        this.hasLoadedExtendedFilters = true;
      }
    },
    async ensureExtendedFilterOptions() {
      if (this.hasLoadedExtendedFilters || this.isLoadingExtendedFilters) return;

      this.loadingAmenities = true;
      this.loadingFacilities = true;
      this.isLoadingExtendedFilters = true;

      try {
        const result = await loadHomeFilterOptions({ includeExtended: true });
        this.property_types = result.propertyTypes;
        this.amenities = result.amenities;
        this.facilities = result.facilities;
        this.hasLoadedExtendedFilters = true;
      } finally {
        this.loadingAmenities = false;
        this.loadingFacilities = false;
        this.isLoadingExtendedFilters = false;
      }
    },
    setupFilterOptionLoading() {
      this.mobileFiltersElement = document.getElementById("mobileFilters");
      if (this.mobileFiltersElement) {
        this.mobileFiltersElement.addEventListener("show.bs.offcanvas", this.handleMobileFiltersShow);
      }

      this.desktopMediaQuery = window.matchMedia("(min-width: 992px)");
      if (typeof this.desktopMediaQuery.addEventListener === "function") {
        this.desktopMediaQuery.addEventListener("change", this.handleViewportChange);
      } else if (typeof this.desktopMediaQuery.addListener === "function") {
        this.desktopMediaQuery.addListener(this.handleViewportChange);
      }
    },
    handleMobileFiltersShow() {
      this.ensureExtendedFilterOptions();
    },
    handleViewportChange(event) {
      if (event.matches) {
        this.ensureExtendedFilterOptions();
      }
    },
    async ensureMapLoaded() {
      this.shouldRenderMap = true;
    },
    async toggleMap() {
      if (!this.showMap) {
        await this.ensureMapLoaded();
      }

      this.showMap = !this.showMap;
    },
    async fetchListings({
      page = 1,
      query = this.activeQuery,
      filters = this.activeFilters,
    } = {}) {
      const requestId = ++this.latestListingsRequestId;
      this.loading = true;

      try {
        const result = await fetchHomeListings({
          page,
          query,
          filters,
        });

        if (requestId !== this.latestListingsRequestId) return;

        this.properties = result.properties;
        this.currentPage = result.currentPage;
        this.lastPage = result.lastPage;
        this.total = result.total;
      } catch (error) {
        if (requestId !== this.latestListingsRequestId) return;

        console.error("Failed to fetch home listings:", error);
        this.properties = [];
        this.currentPage = 1;
        this.lastPage = 1;
        this.total = 0;
      } finally {
        if (requestId === this.latestListingsRequestId) {
          this.loading = false;
        }
      }
    },
    async applyFilters(page = 1) {
      this.normalizePriceRange();
      this.activeFilters = this.createFilterSnapshot();
      this.activeQuery = String(this.searchQuery || "").trim();
      this.currentPage = page;
      await this.fetchListings({
        page,
        query: this.activeQuery,
        filters: this.activeFilters,
      });
    },
    async resetAllFilters() {
      this.selectedAmenities = [];
      this.selectedFacilities = [];
      this.selectedType = null;
      this.selectedAgreement = "";
      this.min_price = null;
      this.max_price = null;
      this.searchQuery = "";
      this.activeQuery = "";
      this.activeFilters = {
        amenities: [],
        facilities: [],
        selectedType: null,
        selectedAgreement: "",
        minPrice: null,
        maxPrice: null,
      };

      await this.fetchListings({
        page: 1,
        query: "",
        filters: this.activeFilters,
      });
    },
    async changePage(page) {
      if (page < 1 || page > this.lastPage) return;

      this.currentPage = page;
      await this.fetchListings({
        page,
        query: this.activeQuery,
        filters: this.activeFilters,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
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

      const wasBookmarked = this.isBookmarked(propertyId);
      this.bookmarkBusyId = propertyId;

      try {
        let response;

        if (wasBookmarked) {
          response = await removeBookmarkedProperty(propertyId);
          this.bookmarkedPropertyIds = this.bookmarkedPropertyIds.filter((id) => id !== Number(propertyId));
        } else {
          response = await bookmarkProperty(propertyId);
          this.bookmarkedPropertyIds = [...new Set([...this.bookmarkedPropertyIds, Number(propertyId)])];
        }

        await Swal.fire({
          icon: "success",
          title: wasBookmarked ? "Bookmark removed" : "Property saved",
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
    async checkDetails(id) {
      await recordView(id);
      this.$router.push(`/property/${id}`);
    },
  },
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

.mobile-filters-copy {
  margin: 0 0 1rem;
  color: #6a85ac;
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
