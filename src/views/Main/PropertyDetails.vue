<template>
  <Header></Header>

  <div class="container py-5" v-if="!loading">
    <!-- Back Button -->
    <button @click="BackToPrevPage()" class="btn btn-outline-primary mb-4">
      <i class="bi bi-arrow-left"></i> Back to Listings
    </button>

    <div class="row g-5 align-items-start">
      <!-- Image Section -->
      <div class="col-lg-6">
        <div class="shadow-sm rounded overflow-hidden">
          <img
            :src="property.image_url || placeholderImg"
            class="img-fluid w-100"
            alt="Property"
            @error="$event.target.src = placeholderImg"
          />
        </div>
      </div>

      <!-- Details Section -->
      <div class="col-lg-6">
        <h2 class="fw-bold text-primary mb-3">{{ property.title }}</h2>
        <p class="text-muted mb-2 description" :class="{ 'clamped': !showFullDescription }">
          {{ property.description }}
        </p>

        <button
          v-if="property.description?.length > 250"
          class="btn btn-link p-0 see-more-btn"
          @click="showFullDescription = !showFullDescription"
        >
          {{ showFullDescription ? 'See less' : 'See more' }}
        </button>

        <p class="fw-bold fs-3 text-success mb-2">
          {{ property.price }} / {{ property.payment_frequency }}
        </p>
        <p class="text-muted small mb-1">
          <i class="bi bi-file-earmark-text"></i>
          Agreement: <span class="fw-semibold">{{ property.agreement_type }}</span>
        </p>
        <p class="text-muted small">
          <i class="bi bi-building"></i>
          Type: <span class="fw-semibold">{{ property.type_name }}</span>
        </p>

        <!-- Owner Info -->
        <div class="d-flex align-items-center gap-3 p-3 border rounded mb-4 bg-light">
          <img
            :src="property.owner_profile_photo || placeholderImg"
            class="rounded-circle"
            width="50"
            height="50"
            alt="Owner"
          />

          <div class="flex-grow-1">
            <p class="mb-0 fw-semibold">{{ property.owner_name }}</p>
            <small class="text-muted">Property Owner</small>
          </div>

          <!-- Future profile button -->
          
          <!-- <button
            class="btn btn-sm btn-outline-secondary"
          >
            View Profile
          </button> -->
         
        </div>


        <div class="mt-4 d-flex gap-2">
        
          <button 
            :disabled="property.owner_id === authId || !isLoggedIn || isOwner == 'owner'" 
            type="button" 
            class="btn btn-primary"
            @click="openAgreementModal"
            data-bs-toggle="tooltip"
            :title="property.owner_id === authId 
                    ? 'You cannot book your own property' 
                    : !isLoggedIn 
                      ? 'You are in guest mode, please log in' 
                      : ''"
          >
            <i class="bi bi-calendar-check"></i> Book Now
          </button>

          <!-- Modal -->
          <div v-if="showUserAgreementModal" class="modal-backdrop-custom">
            <div class="modal-custom">
              <h5 class="fw-bold mb-2">User Agreement</h5>
              <p class="text-muted">Please fill the booking info and agree to terms.</p>

              <!-- Form fields here, bound to `agreement` -->
               <!-- Boarding House -->
                  <div v-if="property_type === 'Boarding House'">
                    <label>How long do you plan to stay?</label>
                    <select v-model="agreement.stay_months" class="form-select">
                      <option value="1">1 month</option>
                      <option value="3">3 months</option>
                      <option value="6">6 months</option>
                      <option value="12">1 year</option>
                      <option value="custom">Custom</option>
                    </select>
                    <div v-if="agreement.stay_months === 'custom'" class="mt-2">
                      <input type="number" v-model="agreement.custom_months" min="1" class="form-control" placeholder="Enter months" />
                    </div>

                    <label class="mt-2">Move-in Date:</label>
                    <input type="date" v-model="agreement.move_in_date" class="form-control" />

                    <label class="mt-2">Additional Notes:</label>
                    <textarea v-model="agreement.notes" class="form-control"></textarea>

                    <div class="form-check mt-2">
                      <input type="checkbox" v-model="agreement.agreement" class="form-check-input" id="boardingAgree">
                      <label class="form-check-label" for="boardingAgree" required>
                        I agree to the house rules and terms set by the owner.
                      </label>
                    </div>
                  </div>

                  <!-- Apartment / Condo / House -->
                  <div v-else-if="['Apartment', 'Condo', 'House'].includes(property_type)">
                    <label>Lease Duration (months):</label>
                    <input type="number" v-model="agreement.lease_duration" min="1" class="form-control" />

                    <label class="mt-2">Move-in Date:</label>
                    <input type="date" v-model="agreement.move_in_date" class="form-control" />

                    <label class="mt-2">Number of Occupants:</label>
                    <input type="number" v-model="agreement.occupant_num" min="1" class="form-control" />

                    <label class="mt-2">Room Preference (optional):</label>
                    <input type="text" v-model="agreement.room_preference" class="form-control" placeholder="e.g., near window, upper floor" />

                    <label class="mt-2">Additional Notes:</label>
                    <textarea v-model="agreement.notes" class="form-control"></textarea>

                    <div class="form-check mt-2">
                      <input type="checkbox" v-model="agreement.agreement" class="form-check-input" id="residentialAgree">
                      <label class="form-check-label" for="residentialAgree" required>
                        I agree to the terms and rules set by the owner.
                      </label>
                    </div>
                  </div>

                  <!-- Commercial Space -->
                  <div v-else-if="property_type === 'Commercial Space'">
                    <label>Lease Duration (months):</label>
                    <input type="number" v-model="agreement.lease_duration" min="1" class="form-control" />

                    <label class="mt-2">Move-in Date:</label>
                    <input type="date" v-model="agreement.move_in_date" class="form-control" />

                    <label class="mt-2">Area Needed (sqm):</label>
                    <input type="number" v-model="agreement.occupant_num" min="1" class="form-control" />

                    <label class="mt-2">Additional Notes:</label>
                    <textarea v-model="agreement.notes" class="form-control"></textarea>

                    <div class="form-check mt-2">
                      <input type="checkbox" v-model="agreement.agreement" class="form-check-input" id="commercialAgree">
                      <label class="form-check-label" for="commercialAgree" required>
                        I agree to the commercial space terms and conditions.
                      </label>
                    </div>
                  </div>

                  <!-- Fallback for unknown type -->
                  <div v-else>
                    <p>Unknown rental type. Please contact support.</p>
                  </div>

              <div class="d-flex justify-content-end gap-2 mt-4">
                <button class="btn btn-outline-secondary" @click="closeAgreementModal">Close</button>
                <button class="btn btn-primary" @click="validateAgreement">Book</button>
              </div>
            </div>
          </div>
          

          <button class="btn btn-outline-secondary px-4" :disabled="property.owner_id === this.authId || !isLoggedIn || isOwner == 'owner'" @click="contactOwner(property.owner_id, property.id)" :title="property.owner_id === authId ? 'You cannot contact yourself' : ''" >
            <i class="bi bi-chat-dots"></i> Contact Owner
          </button>
        </div>
      </div>
    </div>

    <!-- Extra Info -->
    <div class="row mt-5 g-4">
      <div class="col-md-6">
        <div class="p-4 border rounded shadow-sm bg-white h-100">
          <h5 class="fw-bold mb-3">Amenities</h5>
          <hr>
          <ul class="list-unstyled row gap-3">
            <li
              v-for="(amenity, index) in property.amenities"
              :key="index"
              class="col-auto p-0"
            >
              <span class="badge rounded-pill text-bg-secondary m-0">{{ amenity }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-md-6">
        <div class="p-4 border rounded shadow-sm bg-white h-100">
          <h5 class="fw-bold mb-3">Facilities</h5>
          <hr>
          <ul class="list-unstyled mb-0 row gap-3">
            <li
              v-for="(facility, index) in property.facilities"
              :key="index"
              class="col-auto p-0"
            >
              <span class="badge rounded-pill text-bg-secondary m-0">{{ facility }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="row my-4">
      <div class="col-12 col-md-6 ">
        <!-- Property Images Carousel -->
        <div class="my-4">
          <h5 class="fw-bold h3 mb-2">Property Images</h5>
          <hr>
          <div id="propertyImagesCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div v-for="(img, index) in propertyImages" :key="index" 
                  :class="['carousel-item', { active: index === 0 }]">
                <img :src="img" class="d-block w-100" style="height: 300px; object-fit: cover;" />
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#propertyImagesCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#propertyImagesCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 ">
        <!-- Location Map -->
        <div class="container-md container-sm px-0 my-4">
          <h5 class="fw-bold h3 mb-2">Location</h5>
          <hr>
          <div class="container-md container-sm px-0 mb-4">
            <PropertyMap 
            v-if="property.latitude && property.longitude"
            :lat="parseFloat(this.property.latitude)" 
            :lng="parseFloat(this.property.longitude)" 
            :title="this.property.title" 
            />
            <div v-else class="text-danger">Map cannot be displayed: invalid coordinates</div>
          </div>
        </div>
      </div>
    </div>

    

    <!-- Related Properties -->
    <div class="mt-5">
      <h4 class="fw-bold mb-3 text-primary">Related Properties</h4>
      <div v-if="this.relatedProperties.length > 0" class="row g-4">
        <div
          v-for="(related, i) in relatedProperties"
          :key="i"
          class="col-md-6 col-lg-4"
        >
          <div class="card shadow-sm h-100 border-0 property-card">
            <img
              :src="related.image_url || placeholderImg"
              @error="$event.target.src = placeholderImg"
              class="card-img-top"
              alt="Related Property"
            />
            <div class="card-body">
              <h6 class="card-title text-truncate">
                {{ related.title }}
              </h6>
              <p class="fw-bold text-success small mb-2">
                {{ related.price }} / {{ related.payment_frequency }}
              </p>
              <RouterLink
                :to="`/property/${related.id}`"
                class="btn btn-sm btn-outline-primary w-100"
              >
                View Details
              </RouterLink>
            </div>
          </div>
        </div>

      </div>
      <div v-else class="row g-4">
        <div  class="text-center py-5 text-muted">
          <i class="bi bi-house-slash fs-1 mb-3"></i>
          <p class="mb-2">No related properties found</p>
          <RouterLink to="/" class="btn btn-outline-primary btn-sm">
            Browse all listings
          </RouterLink>
        </div>
      </div>
      
    </div>
    <!-- Related Properties -->

    <!-- Ratings & Comments -->
    <div class="mt-5">
      <h4 class="fw-bold mb-3 text-primary">Ratings & Reviews</h4>

      <!-- Average Rating -->
      <div class="d-flex align-items-center mb-3">
        <div class="me-3">
          <span class="fs-3 fw-bold">4.2</span> / 5
        </div>
        <div>
          <span v-for="star in 5" :key="star" class="text-warning me-1">
            <i :class="star <= 4 ? 'bi bi-star-fill' : 'bi bi-star'" ></i>
          </span>
          <small class="text-muted ms-2">(15 reviews)</small>
        </div>
      </div>

      <!-- User Reviews List -->
      <div class="list-group mb-4">
        <div class="list-group-item" v-for="(review, i) in dummyReviews" :key="i">
          <div class="d-flex align-items-center mb-2">
            <img :src="review.user_img || placeholderImg" class="rounded-circle me-2" width="40" height="40" />
            <div>
              <p class="mb-0 fw-semibold">{{ review.user_name }}</p>
              <div>
                <span v-for="star in 5" :key="star" class="text-warning me-1">
                  <i :class="star <= review.rating ? 'bi bi-star-fill' : 'bi bi-star'" ></i>
                </span>
              </div>
            </div>
          </div>
          <p class="mb-0 text-muted">{{ review.comment }}</p>
        </div>
      </div>

      

    </div>
    <!-- Ratings & Comments -->

    <!-- Confirm Modal -->
    <confirmModal
      :show="showConfirmModal"
      title="Confirm Booking"
      message="Are you sure all the information you entered is correct?"
      confirm-text="Yes, I'm Sure"
      @confirm="submitAgreement"
      @cancel="closeConfirmModal"
    />

  </div>

  

  <!-- Loader / Fallback -->
  <div v-else class="text-center py-5">
    <div class="spinner-border text-primary" role="status"></div>
    <p class="mt-3 text-muted">Loading property details...</p>
  </div>
</template>

<script>
import { getPropertyById, getProperties, getPropertyByType } from "@/api/property";
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";
import { RouterLink } from "vue-router";
import { submitBookingRequest } from "@/api/property";
import BookingRequestModal from "@/components/Bookins/BookingRequestModal.vue";
import { submitAgreement } from "@/api/Owner/bookings.js";
import { initiateConversation } from "@/api/messages";
import { getAuthUserId } from "@/api/user";
import { useUserInfo } from '@/store/userInfo';
import confirmModal from "@/components/confirmModal.vue";
import Header from "@/components/Header.vue";
import PropertyMap from "@/components/propertyMap.vue";
import { ref } from 'vue'
import { nextTick } from "vue";

export default {
  name: "PropertyDetails",
  components: { RouterLink, BookingRequestModal, confirmModal, Header, PropertyMap },
  data() {
    return {
      loading: false,
      map: null,
      marker: null,
      showFullDescription: ref(false),
      showConfirmModal: false,
      showUserAgreementModal: false,
      isLoggedIn: null,
      property: null,
      relatedProperties: [],
      placeholderImg,
      property_type: "",
      property_type_id: "",
      showModal : false,
      authId: null,
      dummyReviews: [
        { user_name: "Juan Dela Cruz", rating: 5, comment: "Very clean and well-maintained property!", user_img: null },
        { user_name: "Maria Santos", rating: 4, comment: "Great location but a bit noisy at night.", user_img: null },
        { user_name: "Pedro Reyes", rating: 4, comment: "Friendly owner and smooth booking process.", user_img: null },
      ],
      propertyImages: [],
      // Modal Options
      agreement: {
        stay_months: null,
        occupant_num: null,
        lease_duration: null,
        park_needed: null,
        custom_months: null,
        move_in_date: "",
        room_preference: null,
        notes: "",
        agreement: false,
    },
      
    };
  },
  methods: {
    BackToPrevPage(){
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push("/home");
      }

    },
    async fetchProperty() {
      this.loading = true;
      try {
        const id = this.$route.params.id;
        const response = await getPropertyById(id);
        this.property = response.data.property;
        // console.log("Property Details Response:", response);
        // console.log("Property Details Data:", this.property);
        // console.log(this.property.latitude, this.property.longitude);
        this.property_type = response.data.property.type_name
        this.property_type_id = response.data.property.type_id
        this.propertyImages = response.data.property.images;
        
        // * Fetch related properties (same type, exclude current one)
        const related = await getPropertyByType(this.property_type_id, id)
        this.relatedProperties = related.data.properties
        
      } catch (error) {
        console.error("Property Details Error:", error);
      } finally {
        this.loading = false;
      }
    },
    async submitBookingRequest(id) {
      try {
        const response = await submitBookingRequest(id)
        .then(
          alert("Booking request submitted successfully!")
        );
        console.log("Booking Request Response:", response);
        if(response.status == 200) {
          alert("Booking request submitted successfully!");

        } else if(response.status == 403) {
          alert("You are not allowed to book your own property.");
        }
      } catch (error) {
        console.error("Booking Request Error:", error);
      }
    },
    openAgreementModal() {
      // Reset modal data each time it opens if needed
      this.agreement = {
        stay_months: null,
        custom_months: null,
        move_in_date: null,
        notes: "",
        agreement: false,
        lease_duration: null,
        occupant_num: null,
        room_preference: ""
      };
      this.showUserAgreementModal = true;
    },
    closeAgreementModal() {
      this.showUserAgreementModal = false;
    },
    async validateAgreement() {
      try {

        const info = useUserInfo();

        if(info.role == "owner"){
          alert("You are a owner")
          return
        }

        // Check agreement checkbox
        if (!this.agreement.agreement) {
          alert("Please check the agreement");
          return;
        }

        // Boarding House
        if (this.property_type === "Boarding House") {
          if (!this.agreement.stay_months) {
            alert("Please select stay duration");
            return;
          }
          if (this.agreement.stay_months === "custom") {
            if (!this.agreement.custom_months) {
              alert("Please enter custom months");
              return;
            }
            if (this.agreement.custom_months <= 0) {
              alert("Custom months must be greater than 0");
              return;
            }
          }
          if (!this.agreement.move_in_date) {
            alert("Please select move-in date");
            return;
          }
          if (new Date(this.agreement.move_in_date) < new Date()) {
            alert("Move-in date cannot be in the past");
            return;
          }
        }

        // Apartment / Condo / House
        if (["Apartment", "Condo", "House"].includes(this.property_type)) {
          if (!this.agreement.lease_duration) {
            alert("Please enter lease duration");
            return;
          }
          if (this.agreement.lease_duration <= 0) {
            alert("Lease duration must be greater than 0");
            return;
          }
          if (!this.agreement.move_in_date) {
            alert("Please select move-in date");
            return;
          }
          if (new Date(this.agreement.move_in_date) < new Date()) {
            alert("Move-in date cannot be in the past");
            return;
          }
          if (!this.agreement.occupant_num || this.agreement.occupant_num <= 0) {
            alert("Please enter a valid number of occupants");
            return;
          }
        }

        // Commercial Space
        if (this.property_type === "Commercial Space") {
          if (!this.agreement.lease_duration) {
            alert("Please enter lease duration");
            return;
          }
          if (this.agreement.lease_duration <= 0) {
            alert("Lease duration must be greater than 0");
            return;
          }
          if (!this.agreement.move_in_date) {
            alert("Please select move-in date");
            return;
          }
          if (new Date(this.agreement.move_in_date) < new Date()) {
            alert("Move-in date cannot be in the past");
            return;
          }
          if (!this.agreement.occupant_num || this.agreement.occupant_num <= 0) {
            alert("Please enter a valid area needed (sqm)");
            return;
          }
        }

        // ✅ Only reach here if validation passes
        this.showUserAgreementModal = false;
        this.showConfirmModal = true;

      } catch (error) {
        console.error("Agreement Submit Error:", error);
        alert("Something went wrong submitting the agreement.");
      }
    },
    closeConfirmModal() {
      this.showConfirmModal = false;
    },
    async submitAgreement() {
      try {
        const response = await submitAgreement(this.agreement, this.property.id);

        if (response.status === 201) {
          alert("Booking request submitted successfully!");
          this.showConfirmModal = false;
        } 
        else if (response.status === 400) {
          alert("Booking already exists for this property.");
          this.showConfirmModal = false;
        } 
        else if (response.status === 403) {
          alert("Owners cannot book properties.");
          this.showConfirmModal = false;
        } 
        else if (response.status === 404) {
          alert("Property not found.");
          this.showConfirmModal = false;
        } 
        else if (response.status === 422) {
          // Laravel validation error
          alert(response.data.error || "Validation failed. Please check your inputs.");
        } 
        else {
          alert(response.data.error || "Unexpected error occurred.");
        }

      } catch (error) {
        console.error("Agreement Submit Error:", error);
        alert("Something went wrong submitting the agreement.");
      }
    },
    async getAuthId() {
      try {
        const response = await getAuthUserId();
        this.authId = response.data.userid;
      } catch (error) {
        console.error("Error fetching auth ID:", error);
      }
    },
    async contactOwner(receiver_id, property_id) {
      try {
        // if(receiver_id === this.authId){
        //   alert("You cannot contact yourself.");
        //   return;
        // }

        const response = await initiateConversation(receiver_id, property_id);
        
        console.log("Initiate Conversation Response:", response);
        this.$router.push({ path: '/messages', query: { user: receiver_id } });
      } catch (error) {
        console.log("Contact Owner Error:", error);
      }
    },

  },
  mounted() {
    
    const token = localStorage.getItem("access_token");

    this.isLoggedIn = !!token && token !== "null" && token !== "undefined";

    if (this.isLoggedIn) {
      this.getAuthId();
    } else {
      // Guest mode
      this.authId = null;
    }

  },
  computed: {
    isOwner() {
      const info = useUserInfo();
      return info.role;
    }
  },
  watch: {
    '$route.params.id': {
        immediate: true,
        handler(newId) {
        this.fetchProperty();
        }
    },
  },
};
</script>

<style scoped>
  img {
    max-height: 400px;
    object-fit: cover;
  }
  .property-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .property-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .description.clamped {
    display: -webkit-box;
    -webkit-line-clamp: 3;     /* preview lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .see-more-btn {
    font-size: 0.9rem;
    text-decoration: none;
  }

</style>
