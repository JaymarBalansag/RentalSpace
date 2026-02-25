<template>
  <Header />

  <div class="experience-hero bg-primary text-white py-5 mb-n5">
    <div class="container-fluid px-5">
      <div class="row align-items-center">
        <div class="col-lg-7">
          <h1 class="display-5 fw-bold mb-2">Discover Your Space</h1>
          <p class="lead opacity-75">Tailored recommendations and trending properties in your area.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid p-5 pt-0">
    <div class="row g-4">
      <div class="col-lg-8">
        
        <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
          <div class="card-body p-4">
            <div class="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 class="fw-bold mb-0 text-dark">Recommended for You</h3>
                <p class="text-muted small mb-0">Based on your browsing history and preferences.</p>
              </div>
              <button class="btn btn-light btn-sm rounded-pill px-3 fw-semibold text-primary" @click="fetchProperty">
                <i class="bi bi-arrow-clockwise"></i> Reset
              </button>
            </div>

            <div class="d-flex gap-2 mb-4 overflow-auto pb-2 custom-scrollbar">
              <button 
                class="btn btn-sm rounded-pill px-4 py-2 fw-medium d-flex align-items-center gap-2 transition" 
                :class="activeFilter === 'near' ? 'btn-primary shadow-sm' : 'btn-outline-secondary border-light-subtle bg-light-subtle'"
                @click="getNearProperties"
              >
                <i class="bi bi-geo-alt-fill"></i> Near You
              </button>
              <button 
                class="btn btn-sm rounded-pill px-4 py-2 fw-medium d-flex align-items-center gap-2 transition" 
                :class="activeFilter === 'amenities' ? 'btn-primary shadow-sm' : 'btn-outline-secondary border-light-subtle bg-light-subtle'"
                @click="getPrefferedAmenities"
              >
                <i class="bi bi-stars"></i> Top Amenities
              </button>
              <button 
                class="btn btn-sm rounded-pill px-4 py-2 fw-medium d-flex align-items-center gap-2 transition" 
                :class="activeFilter === 'types' ? 'btn-primary shadow-sm' : 'btn-outline-secondary border-light-subtle bg-light-subtle'"
                @click="getPrefferedTypes"
              >
                <i class="bi bi-building-fill"></i> Property Types
              </button>
            </div>

            <div v-if="loading" class="d-flex gap-4 overflow-auto pb-3">
              <div v-for="n in 3" :key="'skel-' + n" class="skeleton-card" style="min-width: 280px;">
                <div class="placeholder-glow">
                  <div class="placeholder col-12 rounded-4 mb-3" style="height: 180px;"></div>
                  <div class="px-2">
                    <span class="placeholder col-8 mb-2"></span>
                    <span class="placeholder col-11 small"></span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="recommendedProperties.length > 0" class="d-flex gap-4 overflow-auto pb-3 custom-scrollbar">
              <div
                v-for="property in recommendedProperties"
                :key="property.id"
                class="card border-0 property-hover-card h-100"
                style="min-width: 280px; max-width: 280px;"
                @click="gotoProperty(property.id)"
              >
                <div class="position-relative overflow-hidden rounded-4 shadow-sm">
                  <img :src="property.image_url || placeholderImage" class="card-img-top property-img" alt="Property">
                  <div class="property-badge-overlay">
                    <span class="badge glass-badge rounded-pill">
                      ₱{{ property.price }}
                    </span>
                  </div>
                </div>
                <div class="card-body px-1 pt-3">
                  <div class="d-flex justify-content-between align-items-start mb-1">
                    <h6 class="fw-bold text-dark mb-0 text-truncate">{{ property.title }}</h6>
                    <div class="text-warning small">
                      <i class="bi bi-star-fill"></i> {{ getPropertyAverageRating(property).toFixed(1) }}
                    </div>
                  </div>
                  <p class="small text-muted mb-1">
                    {{ getPropertyTotalReviews(property) }} review{{ getPropertyTotalReviews(property) === 1 ? '' : 's' }}
                  </p>
                  <p class="text-muted small mb-0 d-flex align-items-center gap-1">
                    <i class="bi bi-geo-alt-fill text-danger"></i> {{ property.town_name }}
                  </p>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-5 border-dashed rounded-4">
              <div class="bg-light rounded-circle d-inline-flex p-4 mb-3">
                <i class="bi bi-house-exclamation text-muted fs-1"></i>
              </div>
              <h5 class="text-dark fw-bold">No results found</h5>
              <p class="text-muted mx-auto" style="max-width: 300px;">{{ message || 'Try adjusting your filters to see more recommendations.' }}</p>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <h4 class="fw-bold mb-4 d-flex align-items-center gap-2">
              <i class="bi bi-fire text-orange"></i> Trending Now
            </h4>
          </div>
          <div v-if="trendingLoading" class="col-12">
            <div class="placeholder-glow d-flex gap-3">
              <div v-for="n in 2" :key="'trend-skel-' + n" class="placeholder rounded-4" style="height: 140px; flex: 1;"></div>
            </div>
          </div>
          <div v-else-if="trendingProperties.length === 0" class="col-12">
            <div class="text-center py-4 border-dashed rounded-4">
              <p class="mb-0 text-muted">No trending properties yet.</p>
            </div>
          </div>
          <div v-for="property in trendingProperties" :key="property.id" class="col-md-6 mb-4">
            <div class="card border-0 shadow-sm rounded-4 hover-lift overflow-hidden" @click="gotoProperty(property.id)" style="cursor: pointer;">
              <div class="row g-0 align-items-center">
                <div class="col-5">
                  <img :src="property.image_url || placeholderImage" class="img-fluid h-100" style="object-fit: cover; min-height: 120px;" alt="Trending property image">
                </div>
                <div class="col-7">
                  <div class="card-body p-3">
                    <h6 class="fw-bold mb-1 text-truncate">{{ property.title }}</h6>
                    <p class="small text-muted mb-2 text-truncate-2">{{ property.description || 'Popular property based on recent user views.' }}</p>
                    <div class="d-flex align-items-center justify-content-between mt-2">
                      <span class="text-primary small fw-bold">PHP {{ formatPrice(property.price) }}</span>
                      <small class="text-warning fw-semibold">
                        <i class="bi bi-star-fill"></i> {{ getPropertyAverageRating(property).toFixed(1) }}
                      </small>
                    </div>
                    <div class="d-flex align-items-center justify-content-between mt-1">
                      <small class="text-muted">
                        {{ getPropertyTotalReviews(property) }} review{{ getPropertyTotalReviews(property) === 1 ? '' : 's' }}
                      </small>
                      <small class="text-muted"><i class="bi bi-eye"></i> {{ formatCompactNumber(getViewCount(property)) }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Recent Listings</h5>
            
            <div v-if="loading" class="placeholder-glow">
              <div v-for="n in 3" :key="n" class="d-flex mb-4">
                <div class="placeholder rounded-3 me-3" style="width:70px; height:70px;"></div>
                <div class="flex-grow-1">
                  <span class="placeholder col-8 mb-2"></span>
                  <span class="placeholder col-4"></span>
                </div>
              </div>
            </div>

            <div v-else class="recent-list">
              <div v-for="property in recentProperties" :key="property.id" class="d-flex align-items-center mb-4 transition-row">
                <div class="recent-img-wrapper me-3">
                  <img :src="property.image_url || placeholderImage" class="rounded-3 shadow-sm border" style="width:70px; height:70px; object-fit:cover;">
                </div>
                <div class="overflow-hidden">
                  <h6 class="mb-1 text-dark text-truncate fw-semibold">{{ property.title }}</h6>
                  <div class="d-flex align-items-center gap-2">
                    <span class="small text-muted">{{ formatAgo(property.created_at) }}</span>
                    <span class="dot-divider"></span>
                    <span class="text-success small fw-bold">New</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 bg-dark text-white overflow-hidden">
          <div class="card-body p-4 position-relative">
            <div class="z-index-2 position-relative">
              <h5 class="fw-bold mb-4">Popular Categories</h5>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="(type, index) in popularTypes" :key="type.id" 
                      class="badge glass-dark-badge p-2 px-3 fw-medium">
                  {{ type.type_name }} <span class="opacity-50 ms-1">{{ type.total }}</span>
                </span>
              </div>
            </div>
            <i class="bi bi-building-fill-add position-absolute end-0 bottom-0 mb-n3 me-n2 opacity-25" style="font-size: 8rem;"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  getDefaultRecommendation, 
  getRecentProperties, 
  getNearProperties, 
  getPrefferedAmenities, 
  getPrefferedTypes, 
  getPopularTypes,
  getTrendingProperties
} from '@/api/experienceScript';
import Header from '@/components/Header.vue';
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { recordView } from '@/api/property';

