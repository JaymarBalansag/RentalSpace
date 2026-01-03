<template>
  <Header />

  <div class="container-fluid p-5 bg-light-subtle">
    <div class="row">

      <!-- Left Component -->
      <div class="col-lg-7">

        <!-- Recommended -->
        <section class="mb-5">
          <div class="d-flex align-items-center mb-3">
            <h2 class="fw-bold mb-0">Recommended</h2>
            <button class="btn btn-link ms-auto">See All</button>
          </div>
          <p class="text-muted small">Handpicked spaces based on your location and preferences.</p>

          <!-- Filters -->
          <div class="d-flex gap-2 mb-4">
            <button class="btn btn-outline-primary btn-sm rounded-pill" @click="getNearProperties()">Near You</button>
            <button class="btn btn-outline-primary btn-sm rounded-pill" @click="getPrefferedAmenities()">Amenities</button>
            <button class="btn btn-outline-primary btn-sm rounded-pill" @click="getPrefferedTypes()">Property Types</button>
          </div>

          <!-- Horizontal scroll cards -->

          <!-- Loading placeholders -->
          <div v-if="loading" class="d-flex gap-3 overflow-auto pb-2 mt-3" v-for="n in 6" :key="'ph-' + n">
            <div
              class="d-flex justify-content-center align-items-center"
              style="min-width: 250px; max-width: 250px; "
            >
              <div class="card h-100 shadow-sm property-card">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="180" role="img" aria-label="Image placeholder">
                  <rect width="100%" height="100%" fill="#e9ecef"></rect>
                </svg>
                <div class="card-body">
                  <h5 class="card-title placeholder-glow">
                    <span class="placeholder col-6"></span>
                  </h5>
                  <p class="card-text placeholder-glow">
                    <span class="placeholder col-7"></span>
                    <span class="placeholder col-4"></span>
                    <span class="placeholder col-5"></span>
                  </p>
                  <p class="fw-bold text-primary mb-2 placeholder-glow">
                    <span class="placeholder col-4"></span>
                  </p>
                  <div class="d-grid">
                    <span class="btn btn-outline-primary btn-sm disabled placeholder col-6"></span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Recommended Properties -->
          <div v-else class="d-flex gap-3 overflow-auto pb-2">
            <div
              v-for="property in recommendedProperties"
              :key="property.id"
              class="card shadow-sm"
              style="min-width: 240px; max-width: 250px;"
            >
              <img :src="property.image_url || placeholderImage" class="card-img-top" alt="Rental Property">
              <div class="card-body">
                <h6 class="card-title fw-bold">{{ property.title }}</h6>
                <p class="card-text small text-muted">{{ property.description }} • {{ property.town_name }}</p>
                <p class="fw-bold text-primary mb-2">{{ property.price }}</p>
                <a href="#" class="btn btn-sm btn-outline-primary">View More</a>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!loading && recommendedProperties.length === 0" class="d-flex justify-content-center align-content-center">
            <div class="alert alert-light border text-muted">
              {{ message || 'No recommended properties available at the moment.' }}
            </div>
          </div>

          

        </section>

        <!-- Popular Posts -->
        <section>
          <div class="d-flex align-items-center mb-3">
            <h2 class="fw-bold mb-0">Most Viewed Posts</h2>
            <button class="btn btn-link ms-auto">See All</button>
          </div>
          <div class="list-group">
            <a
              v-for="i in 4"
              :key="i"
              href="#"
              class="list-group-item list-group-item-action d-flex gap-3 align-items-center"
            >
              <img
                src="../../assets/hotel.jpg"
                class="rounded"
                style="width: 90px; height: 70px; object-fit: cover;"
                alt="Thumbnail"
              />
              <div class="flex-grow-1">
                <h6 class="mb-1 fw-semibold">Post Title</h6>
                <p class="mb-1 small text-muted">This is a short description of the post content.</p>
                <small class="text-secondary"><i class="bi bi-clock"></i> 3 mins ago</small>
              </div>
            </a>
          </div>
        </section>
      </div>

      <!-- Right Sidebar -->
      <aside class="col-lg-5">

        <!-- Recent Posts -->
        <div class="card border-0 bg-white shadow-sm mb-4">
          <div class="card-header bg-white border-0">
            <h5 class="fw-bold text-center mb-0">Recent Posts</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li v-for="property in recentProperties" :key="property.id" class="list-group-item d-flex align-items-center">
              <img :src="property.image_url || placeholderImage" alt="thumb" class="rounded me-3" style="width:60px; height:60px; object-fit:cover;">
              <div>
                <h6 class="mb-1">{{ property.title }}</h6>
                <small class="text-muted">{{ formatAgo(property.created_at) }}</small>
              </div>
            </li>
          </ul>
        </div>

        <!-- Poopular Property Types -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white border-0 text-center">
            <h5 class="fw-bold mb-0">Popular Property Types</h5>
          </div>
          <div class="card-body d-flex flex-wrap gap-2 justify-content-center">
            <span
              v-for="(type, index) in this.popularTypes.filter(t => t.total > 0)"
              :key="type.id"
              class="badge rounded-pill"
              :class="badgeColors[index % badgeColors.length]"
            >
              {{ type.type_name }}
            </span>
          </div>
        </div>

        <!-- Top Rated -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-0 text-center">
            <h5 class="fw-bold mb-0">Top Rated</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li v-for="i in 2" :key="i" class="list-group-item d-flex gap-3 align-items-center">
              <img src="../../assets/rental.jpg" alt="thumb" class="rounded" style="width:60px; height:60px; object-fit:cover;">
              <div class="flex-grow-1">
                <h6 class="mb-1">Cozy Apartment</h6>
                <small class="text-muted">Near University</small>
              </div>
              <span class="badge bg-success">4.9 ★</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { getDefaultRecommendation, getRecentProperties, getNearProperties, getPrefferedAmenities, getPrefferedTypes, getPopularTypes } from '@/api/experienceScript';
