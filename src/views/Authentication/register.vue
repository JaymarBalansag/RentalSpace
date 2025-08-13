<template>
  <div class="container-fluid vh-100 p-0 m-0">
    <div class="row h-100 g-0">
          <!-- Right Column: Background Image -->
        <div class="col p-0 m-0 d-none d-md-block">
            <img 
            src="@/assets/hotel.jpg" 
            alt="Hotel" 
            class="w-100 h-100" 
            style="object-fit: cover;"
            >
        </div>
      <!-- right Column: Login -->
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
              v-model="email"
              type="email" 
              class="form-control" 
              placeholder="Email Address" 
              autocomplete="username" 
              required
            >
          </div>
          <div class="mb-3">
            <input 
              v-model="password"
              type="password" 
              class="form-control" 
              placeholder="Password" 
              autocomplete="current-password" 
              required
            >
          </div>
          <button type="submit" class="btn btn-primary w-100">Create Account</button>
        </form>
        <div class="d-flex align-items-center my-3 w-100" style="max-width: 320px;">
          <hr class="flex-grow-1">
          <span class="px-2 text-muted">OR</span>
          <hr class="flex-grow-1">
        </div>

        <!-- Register link -->
        <p class="text-center mb-0">
          Already have an account? 
          <router-link to="/login" class="text-decoration-none">Login</router-link>
        </p>
      </div>

    
      
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async handleLogin() {
      // Trim inputs to avoid accidental spaces
      const payload = {
        email: this.email.trim(),
        password: this.password
      };

      // Basic frontend validation
      if (!payload.email || !payload.password) {
        alert("Please enter your email and password.");
        return;
      }

      try {
        // Send POST request to your backend API
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
          console.log("Login success:", data);
          // Save token securely (prefer HttpOnly cookies in backend)
        } else {
          alert(data.message || "Invalid credentials.");
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    }
  }
};
</script>
