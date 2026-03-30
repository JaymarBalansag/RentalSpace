<template>
  <Header />

  <div class="container py-4" v-if="!loading && property">
    <div v-if="bookingSubmitting" class="booking-overlay">
      <div class="booking-overlay-card shadow-sm rounded-4">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mb-0 text-muted fw-semibold">Submitting booking…</p>
      </div>
    </div>
    <div class="mb-3">
      <button @click="BackToPrevPage()" class="btn btn-link text-decoration-none p-0 text-secondary fw-semibold">
        <i class="bi bi-arrow-left"></i> Back to Listings
      </button>
    </div>

    <div class="row g-4 align-items-start">
      <div class="col-lg-7">
        <div class="main-image-wrapper shadow-sm rounded-4 overflow-hidden mb-3">
          <img
            :src="property.image_url || placeholderImg"
            class="img-fluid w-100 main-img"
            alt="Property"
            @error="$event.target.src = placeholderImg"
          />
        </div>

        <div class="gallery-section mb-4" v-if="propertyImages && propertyImages.length > 0">
          <h6 class="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">Property Gallery</h6>
          <div id="propertyImagesCarousel" class="carousel slide rounded-4 overflow-hidden shadow-sm" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div v-for="(img, index) in propertyImages" :key="index" 
                  :class="['carousel-item', { active: index === 0 }]">
                <img :src="img" class="d-block w-100 carousel-img" />
              </div>
            </div>
            <template v-if="propertyImages.length > 1">
              <button class="carousel-control-prev" type="button" data-bs-target="#propertyImagesCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon shadow-sm" aria-hidden="true"></span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#propertyImagesCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon shadow-sm" aria-hidden="true"></span>
              </button>
            </template>
          </div>
        </div>

        <div class="d-flex flex-wrap gap-2 mb-4">
          <div class="stat-pill"><i class="bi bi-house me-2"></i>{{ property.type_name }}</div>
          <div class="stat-pill"><i class="bi bi-file-earmark-text me-2"></i>{{ toTitle(property.agreement_type) }}</div>
          <div class="stat-pill"><i class="bi bi-clock me-2"></i>{{ toTitle(property.payment_frequency) }}</div>
          <div class="stat-pill"><i class="bi bi-check-circle me-2"></i>{{ availabilityText }}</div>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <div class="card h-100 border-0 bg-light p-3 rounded-4">
              <h6 class="fw-bold small mb-3 text-primary text-uppercase">Amenities</h6>
              <div v-if="allAmenities.length" class="d-flex flex-wrap gap-2">
                <span v-for="amenity in allAmenities" :key="amenity" class="badge-custom">{{ amenity }}</span>
              </div>
              <p v-else class="small text-muted mb-0">No amenities listed.</p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card h-100 border-0 bg-light p-3 rounded-4">
              <h6 class="fw-bold small mb-3 text-primary text-uppercase">Facilities</h6>
              <div v-if="allFacilities.length" class="d-flex flex-wrap gap-2">
                <span v-for="facility in allFacilities" :key="facility" class="badge-custom">{{ facility }}</span>
              </div>
              <p v-else class="small text-muted mb-0">No facilities listed.</p>
            </div>
          </div>
          <div class="col-12">
            <div class="card border-0 bg-light p-3 rounded-4">
              <h6 class="fw-bold small mb-3 text-primary text-uppercase">Utilities</h6>
              <div v-if="allUtilities.length" class="d-flex flex-wrap gap-2">
                <span v-for="utility in allUtilities" :key="utility" class="badge-custom">{{ toTitle(utility) }}</span>
              </div>
              <p v-else class="small text-muted mb-0">
                {{ property.utilities_included ? "Utilities are included, but specific items were not listed." : "No utilities included." }}
              </p>
            </div>
          </div>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <div class="card border-0 bg-light p-3 rounded-4 h-100">
              <h6 class="fw-bold small mb-3 text-primary text-uppercase">Property Specs</h6>
              <div v-for="item in propertySpecs" :key="item.label" class="d-flex justify-content-between small py-1 border-bottom">
                <span class="text-muted">{{ item.label }}</span>
                <span class="fw-semibold text-end ms-3">{{ item.value }}</span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card border-0 bg-light p-3 rounded-4 h-100">
              <h6 class="fw-bold small mb-3 text-primary text-uppercase">Rental Terms</h6>
              <div v-for="item in rentalTerms" :key="item.label" class="d-flex justify-content-between small py-1 border-bottom">
                <span class="text-muted">{{ item.label }}</span>
                <span class="fw-semibold text-end ms-3">{{ item.value }}</span>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="card border-0 bg-light p-3 rounded-4">
              <h6 class="fw-bold small mb-2 text-primary text-uppercase">House Rules</h6>
              <p class="small text-muted mb-2">{{ property.rules || "No specific house rules provided." }}</p>
              <p class="small mb-0">
                <span class="text-muted">Curfew:</span>
                <span class="fw-semibold ms-1">{{ curfewText }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5 sticky-lg-top" style="top: 20px; z-index: 10;">
        <div class="card border-0 shadow-lg rounded-4 p-4">
          <h1 class="h3 fw-bold text-dark mb-1">{{ property.title }}</h1>
          <p class="small mb-2" :class="property?.is_available ? 'text-success' : 'text-danger'">
            {{ availabilityText }}
          </p>
          <p class="text-success h2 fw-bold mb-4">
            ₱{{ property.price }} <span class="fs-6 text-muted fw-normal">/ {{ toTitle(property.payment_frequency) }}</span>
          </p>

          <div class="mb-4">
            <h6 class="fw-bold text-muted small text-uppercase mb-2">Details</h6>
            <p class="text-muted description" :class="{ 'clamped': !showFullDescription }">
              {{ property.description }}
            </p>
            <button
              v-if="property.description?.length > 200"
              class="btn btn-link p-0 see-more-btn fw-bold text-decoration-none"
              @click="showFullDescription = !showFullDescription"
            >
              {{ showFullDescription ? 'Show Less' : 'Read More' }}
            </button>
          </div>

          <div class="d-flex align-items-center gap-3 p-3 rounded-4 bg-light mb-4 border border-white">
            <img :src="property.owner_profile_photo || placeholderImg" class="rounded-circle border" width="50" height="50" style="object-fit: cover;"/>
            <div class="flex-grow-1">
              <p class="mb-0 fw-bold small">{{ property.owner_name }}</p>
              <span
                class="badge rounded-pill fw-normal"
                :class="ownerVerificationBadgeClass"
              >
                {{ ownerVerificationLabel }}
              </span>
            </div>
          </div>

          <div class="p-3 rounded-4 bg-light mb-4 border border-white">
            <h6 class="fw-bold text-muted small text-uppercase mb-2">Location</h6>
            <p class="small mb-0 text-muted">{{ fullAddress }}</p>
          </div>

          <div class="d-grid gap-2">
            <button
              v-if="acceptsBookings"
              :disabled="property.owner_id === authId || isOwner == 'owner' || !property?.is_available || bookingSubmitting"
              class="btn btn-primary btn-lg rounded-pill fw-bold py-3"
              @click="openAgreementModal"
            >
              <i class="bi bi-calendar-plus-fill me-2"></i> Book This Property
            </button>
            <div v-else class="booking-disabled-note">
              <div class="booking-disabled-head">
                <i class="bi bi-chat-heart-fill"></i>
                <span>Interested in this property?</span>
              </div>
              <p class="mb-0 small">
                Message the owner to ask about availability, terms, and the next steps for this listing.
              </p>
            </div>
            <button 
              class="btn btn-outline-dark rounded-pill fw-bold py-2" 
              :disabled="property.owner_id === authId || isOwner == 'owner'" 
              @click="contactOwner(property.owner_id, property.id)"
            >
              <i class="bi bi-chat-dots-fill me-2"></i> Message Owner
            </button>
            <button
              v-if="canShowReportAction"
              class="btn btn-outline-danger rounded-pill fw-semibold py-2"
              :disabled="reportSubmitting"
              @click="openReportModal"
            >
              <i class="bi bi-flag-fill me-2"></i> Report Property
            </button>
          </div>
        </div>

        <div class="mt-4 rounded-4 overflow-hidden border shadow-sm">
          <div class="route-summary p-3 border-bottom bg-light-subtle">
            <div class="d-flex align-items-start justify-content-between gap-3">
              <div>
                <p class="route-title mb-1">Route to this property</p>
                <p class="route-message mb-0">{{ mapRouteMessage }}</p>
              </div>
              <span class="route-status-pill" :class="`status-${mapRouteStatus}`">
                {{ mapRouteStatus === "ready" ? "Ready" : mapRouteStatus === "routing" ? "Routing" : mapRouteStatus === "resolving-location" ? "Locating" : mapRouteStatus === "route-error" ? "Route Error" : "Property Only" }}
              </span>
            </div>
            <div v-if="mapRouteStatus === 'ready'" class="d-flex flex-wrap gap-2 mt-2">
              <span class="route-chip"><i class="bi bi-signpost-split me-1"></i>{{ formatDistance(routeSummary.distanceMeters) }}</span>
              <span class="route-chip"><i class="bi bi-clock-history me-1"></i>{{ formatDuration(routeSummary.durationSeconds) }}</span>
            </div>
            <div class="d-flex flex-wrap align-items-center gap-2 mt-2">
              <span class="route-chip route-source-chip"><i class="bi bi-geo-alt me-1"></i>{{ routeSourceLabel }}</span>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary rounded-pill route-action-btn"
                :disabled="mapRouteStatus === 'resolving-location' || mapRouteStatus === 'routing'"
                @click="useCurrentLocationRoute"
              >
                Use My Current Location
              </button>
              <button
                v-if="canResetToSavedLocation"
                type="button"
                class="btn btn-sm btn-outline-secondary rounded-pill route-action-btn"
                @click="useSavedProfileLocation"
              >
                Use Saved Location
              </button>
              <button
                v-if="hasPropertyMap"
                type="button"
                class="btn btn-sm btn-dark rounded-pill route-action-btn"
                @click="openFullViewMap"
              >
                Full View Map
              </button>
            </div>
          </div>
          <PropertyMap
            v-if="hasPropertyMap"
            :lat="propertyMapCoords.lat"
            :lng="propertyMapCoords.lng"
            :title="property.title"
            :user-lat="userCoords.lat"
            :user-lng="userCoords.lng"
            :auto-route="true"
            @route-ready="onRouteReady"
            @route-error="onRouteError"
          />
        </div>
      </div>
    </div>

    <div class="mt-5 pt-5 border-top">
      <h4 class="fw-bold mb-4">Related Listings</h4>
      <div v-if="relatedProperties.length > 0" class="row g-4">
        <div v-for="(related, i) in relatedProperties" :key="i" class="col-md-4">
          <div class="card border-0 shadow-sm h-100 rounded-4 overflow-hidden property-card">
            <img :src="related.image_url || placeholderImg" class="card-img-top" style="height: 180px; object-fit: cover;"/>
            <div class="card-body">
              <h6 class="fw-bold text-truncate">{{ related.title }}</h6>
              <p class="text-success fw-bold small mb-2">₱{{ related.price }} / {{ toTitle(related.payment_frequency) }}</p>
              <button @click="gotoRelated(related.id)" class="btn btn-sm btn-outline-primary rounded-pill w-100 fw-bold">View Details</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-4 bg-light rounded-4 text-muted">
        <i class="bi bi-house-slash fs-2 d-block mb-2"></i>
        No similar properties available.
      </div>
    </div>

    <div class="mt-5 pb-5">
      <h4 class="fw-bold mb-4">Ratings & Reviews</h4>

      <div class="row g-4 mb-4">
        <div class="col-lg-4">
          <div class="p-4 border rounded-4 bg-light h-100">
            <p class="text-muted small mb-1">Average Rating</p>
            <div class="d-flex align-items-end gap-2 mb-2">
              <h2 class="fw-bold mb-0">{{ reviewSummary.average_rating.toFixed(1) }}</h2>
              <span class="text-muted small">/ 5</span>
            </div>
            <div class="text-warning mb-2">
              <i
                v-for="star in 5"
                :key="star"
                :class="star <= Math.round(reviewSummary.average_rating) ? 'bi bi-star-fill' : 'bi bi-star'"
              ></i>
            </div>
            <p class="small text-muted mb-0">
              {{ reviewSummary.total_reviews }} review{{ reviewSummary.total_reviews === 1 ? "" : "s" }}
            </p>
          </div>
        </div>

        <div class="col-lg-8">
          <form class="p-4 border rounded-4 bg-white shadow-sm" @submit.prevent="submitReview">
            <h6 class="fw-bold mb-3">Write a Review</h6>

            <div class="mb-3">
              <label class="form-label small fw-bold">Your Rating</label>
              <div class="text-warning fs-5">
                <button
                  v-for="star in 5"
                  :key="`rate-${star}`"
                  type="button"
                  class="btn btn-link p-0 me-1 text-warning text-decoration-none"
                  @click="reviewForm.rating = star"
                >
                  <i :class="star <= reviewForm.rating ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                </button>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold">Comment</label>
              <textarea
                v-model="reviewForm.comment"
                rows="3"
                maxlength="500"
                class="form-control rounded-3"
                placeholder="Share your experience with this property"
              ></textarea>
            </div>

            <button
              type="submit"
              class="btn btn-primary rounded-pill px-4"
              :disabled="isSubmittingReview || !reviewForm.rating || !reviewForm.comment.trim()"
            >
              <span v-if="isSubmittingReview" class="spinner-border spinner-border-sm me-2"></span>
              Submit Review
            </button>
          </form>
        </div>
      </div>

      <div v-if="reviewsLoading" class="text-muted small">Loading reviews...</div>
      <div v-else-if="reviewsError" class="alert alert-warning mb-0">{{ reviewsError }}</div>
      <div v-else-if="reviews.length === 0" class="text-muted small">No reviews yet for this property.</div>

      <div v-else class="row">
        <div v-for="(review, i) in displayedReviews" :key="review.id || i" class="col-md-6 mb-3">
          <div class="p-3 border rounded-4 bg-white shadow-sm h-100">
            <div class="d-flex align-items-center gap-3 mb-2">
              <img :src="review.user_img || placeholderImg" class="rounded-circle" width="40" height="40" />
              <div class="flex-grow-1">
                <p class="mb-0 fw-bold small">{{ review.user_name }}</p>
                <div class="text-warning small">
                  <i v-for="star in 5" :key="star" :class="star <= review.rating ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                </div>
              </div>
              <small class="text-muted">{{ formatReviewDate(review.created_at) }}</small>
            </div>
            <p class="mb-0 text-muted small">{{ review.comment }}</p>
          </div>
        </div>
      </div>

      <div v-if="canViewAllReviews" class="mt-3">
        <button class="btn btn-outline-primary rounded-pill px-4" @click="openReviewsModal">
          View All Reviews
        </button>
      </div>
    </div>

    <div v-if="showReviewsModal" class="modal-overlay-custom">
      <div class="modal-body-custom rounded-4 shadow-lg p-4 reviews-modal">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">All Reviews</h5>
          <button class="btn-close" @click="closeReviewsModal"></button>
        </div>

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="display-6 fw-bold text-primary mb-0">
            {{ modalSummary.average_rating.toFixed(1) }}
          </div>
          <div>
            <div class="text-warning">
              <i v-for="star in 5" :key="`modal-summary-${star}`" :class="star <= Math.round(modalSummary.average_rating) ? 'bi bi-star-fill' : 'bi bi-star'"></i>
            </div>
            <div class="text-muted small">
              {{ modalSummary.total_reviews }} review{{ modalSummary.total_reviews === 1 ? "" : "s" }}
            </div>
          </div>
        </div>

        <div class="review-pill-row mb-3">
          <button
            v-for="pill in modalStarPills"
            :key="`pill-${pill.stars}`"
            class="review-pill"
            :class="selectedStarFilter === pill.stars ? 'active' : ''"
            @click="toggleStarFilter(pill.stars)"
          >
            {{ pill.stars }} star{{ pill.stars === 1 ? "" : "s" }} · {{ pill.count }}
          </button>
        </div>

        <div v-if="modalReviewsLoading" class="text-muted small">Loading reviews...</div>
        <div v-else-if="modalReviewsError" class="alert alert-warning mb-0">{{ modalReviewsError }}</div>
        <div v-else-if="modalFilteredReviews.length === 0" class="text-muted small">No reviews with this rating.</div>

        <div v-else class="row">
          <div v-for="(review, i) in modalFilteredReviews" :key="review.id || i" class="col-md-6 mb-3">
            <div class="p-3 border rounded-4 bg-white shadow-sm h-100">
              <div class="d-flex align-items-center gap-3 mb-2">
                <img :src="review.user_img || placeholderImg" class="rounded-circle" width="40" height="40" />
                <div class="flex-grow-1">
                  <p class="mb-0 fw-bold small">{{ review.user_name }}</p>
                  <div class="text-warning small">
                    <i v-for="star in 5" :key="`modal-${i}-star-${star}`" :class="star <= review.rating ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                  </div>
                </div>
                <small class="text-muted">{{ formatReviewDate(review.created_at) }}</small>
              </div>
              <p class="mb-0 text-muted small">{{ review.comment }}</p>
            </div>
          </div>
        </div>

        <div v-if="!modalReviewsLoading && !modalReviewsError && modalLastPage > 1" class="d-flex align-items-center justify-content-between mt-3">
          <button class="btn btn-outline-secondary btn-sm" :disabled="modalPage <= 1" @click="changeModalPage(modalPage - 1)">
            <i class="bi bi-chevron-left me-1"></i> Prev
          </button>
          <span class="small text-muted">Page {{ modalPage }} of {{ modalLastPage }}</span>
          <button class="btn btn-outline-secondary btn-sm" :disabled="modalPage >= modalLastPage" @click="changeModalPage(modalPage + 1)">
            Next <i class="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showUserAgreementModal" class="modal-overlay-custom">
      <div class="modal-body-custom rounded-4 shadow-lg p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Booking Requirements</h5>
          <button class="btn-close" @click="closeAgreementModal"></button>
        </div>
        
        <p class="text-muted small mb-4">Please provide details for your <strong>{{ property_type }}</strong> rental request.</p>

        <form @submit.prevent="validateAgreement">
          <div class="d-grid gap-3">
            <div>
              <label class="form-label small fw-bold">Move-in Date</label>
              <input type="date" required v-model="agreement.move_in_date" class="form-control rounded-3" />
            </div>
          </div>
          <div class="mt-3">
            <label class="form-label small fw-bold">Additional Notes</label>
            <textarea v-model="agreement.notes" class="form-control rounded-3" rows="2" placeholder="Any special requests?"></textarea>
          </div>

          <div class="form-check mt-3">
            <input type="checkbox" v-model="agreement.agreement" class="form-check-input" id="termAgree" @change="agreementError = ''">
            <label class="form-check-label small" for="termAgree">I agree to the property rules and terms.</label>
          </div>
          <div v-if="agreementError" class="text-danger small mt-1">
            {{ agreementError }}
          </div>

          <button type="submit" class="btn btn-primary w-100 rounded-pill fw-bold py-3 mt-4">Confirm Request</button>
        </form>
      </div>
    </div>

    <div v-if="showReportModal" class="modal-overlay-custom" @click.self="closeReportModal">
      <div class="modal-body-custom rounded-4 shadow-lg p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 class="fw-bold mb-1">Report Property</h5>
            <p class="text-muted small mb-0">
              Let the admin team know what looks wrong with this listing.
            </p>
          </div>
          <button class="btn-close" @click="closeReportModal"></button>
        </div>

        <form @submit.prevent="submitReport">
          <div class="mb-3">
            <label class="form-label small fw-bold">Reason</label>
            <select v-model="reportForm.reason" class="form-select rounded-3" required>
              <option value="" disabled>Select a reason</option>
              <option v-for="option in reportReasons" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Details <span class="text-muted fw-normal">(Optional)</span></label>
            <textarea
              v-model="reportForm.details"
              rows="4"
              maxlength="1000"
              class="form-control rounded-3"
              placeholder="Share details the admin should review."
            ></textarea>
            <div class="d-flex justify-content-end mt-1">
              <small class="text-muted">{{ reportForm.details.length }}/1000</small>
            </div>
          </div>

          <div class="report-note mb-4">
            <i class="bi bi-shield-check"></i>
            <span>This report is reviewed by admin first. It does not automatically remove the listing.</span>
          </div>

          <div class="d-flex flex-column flex-sm-row gap-2">
            <button type="button" class="btn btn-light border rounded-pill flex-fill" :disabled="reportSubmitting" @click="closeReportModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-danger rounded-pill flex-fill" :disabled="reportSubmitting || !reportForm.reason">
              <span v-if="reportSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>

    <confirmModal
      :show="showConfirmModal"
      title="Confirm Booking"
      message="Are you sure all the information you entered is correct?"
      confirm-text="Yes, I'm Sure"
      :loading="bookingSubmitting"
      @confirm="submitAgreement"
      @cancel="closeConfirmModal"
    />
  </div>

  <div v-else class="text-center py-5 mt-5">
    <div class="spinner-border text-primary" role="status"></div>
    <p class="mt-3 text-muted">Gathering property details...</p>
  </div>
</template>

<script>
// Logic remains identical to your script but integrated into the cleaned template
import { getPropertyById, getPropertyByType, recordView, getPropertyReviews, submitPropertyReview, submitPropertyReport } from "@/api/property";
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";
import { submitAgreement } from "@/api/Owner/bookings.js";
import { initiateConversation } from "@/api/messages";
import { getAuthUserId, getUserProfile } from "@/api/user";
import { useUserInfo } from '@/store/userInfo';
import confirmModal from "@/components/confirmModal.vue";
import Header from "@/components/Header.vue";
import PropertyMap from "@/components/propertyMap.vue";
import Swal from "sweetalert2";

export default {
  name: "PropertyDetails",
  components: { confirmModal, Header, PropertyMap },
  data() {
    return {
      loading: false,
      showFullDescription: false,
      showConfirmModal: false,
      showUserAgreementModal: false,
      agreementError: "",
      bookingSubmitting: false,
      isLoggedIn: null,
      property: null,
      relatedProperties: [],
      placeholderImg,
      property_type: "",
      property_type_id: "",
      authId: null,
      propertyImages: [],
      reviews: [],
      reviewsLoading: false,
      reviewsError: "",
      reviewSummary: {
        average_rating: 0,
        total_reviews: 0,
      },
      showReviewsModal: false,
      showReportModal: false,
      modalReviews: [],
      modalReviewsLoading: false,
      modalReviewsError: "",
      modalSummary: {
        average_rating: 0,
        total_reviews: 0,
      },
      modalCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      modalPage: 1,
      modalLastPage: 1,
      selectedStarFilter: null,
      isSubmittingReview: false,
      reviewForm: {
        rating: 0,
        comment: "",
      },
      reportSubmitting: false,
      reportForm: {
        reason: "",
        details: "",
      },
      reportReasons: [
        { value: "misleading_information", label: "Misleading information" },
        { value: "fake_or_scam_listing", label: "Fake or scam listing" },
        { value: "incorrect_price_or_details", label: "Incorrect price or details" },
        { value: "inappropriate_photos_or_content", label: "Inappropriate photos or content" },
        { value: "unavailable_but_still_advertised", label: "Unavailable but still advertised" },
        { value: "safety_concern", label: "Safety concern" },
        { value: "other", label: "Other" },
      ],
      userCoords: {
        lat: null,
        lng: null,
      },
      mapRouteStatus: "idle",
      mapRouteMessage: "We will try to map your route to this property.",
      routeSummary: {
        distanceMeters: null,
        durationSeconds: null,
      },
      routeSource: "none",
      savedProfileCoords: {
        lat: null,
        lng: null,
      },
      routeGuardTimer: null,
      agreement: {
        occupant_num: null,
        lease_duration: null,
        move_in_date: "",
        room_preference: null,
        notes: "",
        agreement: false,
      },
    };
  },
  methods: {
    normalizeCoordinate(value) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    },
    isValidLatLng(lat, lng) {
      const parsedLat = Number(lat);
      const parsedLng = Number(lng);
      if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) return false;
      if (parsedLat < -90 || parsedLat > 90) return false;
      if (parsedLng < -180 || parsedLng > 180) return false;
      if (Math.abs(parsedLat) < 0.000001 && Math.abs(parsedLng) < 0.000001) return false;
      return true;
    },
    async requestBrowserLocation() {
      if (!("geolocation" in navigator)) {
        return null;
      }

      return await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: Number(position.coords.latitude),
              lng: Number(position.coords.longitude),
            });
          },
          () => {
            resolve(null);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      });
    },
    async loadSavedProfileCoords() {
      const info = useUserInfo();
      if (!info.isLoggedIn) {
        this.savedProfileCoords = { lat: null, lng: null };
        return null;
      }

      try {
        const response = await getUserProfile();
        const profilePayload = response?.data?.user;
        const profile = Array.isArray(profilePayload) ? profilePayload[0] || {} : (profilePayload || response?.data || {});
        const lat = this.normalizeCoordinate(profile.latitude);
        const lng = this.normalizeCoordinate(profile.longitude);

        if (this.isValidLatLng(lat, lng)) {
          this.savedProfileCoords = { lat, lng };
          return { lat, lng };
        }
      } catch (error) {
        console.error("Unable to fetch profile location:", error);
      }

      this.savedProfileCoords = { lat: null, lng: null };
      return null;
    },
    applyRouteSource(coords, source, message) {
      if (this.routeGuardTimer) {
        clearTimeout(this.routeGuardTimer);
        this.routeGuardTimer = null;
      }
      this.userCoords = { lat: coords.lat, lng: coords.lng };
      this.routeSource = source;
      this.mapRouteStatus = "routing";
      this.mapRouteMessage = message;
      this.routeSummary = { distanceMeters: null, durationSeconds: null };

      // Guard against unresolved route fetches so UI never stays stuck on "Routing".
      this.routeGuardTimer = setTimeout(() => {
        if (this.mapRouteStatus === "routing") {
          this.onRouteError();
        }
      }, 15000);
    },
    async useCurrentLocationRoute() {
      this.mapRouteStatus = "resolving-location";
      this.mapRouteMessage = "Fetching your current location...";
      const browserCoords = await this.requestBrowserLocation();

      if (this.isValidLatLng(browserCoords?.lat, browserCoords?.lng)) {
        this.applyRouteSource(
          { lat: browserCoords.lat, lng: browserCoords.lng },
          "live",
          "Calculating route from your current location..."
        );
        return;
      }

      if (this.isValidLatLng(this.savedProfileCoords.lat, this.savedProfileCoords.lng)) {
        this.applyRouteSource(
          { ...this.savedProfileCoords },
          "saved",
          "Current location unavailable. Reverted to your saved profile location."
        );
        return;
      }

      this.routeSource = "none";
      this.mapRouteStatus = "no-location";
      this.mapRouteMessage = "Current location is unavailable. Showing property location only.";
      this.routeSummary = { distanceMeters: null, durationSeconds: null };
    },
    useSavedProfileLocation() {
      if (!this.isValidLatLng(this.savedProfileCoords.lat, this.savedProfileCoords.lng)) return;
      this.applyRouteSource(
        { ...this.savedProfileCoords },
        "saved",
        "Calculating route from your saved profile location..."
      );
    },
    async resolveUserLocationForRoute() {
      this.userCoords = { lat: null, lng: null };
      this.routeSummary = { distanceMeters: null, durationSeconds: null };
      this.routeSource = "none";
      this.mapRouteStatus = "resolving-location";
      this.mapRouteMessage = "Resolving your location for route preview...";
      const savedCoords = await this.loadSavedProfileCoords();
      if (this.isValidLatLng(savedCoords?.lat, savedCoords?.lng)) {
        this.applyRouteSource(savedCoords, "saved", "Calculating route from your saved profile location...");
        return;
      }

      const browserCoords = await this.requestBrowserLocation();
      if (this.isValidLatLng(browserCoords?.lat, browserCoords?.lng)) {
        this.applyRouteSource(
          { lat: browserCoords.lat, lng: browserCoords.lng },
          "live",
          "Saved location is not set. Calculating route from your current location..."
        );
        return;
      }

      this.routeSource = "none";
      this.mapRouteStatus = "no-location";
      this.mapRouteMessage = "Location access denied or unavailable. Showing property location only.";
    },
    onRouteReady(payload) {
      if (this.routeGuardTimer) {
        clearTimeout(this.routeGuardTimer);
        this.routeGuardTimer = null;
      }
      this.routeSummary = {
        distanceMeters: Number(payload?.distanceMeters || 0),
        durationSeconds: Number(payload?.durationSeconds || 0),
      };
      this.mapRouteStatus = "ready";
      this.mapRouteMessage = this.routeSource === "live"
        ? "Route preview is ready from your current location."
        : "Route preview is ready from your saved profile location.";
    },
    onRouteError() {
      if (this.routeGuardTimer) {
        clearTimeout(this.routeGuardTimer);
        this.routeGuardTimer = null;
      }
      this.routeSummary = { distanceMeters: null, durationSeconds: null };
      this.mapRouteStatus = "route-error";
      this.mapRouteMessage = "Unable to calculate route right now. Showing map markers only.";
    },
    formatDistance(meters) {
      const safeMeters = Number(meters || 0);
      if (!Number.isFinite(safeMeters) || safeMeters <= 0) return "-";
      if (safeMeters >= 1000) return `${(safeMeters / 1000).toFixed(1)} km`;
      return `${Math.round(safeMeters)} m`;
    },
    formatDuration(seconds) {
      const safeSeconds = Number(seconds || 0);
      if (!Number.isFinite(safeSeconds) || safeSeconds <= 0) return "-";

      const totalMinutes = Math.round(safeSeconds / 60);
      if (totalMinutes < 60) return `${totalMinutes} min`;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;
    },
    openFullViewMap() {
      if (!this.hasPropertyMap || !this.property?.id) return;

      this.$router.push({
        name: "PropertyRouteMap",
        params: { id: this.property.id },
        query: {
          title: this.property.title || "",
          lat: this.propertyMapCoords.lat,
          lng: this.propertyMapCoords.lng,
        },
      });
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
    async fetchReviews() {
      const propertyId = this.$route.params.id;
      if (!propertyId) return;

      this.reviewsLoading = true;
      this.reviewsError = "";

      try {
        const response = await getPropertyReviews(propertyId, 1);
        const payload = response?.data || {};
        const normalized = this.normalizeReviews(payload);
        this.reviews = normalized.reviews;
        this.reviewSummary = normalized.summary;
      } catch (error) {
        this.reviews = [];
        this.reviewSummary = { average_rating: 0, total_reviews: 0 };
        this.reviewsError = error?.response?.data?.message || "Unable to load reviews right now.";
      } finally {
        this.reviewsLoading = false;
      }
    },
    async openReviewsModal() {
      this.showReviewsModal = true;
      this.selectedStarFilter = null;
      this.modalPage = 1;
      this.modalLastPage = 1;
      await this.fetchModalReviewsPage(1);
    },
    closeReviewsModal() {
      this.showReviewsModal = false;
    },
    async fetchModalReviewsPage(page = 1) {
      const propertyId = this.$route.params.id;
      if (!propertyId) return;

      this.modalReviewsLoading = true;
      this.modalReviewsError = "";
      this.modalReviews = [];
      this.modalSummary = { average_rating: 0, total_reviews: 0 };
      this.modalCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      try {
        const response = await getPropertyReviews(propertyId, page, this.selectedStarFilter);
        const payload = response?.data || {};
        const normalized = this.normalizeReviews(payload);
        this.modalReviews = normalized.reviews;
        this.modalSummary = normalized.summary;
        this.modalCounts = normalized.counts;
        this.modalPage = normalized.currentPage;
        this.modalLastPage = normalized.lastPage;
      } catch (error) {
        this.modalReviews = [];
        this.modalSummary = { average_rating: 0, total_reviews: 0 };
        this.modalCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        this.modalPage = 1;
        this.modalLastPage = 1;
        this.modalReviewsError = error?.response?.data?.message || "Unable to load reviews right now.";
      } finally {
        this.modalReviewsLoading = false;
      }
    },
    async changeModalPage(page) {
      if (page < 1 || page > this.modalLastPage || this.modalReviewsLoading) return;
      await this.fetchModalReviewsPage(page);
    },
    async toggleStarFilter(star) {
      this.selectedStarFilter = this.selectedStarFilter === star ? null : star;
      this.modalPage = 1;
      await this.fetchModalReviewsPage(1);
    },
    async submitReview() {
      const info = useUserInfo();
      if (!info.isLoggedIn) {
        this.$router.push("/login");
        return;
      }

      if (!this.reviewForm.rating || !this.reviewForm.comment.trim()) {
        return;
      }

      this.isSubmittingReview = true;
      try {
        await submitPropertyReview(this.property.id, {
          rating: this.reviewForm.rating,
          comment: this.reviewForm.comment.trim(),
        });

        this.reviewForm = { rating: 0, comment: "" };
        await this.fetchReviews();
      } catch (error) {
        alert(error?.response?.data?.message || "Unable to submit review.");
      } finally {
        this.isSubmittingReview = false;
      }
    },
    async gotoRelated(id){
      await recordView(id);
      this.$router.push(`/property/${id}`);
    },
    closeConfirmModal() {
      this.showConfirmModal = false;
    },
    normalizeList(value) {
      if (!Array.isArray(value)) return [];
      return value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter((item) => item.length > 0);
    },
    formatMoney(value) {
      const amount = Number(value || 0);
      return amount.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    },
    toTitle(text){
      return text ? text.charAt(0).toUpperCase() + text.slice(1).replaceAll("_", " ") : "-";
    },
    isProfileComplete(value) {
      return value === true || value === 1 || value === "1";
    },
    normalizeUserVerificationStatus(value) {
      const status = String(value || "unverified").toLowerCase().trim();
      return ["unverified", "pending", "verified", "rejected"].includes(status) ? status : "unverified";
    },
    async ensureProfileCompletedOrRedirect() {
      const info = useUserInfo();
      if (this.isProfileComplete(info.isComplete)) return true;

      await Swal.fire({
        icon: "warning",
        title: "Complete your profile first",
        text: "Please complete your profile before booking a property or messaging an owner.",
        confirmButtonText: "Go to Profile",
      });
      this.$router.push("/completion");
      return false;
    },
    async ensureUserVerifiedForBooking() {
      const info = useUserInfo();
      const status = this.normalizeUserVerificationStatus(info.user_verification_status);

      if (status === "verified") return true;

      let text = "Verify your account first to book this property.";
      if (status === "pending") {
        text = "Your identity verification is under review. Booking will unlock after approval.";
      } else if (status === "rejected") {
        text = "Your verification was rejected. Please resubmit your valid government ID in your profile.";
      }

      await Swal.fire({
        icon: status === "pending" ? "info" : "warning",
        title: "Verification required",
        text,
        confirmButtonText: "Go to Profile",
      });
      this.$router.push("/profile");
      return false;
    },
    BackToPrevPage() {
      if (window.history.length > 1) { this.$router.back(); } 
      else { this.$router.push("/home"); }
    },
    async fetchProperty() {
      this.loading = true;
      try {
        const id = this.$route.params.id;
        const response = await getPropertyById(id);
        // console.log(response)
        this.property = response.data.property;
        this.property_type = response.data.property.type_name;
        this.property_type_id = response.data.property.type_id;
        this.propertyImages = response.data.property.images;
        await this.resolveUserLocationForRoute();
        
        const related = await getPropertyByType(this.property_type_id, id);
        this.relatedProperties = related.data.properties;
        await this.fetchReviews();
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        this.loading = false;
      }
    },
    async openAgreementModal() {
      if (!this.acceptsBookings) {
        await Swal.fire({
          icon: "info",
          title: "Inquiry only",
          text: "Booking is not enabled for this owner's current plan.",
        });
        return;
      }

      const info = useUserInfo();
      const isLoggedin = info.isLoggedIn;
      if(!isLoggedin){
        this.$router.push('/login');
        return;
      }

      const canProceed = await this.ensureProfileCompletedOrRedirect();
      if (!canProceed) return;
      const isVerified = await this.ensureUserVerifiedForBooking();
      if (!isVerified) return;

      this.agreement = {
        occupant_num: null,
        lease_duration: null,
        move_in_date: "",
        room_preference: null,
        notes: "",
        agreement: false,
      };
      this.agreementError = "";
      this.showUserAgreementModal = true;
    },
    closeAgreementModal() {
       this.showUserAgreementModal = false; 
    },
    validateAgreement() {
      const { agreement } = this.agreement;

      if (!agreement) {
        this.agreementError = "Please check the agreement box.";
        return;
      }
      this.agreementError = "";

      // If all checks pass:
      this.showUserAgreementModal = false;
      this.showConfirmModal = true;
    },
    async submitAgreement() {
      if (!this.acceptsBookings) {
        await Swal.fire({
          icon: "info",
          title: "Inquiry only",
          text: "Booking is not enabled for this owner's current plan.",
        });
        return;
      }
      if (this.bookingSubmitting) return;
      this.showConfirmModal = false;
      this.showUserAgreementModal = false;
      this.bookingSubmitting = true;
      try {
        const response = await submitAgreement(this.agreement, this.property.id);
        await Swal.fire({
          icon: "success",
          title: "Booking submitted",
          text: response.data.message || "Booking request submitted!",
        });
      } catch (error) {
        console.log(error)
        await Swal.fire({
          icon: "error",
          title: "Booking failed",
          text: error?.response?.data?.message || error?.data?.error || "Something went wrong.",
        });
      } finally {
        this.bookingSubmitting = false;
      }
    },
    async contactOwner(receiver_id, property_id) {

      const info = useUserInfo();
      const isLoggedin = info.isLoggedIn;
      if(!isLoggedin) {
        this.$router.push("/login");
        return;
      }
      const canProceed = await this.ensureProfileCompletedOrRedirect();
      if (!canProceed) return;

      try {
        const response = await initiateConversation(receiver_id, property_id);
        const conversationId = response?.data?.conversation_id;
        this.$router.push({
          path: '/messages',
          query: {
            user: receiver_id,
            conversation: conversationId || undefined,
          }
        });
      } catch (error) { console.error(error); }
    },
    openReportModal() {
      const info = useUserInfo();
      if (!info.isLoggedIn) {
        this.$router.push("/login");
        return;
      }

      if (this.isOwner === "owner" || this.isOwner === "admin") {
        Swal.fire({
          icon: "info",
          title: "Reporting unavailable",
          text: "Only renter-side users can report properties from this page.",
        });
        return;
      }

      if (this.isViewingOwnProperty) {
        Swal.fire({
          icon: "info",
          title: "This is your property",
          text: "You cannot submit a report for your own listing.",
        });
        return;
      }

      this.showReportModal = true;
    },
    closeReportModal() {
      this.showReportModal = false;
      this.reportForm = {
        reason: "",
        details: "",
      };
    },
    async submitReport() {
      if (!this.property?.id || !this.reportForm.reason || this.reportSubmitting) return;

      this.reportSubmitting = true;
      try {
        const response = await submitPropertyReport(this.property.id, {
          reason: this.reportForm.reason,
          details: this.reportForm.details?.trim() || "",
        });

        this.reportSubmitting = false;
        this.closeReportModal();

        await Swal.fire({
          icon: "success",
          title: "Report submitted",
          text: response?.data?.message || "Thanks. Our admin team will review this report.",
        });
      } catch (error) {
        this.reportSubmitting = false;
        this.closeReportModal();

        await Swal.fire({
          icon: "error",
          title: "Unable to submit report",
          text: error?.response?.data?.message || "Something went wrong while sending your report.",
        });
      } finally {
        this.reportSubmitting = false;
      }
    },
    async getAuthId() {
      try {
        const response = await getAuthUserId();
        this.authId = response.data.userid;
      } catch (error) { console.error(error); }
    }
  },
  mounted() {
    const token = localStorage.getItem("access_token");
    this.isLoggedIn = !!token && token !== "null";
    if (this.isLoggedIn) this.getAuthId();
  },
  beforeUnmount() {
    if (this.routeGuardTimer) {
      clearTimeout(this.routeGuardTimer);
      this.routeGuardTimer = null;
    }
  },
  computed: {
    isOwner() { return useUserInfo().role; },
    acceptsBookings() {
      return Boolean(this.property?.accepts_bookings);
    },
    routeSourceLabel() {
      if (this.routeSource === "saved") return "Saved location";
      if (this.routeSource === "live") return "Current location";
      return "Property only";
    },
    canResetToSavedLocation() {
      return this.routeSource === "live" && this.isValidLatLng(this.savedProfileCoords.lat, this.savedProfileCoords.lng);
    },
    propertyMapCoords() {
      return {
        lat: this.normalizeCoordinate(this.property?.latitude),
        lng: this.normalizeCoordinate(this.property?.longitude),
      };
    },
    hasPropertyMap() {
      return this.isValidLatLng(this.propertyMapCoords.lat, this.propertyMapCoords.lng);
    },
    allAmenities() {
      const base = this.normalizeList(this.property?.amenities);
      const custom = this.normalizeList(this.property?.custom_amenities);
      return [...new Set([...base, ...custom])];
    },
    allFacilities() {
      const base = this.normalizeList(this.property?.facilities);
      const custom = this.normalizeList(this.property?.custom_facilities);
      return [...new Set([...base, ...custom])];
    },
    allUtilities() {
      const base = this.normalizeList(this.property?.utilities);
      const custom = this.normalizeList(this.property?.custom_utilities);
      return [...new Set([...base, ...custom])];
    },
    fullAddress() {
      if (!this.property) return "Address not available.";
      const parts = [
        this.property.village_name,
        this.property.town_name,
        this.property.state_name,
        this.property.region_name,
      ].filter((item) => item && String(item).trim().length > 0);
      return parts.length ? parts.join(", ") : "Address not available.";
    },
    curfewText() {
      if (!this.property?.has_curfew) return "No curfew";
      const from = this.property?.curfew_from || "--:--";
      const to = this.property?.curfew_to || "--:--";
      return `${from} to ${to}`;
    },
    propertyTypeName() {
      return String(this.property?.type_name || "").toLowerCase().trim();
    },
    availabilityText() {
      return this.property?.is_available ? "Available" : "Fully Booked";
    },
    propertySpecs() {
      if (!this.property) return [];

      const type = this.propertyTypeName;
      const base = [];

      if (this.property.furnishing) {
        base.push({ label: "Furnishing", value: this.toTitle(this.property.furnishing) });
      }

      if (type === "boarding house") {
        base.push(
          { label: "Bedrooms", value: this.property.bedrooms ?? "-" },
          { label: "Bed Space", value: this.property.bed_space ?? "-" },
          { label: "Single Beds", value: this.property.single_bed ?? "-" },
          { label: "Double Beds", value: this.property.double_bed ?? "-" },
          { label: "Public Bathrooms", value: this.property.public_bath ?? "-" },
          { label: "Private Bathrooms", value: this.property.private_bath ?? "-" }
        );
        return base;
      }

      if (type === "commercial space") {
        base.push(
          { label: "Floor Area", value: this.property.floor_area ? `${this.property.floor_area} sqm` : "-" },
          { label: "Lot Area", value: this.property.lot_area ? `${this.property.lot_area} sqm` : "-" },
          { label: "Maximum Occupants", value: this.property.max_size ?? "-" }
        );
        return base;
      }

      base.push(
        { label: "Bedrooms", value: this.property.bedrooms ?? "-" },
        { label: "Single Beds", value: this.property.single_bed ?? "-" },
        { label: "Double Beds", value: this.property.double_bed ?? "-" },
        { label: "Public Bathrooms", value: this.property.public_bath ?? "-" },
        { label: "Private Bathrooms", value: this.property.private_bath ?? "-" },
        { label: "Max Occupants", value: this.property.max_size ?? "-" }
      );

      return base;
    },
    rentalTerms() {
      if (!this.property) return [];
      const advanceValue = Number(this.property.advance_payment_months || 0);
      const hasAdvance = Number.isFinite(advanceValue) && advanceValue > 0;
      const depositValue = Number(this.property.deposit_required || 0);
      const hasDeposit = Number.isFinite(depositValue) && depositValue > 0;
      const terms = [
        { label: "Price", value: `PHP ${this.formatMoney(this.property.price)}` },
        { label: "Payment Frequency", value: this.toTitle(this.property.payment_frequency) },
        { label: "Agreement", value: this.toTitle(this.property.agreement_type) },
        { label: "Advance Payment (Move-out Notice)", value: hasAdvance ? `PHP ${this.formatMoney(advanceValue)}` : "None" },
        { label: "Deposit", value: hasDeposit ? `PHP ${this.formatMoney(depositValue)}` : "None" },
        { label: "Availability", value: this.availabilityText },
      ];

      if (this.property.agreement_type === "lease") {
        terms.push(
          { label: "Lease Term", value: this.property.lease_term_months ? `${this.property.lease_term_months} month(s)` : "-" },
          { label: "Renewal Option", value: this.property.renewal_option || "-" },
          { label: "Notice Period", value: this.property.notice_period ? `${this.property.notice_period} day(s)` : "-" }
        );
      }

      return terms;
    },
    ownerVerificationStatus() {
      const raw =
        this.property?.owner_verification_status ??
        this.property?.verification_status ??
        this.property?.owner_status ??
        null;
      const status = String(raw || "unverified").toLowerCase().trim();
      if (["verified", "pending", "rejected", "unverified"].includes(status)) {
        return status;
      }
      return "unverified";
    },
    ownerVerificationLabel() {
      if (this.ownerVerificationStatus === "verified") return "Verified Owner";
      if (this.ownerVerificationStatus === "pending") return "Owner Verification Pending";
      if (this.ownerVerificationStatus === "rejected") return "Owner Verification Rejected";
      return "Unverified Owner";
    },
    ownerVerificationBadgeClass() {
      if (this.ownerVerificationStatus === "verified") {
        return "bg-success-subtle text-success border border-success-subtle";
      }
      if (this.ownerVerificationStatus === "pending") {
        return "bg-warning-subtle text-warning-emphasis border border-warning-subtle";
      }
      if (this.ownerVerificationStatus === "rejected") {
        return "bg-danger-subtle text-danger border border-danger-subtle";
      }
      return "bg-secondary-subtle text-secondary border border-secondary-subtle";
    },
    displayedReviews() {
      return (this.reviews || []).slice(0, 3);
    },
    canViewAllReviews() {
      return Number(this.reviewSummary?.total_reviews || 0) > 3;
    },
    isViewingOwnProperty() {
      return Boolean(this.authId && this.property?.owner_id && Number(this.authId) === Number(this.property.owner_id));
    },
    canShowReportAction() {
      if (!this.property) return false;
      if (this.isOwner === "owner" || this.isOwner === "admin") return false;
      if (this.isViewingOwnProperty) return false;
      return true;
    },
    modalStarPills() {
      const counts = this.modalCounts || {};
      return [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count: Number(counts?.[stars] || 0),
      }));
    },
    modalFilteredReviews() {
      if (!this.selectedStarFilter) return this.modalReviews;
      return (this.modalReviews || []).filter((review) => Number(review?.rating || 0) === this.selectedStarFilter);
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() { this.fetchProperty(); }
    },
  },
};
</script>

