<template>
  <Header />

  <div class="auth-container d-flex align-items-center justify-content-center min-vh-100 py-5 px-3">
    <div class="card shadow-lg border-0 rounded-4 auth-card overflow-hidden">
      <div class="auth-accent-line"></div>

      <div class="card-body p-4 p-md-5">
        <div class="text-center mb-4">
          <div class="logo-wrapper mb-3 mx-auto shadow-sm">
             <i class="bi bi-house-heart-fill text-primary fs-1"></i>
          </div>
          <h3 class="fw-bold text-dark mb-1">Join RentaHub</h3>
          <p class="text-muted small">Start finding or listing your ideal space today.</p>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="row g-3 mb-3">
            <div class="col-sm-6">
              <label class="form-label small fw-bold text-secondary">First Name</label>
              <input 
                type="text" 
                class="form-control rounded-3 shadow-none custom-input" 
                placeholder="Juan" 
                v-model="form.first_name" 
                required
              >
            </div>
            <div class="col-sm-6">
              <label class="form-label small fw-bold text-secondary">Last Name</label>
              <input 
                type="text" 
                class="form-control rounded-3 shadow-none custom-input" 
                placeholder="Dela Cruz" 
                v-model="form.last_name" 
                required
              >
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-secondary">Email Address</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 rounded-start-3">
                <i class="bi bi-envelope text-muted"></i>
              </span>
              <input 
                type="email" 
                class="form-control rounded-end-3 shadow-none border-start-0 custom-input" 
                placeholder="name@email.com" 
                v-model="form.email" 
                required
              >
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label small fw-bold text-secondary">Password</label>
            <div class="position-relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                class="form-control rounded-3 shadow-none pe-5 custom-input"
                placeholder="Min. 8 characters"
                required
              />
              <button
                type="button"
                class="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted text-decoration-none"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label small fw-bold text-secondary">Confirm Password</label>
            <div class="position-relative">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="form.confirmPassword"
                class="form-control rounded-3 shadow-none pe-5 custom-input"
                placeholder="Password Confirmation"
                required
              />
              <button
                type="button"
                class="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted text-decoration-none"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 rounded-3 py-3 fw-bold shadow-sm submit-btn d-flex align-items-center justify-content-center"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="d-flex align-items-center my-4">
          <hr class="flex-grow-1 text-muted opacity-25">
          <span class="px-3 text-muted small fw-bold">OR</span>
          <hr class="flex-grow-1 text-muted opacity-25">
        </div>

        <p class="text-center mb-0 small">
          Already have an account? 
          <router-link to="/login" class="fw-bold text-primary text-decoration-none hover-underline">
            Login here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from '@/api/auth';
import Header from '@/components/Header.vue';

export default {
  name: "Register",
  components: { Header },
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
    };
  },
  methods: {
    async handleRegister() {
      // Basic validation for defense
      if (this.form.password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }

      if(this.form.confirmPassword !== this.form.password){
        alert("Password and Password Confirmation is not match")
        return;
      }

      this.loading = true;
      try {
        const res = await register(
          this.form.first_name, 
          this.form.last_name, 
          this.form.email, 
          this.form.password
        );

        const userID = res.data.userId;

        // console.log(res);

        this.$router.push(`/verify-email/${userID}`);
        
      } catch (error) {
        // Handle API errors (like Email already exists)
        alert(error.response?.data?.message || "An error occurred during registration.");
      } finally {
        this.form.first_name = "";
        this.form.last_name = "";
        this.form.email = "";
        this.form.password = "";
        this.form.confirmPassword = "";
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Background with subtle pattern */
.auth-container {
  background-color: #f4f7fe;
  background-image: radial-gradient(#4780d9 0.5px, transparent 0.5px);
  background-size: 24px 24px;
}

/* Card Styling */
.auth-card {
  width: 100%;
  max-width: 480px; /* Slightly wider for the two-column name row */
  background: white;
}

/* Top Branding Strip */
.auth-accent-line {
  height: 6px;
  background: linear-gradient(90deg, #4780d9, #ffd166);
}

/* Icon Wrapper */
.logo-wrapper {
  width: 64px;
  height: 64px;
  background: #f0f7ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Form Input Focus Effects */
.custom-input {
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.custom-input:focus {
  border-color: #4780d9;
  background-color: #fcfdff;
  box-shadow: 0 0 0 3px rgba(71, 128, 217, 0.1);
}

/* Button Interactions */
.submit-btn {
  background-color: #4780d9;
  border: none;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #366ac2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 128, 217, 0.2);
}

.submit-btn:active {
  transform: translateY(0);
}

.hover-underline:hover {
    text-decoration: underline !important;
}

/* Responsive adjustments */
@media (max-width: 576px) {
    .auth-card {
        max-width: 100%;
        border-radius: 0;
    }
    .auth-container {
        padding: 0 !important;
        background: white;
    }
}
</style>