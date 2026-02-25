<template>
  <div class="verify-container d-flex align-items-center justify-content-center min-vh-100 px-3">
    <div class="card verify-card shadow-lg border-0 rounded-4 text-center p-4 p-md-5">
      
      <div class="icon-wrapper mb-4">
        📩
      </div>

      <h4 class="fw-bold mb-2">Verify your email address</h4>

      <p class="text-muted mb-4">
        We sent a verification link to your email.<br>
        Please check your inbox or spam folder.
      </p>

      <router-link to="/login" class="btn btn-outline-primary rounded-3 px-4">
        Go back to login
      </router-link>

    </div>
  </div>
</template>

<script>

export default {
  name: "VerifyEmail",
};
</script>

<style scoped>
.verify-container {
  background-color: #f4f7fe;
  background-image: radial-gradient(#4780d9 0.5px, transparent 0.5px);
  background-size: 24px 24px;
}

.verify-card {
  max-width: 420px;
  width: 100%;
}

.icon-wrapper {
  font-size: 3rem;
  background: #f0f7ff;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
</style>
    