<template>
  <div class="container py-4" style="max-width: 700px;">
    <!-- Back Button -->
    <RouterLink to="/" class="btn btn-outline-secondary mb-3">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <h3 class="fw-bold mb-4">Contact Us</h3>

    <p>If you have any questions or concerns, feel free to reach out to us.</p>

    <ul class="list-group mb-4">
      <li class="list-group-item">
        <i class="bi bi-envelope me-2"></i> support@rentaspace.com
      </li>
      <li class="list-group-item">
        <i class="bi bi-telephone me-2"></i> +63 977 140 5584
      </li>
      <li class="list-group-item">
        <i class="bi bi-geo-alt me-2"></i> Abuyog, Leyte, Philippines
      </li>
    </ul>

    <h5>Send us a message</h5>
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
      <button type="submit" class="btn btn-primary">Send</button>
    </form>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
  name: "ContactUsPage",
  components: { RouterLink },
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
