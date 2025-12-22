<template>
  <Header></Header>

  <div class="bg-light py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden">

            <!-- Header -->
            <div class="card-header bg-primary text-white d-flex align-items-center">
              <RouterLink to="/payment/wall" class="text-white text-decoration-none d-flex align-items-center">
                <i class="bi bi-arrow-left fs-4 me-2"></i>
                Back
              </RouterLink>
              <h3 class="ms-auto me-auto mb-0 fw-semibold">Payment Details</h3>
            </div>

            <!-- Body -->
            <div class="card-body p-4">
              <div class="row">
                
                <!-- Left: Form -->
                <div class="col-md-6 border-end">
                  <h5 class="fw-bold mb-3 text-primary">Your Information</h5>
                  
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Full Name</label>
                    <input v-model="name" type="text" class="form-control shadow-sm" readonly>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">Email Address</label>
                    <input v-model="email" type="email" class="form-control shadow-sm" readonly>
                  </div>

                  <h5 class="fw-bold mt-4 mb-3 text-primary">Payment Method</h5>
                  <select v-model="paymentMethod" class="form-select shadow-sm">
                    <option disabled value="">-- Select Payment Method --</option>
                    <option value="qrph">QR Ph</option>
                    <option value="gcash" disabled>GCash (Unavailable)</option>
                    <option value="maya" disabled>Maya (Unavailable)</option>
                  </select>

                  <button 
                    @click="validatedPayment"
                    class="btn btn-primary w-100 mt-4 fw-semibold py-2"
                  >
                    <i class="bi bi-credit-card me-2"></i> Confirm Payment
                  </button>
                </div>

                <!-- Right: Plan Summary -->
                <div class="col-md-6">
                  <div class="text-center p-4">
                    <h5 class="fw-bold text-primary mb-3">Selected Plan</h5>

                    <div class="p-4 rounded-4 border border-primary-subtle shadow-sm bg-white">
                      <h3 class="fw-bold mb-2">{{ selectedPlan }}</h3>
                      <p class="fs-4 text-primary fw-semibold mb-2">₱{{ planPrice }}</p>
                      <p class="text-muted small mb-3">Billed {{ planBilling }}</p>

                      <hr>

                      <ul class="list-unstyled text-start small">
                        <li><i class="bi bi-check2 text-success"></i> Verified listing approval</li>
                        <li><i class="bi bi-check2 text-success"></i> Access to property dashboard</li>
                        <li><i class="bi bi-check2 text-success"></i> Manage bookings and tenants</li>
                      </ul>
                    </div>

                    <p class="text-muted mt-3 small">
                      💡 Simulation mode only — payment gateway is disabled for demo purposes.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <!-- Footer -->
            <div class="card-footer text-center bg-white py-3 text-muted small">
              Your payment information is processed securely and privately.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirm Modal -->
    <ConfirmModal
      :show="showConfirmModal"
      title="Confirm Payment"
      message="Are you sure all the information you entered is correct?"
      confirm-text="Yes, I'm Sure"
      @confirm="confirmPayment"
      @cancel="closeConfirmModal"
    />
</template>

<script>
import { RouterLink } from 'vue-router'
import { useUserInfo } from '@/store/userInfo'
import { paymentConfirmation } from '@/api/payment'
import ConfirmModal from '@/components/confirmModal.vue';
import Header from '@/components/Header.vue';

export default {
  name: "PaymentDetails",
  components: { RouterLink, ConfirmModal, Header },
  data() {
    return {
      showConfirmModal: false,
      name: null,
      email: null,
      role: null,
      selectedPlan: null,
      planPrice: 50,
      planBilling: "",
      paymentMethod: ""
    }
  },
  mounted() {
    this.getUserInfo()
    this.getPlanDetails()
  },
  methods: {
    getUserInfo() {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      if (userInfo) {
        this.name = `${userInfo.first_name} ${userInfo.last_name}`
        this.email = userInfo.email
        this.role = userInfo.role
      }
    },
    async getPlanDetails() {
      const plan = this.$route.query.plan
      console.log("plan" + plan)
      if (plan === "Annual") {
        this.selectedPlan = "Annual"
        this.planPrice = 500
        this.planBilling = "per year"
      } else if (plan === "Monthly") {
        this.selectedPlan = "Monthly"
        this.planPrice = 50
        this.planBilling = "per month"
      } else {
        this.$router.push({
          path: '/payment/wall',
          query: { message: 'Invalid plan selected' }
        })
      }
    },
    validatedPayment() {
      if (!this.paymentMethod) {
        alert("⚠ Please select a payment method.")
        return
      }

      if(!this.selectedPlan){
        alert("⚠ Please select a payment plan.")
        return
      }

      this.showConfirmModal = true;
     
    },
    async confirmPayment() {
      try {
        const res = await paymentConfirmation(
          this.selectedPlan,
          this.paymentMethod
        )

        const info = useUserInfo()
        info.setRole("owner")

        localStorage.setItem("userInfo", JSON.stringify(res.data.user))

        sessionStorage.setItem("subscriptionSuccess", true);
        alert("✅ Subscription activated!")
        this.$router.push("/")
      } catch (err) {
        alert(err.response?.data?.message || "❌ Payment failed")
      }
    },
    closeConfirmModal() {
      this.showConfirmModal = false;
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}

.form-control,
.form-select {
  border-radius: 0.5rem;
}

.btn-primary {
  border-radius: 0.5rem;
}

.bg-light {
  background-color: #f8f9fb !important;
}
</style>
