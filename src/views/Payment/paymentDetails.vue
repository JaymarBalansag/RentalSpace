<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow border-0">
          <!-- Header -->
          <div class="card-header d-flex align-items-center">
            <RouterLink to="/payment/wall" class="text-decoration-none text-black d-flex align-items-center">
              <i class="bi bi-arrow-left fs-4 me-2"></i>
              Back
            </RouterLink>
            <h3 class="ms-auto me-auto mb-0">Payment Details</h3>
          </div>

          <!-- Body -->
          <div class="card-body">
            <div class="row">
              <!-- Left: Form -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Name</label>
                  <input v-model="name" type="text" class="form-control" readonly>
                </div>

                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="email" type="email" class="form-control" readonly>
                </div>

                <button 
                  @click="confirmPayment" 
                  class="btn btn-primary w-100"
                >
                  Confirm Payment
                </button>
              </div>

              <!-- Right: Summary -->
              <div class="col-md-6 border-start">
                <div class="text-center">
                  <img src="@/assets/qr.png" alt="QR Code" class="img-fluid mb-3" style="max-width: 200px;">
                  <h5 class="fw-bold mb-2">Plan: {{ selectedPlan }}</h5>
                  <p class="fs-4 fw-light mb-1">Price: {{ planPrice }}</p>
                  <p class="text-muted small">Scan QR or click Confirm to simulate payment.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="card-footer text-center text-muted">
            Your payment is securely processed. (Simulation Mode)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import { useUserInfo } from '@/store/userInfo'

export default {
  name: "paymentDetails",
  data() {
    return {
      name: null,
      email: null,
      role: null,
      selectedPlan: "Monthly",   // later this should come from route params
      planPrice: "₱500",
      paymentMethod: ""
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      if (userInfo) {
        this.name = userInfo.first_name + " " + userInfo.last_name
        this.email = userInfo.email
        this.role = userInfo.role
      }
    },
    confirmPayment() {
      if (!this.paymentMethod) {
        alert("Please select a payment method.")
        return
      }

      // Simulation only: mark user as owner
      const info = useUserInfo()
      info.setRole("owner")

      alert(`✅ Payment successful! You are now an Owner on the ${this.selectedPlan} plan.`)
      this.$router.push("/owner/dashboard")
    }
  },
  components: { RouterLink }
}
</script>
    