<template>
  <Header />

  <div class="contact-hero text-center py-5">
    <div class="container py-4">
      <h1 class="display-4 fw-bold text-white mb-2">Get in Touch</h1>
      <p class="lead text-white-50 mx-auto" style="max-width: 600px;">
        Have questions about a listing or our platform? Our team is here to help you every step of the way.
      </p>
    </div>
  </div>

  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-11">
        
        <RouterLink to="/home" class="btn btn-link text-decoration-none p-0 mb-5 text-muted">
          <i class="bi bi-arrow-left me-2"></i>Back to Explore
        </RouterLink>

        <div class="row g-5">
          <div class="col-md-5">
            <h2 class="fw-bold text-dark mb-4">Contact Information</h2>
            <p class="text-secondary mb-5">
              Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div class="contact-info-list">
              <div class="d-flex align-items-start mb-4">
                <div class="icon-box bg-primary-subtle text-primary me-3">
                  <i class="bi bi-telephone-fill"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-0">Phone</h6>
                  <p class="text-muted">+63 977 140 5584</p>
                </div>
              </div>

              <div class="d-flex align-items-start mb-4">
                <div class="icon-box bg-success-subtle text-success me-3">
                  <i class="bi bi-envelope-fill"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-0">Email</h6>
                  <p class="text-muted">support@rentahub.com</p>
                </div>
              </div>

              <div class="d-flex align-items-start mb-4">
                <div class="icon-box bg-danger-subtle text-danger me-3">
                  <i class="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-0">Office</h6>
                  <p class="text-muted">Abuyog, Leyte, Philippines</p>
                </div>
              </div>
            </div>

            <div class="mt-5">
              <h6 class="fw-bold mb-3">Follow Us</h6>
              <div class="d-flex gap-3">
                <a href="#" class="btn btn-outline-primary btn-sm rounded-circle"><i class="bi bi-facebook"></i></a>
                <a href="#" class="btn btn-outline-primary btn-sm rounded-circle"><i class="bi bi-twitter"></i></a>
                <a href="#" class="btn btn-outline-primary btn-sm rounded-circle"><i class="bi bi-instagram"></i></a>
              </div>
            </div>
          </div>

          <div class="col-md-7">
            <div class="card border-0 shadow-lg rounded-4 p-4 p-md-5 contact-card">
              <h4 class="fw-bold mb-4">Send a Message</h4>
              
              <form @submit.prevent="submitForm">
                <div class="row g-3">
                  <div class="col-md-12">
                    <label class="form-label small fw-bold text-muted">Your Name</label>
                    <input type="text" v-model="form.name" class="form-control rounded-3 custom-input" placeholder="Juan Dela Cruz" required>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label small fw-bold text-muted">Email Address</label>
                    <input type="email" v-model="form.email" class="form-control rounded-3 custom-input" placeholder="juan@example.com" required>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label small fw-bold text-muted">Message</label>
                    <textarea v-model="form.message" class="form-control rounded-3 custom-input" rows="5" placeholder="How can we help you?" required></textarea>
                  </div>
                  <div class="col-12 mt-4">
                    <button type="submit" class="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3 shadow-sm submit-btn">
                      <i class="bi bi-send-fill me-2"></i> Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
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
      // In a real demo, this would call an API
      alert(`Thank you, ${this.form.name}! Your message has been sent to the RentaHub support team.`);
      this.form.name = "";
      this.form.email = "";
      this.form.message = "";
    },
  },
};
</script>

<style scoped>
/* Branding Hero Gradient */
.contact-hero {
  background: linear-gradient(135deg, #4780d9 0%, #2a5298 100%);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.icon-box {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.contact-card {
  background: #ffffff;
}

.custom-input {
  padding: 0.8rem 1rem;
  border: 1.5px solid #eef2f6;
  background-color: #f8fbff;
  transition: all 0.3s ease;
}

.custom-input:focus {
  border-color: #4780d9;
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(71, 128, 217, 0.1);
}

.submit-btn {
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  background-color: #366ac2;
}

/* Entrance Animation */
.container {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>