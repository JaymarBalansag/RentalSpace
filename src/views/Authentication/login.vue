<template>

  <!-- Success Toast -->
  <successToast v-if="showSuccess" message="🎉 Register successful! Please log in."></successToast>

  <Header></Header>

  <div class="auth-container d-flex align-items-center justify-content-center vh-100">
    <div class="card shadow-lg border-0 rounded-4 auth-card">
      <!-- Logo -->
      <div class="text-center mb-4">
        <img src="@/assets/logo.jpg" alt="RentaSpace Logo" class="img-fluid mb-2" style="max-width: 80px;">
        <h3 class="fw-bold text-primary">Renta Hub</h3>
        <p class="text-muted small">Find your perfect rental space</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin">
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
            class="form-control pe-5 form-control-lg rounded-3"
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
          Login
        </button>
      </form>

      <!-- Divider -->
      <div class="d-flex align-items-center my-3">
        <hr class="flex-grow-1">
        <span class="px-2 text-muted">OR</span>
        <hr class="flex-grow-1">
      </div>

      <!-- Register link -->
      <p class="text-center mb-0">
        Don’t have an account? 
        <router-link to="/register" class="fw-semibold text-primary">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/auth';
import { useUserInfo } from '@/store/userInfo';
import successToast from '@/components/successToast.vue';
import { getUserProfile } from '@/api/user';
import Header from '@/components/Header.vue';


export default {
  name: "Login",
  components: {
    successToast,
    Header
  },
  data() {
    return {
      form: { email: '', password: '' },
      showSuccess: false,
      showPassword: false,
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      const info = useUserInfo();
      this.loading = true;
      try {
        const res = await login(this.form.email, this.form.password);
        if (res && res.first_name) {

          // fetch profile image right after login
          const profileRes = await getUserProfile();
          const data = profileRes.data.user[0];
          const profile_photo = data.user_img_url || null;

          info.setUserInfo(res.first_name, res.last_name, res.role, res.email, profile_photo );

          sessionStorage.setItem("loginSuccess", "true");


          this.$router.push("/home");
        } else {
          alert("Invalid credentials");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Something went wrong");
      } finally {
        this.loading = false;
      }
    },
    registerSuccessToast() {
      const toastEl = this.$refs.successToast;
      
      toastEl.classList.add("show");

      setTimeout(() => {
        toastEl.classList.remove("show");
      }, 4000);

      sessionStorage.removeItem("registerSuccess");
    }
  },
  mounted() {

    const registerSuccess = sessionStorage.getItem("registerSuccess");

    if(registerSuccess){
      this.showSuccess = true;
      sessionStorage.removeItem("registerSuccess")
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