dayjs.extend(relativeTime);

export default {
  name: "Experience",
  components: { Header },
  data() {
    return {
      message: '',
      activeFilter: 'default',
      recommendedProperties: [],
      recentProperties: [],
      popularTypes: [],
      trendingProperties: [],
      placeholderImage: placeholderImg,
      loading: false,
      trendingLoading: false,
      badgeColors: ['bg-primary-subtle text-primary', 'bg-success-subtle text-success', 'bg-warning-subtle text-warning-emphasis', 'bg-info-subtle text-info']
    }
  },
  methods: {
    formatAgo(date) {
      return dayjs(date).fromNow();
    },

    async gotoProperty(id){
      await recordView(id);
      this.$router.push(`/property/${id}`);
    },

    getViewCount(property) {
      return Number(
        property?.view_count ??
        property?.views ??
        property?.total_views ??
        property?.property_views ??
        0
      ) || 0;
    },

    formatCompactNumber(value) {
      return new Intl.NumberFormat("en", { notation: "compact" }).format(Number(value) || 0);
    },

    formatPrice(value) {
      return new Intl.NumberFormat("en-PH").format(Number(value) || 0);
    },
    getPropertyAverageRating(property) {
      const value = Number(property?.average_rating ?? property?.avg_rating ?? 0);
      return Number.isFinite(value) ? value : 0;
    },
    getPropertyTotalReviews(property) {
      const value = Number(property?.total_reviews ?? property?.review_count ?? 0);
      return Number.isFinite(value) ? value : 0;
    },

    async handleLoad(apiCall, targetKey, filterName = '') {
      this.loading = true;
      if (filterName) this.activeFilter = filterName;
      try {
        const response = await apiCall();
        this[targetKey] = response.data.data;
        this.message = response.data.message || '';
      } catch (error) {
        console.error(`Error loading ${targetKey}:`, error);
        // this.message = error.error;
      } finally {
        this.loading = false;
      }
    },

    fetchProperty() {
      this.handleLoad(getDefaultRecommendation, 'recommendedProperties', 'default');
    },
    getNearProperties() {
      this.handleLoad(getNearProperties, 'recommendedProperties', 'near');
    },
    getPrefferedAmenities() {
      this.handleLoad(getPrefferedAmenities, 'recommendedProperties', 'amenities');
    },
    getPrefferedTypes() {
      this.handleLoad(getPrefferedTypes, 'recommendedProperties', 'types');
    },

    async fetchTrendingProperties() {
      this.trendingLoading = true;
      try {
        const response = await getTrendingProperties(2);
        const list = Array.isArray(response?.data?.data) ? response.data.data : [];
        this.trendingProperties = list
          .sort((a, b) => this.getViewCount(b) - this.getViewCount(a))
          .slice(0, 2);
      } catch (error) {
        console.error("Error loading trending properties:", error);
        this.trendingProperties = [];
      } finally {
        this.trendingLoading = false;
      }
    }
  },
  mounted() {
    this.fetchProperty();
    this.handleLoad(getRecentProperties, 'recentProperties');
    this.handleLoad(getPopularTypes, 'popularTypes');
    this.fetchTrendingProperties();
  }
}
</script>

<style scoped>
/* Hero Section Layout */
.experience-hero {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.text-orange { color: #fd7e14; }

/* Horizontal Scroll UX */
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ced4da;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* Card Styling */
.property-hover-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
}
.property-hover-card:hover {
  transform: translateY(-8px);
}
.property-hover-card:hover img {
  transform: scale(1.05);
}

.property-img {
  height: 180px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.property-badge-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
}

.glass-badge {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  color: #0d6efd;
  font-weight: 700;
  padding: 6px 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.glass-dark-badge {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
}

/* Typography & Lists */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dot-divider {
  width: 4px;
  height: 4px;
  background: #ccc;
  border-radius: 50%;
}

.border-dashed {
  border: 2px dashed #dee2e6 !important;
}

.transition {
  transition: all 0.2s ease-in-out;
}

.recent-img-wrapper img {
  transition: transform 0.2s ease;
}
.transition-row:hover img {
  transform: rotate(3deg) scale(1.1);
}
</style>
