<template>
  <div class="container py-4" style="max-width: 800px;">
    <!-- Back Button -->
    <RouterLink to="/" class="btn btn-outline-secondary mb-3">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <h3 class="fw-bold mb-4">About Us</h3>

    <p>
      <strong>RentaSpace</strong> is a platform designed to help users find and manage rental spaces such as boarding houses, apartments, and more. 
      Our goal is to make renting simple, transparent, and accessible to everyone.
    </p>

    <h5 class="mt-4">Our Mission</h5>
    <p>
      To connect property owners and renters through a reliable and user-friendly system that provides maps, booking features, and real-time communication.
    </p>

    <h5 class="mt-4">Our Vision</h5>
    <p>
      To be the most trusted platform for space rentals in the Philippines, empowering communities through technology.
    </p>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
  name: "AboutUsPage",
  components: { RouterLink },
};
</script>
