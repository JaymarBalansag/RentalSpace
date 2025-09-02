<template>
  <div class="container-fluid vh-100 p-0 m-0">
    <div class="row h-100 g-0">
      <!-- Left Column: Login -->
      <div class="col d-flex flex-column justify-content-center align-items-center p-2">
        
        <!-- Logo + Title -->
        <div class="text-center mb-4">
          <img src="@/assets/logo.jpg" alt="RentaSpace Logo" class="img-fluid" style="max-width: 120px;">
          <h3 class="mt-2">RentaSpace</h3>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="w-100" style="max-width: 350px;">
          <div class="mb-3">
            <input 
              type="email" 
              class="form-control" 
              placeholder="Email Address" 
              autocomplete="username" 
              required
              v-model="form.email"
            >
          </div>
          <div class="mb-3">
            <input 
              type="password" 
              class="form-control" 
              placeholder="Password" 
              autocomplete="current-password" 
              required
              v-model="form.password"
            >
          </div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
        <div class="d-flex align-items-center my-3 w-100" style="max-width: 320px;">
          <hr class="flex-grow-1">
          <span class="px-2 text-muted">OR</span>
          <hr class="flex-grow-1">
        </div>

        <!-- Register link -->
        <p class="text-center mb-0">
          Don’t have an account? 
          <router-link to="/register" class="text-decoration-none">Register</router-link>
        </p>
      </div>

      <!-- Right Column: Background Image -->
      <div class="col p-0 m-0 d-none d-md-block">
        <img 
          src="@/assets/hotel.jpg" 
          alt="Hotel" 
          class="w-100 h-100" 
          style="object-fit: cover;"
        >
      </div>
    </div>
  </div>
</template>

<script>

  import { login } from '@/api/auth';
  import { useUserInfo } from '@/store/userInfo';
  export default {
    name: "Login",
    data() {
      return {
        form: {
          email: '',
          password: ''
        }
      };
    },
    methods: {
      async handleLogin() {
        const info = useUserInfo();
        try {
          const res = await login(this.form.email, this.form.password);
          if(res && res.first_name && res.last_name && res.role && res.email){
            console.log(res);
            info.setUserInfo(res.first_name, res.last_name, res.role, res.email);
            info.setLoggedIn(true);
            alert(`Welcome back! ${info.first_name} ${info.last_name}`);
            this.$router.push("/home");
          } else {
            alert("Login failed. Please try again.");
          }
        } catch (error) {
          if (error.response) {
            alert(error.response.data.message); // <--- This will catch "The provided credentials are incorrect"
            this.$router.push("/login")
          } 
          else {
            alert("Something went wrong!");
          }
        }
      }
    }
  };
</script>

