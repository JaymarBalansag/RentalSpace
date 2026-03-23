<template>
  <Header />

  <div class="contact-page">
    <section class="contact-hero">
      <div class="container py-5 text-center">
        <p class="hero-eyebrow mb-2">Support and Questions</p>
        <h1 class="display-5 fw-bold text-white mb-2">Get In Touch</h1>
        <p class="hero-copy mx-auto mb-0">
          Have questions about listings or the platform? We are here to help every step of the way.
        </p>
      </div>
    </section>

    <OwnerSubscriptionExpiredBanner />
    <SubscriptionWarningBanner />

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-11">
          <RouterLink to="/home" class="back-link text-decoration-none mb-4 d-inline-flex align-items-center">
            <i class="bi bi-arrow-left me-2"></i>Back to Explore
          </RouterLink>

          <div class="row g-4">
            <div class="col-md-5">
              <section class="panel h-100">
                <p class="section-eyebrow mb-2">Contact Information</p>
                <h2 class="fw-bold text-dark mb-2">Let Us Know What You Need</h2>
                <p class="text-secondary mb-4">Send us your concern and we will respond as soon as possible.</p>

                <div class="contact-item d-flex align-items-start mb-4">
                  <div class="icon-box icon-primary me-3"><i class="bi bi-telephone-fill"></i></div>
                  <div>
                    <h6 class="fw-bold mb-1">Phone</h6>
                    <p class="text-muted mb-0">+63 977 140 5584</p>
                  </div>
                </div>

                <div class="contact-item d-flex align-items-start mb-4">
                  <div class="icon-box icon-success me-3"><i class="bi bi-envelope-fill"></i></div>
                  <div>
                    <h6 class="fw-bold mb-1">Email</h6>
                    <p class="text-muted mb-0">rentahubsupport@gmail.com</p>
                  </div>
                </div> 

                <div class="contact-item d-flex align-items-start mb-4">
                  <div class="icon-box icon-danger me-3"><i class="bi bi-geo-alt-fill"></i></div>
                  <div>
                    <h6 class="fw-bold mb-1">Office</h6>
                    <p class="text-muted mb-0">Abuyog, Leyte, Philippines</p>
                  </div>
                </div>

                <div class="social-block mt-4">
                  <h6 class="fw-bold mb-3">Follow Us</h6>
                  <div class="d-flex gap-2">
                    <a href="https://www.facebook.com/profile.php?id=61577415020480" class="social-btn" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                    <!-- <a href="#" class="social-btn" aria-label="Twitter"><i class="bi bi-twitter"></i></a>
                    <a href="#" class="social-btn" aria-label="Instagram"><i class="bi bi-instagram"></i></a> -->
                  </div>
                </div>
              </section>
            </div>

            <div class="col-md-7">
              <section class="panel form-panel h-100">
                <p class="section-eyebrow mb-2">Message Form</p>
                <h4 class="fw-bold mb-4">Send A Message</h4>

                <div v-if="successMessage" class="alert alert-success rounded-4 border-0 shadow-sm mb-4" role="status">
                  {{ successMessage }}
                </div>
                <div v-if="errorMessage" class="alert alert-danger rounded-4 border-0 shadow-sm mb-4" role="alert">
                  {{ errorMessage }}
                </div>

                <form @submit.prevent="submitForm">
                  <div class="row g-3">
                    <div class="col-md-12">
                      <label class="form-label small fw-bold text-muted">Your Name</label>
                      <input
                        type="text"
                        v-model="form.name"
                        class="form-control rounded-3 custom-input"
                        :class="{ 'is-invalid': errors.name }"
                        placeholder="Juan Dela Cruz"
                        :disabled="submitting"
                        required
                      >
                      <div v-if="errors.name" class="invalid-feedback d-block">{{ errors.name }}</div>
                    </div>
                    <div class="col-md-12">
                      <label class="form-label small fw-bold text-muted">Email Address</label>
                      <input
                        type="email"
                        v-model="form.email"
                        class="form-control rounded-3 custom-input"
                        :class="{ 'is-invalid': errors.email }"
                        placeholder="juan@example.com"
                        :disabled="submitting"
                        required
                      >
                      <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
                    </div>
                    <div class="col-md-12">
                      <label class="form-label small fw-bold text-muted">Message</label>
                      <textarea
                        v-model="form.message"
                        class="form-control rounded-3 custom-input"
                        :class="{ 'is-invalid': errors.message }"
                        rows="5"
                        placeholder="How can we help you?"
                        :disabled="submitting"
                        required
                      ></textarea>
                      <div v-if="errors.message" class="invalid-feedback d-block">{{ errors.message }}</div>
                    </div>
                    <div class="col-12 mt-3">
                      <button type="submit" class="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3 submit-btn" :disabled="submitting">
                        <span v-if="submitting" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        <i v-else class="bi bi-send-fill me-2"></i>{{ submitting ? "Sending Message..." : "Send Message" }}
                      </button>
                    </div>
                  </div>
                </form>
              </section>
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
import SubscriptionWarningBanner from "@/components/SubscriptionWarningBanner.vue";
import OwnerSubscriptionExpiredBanner from "@/components/OwnerSubscriptionExpiredBanner.vue";
import { submitContactInquiry } from "@/api/contact";

