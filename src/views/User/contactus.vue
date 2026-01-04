<template>
  <Header></Header>

  <!-- Hero Section -->
  <div class="hero-section text-center py-5 bg-light">
    <h2 class="fw-bold">Contact RentaSpace</h2>
    <p class="lead text-muted">We’re here to help you with your rental journey</p>
  </div>

  <div class="container py-5" style="max-width: 900px;">
    <!-- Back Button -->
    <RouterLink to="/" class="btn btn-outline-secondary mb-4">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <!-- Intro -->
    <p class="mb-4">
      If you have any questions or concerns, feel free to reach out to us. 
      Our team is ready to assist you.
    </p>

    <!-- Contact Info Cards -->
    <div class="row g-4 mb-5">
      <div class="col-md-4">
        <div class="card shadow-sm h-100 text-center p-3">
          <i class="bi bi-envelope text-primary fs-1 mb-2"></i>
          <h6 class="fw-bold">Email</h6>
          <p class="text-muted mb-0">support@rentaspace.com</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm h-100 text-center p-3">
          <i class="bi bi-telephone text-success fs-1 mb-2"></i>
          <h6 class="fw-bold">Phone</h6>
          <p class="text-muted mb-0">+63 977 140 5584</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm h-100 text-center p-3">
          <i class="bi bi-geo-alt text-danger fs-1 mb-2"></i>
          <h6 class="fw-bold">Location</h6>
          <p class="text-muted mb-0">Abuyog, Leyte, Philippines</p>
        </div>
      </div>
    </div>

    <!-- Contact Form -->
    <div class="card shadow-sm p-4">
      <h5 class="fw-bold mb-3">Send us a message</h5>
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" v-model="form.name" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" v-model="form.email" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Message</label>
          <textarea v-model="form.message" class="form-control" rows="4" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary w-100">Send Message</button>
      </form>
    </div>

    <!-- CTA Footer -->
    <div class="text-center mt-5">
      <RouterLink to="/" class="btn btn-outline-primary btn-lg">
        Explore Properties
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import Header from "@/components/Header.vue";

export default {
  name: "ContactUsPage",
  components: { RouterLink, Header },
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: "",
      },
    };
  },
  methods: {
    submitForm() {
      alert(`Message sent!\n\nName: ${this.form.name}\nEmail: ${this.form.email}\nMessage: ${this.form.message}`);
      this.form.name = "";
      this.form.email = "";
      this.form.message = "";
    },
  },
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
