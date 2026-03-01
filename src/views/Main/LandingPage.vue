<template>
  <Header />
  <div class="landing-page">
    <section class="hero-section d-flex align-items-center">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 hero-text-container">
            <span class="hero-badge">Trusted Rental Marketplace</span>
            <h1 class="display-3 fw-bold mb-3 text-white hero-title">
              Find Your <span class="text-accent">Perfect</span> Stay
            </h1>
            <p class="lead text-white-50 mb-4 fs-5 hero-subtitle">
              RentaHub simplifies property rentals. Whether you're looking for a cozy boarding house or a commercial space, we connect you directly with verified owners.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <RouterLink to="/home" class="btn btn-light btn-lg rounded-pill px-4 py-3 fw-bold text-primary">
                Browse Listings
              </RouterLink>
              <RouterLink to="/login" class="btn btn-outline-light btn-lg rounded-pill px-4 py-3 fw-bold">
                Join Now
              </RouterLink>
            </div>
          </div>
          <div class="col-lg-6 d-none d-lg-block">
            <div class="hero-image-glow">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"
                class="img-fluid rounded-5 shadow-lg "
                alt="Modern Home"
              >
              <div class="hero-info-card">
                <h6 class="mb-1">Verified Owner Listings</h6>
                <p class="mb-0 small text-muted">View trusted spaces with complete listing details.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="container">
        <div class="row text-center g-4">
          <div class="col-md-4">
            <div class="stat-card">
              <h2 class="fw-bold text-primary">{{ displayCount(propertyCount) }}</h2>
              <p class="text-muted mb-0">Verified Properties</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card">
              <h2 class="fw-bold text-primary">{{ displayCount(tenantCount) }}</h2>
              <p class="text-muted mb-0">Happy Tenants</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card">
              <h2 class="fw-bold text-primary">24/7</h2>
              <p class="text-muted mb-0">Direct Support</p>
            </div>
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
          <div v-for="cat in categories" :key="cat.name" class="col-md-3 col-sm-6">
            <div class="card category-card border-0 shadow-sm text-center p-4 h-100">
              <div class="icon-box mb-3 mx-auto">
                <i :class="cat.icon"></i>
              </div>
              <h5 class="fw-bold">{{ cat.name }}</h5>
              <p class="small text-muted mb-0">{{ displayCount(cat.count) }} Listings</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 owner-section text-white mb-0 overflow-hidden position-relative">
      <div class="container py-5 position-relative z-index-2">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h2 class="display-5 fw-bold mb-3">Are you a property owner?</h2>
            <p class="lead opacity-75">List your space in minutes and reach thousands of potential tenants. Manage bookings and chats all in one dashboard.</p>
          </div>
          <div class="col-md-4 text-md-end">
            <RouterLink to="/payment/wall" class="btn btn-accent btn-lg px-4 rounded-pill fw-bold">
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
        <p class="text-muted mb-4 small">&copy; 2026 RentaHub Rental Management System. All Rights Reserved.</p>
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
      loading: false,
      propertyCount: 0,
      tenantCount: 0,
      categories: [
        { name: "Boarding House", icon: "bi bi-houses-fill", count: 120 },
        { name: "Apartments", icon: "bi bi-building", count: 85 },
        { name: "Condominiums", icon: "bi bi-building-check", count: 45 },
        { name: "House", icon: "bi bi-house", count: 30 },
      ],
    };
  },
  methods: {
    displayCount(value) {
      const count = Number(value || 0);
      return count <= 100 ? count : "100+";
    },
    async fetchCategoryCounts() {
      this.loading = true;
      try {
        const response = await fetchCategoryCountsHelper();
        const payload = response?.data || {};
        const data = payload?.data || [];

        if (Array.isArray(data) && data.length >= 4) {
          this.categories[0].count = Number(data[0]?.total || 0);
          this.categories[1].count = Number(data[1]?.total || 0);
          this.categories[2].count = Number(data[2]?.total || 0);
          this.categories[3].count = Number(data[3]?.total || 0);
        }

        this.propertyCount = Number(payload?.propertyCount || 0);
        this.tenantCount = Number(payload?.tenantCount || 0);
      } catch (error) {
        console.error("Failed to fetch category counts:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchCategoryCounts();
  },
};
</script>

<style scoped>
.landing-page {
  background: #f7f9fd;
}

.hero-section {
  min-height: 90vh;
  background: linear-gradient(135deg, #4780d9 0%, #2a5298 100%);
  padding: 6.5rem 0 5rem;
  position: relative;
  overflow: hidden;
}

.hero-badge {
  display: inline-block;
  margin-bottom: 0.9rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #dbeafe;
  background: rgba(255, 255, 255, 0.12);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.hero-title {
  line-height: 1.05;
}

.hero-subtitle {
  max-width: 44ch;
}

.text-accent {
  color: #ffd166;
}

.btn-accent {
  background-color: #ffd166;
  color: #2a5298;
}

.btn-accent:hover {
  background-color: #ffc107;
  color: #000;
}

.category-card {
  border-radius: 16px;
  transition: all 0.25s ease;
  cursor: pointer;
  border: 1px solid #e7eef9 !important;
}

.category-card:hover {
  transform: translateY(-6px);
  background: #4780d9;
  color: white;
  box-shadow: 0 16px 28px rgba(31, 57, 101, 0.16) !important;
}

.category-card:hover .text-muted {
  color: rgba(255, 255, 255, 0.78) !important;
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
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.floating-img {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-18px); }
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
  filter: blur(70px);
  z-index: -1;
  transform: translate(-50%, -50%);
}

.hero-info-card {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 0.8rem 1rem;
}

.stats-section {
  margin-top: -2rem;
  position: relative;
  z-index: 5;
  padding-bottom: 2rem;
}

.stat-card {
  background: #fff;
  border: 1px solid #e5ecf7;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 8px 22px rgba(16, 39, 77, 0.06);
}

.owner-section {
  background: linear-gradient(145deg, #16263f, #1f3558);
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

@media (max-width: 991px) {
  .hero-section {
    min-height: auto;
    padding: 5.5rem 0 3.5rem;
  }

  .hero-text-container {
    text-align: center;
  }

  .hero-subtitle {
    max-width: 100%;
  }

  .stats-section {
    margin-top: 0;
    padding-top: 2rem;
  }
}
</style>
