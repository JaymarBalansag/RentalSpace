<template>
  <Header />

  <div class="container py-5" v-if="property">
    <!-- Back Button -->
    <RouterLink to="/" class="btn btn-outline-primary mb-4">
      <i class="bi bi-arrow-left"></i> Back to Listings
    </RouterLink>

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
        <p class="text-muted mb-4">{{ property.description }}</p>

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
          <!-- <button class="btn btn-primary px-4" @click="submitBookingRequest(property.id)">
            <i class="bi bi-calendar-check"></i> Book Now
          </button> -->

          <button :disabled="property.owner_id === this.authId"  type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#userAgreementModal">
            <i class="bi bi-calendar-check"></i> Book Now
          </button>

          <!-- Modal -->

          <!-- Modal -->
          <div class="modal fade" id="userAgreementModal" tabindex="-1" aria-labelledby="userAgreementModal" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="userAgreementModalLabel">User Agreement</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
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
                      <label class="form-check-label" for="boardingAgree">
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
                      <label class="form-check-label" for="residentialAgree">
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
                      <label class="form-check-label" for="commercialAgree">
                        I agree to the commercial space terms and conditions.
                      </label>
                    </div>
                  </div>

                  <!-- Fallback for unknown type -->
                  <div v-else>
                    <p>Unknown rental type. Please contact support.</p>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" @click="agreementSubmit">Submit Bookings</button>
                </div>
              </div>
            </div>
          </div>
          

          <button
            class="btn btn-outline-secondary px-4"
            :disabled="property.owner_id === this.authId"
            @click="contactOwner(property.owner_id, property.id)"
            :title="property.owner_id === authId ? 'You cannot contact yourself' : ''"
          >
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
          <ul class="list-unstyled mb-0 row row-cols-2 g-2">
            <li
              v-for="(amenity, index) in property.amenities"
              :key="index"
              class="col"
            >
              ✅ {{ amenity }}
            </li>
          </ul>
        </div>
      </div>

      <div class="col-md-6">
        <div class="p-4 border rounded shadow-sm bg-white h-100">
          <h5 class="fw-bold mb-3">Facilities</h5>
          <ul class="list-unstyled mb-0 row row-cols-2 g-2">
            <li
              v-for="(facility, index) in property.facilities"
              :key="index"
              class="col"
            >
              🏠 {{ facility }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Related Properties -->
    <div class="mt-5">
      <h4 class="fw-bold mb-3 text-primary">Related Properties</h4>
      <div class="row g-4">
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

      <!-- Property Images Carousel -->
      <div class="mb-4">
        <h5 class="fw-bold mb-2">Property Images</h5>
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
    <!-- Ratings & Comments -->



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
import Header from "@/components/Header.vue";
import { RouterLink } from "vue-router";
import { submitBookingRequest } from "@/api/property";
import BookingRequestModal from "@/components/Bookins/BookingRequestModal.vue";
import { submitAgreement } from "@/api/Owner/bookings.js";
import { initiateConversation } from "@/api/messages";
import { getAuthUserId } from "@/api/user";


export default {
  name: "PropertyDetails",
  components: { Header, RouterLink, BookingRequestModal },
  data() {
    return {
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
      propertyImages: [
        placeholderImg,
        placeholderImg,
        placeholderImg
      ],
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
    async fetchProperty() {
      try {
        const id = this.$route.params.id;
        const response = await getPropertyById(id);
        this.property = response.data.property;
        this.property_type = response.data.property.type_name
        this.property_type_id = response.data.property.type_id
        
        // * Fetch related properties (same type, exclude current one)
        const related = await getPropertyByType(this.property_type_id, id)
        this.relatedProperties = related.data.properties
        
      } catch (error) {
        console.error("Property Details Error:", error);
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
    async agreementSubmit() {
      try {
        
        const response = await submitAgreement(this.agreement, this.property.id);
        // console.log("Agreement Submit Responsesssssss:", response);
        if(response.status == 201) {
          alert("Booking request submitted successfully!");
        }
        if(response.status == 400){
          alert("Booking Already Exists for this property.");
        }
        


      } catch (error) {
        console.error("Agreement Submit Error:", error);
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
        // alert(receiver_id);
        // alert(property_id);
        const response = await initiateConversation(receiver_id, property_id);
        
        console.log("Initiate Conversation Response:", response);
        this.$router.push({ path: '/messages', query: { user: receiver_id } });
      } catch (error) {
        console.log("Contact Owner Error:", error);
      }
    }
  },
  mounted() {
    this.getAuthId();
  },
  watch: {
    '$route.params.id': {
        immediate: true,
        handler(newId) {
        this.fetchProperty();
        }
    },
}
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
</style>
