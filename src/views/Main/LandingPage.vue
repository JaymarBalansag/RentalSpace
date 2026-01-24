<template>
  <div class="landing-page">

    <section class="hero-section d-flex align-items-center">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 hero-text-container" data-aos="fade-up">
            <h1 class="display-3 fw-bold mb-3 text-white">
              Find Your <span class="text-accent">Perfect</span> Stay.
            </h1>
            <p class="lead text-white-50 mb-5 fs-4">
              RentaHub simplifies property rentals. Whether you're looking for a cozy boarding house or a commercial space, we connect you directly with verified owners.
            </p>
            <div class="d-flex gap-3">
              <RouterLink to="/home" class="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow">
                Browse Listings
              </RouterLink>
              <RouterLink to="/login" class="btn btn-outline-light btn-lg rounded-pill px-5 py-3 fw-bold">
                Join Now
              </RouterLink>
            </div>
          </div>
          <div class="col-lg-6 d-none d-lg-block">
             <div class="hero-image-glow">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80" 
                     class="img-fluid rounded-5 shadow-lg floating-img" alt="Modern Home">
             </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light">
      <div class="container">
        <div class="row text-center g-4">
          <div class="col-md-4">
            <h2 class="fw-bold text-primary">{{ propertyCount <= 100 ? propertyCount : '100+' }}</h2>
            <p class="text-muted">Verified Properties</p>
          </div>
          <div class="col-md-4">
            <h2 class="fw-bold text-primary">{{ tenantCount <= 100 ? tenantCount : '100+' }}</h2>
            <p class="text-muted">Happy Tenants</p>
          </div>
          <div class="col-md-4">
            <h2 class="fw-bold text-primary">24/7</h2>
            <p class="text-muted">Direct Support</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container py-5">
        <div class="text-center mb-5">
          <h2 class="fw-bold h1">Explore by Category</h2>
          <p class="text-muted">We cater to all types of rental needs.</p>
        </div>
        <div class="row g-4">
          <div v-for="cat in categories" :key="cat.name" class="col-md-3">
            <div class="card category-card border-0 shadow-sm text-center p-4">
              <div class="icon-box mb-3 mx-auto">
                <i :class="cat.icon"></i>
              </div>
              <h5 class="fw-bold">{{ cat.name }}</h5>
              <p class="small text-muted mb-0">{{ cat.count  <= 100 ? cat.count : '100+'  }} Listings</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-dark text-white mb-0 overflow-hidden position-relative">
      <div class="container py-5 position-relative z-index-2">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h2 class="display-5 fw-bold mb-3">Are you a property owner?</h2>
            <p class="lead opacity-75">List your space in minutes and reach thousands of potential tenants. Manage bookings and chats all in one dashboard.</p>
          </div>
          <div class="col-md-4 text-md-end">
            <RouterLink to="/payment/wall" class="btn btn-accent btn-lg px-5 rounded-pill fw-bold">
              List Property
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="decoration-circle"></div>
    </section>

    <footer class="py-5 bg-white border-top">
      <div class="container text-center">
        <h4 class="fw-bold text-primary mb-3">RentaHub</h4>
        <p class="text-muted mb-4 small">© 2026 RentaHub Rental Management System. All Rights Reserved.</p>
        <div class="d-flex justify-content-center gap-4">
          <a href="#" class="text-muted"><i class="bi bi-facebook"></i></a>
          <a href="#" class="text-muted"><i class="bi bi-twitter"></i></a>
          <a href="#" class="text-muted"><i class="bi bi-instagram"></i></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { fetchCategoryCountsHelper } from "@/api/landingPage";
import Header from "@/components/Header.vue";

export default {
  components: { Header },
  data() {
    return {
      loading : false,
      propertyCount: 0,
      tenantCount: 0,
      categories: [
        { name: 'Boarding House', icon: 'bi bi-houses-fill', count: '120' },
        { name: 'Apartments', icon: 'bi bi-building', count: '85' },
        { name: 'Condominiums', icon: 'bi bi-building-check', count: '45' },
        { name: 'House', icon: 'bi bi-house', count: '30' }
      ]
    };
  },
  methods: {
    async fetchCategoryCounts() {
      this.loading = true;
      const response = await fetchCategoryCountsHelper();
      console.log(response.data);

      this.categories[0].count = response.data.data[0].total;
      this.categories[1].count = response.data.data[1].total;
      this.categories[2].count = response.data.data[2].total;
      this.categories[3].count = response.data.data[3].total;

      this.propertyCount = response.data.propertyCount;
      this.tenantCount = response.data.tenantCount;

      this.loading = false;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchCategoryCounts();
    })
  }
};
</script>

<style scoped>
/* Hero Design */
.hero-section {
  min-height: 90vh;
  background: linear-gradient(135deg, #4780d9 0%, #2a5298 100%);
  padding-top: 80px;
  position: relative;
  overflow: hidden;
}

.text-accent {
  color: #ffd166; /* Gold/Accent color */
}

.btn-accent {
  background-color: #ffd166;
  color: #2a5298;
}

.btn-accent:hover {
  background-color: #ffc107;
  color: #000;
}

/* Category Cards */
.category-card {
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-10px);
  background: #4780d9;
  color: white;
}

.category-card:hover .text-muted {
  color: rgba(255,255,255,0.7) !important;
}

.icon-box {
  width: 60px;
  height: 60px;
  background: rgba(71, 128, 217, 0.1);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #4780d9;
}

.category-card:hover .icon-box {
  background: rgba(255,255,255,0.2);
  color: white;
}

/* Animations */
.floating-img {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.hero-image-glow {
  position: relative;
}

.hero-image-glow::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 209, 102, 0.2);
  filter: blur(80px);
  z-index: -1;
  transform: translate(-50%, -50%);
}

.decoration-circle {
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 209, 102, 0.1);
  border-radius: 50%;
  bottom: -150px;
  right: -50px;
}
</style>