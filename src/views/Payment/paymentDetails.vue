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

                <div class="mb-3">
                  <label class="form-label">Payment Method</label>
                  <select v-model="paymentMethod" class="form-select">
                    <option disabled value="">-- Select --</option>
                    <option value="qrph">QR Ph</option>
                    <option value="gcash" disabled>GCash (Unavailable)</option>
                    <option value="maya" disabled>Maya (Unavailable)</option>
                  </select>
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
                  <h5 class="fw-bold mb-2">Selected Plan</h5>
                  <p class="fs-4 mb-1">{{ selectedPlan }}</p>
                  <p class="fs-5 fw-light">Price: {{ planPrice }}</p>
                  <p class="text-muted small">Payment simulation only. After confirm, you’ll become an Owner.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="card-footer text-center text-muted">
            Your payment will be securely processed. (Simulation Mode)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import { useUserInfo } from '@/store/userInfo'
import { paymentConfirmation } from '@/api/payment'

export default {
  name: "paymentDetails",
  data() {
    return {
      name: null,
      email: null,
      role: null,
      selectedPlan: "Monthly",   // later from route params
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
    async confirmPayment() {
        if (!this.paymentMethod) {
          alert("⚠ Please select a payment method.")
          return
        }

        if (this.role === "owner") {
          alert("⚠ You are already an Owner")
          return
        }

        try {
          // const res = await api.post("/paymentConfirmation", {
          //   plan: this.selectedPlan
          // })
          const res = await paymentConfirmation(this.selectedPlan, this.paymentMethod);

          const info = useUserInfo()
          info.setRole("owner")

          localStorage.setItem("userInfo", JSON.stringify(res.data.user))

          alert("✅ Payment confirmed! You are now an Owner.")

          // this.$router.push("/dashboard")  or wherever owner lands
          this.$router.push("/") // or wherever owner lands
        } catch (err) {
          console.error(err)
          alert("❌ Payment confirmation failed.")
        }
      }
    },
  components: { RouterLink }
}
</script>