import Header from '@/components/Header.vue';
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default {
  name: "Experience",
  components: { Header },
  data() {
    return {
      message: '',
      recommendedProperties: [],
      recentProperties: [],
      nearProperties: [],
      popularTypes: [],
      placeholderImage: placeholderImg,
      loading: false,
      badgeColors: [
        'bg-primary',
        'bg-success',
        'bg-warning text-dark',
        'bg-info'
      ]
    }
  },
  methods: {
    formatAgo(date) {
      return dayjs(date).fromNow();
    },
    async fetchProperty() {
      this.loading = true;
      try {
        const response = await getDefaultRecommendation();
        
        this.recommendedProperties = response.data.data;

      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchRecentProperties() {
      this.loading = true;
      try {
        const response = await getRecentProperties();
        
        this.recentProperties = response.data.data;

      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        this.loading = false;
      }
    },
    async getNearProperties() {
      this.loading = true;
      try {
        this.recommendedProperties = [];
        const response = await getNearProperties();
        this.recommendedProperties = response.data.data;
      } catch (error) {
        console.error("Error fetching near properties:", error);
      } finally {
        this.loading = false;
      }
    },
    async getPrefferedAmenities(){
      this.loading = true;
      try {
        const response = await getPrefferedAmenities();
        this.message = response.data.message;
        this.recommendedProperties = response.data.data;
      } catch (error) {
        console.error("Error fetching preferred amenities:", error);
      } finally {
        this.loading = false;
      }
    },
    async getPrefferedTypes(){
      this.loading = true;
      try {
        const response = await getPrefferedTypes();
        this.message = response.data.message;
        this.recommendedProperties = response.data.data;
      } catch (error) {
        console.error("Error fetching preferred types:", error);
      } finally {
        this.loading = false;
      }
    },
    async getPopularTypes(){
      this.loading = true;
      try {
        const response = await getPopularTypes();
        this.message = response.data.message;
        this.popularTypes = response.data.data;
      } catch (error) {
        console.error("Error fetching popular types:", error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchProperty();
    this.fetchRecentProperties();
    this.getPopularTypes();
  }
}
</script>

<style scoped>
.property-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

</style>
