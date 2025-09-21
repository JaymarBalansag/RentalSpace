<template>
  <Header />

  <!-- Search Filter -->
  <div class="container-fluid bg-light py-5">
    <div class="container">
      <h1 class="fw-bold text-primary mb-4">Find Your Perfect Space</h1>
      <div class="row g-3 align-items-center">
        
        <!-- Property Type -->
        <div class="col-md-3">
          <select class="form-select shadow-sm">
            <option selected disabled>Property Type</option>
            <option v-for="(type, index) in property_types" :key="index">{{ type.type_name }}</option>
          </select>
        </div>

        <!-- Agreement Type -->
        <div class="col-md-3">
          <select class="form-select shadow-sm">
            <option selected disabled>Agreement Type</option>
            <option>Rental</option>
            <option>Lease</option>
          </select>
        </div>

        <!-- Search -->
        <div class="col-md-4">
          <div class="input-group shadow-sm">
            <input type="text" class="form-control" placeholder="Search by location or name">
            <button class="btn btn-outline-primary">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>

        <!-- Search Button -->
        <div class="col-md-2 d-grid">
          <button class="btn btn-primary shadow-sm">Search</button>
        </div>

      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="container my-5">
    <div class="row g-4">
      
      <!-- Side Filters -->
      <aside class="col-lg-3">
        <div class="p-3 border rounded shadow-sm mb-4 bg-white">
          <h5 class="fw-bold mb-3">Amenities</h5>
          <div class="form-check" v-for="(amenity, index) in amenities" :key="index">
            <input class="form-check-input" type="checkbox" :id="'amenity-' + index">
            <label class="form-check-label" :for="'amenity-' + index">{{ amenity.amenity_name }}</label>
          </div>
        </div>

        <div class="p-3 border rounded shadow-sm bg-white">
          <h5 class="fw-bold mb-3">Facilities</h5>
          <div class="form-check" v-for="(facility, index) in facilities" :key="index">
            <input class="form-check-input" type="checkbox" :id="'facility-' + index">
            <label class="form-check-label" :for="'facility-' + index">{{ facility.facility_name }}</label>
          </div>
        </div>
      </aside>

      <!-- Property Listings -->
      <div class="col-lg-9">
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="(property, index) in properties" :key="index">
            <div class="card h-100 shadow-sm property-card">
              <img :src="property.image_url" @error="$event.target.src = placeholderImg" class="card-img-top" alt="Property">
              <div class="card-body">
                <h5 class="card-title">{{ property.title }}</h5>
                <p class="card-text text-muted small">{{ property.description }}</p>
                <p class="fw-bold text-primary mb-2">{{ property.price }} / {{ property.payment_frequency }}</p>
                <a href="#" class="btn btn-outline-primary btn-sm">View Details</a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import Header from '@/components/Header.vue';
import placeholderImg from '@/assets/Placeholder/thumbnail_placeholder.jpg'; 
import { getProperties, getPropertyTypes, getAmenities, getFacilities } from '@/api/property';

export default {
  name: 'Home',
  components: {
    Header,
    RouterLink
  },
  data() {
    return {
      amenities: [],
      facilities: [],
      property_types: [],
      properties: [],
      message: "",
      placeholderImg,
    };
  },
  methods: {
    async getProperties() {
      try {
        const response = await getProperties();
        this.properties = response.data.properties
        this.message = response.data.message
        console.log(this.properties)
      } catch (error) {
        console.log("Properties Error: " + error)
      }
    },
    async getAmenities(){
      try {
        const response = await getAmenities();
        this.amenities = response
      } catch (error) {
        console.log("Amenities Error: " + error)
      }
    },
    async getFacilities(){
      try {
        const response = await getFacilities();
        this.facilities = response
      } catch (error) {
        console.log("Facilities Error: " + error)
      }
    },
    async getPropertyTypes(){
      try {
        const response = await getPropertyTypes();
        this.property_types = response
      } catch (error) {
        console.log("Property Types Error: " + error)
      }
    },
  },
  mounted() {
    this.getAmenities()
    this.getFacilities()
    this.getPropertyTypes()
    this.getProperties()
  }
};
</script>

<style scoped>
.property-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}
</style>
