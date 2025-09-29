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

        <div class="mt-4 d-flex gap-2">
          <button class="btn btn-primary px-4">
            <i class="bi bi-calendar-check"></i> Book Now
          </button>
          <button class="btn btn-outline-secondary px-4">
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

export default {
  name: "PropertyDetails",
  components: { Header, RouterLink },
  data() {
    return {
      property: null,
      relatedProperties: [],
      placeholderImg,
      property_type: "",
      property_type_id: "",
    };
  },
  methods: {
    async fetchProperty() {
      try {
        const id = this.$route.params.id;
        const response = await getPropertyById(id);
        console.log(response)
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
  },
  mounted() {
  },
  watch: {
    '$route.params.id': {
        immediate: true,
        handler(newId) {
        this.fetchProperty();
        }
    }
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
