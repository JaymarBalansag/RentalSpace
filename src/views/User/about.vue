<template>
  <Header />

  <div class="about-hero text-center py-5">
    <div class="container py-4">
      <h1 class="display-4 fw-bold text-white mb-2">About RentaHub</h1>
      <p class="lead text-white-50 mx-auto" style="max-width: 600px;">
        Making renting simple, transparent, and accessible for every Filipino.
      </p>
    </div>
  </div>

  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        
        <RouterLink to="/home" class="btn btn-link text-decoration-none p-0 mb-5 text-muted">
          <i class="bi bi-arrow-left me-2"></i>Back to Home
        </RouterLink>

        <div class="row align-items-center mb-5 g-5">
          <div class="col-md-6">
            <h2 class="fw-bold text-primary mb-4">Our Story</h2>
            <p class="text-secondary lh-lg">
              <strong>RentaHub</strong> was born from a simple observation: finding a reliable rental space is often stressful and disorganized. Whether it's a student looking for a boarding house or a business seeking a commercial spot, the process was broken.
            </p>
            <p class="text-secondary lh-lg">
              We built this platform to bridge the gap between property owners and tenants, providing a centralized system for maps, real-time messaging, and secure booking.
            </p>
          </div>
          <div class="col-md-6">
            <div class="p-2 border rounded-4 bg-white shadow-sm">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" 
                   class="img-fluid rounded-4 shadow-sm" alt="Modern Building">
            </div>
          </div>
        </div>

        <div class="row g-4 mb-5">
          <div class="col-md-6">
            <div class="card border-0 shadow-sm rounded-4 h-100 p-4 mission-card">
              <div class="icon-circle bg-primary-subtle mb-4">
                <i class="bi bi-bullseye text-primary fs-2"></i>
              </div>
              <h4 class="fw-bold">Our Mission</h4>
              <p class="text-muted mb-0">
                To connect property owners and renters through a reliable and user-friendly system that provides transparency, maps, and real-time communication tools.
              </p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card border-0 shadow-sm rounded-4 h-100 p-4 vision-card">
              <div class="icon-circle bg-success-subtle mb-4">
                <i class="bi bi-eye-fill text-success fs-2"></i>
              </div>
              <h4 class="fw-bold">Our Vision</h4>
              <p class="text-muted mb-0">
                To be the most trusted rental management platform in the Philippines, empowering local communities through innovative property technology.
              </p>
            </div>
          </div>
        </div>

        <div class="text-center py-5">
          <h3 class="fw-bold mb-5">Why RentaHub?</h3>
          <div class="row g-4 text-center">
            <div class="col-md-4">
              <i class="bi bi-geo-alt-fill text-primary fs-2 mb-2"></i>
              <h6 class="fw-bold">Map Integration</h6>
              <p class="small text-muted">Locate properties precisely using our interactive map features.</p>
            </div>
            <div class="col-md-4">
              <i class="bi bi-chat-dots-fill text-primary fs-2 mb-2"></i>
              <h6 class="fw-bold">Direct Messaging</h6>
              <p class="small text-muted">Chat directly with owners to clarify house rules and availability.</p>
            </div>
            <div class="col-md-4">
              <i class="bi bi-shield-fill-check text-primary fs-2 mb-2"></i>
              <h6 class="fw-bold">Verified Listings</h6>
              <p class="small text-muted">Ensuring a safer community for both owners and tenants.</p>
            </div>
          </div>
        </div>

        <div class="text-center mt-5 p-5 bg-light rounded-5 border-dashed">
          <h4 class="fw-bold mb-3">Ready to find your next home?</h4>
          <RouterLink to="/home" class="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow">
            Explore All Properties
          </RouterLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import Header from "@/components/Header.vue";

export default {
  name: "AboutUsPage",
  components: { RouterLink, Header },
};
</script>

<style scoped>
/* Branding Hero Gradient */
.about-hero {
  background: linear-gradient(135deg, #4780d9 0%, #2a5298 100%);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mission-card, .vision-card {
  transition: transform 0.3s ease;
  background: #ffffff;
}

.mission-card:hover, .vision-card:hover {
  transform: translateY(-5px);
}

.border-dashed {
  border: 2px dashed #dee2e6 !important;
}

.lh-lg {
  line-height: 1.8;
}

/* Animations for your demo */
.container {
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>