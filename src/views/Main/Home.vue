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
            <option>Boarding House</option>
            <option>Apartment</option>
            <option>Dormitory</option>
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
            <label class="form-check-label" :for="'amenity-' + index">{{ amenity }}</label>
          </div>
        </div>

        <div class="p-3 border rounded shadow-sm bg-white">
          <h5 class="fw-bold mb-3">Facilities</h5>
          <div class="form-check" v-for="(facility, index) in facilities" :key="index">
            <input class="form-check-input" type="checkbox" :id="'facility-' + index">
            <label class="form-check-label" :for="'facility-' + index">{{ facility }}</label>
          </div>
        </div>
      </aside>

      <!-- Property Listings -->
      <div class="col-lg-9">
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="i in 6" :key="i">
            <div class="card h-100 shadow-sm property-card">
              <img src="../../assets/hotel.jpg" class="card-img-top" alt="Property">
              <div class="card-body">
                <h5 class="card-title">Sample Property</h5>
                <p class="card-text text-muted small">Located near City Center • Fully furnished</p>
                <p class="fw-bold text-primary mb-2">$250 / month</p>
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

export default {
  name: 'Home',
  components: {
    Header,
    RouterLink
  },
  data() {
    return {
      amenities: [
        'Electricity & Water',
        'Private Bedroom',
        'Furnitures',
        'Security',
        'Wi-fi'
      ],
      facilities: [
        'Kitchen',
        'Parking Space',
        'Gated Compound',
        'Common Lounge',
        'Fitness Area'
      ]
    };
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
