<template>
  <div v-if="showSuccess" class="alert alert-success" role="alert">
    🎉 {{ toastMessage }}
  </div>
  <OwnerSubscriptionExpiredBanner />
  <div class="container-fluid p-0">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h4 class="mb-1 fw-bold text-dark">🏠 My Properties</h4>
        <p class="text-muted small mb-0">Manage and track your property listings</p>
        <div class="mt-2">
          <span class="badge rounded-pill" :class="ownerVerificationBadgeClass">
            {{ ownerVerificationLabel }}
          </span>
        </div>
      </div>

      <div class="d-flex flex-column align-items-md-end">
        <button
          class="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-pill"
          :class="(limitReached || isSubscriptionExpired) ? 'btn-secondary opacity-75 cursor-not-allowed' : ''"
          :disabled="limitReached || isSubscriptionExpired"
          @click="goToAddProperty"
        >
          <i class="bi bi-plus-lg me-1"></i> Add New Property
        </button>
      </div>
    </div>

    <div v-if="limit !== null" class="card border-0 bg-light mb-4 shadow-sm">
      <div class="card-body py-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="small fw-bold text-uppercase text-muted">Listing Limit Usage</span>
          <span class="badge bg-white text-dark border fw-bold">{{ count }} / {{ limit }}</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div 
            class="progress-bar rounded-pill" 
            :class="limitReached ? 'bg-danger' : 'bg-primary'" 
            role="progressbar" 
            :style="{ width: (count / limit * 100) + '%' }">
          </div>
        </div>
        <div v-if="limitReached" class="mt-2 small text-danger fw-bold">
          <i class="bi bi-exclamation-triangle-fill me-1"></i> 
          Limit reached. Upgrade your plan to post more properties.
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div v-if="properties.length === 0" class="col-12 text-center py-5">
        <i class="bi bi-house-door text-light-emphasis display-1"></i>
        <p class="mt-3 text-muted">No properties found. Start by adding your first one!</p>
      </div>

      <div class="col-12 col-md-6 col-lg-4" v-for="property in properties" :key="property.id">
        <div class="card h-100 border-0 shadow-sm property-card">
          <div class="position-absolute top-0 end-0 m-3 z-1">
            <span :class="property.is_available ? 'bg-success' : 'bg-danger'" class="badge shadow-sm px-3 py-2">
              {{ property.is_available ? 'Available' : 'Fully Booked' }}
            </span>
          </div>

          <div class="position-relative overflow-hidden rounded-top" style="height: 200px;">
            <img 
              :src="property.image_url || placeholderImg" 
              @error="$event.target.src = placeholderImg" 
              class="card-img-top w-100 h-100 object-fit-cover transition-transform" 
              alt="Property"
            >
          </div>

          <div class="card-body d-flex flex-column p-4">
            <h5 class="card-title fw-bold text-dark text-truncate mb-2">{{ property.title }}</h5>
            
            <div class="card-text mb-4">
              <div class="d-flex align-items-start mb-2 text-muted small">
                <i class="bi bi-geo-alt-fill text-danger me-2"></i>
                <span>{{ property.state_name ?? 'N/A' }}, {{ property.region_name || "" }}</span>
              </div>
              <div class="h5 fw-bold text-primary mb-0">
                ₱{{ property.price?.toLocaleString() }}
                <small class="text-muted fw-normal" style="font-size: 0.8rem">
                   / {{ property.payment_frequency }}
                </small>
              </div>
            </div>

            <div class="mt-auto pt-3 border-top d-flex gap-2">
              <RouterLink
                :to="`/dashboard/properties/${property.id}/edit`"
                class="btn btn-outline-warning flex-grow-1 btn-sm fw-bold"
                :class="isSubscriptionExpired ? 'disabled pe-none opacity-75' : ''"
                :aria-disabled="isSubscriptionExpired ? 'true' : 'false'"
              >
                <i class="bi bi-pencil-square me-1"></i> Edit
              </RouterLink>
              <button
                @click="deleteProperty(property.id)"
                class="btn btn-outline-danger btn-sm px-3"
                :disabled="isSubscriptionExpired"
                :class="isSubscriptionExpired ? 'opacity-75 cursor-not-allowed' : ''"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>

            <div class="pt-3 mt-3 border-top d-flex align-items-center justify-content-between">
              <span class="small text-muted">
                {{ getPropertyTotalReviews(property) }} review{{ getPropertyTotalReviews(property) === 1 ? "" : "s" }}
              </span>
              <button
                class="btn btn-outline-primary btn-sm"
                :disabled="reviewsLoading && selectedProperty?.id === property.id"
                @click="openReviewsModal(property)"
              >
                <i class="bi bi-chat-left-text me-1"></i> View Reviews
              </button>
            </div>

            <div class="pt-3 mt-3 border-top">
              <div class="d-flex align-items-center justify-content-between">
                <span class="small fw-semibold text-muted">Availability</span>
                <div class="form-check form-switch mb-0">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :id="`availability-${property.id}`"
                    :checked="property.is_available"
                    :disabled="availabilityLoadingIds.includes(property.id) || isSubscriptionExpired"
                    @change="toggleAvailability(property)"
                  />
                  <label class="form-check-label small ms-1" :for="`availability-${property.id}`">
                    {{ property.is_available ? "Open" : "Full" }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showReviewsModal" class="modal-backdrop-custom">
    <div class="modal-custom modal-reviews">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 class="fw-bold mb-1">Property Reviews</h5>
          <p class="text-muted small mb-0">{{ selectedProperty?.title || "Selected Property" }}</p>
        </div>
        <button class="btn btn-light btn-sm" @click="closeReviewsModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="display-6 fw-bold text-primary mb-0">
          {{ reviewSummary.average_rating.toFixed(1) }}
        </div>
        <div>
          <div class="text-warning">
            <i v-for="star in 5" :key="`summary-star-${star}`" :class="star <= Math.round(reviewSummary.average_rating) ? 'bi bi-star-fill' : 'bi bi-star'"></i>
          </div>
          <div class="text-muted small">
            {{ reviewSummary.total_reviews }} review{{ reviewSummary.total_reviews === 1 ? "" : "s" }}
          </div>
        </div>
      </div>

      <div class="star-breakdown mb-4">
        <span v-for="row in starBreakdown" :key="`breakdown-${row.stars}`" class="star-pill">
          {{ row.stars }} star{{ row.stars === 1 ? "" : "s" }} · {{ row.count }}
        </span>
      </div>

      <div class="star-filter mb-3">
        <button
          v-for="star in 5"
          :key="`filter-${star}`"
          class="star-filter-btn"
          :class="selectedStarFilter === star ? 'active' : ''"
          @click="toggleStarFilter(star)"
        >
          {{ star }} star{{ star === 1 ? "" : "s" }}
        </button>
      </div>

      <div v-if="reviewsLoading" class="text-muted small">Loading reviews...</div>
      <div v-else-if="reviewsError" class="alert alert-warning mb-0">{{ reviewsError }}</div>
      <div v-else-if="filteredReviews.length === 0" class="text-muted small">No reviews with this rating.</div>
      <div v-else class="review-list">
        <div v-for="(review, i) in filteredReviews" :key="review.id || i" class="review-item">
          <img :src="review.user_img || avatarFallback(review.user_name)" class="rounded-circle" width="40" height="40" />
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="mb-0 fw-bold small">{{ review.user_name }}</p>
                <div class="text-warning small">
                  <i v-for="star in 5" :key="`review-${i}-star-${star}`" :class="star <= review.rating ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                </div>
              </div>
              <small class="text-muted">{{ formatReviewDate(review.created_at) }}</small>
            </div>
            <p class="mb-0 text-muted small mt-1">{{ review.comment }}</p>
          </div>
        </div>
      </div>

      <div v-if="!reviewsLoading && !reviewsError && reviewLastPage > 1" class="d-flex align-items-center justify-content-between mt-4">
        <button class="btn btn-outline-secondary btn-sm" :disabled="reviewPage <= 1" @click="changeReviewPage(reviewPage - 1)">
          <i class="bi bi-chevron-left me-1"></i> Prev
        </button>
        <span class="small text-muted">Page {{ reviewPage }} of {{ reviewLastPage }}</span>
        <button class="btn btn-outline-secondary btn-sm" :disabled="reviewPage >= reviewLastPage" @click="changeReviewPage(reviewPage + 1)">
          Next <i class="bi bi-chevron-right ms-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteProperty as deleteOwnerPropertyApi, getOwnerProperties, getPropertyLimit, getPropertyReviews, updateOwnerPropertyAvailability, updateOwnerPropertyState } from '@/api/property';
import { getOwnerSubscriptionStatus } from "@/api/subscription";
import SuccessToast from '@/components/successToast.vue';
import OwnerSubscriptionExpiredBanner from "@/components/OwnerSubscriptionExpiredBanner.vue";
import placeholderImg from '@/assets/Placeholder/thumbnail_placeholder.jpg'; 
import { useUserInfo } from '@/store/userInfo';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      properties: [],
      showSuccess: false,
      limit: null,
      count: null,
      limitReached: false,
      availabilityLoadingIds: [],
      placeholderImg: placeholderImg,
      isLoading: true, // Added loading state,
      toastMessage: "",
      showReviewsModal: false,
      reviewsLoading: false,
      reviewsError: "",
      reviews: [],
      reviewSummary: {
        average_rating: 0,
        total_reviews: 0,
      },
      reviewCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      reviewPage: 1,
      reviewLastPage: 1,
      selectedStarFilter: null,
      selectedProperty: null,
    };
  },
  components: { SuccessToast, OwnerSubscriptionExpiredBanner },
  computed: {
    info() {
      return useUserInfo();
    },
    subscription() {
      return this.info.subscription || null;
    },
    isSubscriptionExpired() {
      if (!this.subscription) return false;
      const canManage = this.subscription?.can_manage_properties;
      const hasStatus = typeof this.subscription?.status !== "undefined" && this.subscription?.status !== null;
      const status = hasStatus ? String(this.subscription.status).toLowerCase() : "";
      const statusInactive = hasStatus && !["active", "trialing", "trial", "ongoing"].includes(status);
      return canManage === false || statusInactive;
    },
    ownerVerificationStatus() {
      const status = String(this.info?.owner_verification_status || "unverified").toLowerCase().trim();
      return ["verified", "pending", "rejected", "unverified"].includes(status) ? status : "unverified";
    },
    ownerVerificationLabel() {
      if (this.ownerVerificationStatus === "verified") return "Owner: Verified";
      if (this.ownerVerificationStatus === "pending") return "Owner: Verification Pending";
      if (this.ownerVerificationStatus === "rejected") return "Owner: Verification Rejected";
      return "Owner: Unverified";
    },
    ownerVerificationBadgeClass() {
      if (this.ownerVerificationStatus === "verified") return "bg-success-subtle text-success";
      if (this.ownerVerificationStatus === "pending") return "bg-warning-subtle text-warning-emphasis";
      if (this.ownerVerificationStatus === "rejected") return "bg-danger-subtle text-danger";
      return "bg-secondary-subtle text-secondary";
    },
    starBreakdown() {
      const counts = this.reviewCounts || {};
      const total = Number(this.reviewSummary?.total_reviews || 0) || Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0);
      return [5, 4, 3, 2, 1].map((stars) => {
        const count = Number(counts?.[stars] || 0);
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
        return { stars, count, percent };
      });
    },
    filteredReviews() {
      if (!this.selectedStarFilter) return this.reviews;
      return (this.reviews || []).filter((review) => Number(review?.rating || 0) === this.selectedStarFilter);
    },
  },
  methods: {
    getPropertyTotalReviews(property) {
      const value = Number(property?.total_reviews ?? property?.review_count ?? 0);
      return Number.isFinite(value) ? value : 0;
    },
    normalizeReviews(payload) {
      const reviewList = Array.isArray(payload?.reviews)
        ? payload.reviews
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      const reviews = reviewList.map((review) => ({
        id: review.id,
        user_name: review.user_name || review.user?.name || "Anonymous User",
        user_img: review.user_img || review.user?.user_img_url || null,
        rating: Number(review.rating || 0),
        comment: review.comment || "",
        created_at: review.created_at || null,
      }));

      const average = Number(payload?.average_rating || payload?.summary?.average_rating || 0);
      const total = Number(payload?.total_reviews || payload?.summary?.total_reviews || reviews.length);

      const rawCounts = payload?.summary?.counts || payload?.summary?.rating_counts || payload?.counts || payload?.rating_counts || null;
      const counts = {
        1: Number(rawCounts?.[1] || rawCounts?.one || 0),
        2: Number(rawCounts?.[2] || rawCounts?.two || 0),
        3: Number(rawCounts?.[3] || rawCounts?.three || 0),
        4: Number(rawCounts?.[4] || rawCounts?.four || 0),
        5: Number(rawCounts?.[5] || rawCounts?.five || 0),
      };
      const hasCounts = Object.values(counts).some((value) => value > 0);
      if (!hasCounts) {
        reviews.forEach((review) => {
          const rating = Math.max(1, Math.min(5, Math.round(Number(review.rating || 0))));
          counts[rating] = (counts[rating] || 0) + 1;
        });
      }

      const meta = payload?.meta || payload?.pagination || payload || {};
      const currentPage = Number(meta?.current_page || meta?.currentPage || payload?.current_page || 1);
      const lastPage = Number(meta?.last_page || meta?.lastPage || payload?.last_page || 1);

      return {
        reviews,
        summary: {
          average_rating: Number.isFinite(average) ? average : 0,
          total_reviews: Number.isFinite(total) ? total : reviews.length,
        },
        counts,
        currentPage: Number.isFinite(currentPage) ? currentPage : 1,
        lastPage: Number.isFinite(lastPage) ? lastPage : 1,
      };
    },
    formatReviewDate(date) {
      if (!date) return "";
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return "";
      return parsed.toLocaleDateString();
    },
    avatarFallback(name) {
      const safeName = encodeURIComponent(name || "User");
      return `https://ui-avatars.com/api/?name=${safeName}&background=E2E8F0&color=1E293B`;
    },
    async openReviewsModal(property) {
      this.selectedProperty = property;
      this.reviewPage = 1;
      this.reviewLastPage = 1;
      this.selectedStarFilter = null;
      this.showReviewsModal = true;
      await this.fetchReviewsPage(1);
    },
    async fetchReviewsPage(page = 1) {
      if (!this.selectedProperty) return;
      this.reviewsLoading = true;
      this.reviewsError = "";
      this.reviews = [];
      this.reviewSummary = { average_rating: 0, total_reviews: 0 };
      this.reviewCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      try {
        const response = await getPropertyReviews(this.selectedProperty.id, page, this.selectedStarFilter);
        const payload = response?.data || {};
        const normalized = this.normalizeReviews(payload);
        this.reviews = normalized.reviews;
        this.reviewSummary = normalized.summary;
        this.reviewCounts = normalized.counts;
        this.reviewPage = normalized.currentPage;
        this.reviewLastPage = normalized.lastPage;
      } catch (error) {
        this.reviews = [];
        this.reviewSummary = { average_rating: 0, total_reviews: 0 };
        this.reviewCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        this.reviewPage = 1;
        this.reviewLastPage = 1;
        this.reviewsError = error?.response?.data?.message || "Unable to load reviews right now.";
      } finally {
        this.reviewsLoading = false;
      }
    },
    closeReviewsModal() {
      this.showReviewsModal = false;
      this.selectedProperty = null;
    },
    async changeReviewPage(page) {
      if (page < 1 || page > this.reviewLastPage || this.reviewsLoading) return;
      await this.fetchReviewsPage(page);
    },
    async toggleStarFilter(star) {
      this.selectedStarFilter = this.selectedStarFilter === star ? null : star;
      this.reviewPage = 1;
      await this.fetchReviewsPage(1);
    },
    async refreshSubscription() {
      try {
        const subscription = await getOwnerSubscriptionStatus();
        if (subscription) {
          this.info.setSubscriptionStatus(subscription);
        }
      } catch (error) {
        console.warn("Failed to refresh subscription status:", error);
      }
    },
    async applyExpiredAvailability() {
      if (!this.isSubscriptionExpired) return;
      const toDisable = (this.properties || []).filter(
        (p) => p?.is_available || String(p?.status || "").toLowerCase() !== "pending"
      );
      if (!toDisable.length) return;

      await Promise.allSettled(
        toDisable.map(async (property) => {
          try {
            await updateOwnerPropertyState(property.id, false, "pending");
            property.is_available = false;
            property.status = "pending";
          } catch (error) {
            console.error("Failed to update availability:", error);
          }
        })
      );

    },
    async deleteProperty(id) {
      if (this.isSubscriptionExpired) return;
      const result = await Swal.fire({
        title: "Delete property?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
      });

      if (!result.isConfirmed) return;

      try {
        await deleteOwnerPropertyApi(id);
        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Property deleted successfully.",
          timer: 1400,
          showConfirmButton: false,
        });
        this.getProperties(); // Refresh list
        this.getPropertyLimit(); // Refresh limit
      } catch (error) {
        console.error("Delete failed", error);
        await Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: error?.response?.data?.message || "Delete failed.",
        });
      }
    },
    async getProperties() {
      this.isLoading = true;
      try {
        const response = await getOwnerProperties();
        this.properties = response.data.properties;
      } catch (error) {
        console.error("GetProperties Error:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getPropertyLimit() {
      try {
        const response = await getPropertyLimit();
        this.limit = response.data.listing_limit;
        this.count = response.data.current_listings;
        this.limitReached = this.count >= this.limit;
      } catch (error) {
        console.error("Limit Fetch Error:", error);
      }
    },
    async toggleAvailability(property) {
      if (this.isSubscriptionExpired) return;
      if (this.availabilityLoadingIds.includes(property.id)) return;
      const nextAvailability = !property.is_available;
      this.availabilityLoadingIds.push(property.id);

      try {
        await updateOwnerPropertyAvailability(property.id, nextAvailability);
        property.is_available = nextAvailability;
      } catch (error) {
        console.error("Availability update failed:", error);
        alert(error?.response?.data?.message || "Failed to update availability.");
      } finally {
        this.availabilityLoadingIds = this.availabilityLoadingIds.filter((id) => id !== property.id);
      }
    },
    goToAddProperty() {
      if (!this.limitReached && !this.isSubscriptionExpired) {
        this.$router.push('/dashboard/properties/add');
      }
    },
  },
  async mounted() {
    await this.refreshSubscription();
    await this.getProperties();
    await this.getPropertyLimit();
    await this.applyExpiredAvailability();
    
    const success = sessionStorage.getItem("propertyCreated");
    const update = sessionStorage.getItem("propertyUpdate");
    if (success) {
      this.showSuccess = true;
      Swal.fire({
          icon: "success",
          title: "Property submitted",
          text: "Your property was submitted successfully.",
          timer: 1300,
          showConfirmButton: false,
        });
      sessionStorage.removeItem("propertyCreated");
      this.toastMessage = "Property Created Successfully";
      // Auto-hide toast after 3 seconds
      setTimeout(() => { this.showSuccess = false; }, 3000);
    } else if (update){
      this.showSuccess = true;
      this.toastMessage = "Property Updated Successfully";
      sessionStorage.removeItem("propertyUpdate");
      // Auto-hide toast after 3 seconds
      setTimeout(() => { this.showSuccess = false; }, 3000);
    }
  }
};
</script>

<style scoped>
.property-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.property-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.12) !important;
}

.transition-transform {
  transition: transform 0.5s ease;
}

.property-card:hover .transition-transform {
  transform: scale(1.1);
}

.object-fit-cover {
  object-fit: cover;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-custom {
  background: #fff;
  padding: 1.5rem;
  border-radius: 14px;
  width: 100%;
  max-width: 720px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-reviews {
  max-height: 80vh;
  overflow: auto;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.star-breakdown {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.star-pill {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}

.star-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.star-filter-btn {
  border: 1px solid #d7dde5;
  background: #fff;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  transition: all 0.2s ease;
}

.star-filter-btn:hover {
  border-color: #f5a524;
  color: #b45309;
}

.star-filter-btn.active {
  background: #f59e0b;
  border-color: #f59e0b;
  color: #fff;
  box-shadow: 0 6px 14px rgba(245, 158, 11, 0.25);
}

.review-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  background: #fbfdff;
}
</style>