export default {
  name: "ContactUsPage",
  components: { RouterLink, Header, SubscriptionWarningBanner, OwnerSubscriptionExpiredBanner },
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: "",
      },
      submitting: false,
      successMessage: "",
      errorMessage: "",
      errors: {
        name: "",
        email: "",
        message: "",
      },
    };
  },
  methods: {
    resetForm() {
      this.form.name = "";
      this.form.email = "";
      this.form.message = "";
    },
    resetErrors() {
      this.errorMessage = "";
      this.errors = {
        name: "",
        email: "",
        message: "",
      };
    },
    async submitForm() {
      this.submitting = true;
      this.successMessage = "";
      this.resetErrors();

      try {
        const response = await submitContactInquiry({
          name: this.form.name,
          email: this.form.email,
          message: this.form.message,
        });

        this.successMessage = response?.data?.message || `Thank you, ${this.form.name}! Your message has been sent to the RentaHub support team.`;
        this.resetForm();
      } catch (error) {
        const validationErrors = error?.response?.data?.errors || {};
        this.errors = {
          name: validationErrors?.name?.[0] || "",
          email: validationErrors?.email?.[0] || "",
          message: validationErrors?.message?.[0] || "",
        };

        this.errorMessage =
          error?.response?.data?.message ||
          "We could not send your message right now. Please try again in a moment.";
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.contact-page {
  background: radial-gradient(circle at 20% 0, #edf4ff 0%, #f8fbff 34%, #ffffff 100%);
  min-height: 100vh;
}

.contact-hero {
  background:
    linear-gradient(145deg, rgba(20, 51, 98, 0.84), rgba(38, 90, 168, 0.78)),
    url("../../assets/Main/contact.avif");
  background-size: cover;
  background-position: center;
}

.hero-eyebrow {
  color: #dce9ff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.74rem;
  font-weight: 700;
}

.hero-copy {
  color: rgba(241, 247, 255, 0.9);
  max-width: 62ch;
}

.back-link {
  color: #4a658f;
  font-weight: 600;
}

.panel {
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  border: 1px solid #e3ecfa;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 22px rgba(18, 43, 83, 0.06);
}

.section-eyebrow {
  color: #3a64aa;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.72rem;
  font-weight: 700;
}

.icon-box {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.icon-primary {
  background: #eaf2ff;
  color: #2f61ae;
}

.icon-success {
  background: #eafaf0;
  color: #1e8a53;
}

.icon-danger {
  background: #fff0f0;
  color: #ce3b3b;
}

.social-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid #cfe0fb;
  color: #2f61ae;
  display: inline-grid;
  place-items: center;
  text-decoration: none;
  background: #f5f9ff;
}

.custom-input {
  padding: 0.8rem 1rem;
  border: 1.4px solid #e2ebf9;
  background-color: #f8fbff;
  transition: border-color 0.35s ease, box-shadow 0.35s ease, background-color 0.35s ease;
}

.custom-input:focus {
  border-color: #4780d9;
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(71, 128, 217, 0.1);
}

.submit-btn {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.35s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  background-color: #366ac2;
}

@media (prefers-reduced-motion: reduce) {
  .submit-btn,
  .custom-input {
    transition: none !important;
    animation: none !important;
  }
}
</style>
