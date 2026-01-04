<template>
  <Header></Header>

  <!-- Hero Section -->
  <div class="hero-section text-center py-5 bg-light">
    <h2 class="fw-bold">About RentaSpace</h2>
    <p class="lead text-muted">Making renting simple, transparent, and accessible for everyone</p>
  </div>

  <div class="container py-5" style="max-width: 900px;">
    <!-- Back Button -->
    <RouterLink to="/" class="btn btn-outline-secondary mb-4">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <!-- Intro -->
    <p class="mb-5">
      <strong>RentaSpace</strong> is a platform designed to help users find and manage rental spaces such as boarding houses, apartments, and more. 
      Our goal is to make renting simple, transparent, and accessible to everyone.
    </p>

    <!-- Mission & Vision Cards -->
    <div class="row g-4">
      <div class="col-md-6">
        <div class="card shadow-sm h-100 text-center p-4">
          <i class="bi bi-bullseye text-primary fs-1 mb-3"></i>
          <h5 class="fw-bold">Our Mission</h5>
          <p class="text-muted">
            To connect property owners and renters through a reliable and user-friendly system that provides maps, booking features, and real-time communication.
          </p>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card shadow-sm h-100 text-center p-4">
          <i class="bi bi-eye text-success fs-1 mb-3"></i>
          <h5 class="fw-bold">Our Vision</h5>
          <p class="text-muted">
            To be the most trusted platform for space rentals in the Philippines, empowering communities through technology.
          </p>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="text-center mt-5">
      <RouterLink to="/" class="btn btn-primary btn-lg">
        Explore Properties
      </RouterLink>
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
.hero-section {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}
.card i {
  display: block;
}
</style>
