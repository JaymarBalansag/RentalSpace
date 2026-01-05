<template>
  <Header></Header>

  <div class="auth-container d-flex align-items-center justify-content-center vh-100">
    <div class="card shadow-lg border-0 rounded-4 auth-card">
      <!-- Logo -->
      <div class="text-center mb-4">
        <img src="@/assets/logo.jpg" alt="RentaSpace Logo" class="img-fluid mb-2" style="max-width: 80px;">
        <h3 class="fw-bold text-primary">Renta Hub</h3>
        <p class="text-muted small">Join and start finding your ideal space</p>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <input 
            type="text" 
            class="form-control form-control-lg rounded-3" 
            placeholder="First Name" 
            v-model="form.first_name" 
            required
          >
        </div>
        <div class="mb-3">
          <input 
            type="text" 
            class="form-control form-control-lg rounded-3" 
            placeholder="Last Name" 
            v-model="form.last_name" 
            required
          >
        </div>
        <div class="mb-3">
          <input 
            type="email" 
            class="form-control form-control-lg rounded-3" 
            placeholder="Email Address" 
            v-model="form.email" 
            required
          >
        </div>
        <div class="position-relative mb-3">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            class="form-control form-control-lg rounded-3 pe-5"
            placeholder="Password"
          />

          <button
            v-if="form.password"
            type="button"
            class="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
        <button
          type="submit"
          class="btn btn-primary w-100 rounded-3 py-2 fw-bold"
          :class="{ disabled: loading }"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Create Account
        </button>
      </form>

      <!-- Divider -->
      <div class="d-flex align-items-center my-3">
        <hr class="flex-grow-1">
        <span class="px-2 text-muted">OR</span>
        <hr class="flex-grow-1">
      </div>

      <!-- Login link -->
      <p class="text-center mb-0">
        Already have an account? 
        <router-link to="/login" class="fw-semibold text-primary">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { register } from '@/api/auth';
import Header from '@/components/Header.vue';
import { useUserInfo } from '@/store/userInfo';


export default {
  name: "Register",
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      },
      showPassword: false,
      loading: false,
    };
  },
  components: {
    Header
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      try {
        const res = await register(
          this.form.first_name, 
          this.form.last_name, 
          this.form.email, 
          this.form.password
        );

        if (res) {
          // ✅ store success flag
          sessionStorage.setItem("registerSuccess", "true");

          // redirect to login
          this.$router.push("/login");
        } else {
          alert("Registration failed. Try again.");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Something went wrong");
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  background: linear-gradient(135deg, #f8f9fa, #eef3f9);
}

.auth-card {
  width: 100%;
  max-width: 380px;
  padding: 2rem;
}
</style>