<style scoped>
.main-img { height: 450px; object-fit: cover; }
.carousel-img { height: 350px; object-fit: cover; }

.stat-pill {
  background: #f1f5f9;
  color: #334155;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #e2e8f0;
}

.badge-custom {
  background: white;
  border: 1px solid #dee2e6;
  padding: 5px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  color: #666;
}

.description.clamped {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal-overlay-custom {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
}

.modal-body-custom {
  background: white; width: 90%; max-width: 500px;
  max-height: 90vh; overflow-y: auto;
}

.reviews-modal {
  max-width: 900px;
}

.review-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.review-pill {
  border: 1px solid #d7dde5;
  background: #fff;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  transition: all 0.2s ease;
}

.review-pill:hover {
  border-color: #2563eb;
  color: #1d4ed8;
}

.review-pill.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.25);
}

.report-note {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  color: #9a3412;
  font-size: 0.92rem;
}

.report-note i {
  font-size: 1rem;
  margin-top: 0.1rem;
}

.booking-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1040;
}

.booking-overlay-card {
  background: #ffffff;
  border: 1px solid #e6ebf2;
  padding: 1.25rem 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.property-card:hover {
  transform: translateY(-5px);
  transition: 0.3s;
}

.letter-spacing-1 { letter-spacing: 1px; }

.carousel-control-prev-icon, .carousel-control-next-icon {
  background-color: rgba(0,0,0,0.5);
  border-radius: 50%;
  padding: 1.5rem;
}

.route-summary {
  background: linear-gradient(180deg, #f8fbff 0%, #f4f7fc 100%);
}

.route-title {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #3d5a80;
}

.route-message {
  font-size: 0.86rem;
  color: #516079;
}

.route-status-pill {
  border-radius: 999px;
  padding: 0.32rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
  border: 1px solid transparent;
}

.status-ready {
  color: #0f6d5b;
  background: #ddf8f0;
  border-color: #b9efe0;
}

.status-routing,
.status-resolving-location {
  color: #1f4fa8;
  background: #e2ecff;
  border-color: #c8d9ff;
}

.status-no-location {
  color: #6b7280;
  background: #f0f2f5;
  border-color: #e5e7eb;
}

.status-route-error {
  color: #a11f2a;
  background: #ffe9ec;
  border-color: #ffcfd6;
}

.route-chip {
  display: inline-flex;
  align-items: center;
  border: 1px solid #dbe4f0;
  border-radius: 999px;
  padding: 0.28rem 0.68rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #314260;
  background: #fff;
}

.booking-disabled-note {
  border: 1px solid rgba(44, 107, 237, 0.14);
  background: linear-gradient(180deg, rgba(44, 107, 237, 0.05), rgba(44, 107, 237, 0.08));
  color: #35537f;
  border-radius: 1.25rem;
  padding: 1rem 1.05rem;
}

.booking-disabled-head {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  color: #204f9b;
}

.booking-disabled-head i {
  font-size: 1rem;
}

.route-source-chip {
  background: #eef5ff;
  color: #274777;
  border-color: #cfe1ff;
}

.route-action-btn {
  font-size: 0.76rem;
  font-weight: 600;
  padding: 0.28rem 0.75rem;
}

@media (prefers-reduced-motion: reduce) {
  .route-status-pill,
  .route-chip {
    transition: none !important;
  }
}
</style>

