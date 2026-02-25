<template>
  <Header />

  <div class="container py-4" v-if="!loading && property">
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
              :disabled="property.owner_id === authId || isOwner == 'owner' || !property?.is_available" 
              class="btn btn-primary btn-lg rounded-pill fw-bold py-3"
              @click="openAgreementModal"
            >
              <i class="bi bi-calendar-plus-fill me-2"></i> Book This Property
            </button>
            <button 
              class="btn btn-outline-dark rounded-pill fw-bold py-2" 
              :disabled="property.owner_id === authId || isOwner == 'owner'" 
              @click="contactOwner(property.owner_id, property.id)"
            >
              <i class="bi bi-chat-dots-fill me-2"></i> Message Owner
            </button>
          </div>
        </div>

        <div class="mt-4 rounded-4 overflow-hidden border shadow-sm">
           <PropertyMap 
            v-if="property.latitude && property.longitude"
            :lat="parseFloat(this.property.latitude)" 
            :lng="parseFloat(this.property.longitude)" 
            :title="this.property.title" 
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
        <div v-for="(review, i) in reviews" :key="review.id || i" class="col-md-6 mb-3">
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
    </div>

    <div v-if="showUserAgreementModal" class="modal-overlay-custom">
      <div class="modal-body-custom rounded-4 shadow-lg p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Booking Requirements</h5>
          <button class="btn-close" @click="closeAgreementModal"></button>
        </div>
        
        <p class="text-muted small mb-4">Please provide details for your <strong>{{ property_type }}</strong> rental request.</p>

        <form @submit.prevent="validateAgreement">
          <div v-if="property_type === 'Boarding House'" class="d-grid gap-3">
            <div>
              <label class="form-label small fw-bold">Stay Duration</label>
              <select required v-model="agreement.stay_months" class="form-select rounded-3">
                <option value="1">1 month</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">1 year</option>
                <option value="custom">Custom</option>
              </select>
              <input v-if="agreement.stay_months === 'custom'" type="number" v-model="agreement.custom_months" class="form-control mt-2 rounded-3" placeholder="Number of months" />
            </div>
            <div>
              <label class="form-label small fw-bold">Move-in Date</label>
              <input type="date" required v-model="agreement.move_in_date" class="form-control rounded-3" />
            </div>
          </div>

          <div v-else-if="['Apartment', 'Condo', 'House'].includes(property_type)" class="d-grid gap-3">
            <div>
              <label class="form-label small fw-bold">Lease Duration (Months)</label>
              <input type="number" required v-model="agreement.lease_duration" min="1" class="form-control rounded-3" />
            </div>
            <div>
              <label class="form-label small fw-bold">Number of Occupants</label>
              <input type="number" required v-model="agreement.occupant_num" min="1" class="form-control rounded-3" />
            </div>
            <div>
              <label class="form-label small fw-bold">Move-in Date</label>
              <input type="date" required v-model="agreement.move_in_date" class="form-control rounded-3" />
            </div>
          </div>

          <div v-else-if="property_type === 'Commercial Space'" class="d-grid gap-3">
            <div>
              <label class="form-label small fw-bold">Lease Duration (Months)</label>
              <input type="number" required v-model="agreement.lease_duration" min="1" class="form-control rounded-3" />
            </div>
            <div>
              <label class="form-label small fw-bold">Area Needed (sqm)</label>
              <input type="number" required v-model="agreement.occupant_num" min="1" class="form-control rounded-3" />
            </div>
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
            <input type="checkbox" v-model="agreement.agreement" class="form-check-input" id="termAgree">
            <label class="form-check-label small" for="termAgree">I agree to the property rules and terms.</label>
          </div>

          <button type="submit" class="btn btn-primary w-100 rounded-pill fw-bold py-3 mt-4">Confirm Request</button>
        </form>
      </div>
    </div>

    <confirmModal
      :show="showConfirmModal"
      title="Confirm Booking"
      message="Are you sure all the information you entered is correct?"
      confirm-text="Yes, I'm Sure"
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
import { getPropertyById, getPropertyByType, recordView, getPropertyReviews, submitPropertyReview } from "@/api/property";
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";
import { submitAgreement } from "@/api/Owner/bookings.js";
import { initiateConversation } from "@/api/messages";
import { getAuthUserId } from "@/api/user";
import { useUserInfo } from '@/store/userInfo';
import confirmModal from "@/components/confirmModal.vue";
import Header from "@/components/Header.vue";
import PropertyMap from "@/components/propertyMap.vue";

export default {
  name: "PropertyDetails",
  components: { confirmModal, Header, PropertyMap },
  data() {
    return {
      loading: false,
      showFullDescription: false,
      showConfirmModal: false,
      showUserAgreementModal: false,
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
      isSubmittingReview: false,
      reviewForm: {
        rating: 0,
        comment: "",
      },
      agreement: {
        stay_months: null,
        occupant_num: null,
        lease_duration: null,
        custom_months: null,
        move_in_date: "",
        room_preference: null,
        notes: "",
        agreement: false,
      },
    };
  },
  methods: {
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

      return {
        reviews,
        summary: {
          average_rating: Number.isFinite(average) ? average : 0,
          total_reviews: Number.isFinite(total) ? total : reviews.length,
        },
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
        const response = await getPropertyReviews(propertyId);
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
        
        const related = await getPropertyByType(this.property_type_id, id);
        this.relatedProperties = related.data.properties;
        await this.fetchReviews();
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        this.loading = false;
      }
    },
    openAgreementModal() {
      const info = useUserInfo();
      const isLoggedin = info.isLoggedIn;
      if(!isLoggedin){
        this.$router.push('/login');
        return;
      }

      this.agreement = { agreement: false, notes: "", move_in_date: "" };
      this.showUserAgreementModal = true;
    },
    closeAgreementModal() {
       this.showUserAgreementModal = false; 
    },
    validateAgreement() {
      const { move_in_date, stay_months, occupant_num, agreement } = this.agreement;

      if (!agreement) {
        return alert("Please check the agreement box.");
      }

      // If all checks pass:
      this.showUserAgreementModal = false;
      this.showConfirmModal = true;
    },
    async submitAgreement() {
      try {
        const response = await submitAgreement(this.agreement, this.property.id);
        alert(response.data.message || "Booking request submitted!");
        this.showConfirmModal = false;
      } catch (error) {
        console.log(error)
        alert(error.data?.error || "Something went wrong.");
      }
    },
    async contactOwner(receiver_id, property_id) {

      const info = useUserInfo();
      const isLoggedin = info.isLoggedIn;
      if(!isLoggedin) {
        this.$router.push("/login");
        return;
      }

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
  computed: {
    isOwner() { return useUserInfo().role; },
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
      const terms = [
        { label: "Price", value: `PHP ${this.formatMoney(this.property.price)}` },
        { label: "Payment Frequency", value: this.toTitle(this.property.payment_frequency) },
        { label: "Agreement", value: this.toTitle(this.property.agreement_type) },
        { label: "Advance Payment", value: this.property.advance_payment_months ?? 0 },
        { label: "Deposit", value: this.property.deposit_required ? `PHP ${this.formatMoney(this.property.deposit_required)}` : "None" },
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
</style>

