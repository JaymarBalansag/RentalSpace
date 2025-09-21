<template>
  <div class="auth-container d-flex align-items-center justify-content-center vh-100">
    <div class="card shadow-lg border-0 rounded-4 auth-card">
      <!-- Logo -->
      <div class="text-center mb-4">
        <img src="@/assets/logo.jpg" alt="RentaSpace Logo" class="img-fluid mb-2" style="max-width: 80px;">
        <h3 class="fw-bold text-primary">RentaSpace</h3>
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
        <div class="mb-3">
          <input 
            type="password" 
            class="form-control form-control-lg rounded-3" 
            placeholder="Password" 
            v-model="form.password" 
            required
          >
        </div>
        <button type="submit" class="btn btn-primary w-100 rounded-3 py-2 fw-bold">
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
      }
    };
  },
  methods: {
    async handleRegister() {
      const info = useUserInfo();
      try {
        const res = await register(
          this.form.first_name, 
          this.form.last_name, 
          this.form.email, 
          this.form.password
        );
        if (res && res.first_name) {
          info.setUserInfo(res.first_name, res.last_name, res.role, res.email);
          info.setLoggedIn(true);
          this.$router.push("/home");
        } else {
          alert("Registration failed. Try again.");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Something went wrong");
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
