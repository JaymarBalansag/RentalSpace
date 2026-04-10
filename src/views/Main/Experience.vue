<template>
  <Header />
  <div class="experience-page">
    <div class="experience-hero text-white py-5 mb-n5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <p class="hero-eyebrow mb-2">Personalized Discovery</p>
            <h1 class="display-5 fw-bold mb-2">Discover Your Space</h1>
            <p class="lead hero-subtitle mb-0">Tailored recommendations and trending properties in your area.</p>
          </div>
        </div>
      </div>
    </div>

    <OwnerSubscriptionExpiredBanner />
    <SubscriptionWarningBanner />

    <div class="container-fluid p-5 pt-0">
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden panel-card">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h3 class="fw-bold mb-0 text-dark">Recommended for You</h3>
                  <p class="text-muted small mb-0">Based on your browsing history and preferences.</p>
                </div>
                <button class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold" @click="fetchProperty">
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

              <div v-if="recommendationsLoading && !recommendedProperties.length" class="d-flex gap-4 overflow-auto pb-3">
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

              <div v-else-if="recommendedProperties.length > 0" class="position-relative">
                <div v-if="recommendationsRefreshing" class="recommendation-refresh-indicator">
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Refreshing recommendations...
                </div>
                <div class="d-flex gap-4 overflow-auto pb-3 custom-scrollbar" :class="{ 'is-refreshing': recommendationsRefreshing }">
                <div
                  v-for="property in recommendedProperties"
                  :key="property.id"
                  class="card border-0 property-hover-card h-100 panel-card"
                  style="min-width: 280px; max-width: 280px;"
                  @click="gotoProperty(property.id)"
                >
                  <div class="position-relative overflow-hidden rounded-4 shadow-sm">
                    <img :src="property.image_url" class="card-img-top property-img" alt="Property" @error="$event.target.src = placeholderImage">
                    <div class="property-badge-overlay">
                      <span class="badge glass-badge rounded-pill">
                        {{ property.display_price }}
                      </span>
                    </div>
                  </div>
                  <div class="card-body px-1 pt-3">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                      <h6 class="fw-bold text-dark mb-0 text-truncate">{{ property.title }}</h6>
                      <div class="text-warning small">
                        <i class="bi bi-star-fill"></i> {{ property.average_rating.toFixed(1) }}
                      </div>
                    </div>
                    <p class="small text-muted mb-1">
                      {{ property.total_reviews }} review{{ property.total_reviews === 1 ? '' : 's' }}
                    </p>
                    <p class="text-muted small mb-0 d-flex align-items-center gap-1">
                      <i class="bi bi-geo-alt-fill text-danger"></i> {{ property.town_name }}
                    </p>
                  </div>
                </div>
              </div>
              </div>

              <div v-else class="text-center py-5 border-dashed rounded-4 empty-shell">
                <div class="bg-light rounded-circle d-inline-flex p-4 mb-3 empty-icon">
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
              <div class="text-center py-4 border-dashed rounded-4 empty-shell">
                <p class="mb-0 text-muted">No trending properties yet.</p>
              </div>
            </div>
            <div v-for="property in trendingProperties" :key="property.id" class="col-md-6 mb-4">
              <div class="card border-0 shadow-sm rounded-4 hover-lift overflow-hidden panel-card" @click="gotoProperty(property.id)" style="cursor: pointer;">
                <div class="row g-0 align-items-center">
                  <div class="col-5">
                    <img :src="property.image_url" class="img-fluid h-100" style="object-fit: cover; min-height: 120px;" alt="Trending property image" @error="$event.target.src = placeholderImage">
                  </div>
                  <div class="col-7">
                    <div class="card-body p-3">
                      <h6 class="fw-bold mb-1 text-truncate">{{ property.title }}</h6>
                      <p class="small text-muted mb-2 text-truncate-2">{{ property.description || 'Popular property based on recent user views.' }}</p>
                      <div class="d-flex align-items-center justify-content-between mt-2">
                        <span class="text-primary small fw-bold">{{ property.display_price }}</span>
                        <small class="text-warning fw-semibold">
                          <i class="bi bi-star-fill"></i> {{ property.average_rating.toFixed(1) }}
                        </small>
                      </div>
                      <div class="d-flex align-items-center justify-content-between mt-1">
                        <small class="text-muted">
                          {{ property.total_reviews }} review{{ property.total_reviews === 1 ? '' : 's' }}
                        </small>
                        <small class="text-muted"><i class="bi bi-eye"></i> {{ property.compact_view_count }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 mb-4 panel-card">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">Recent Listings</h5>

              <div v-if="recentLoading" class="placeholder-glow">
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
                    <img :src="property.image_url" class="rounded-3 shadow-sm border" style="width:70px; height:70px; object-fit:cover;" @error="$event.target.src = placeholderImage">
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

          <div class="card border-0 shadow-sm rounded-4 bg-dark text-white overflow-hidden category-dark-card">
            <div class="card-body p-4 position-relative">
              <div class="z-index-2 position-relative">
                <h5 class="fw-bold mb-4">Popular Categories</h5>
                <div v-if="popularTypesLoading" class="d-flex flex-wrap gap-2">
                  <span v-for="n in 4" :key="'popular-skel-' + n" class="badge glass-dark-badge p-2 px-3 fw-medium placeholder-glow">
                    <span class="placeholder col-12" style="width: 72px; display: inline-block;"></span>
                  </span>
                </div>
                <div v-else class="d-flex flex-wrap gap-2">
                  <span v-for="type in popularTypes" :key="type.id" class="badge glass-dark-badge p-2 px-3 fw-medium">
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
import SubscriptionWarningBanner from '@/components/SubscriptionWarningBanner.vue';
import OwnerSubscriptionExpiredBanner from '@/components/OwnerSubscriptionExpiredBanner.vue';
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { recordView } from '@/api/property';

dayjs.extend(relativeTime);

export default {
  name: "Experience",
  components: { Header, SubscriptionWarningBanner, OwnerSubscriptionExpiredBanner },
  data() {
    return {
      message: '',
      activeFilter: 'default',
      recommendedProperties: [],
      recentProperties: [],
      popularTypes: [],
      trendingProperties: [],
      placeholderImage: placeholderImg,
      recommendationsLoading: false,
      recommendationsRefreshing: false,
      recentLoading: false,
      popularTypesLoading: false,
      trendingLoading: false,
      recommendationRequestToken: 0,
      badgeColors: ['bg-primary-subtle text-primary', 'bg-success-subtle text-success', 'bg-warning-subtle text-warning-emphasis', 'bg-info-subtle text-info']
    }
  },
  methods: {
    formatAgo(date) {
      return dayjs(date).fromNow();
    },

    gotoProperty(id){
      this.$router.push(`/property/${id}`);
      Promise.resolve().then(() => recordView(id)).catch((error) => {
        console.warn("Failed to record property view:", error);
      });
    },

    normalizeViewCount(property) {
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
    getPropertyImage(property) {
      const imageUrl = property?.image_url;

      if (!imageUrl) {
        return this.placeholderImage;
      }

      if (typeof imageUrl === "string") {
        const normalized = imageUrl.trim().toLowerCase();
        if (!normalized || normalized === "null" || normalized === "undefined") {
          return this.placeholderImage;
        }
      }

      return imageUrl;
    },
    normalizeProperty(property) {
      const averageRating = Number(property?.average_rating ?? property?.avg_rating ?? 0);
      const totalReviews = Number(property?.total_reviews ?? property?.review_count ?? 0);
      const price = Number(property?.price ?? 0);
      const viewCount = this.normalizeViewCount(property);

      return {
        ...property,
        image_url: this.getPropertyImage(property),
        average_rating: Number.isFinite(averageRating) ? averageRating : 0,
        total_reviews: Number.isFinite(totalReviews) ? totalReviews : 0,
        price,
        display_price: `PHP ${this.formatPrice(price)}`,
        view_count: viewCount,
        compact_view_count: this.formatCompactNumber(viewCount),
      };
    },
    filterAvailableProperties(list) {
      const data = Array.isArray(list) ? list : [];
      return data.filter((property) => {
        const status = String(property?.status || "").toLowerCase();
        return property?.is_available !== false && status !== "pending";
      });
    },
    normalizeProperties(list, { filterAvailable = false } = {}) {
      const source = filterAvailable ? this.filterAvailableProperties(list) : (Array.isArray(list) ? list : []);
      return source.map((property) => this.normalizeProperty(property));
    },
    async loadRecommendations(apiCall, filterName = 'default') {
      const token = ++this.recommendationRequestToken;
      const hasExistingCards = this.recommendedProperties.length > 0;

      this.recommendationsLoading = !hasExistingCards;
      this.recommendationsRefreshing = hasExistingCards;
      this.activeFilter = filterName;
      try {
        const response = await apiCall();
        if (token !== this.recommendationRequestToken) return;

        const list = Array.isArray(response?.data?.data) ? response.data.data : [];
        this.recommendedProperties = this.normalizeProperties(list, { filterAvailable: true });
        this.message = response?.data?.message || '';
      } catch (error) {
        if (token !== this.recommendationRequestToken) return;
        console.error("Error loading recommendations:", error);
        this.recommendedProperties = [];
        this.message = "Unable to load recommendations right now.";
      } finally {
        if (token !== this.recommendationRequestToken) return;
        this.recommendationsLoading = false;
        this.recommendationsRefreshing = false;
      }
    },
    fetchProperty() {
      this.loadRecommendations(getDefaultRecommendation, 'default');
    },
    getNearProperties() {
      this.loadRecommendations(getNearProperties, 'near');
    },
    getPrefferedAmenities() {
      this.loadRecommendations(getPrefferedAmenities, 'amenities');
    },
    getPrefferedTypes() {
      this.loadRecommendations(getPrefferedTypes, 'types');
    },
    async fetchRecentProperties() {
      this.recentLoading = true;
      try {
        const response = await getRecentProperties();
        const list = Array.isArray(response?.data?.data) ? response.data.data : [];
        this.recentProperties = this.normalizeProperties(list, { filterAvailable: true });
      } catch (error) {
        console.error("Error loading recent properties:", error);
        this.recentProperties = [];
      } finally {
        this.recentLoading = false;
      }
    },
    async fetchPopularTypes() {
      this.popularTypesLoading = true;
      try {
        const response = await getPopularTypes();
        this.popularTypes = Array.isArray(response?.data?.data) ? response.data.data : [];
      } catch (error) {
        console.error("Error loading popular property types:", error);
        this.popularTypes = [];
      } finally {
        this.popularTypesLoading = false;
      }
    },
    async fetchTrendingProperties() {
      this.trendingLoading = true;
      try {
        const response = await getTrendingProperties(2);
        const list = Array.isArray(response?.data?.data) ? response.data.data : [];
        const normalized = this.normalizeProperties(list, { filterAvailable: true });
        this.trendingProperties = normalized
          .sort((a, b) => b.view_count - a.view_count)
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
    Promise.allSettled([
      this.loadRecommendations(getDefaultRecommendation, 'default'),
      this.fetchRecentProperties(),
      this.fetchPopularTypes(),
      this.fetchTrendingProperties(),
    ]);
  }
}
</script>

<style scoped>
.experience-page {
  background: radial-gradient(circle at 20% 0, #edf4ff 0%, #f8fbff 32%, #ffffff 100%);
  min-height: 100vh;
}

.experience-hero {
  background:
    linear-gradient(145deg, rgba(20, 51, 98, 0.84), rgba(38, 90, 168, 0.78)),
    url("../../assets/Main/exp.avif");
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.hero-eyebrow {
  color: #dce9ff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.74rem;
  font-weight: 700;
}

.hero-subtitle {
  color: rgba(240, 247, 255, 0.9);
}

.text-orange { color: #fd7e14; }

.panel-card {
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  border: 1px solid #e3ecfa !important;
  box-shadow: 0 10px 22px rgba(18, 43, 83, 0.06) !important;
}

.category-dark-card {
  background: linear-gradient(145deg, #16263f, #1f3558) !important;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #eef3fb;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c8d8ef;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #aebfd8;
}

.property-hover-card {
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s ease;
  cursor: pointer;
}
.property-hover-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 28px rgba(18, 43, 83, 0.12) !important;
}
.property-hover-card:hover img {
  transform: scale(1.04);
}

.property-img {
  height: 180px;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.property-badge-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
}

.glass-badge {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  color: #1f4f9b;
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

.recommendation-refresh-indicator {
  position: absolute;
  top: -0.25rem;
  right: 0;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #d8e4f8;
  box-shadow: 0 8px 18px rgba(18, 43, 83, 0.1);
  color: #315f9d;
  font-size: 0.78rem;
  font-weight: 700;
}

.is-refreshing {
  opacity: 0.72;
}

.hover-lift {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 24px rgba(18, 43, 83, 0.11) !important;
}

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
  border: 2px dashed #d9e4f5 !important;
}

.empty-shell {
  background: #fbfdff;
}

.empty-icon {
  border: 1px solid #e2ebf9;
}

.transition {
  transition: all 0.35s ease-in-out;
}

.recent-img-wrapper img {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.transition-row:hover img {
  transform: rotate(2deg) scale(1.08);
}

@media (prefers-reduced-motion: reduce) {
  .property-hover-card,
  .property-img,
  .hover-lift,
  .transition,
  .recent-img-wrapper img {
    transition: none !important;
    animation: none !important;
  }
}
</style>
