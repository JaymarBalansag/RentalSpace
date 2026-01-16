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
        </div>

        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <div class="card h-100 border-0 bg-light p-3 rounded-4">
              <h6 class="fw-bold small mb-3 text-primary text-uppercase">Amenities</h6>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="amenity in property.amenities" :key="amenity" class="badge-custom">{{ amenity }}</span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card h-100 border-0 bg-light p-3 rounded-4">
              <h6 class="fw-bold small mb-3 text-primary text-uppercase">Facilities</h6>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="facility in property.facilities" :key="facility" class="badge-custom">{{ facility }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5 sticky-lg-top" style="top: 20px; z-index: 10;">
        <div class="card border-0 shadow-lg rounded-4 p-4">
          <h1 class="h3 fw-bold text-dark mb-1">{{ property.title }}</h1>
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
              <span class="badge bg-white text-primary border border-primary-subtle rounded-pill fw-normal">Verified Owner</span>
            </div>
          </div>

          <div class="d-grid gap-2">
            <button 
              :disabled="property.owner_id === authId || !isLoggedIn || isOwner == 'owner'" 
              class="btn btn-primary btn-lg rounded-pill fw-bold py-3"
              @click="openAgreementModal"
            >
              <i class="bi bi-calendar-plus-fill me-2"></i> Book This Property
            </button>
            <button 
              class="btn btn-outline-dark rounded-pill fw-bold py-2" 
              :disabled="property.owner_id === authId || !isLoggedIn || isOwner == 'owner'" 
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
              <RouterLink :to="`/property/${related.id}`" class="btn btn-sm btn-outline-primary rounded-pill w-100 fw-bold">View Details</RouterLink>
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
      <div class="row">
        <div v-for="(review, i) in dummyReviews" :key="i" class="col-md-6 mb-3">
          <div class="p-3 border rounded-4 bg-white shadow-sm h-100">
            <div class="d-flex align-items-center gap-3 mb-2">
              <img :src="review.user_img || placeholderImg" class="rounded-circle" width="40" height="40" />
              <div>
                <p class="mb-0 fw-bold small">{{ review.user_name }}</p>
                <div class="text-warning small">
                  <i v-for="star in 5" :key="star" :class="star <= review.rating ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                </div>
              </div>
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
import { getPropertyById, getPropertyByType, submitBookingRequest } from "@/api/property";
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";
import { submitAgreement } from "@/api/Owner/bookings.js";
import { initiateConversation } from "@/api/messages";
import { getAuthUserId } from "@/api/user";
import { useUserInfo } from '@/store/userInfo';
import confirmModal from "@/components/confirmModal.vue";
import Header from "@/components/Header.vue";
import PropertyMap from "@/components/propertyMap.vue";
import { ref } from 'vue'

export default {
  name: "PropertyDetails",
  components: { confirmModal, Header, PropertyMap },
  data() {
    return {
      loading: false,
      showFullDescription: ref(false),
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
      dummyReviews: [
        { user_name: "Juan Dela Cruz", rating: 5, comment: "Very clean and well-maintained property!", user_img: null },
        { user_name: "Maria Santos", rating: 4, comment: "Great location but a bit noisy at night.", user_img: null },
        { user_name: "Pedro Reyes", rating: 4, comment: "Friendly owner and smooth booking process.", user_img: null },
      ],
    };
  },
  methods: {
    closeConfirmModal() {
      this.showConfirmModal = false;
    },
    toTitle(text){
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : "asd";
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
        console.log(response)
        this.property = response.data.property;
        this.property_type = response.data.property.type_name;
        this.property_type_id = response.data.property.type_id;
        this.propertyImages = response.data.property.images;
        
        const related = await getPropertyByType(this.property_type_id, id);
        this.relatedProperties = related.data.properties;
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        this.loading = false;
      }
    },
    openAgreementModal() {
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
      try {
        await initiateConversation(receiver_id, property_id);
        this.$router.push({ path: '/messages', query: { user: receiver_id } });
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
    isOwner() { return useUserInfo().role; }
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