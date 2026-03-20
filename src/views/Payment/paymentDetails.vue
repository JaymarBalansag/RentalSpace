<template>
  <Header />

  <div class="bg-light py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="card-header bg-primary text-white d-flex align-items-center py-3">
              <RouterLink to="/payment/wall" class="text-white text-decoration-none">
                <i class="bi bi-arrow-left fs-4 me-2"></i> Back
              </RouterLink>
              <h3 class="ms-auto me-auto mb-0 fw-semibold">Secure Checkout</h3>
            </div>

            <div class="card-body p-4 p-md-5">
              <div class="row g-4">
                <div class="col-md-7 border-end">
                  <div v-if="!isProcessingPayment" class="animate-fade-in">
                    <h5 class="fw-bold mb-3 text-primary">Owner Verification</h5>
                    <p class="text-muted small mb-4">Please provide your details to verify your account and receive payments.</p>

                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label fw-semibold">Full Name</label>
                        <input v-model="name" type="text" class="form-control bg-light" readonly>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-semibold">Email</label>
                        <input v-model="email" type="text" class="form-control bg-light" readonly>
                      </div>
                      <div class="col-12 d-flex gap-3 border-top pt-2">
                        <div class="form-check">
                          <input class="form-check-input" v-model="paymentType" value="gcash" type="radio" name="radioDefault" id="radioDefault1" checked>
                          <label class="form-check-label" for="radioDefault1">GCash</label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" v-model="paymentType" value="paymaya" type="radio" name="radioDefault" id="radioDefault2">
                          <label class="form-check-label" for="radioDefault2">PayMaya</label>
                        </div>
                      </div>

                      <div class="col-12 border-bottom pb-2">
                        <label class="form-label fw-semibold">Contact Number (GCash/Maya)</label>
                        <div class="input-group">
                          <span class="input-group-text bg-white"><i class="bi bi-phone"></i></span>
                          <input v-model="phoneNumber" type="tel" class="form-control" placeholder="09XXXXXXXXX" inputmode="numeric">
                        </div>
                        <small class="text-muted">Required for receiving payments from tenants.</small>
                      </div>

                      <div class="col-12">
                        <div class="alert alert-warning border-warning-subtle mb-0 small">
                          <strong>Compliance reminder:</strong>
                          Before listing any rental property, you must hold a valid business permit and provide truthful property information.
                          Non-compliant listings may be rejected or removed.
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="form-check">
                          <input
                            id="permitAcknowledge"
                            class="form-check-input"
                            type="checkbox"
                            v-model="permitAcknowledged"
                          >
                          <label class="form-check-label small" for="permitAcknowledge">
                            I acknowledge that I am responsible for having valid permit/compliance documents before publishing listings.
                          </label>
                        </div>
                      </div>
                    </div>

                    <button @click="validatedPayment" class="btn btn-primary w-100 mt-4 fw-bold py-2 shadow">
                      <i class="bi bi-shield-check me-2"></i> Confirm & Generate Payment QR
                    </button>
                  </div>

                  <div v-else class="text-center animate-fade-in py-2">
                    <h4 class="fw-bold text-success mb-2">Scan QR Ph to Pay</h4>
                    <p class="text-muted small">Open GCash, Maya, or any Banking App to scan.</p>

                    <div v-if="qrCodeUrl" class="my-4">
                      <div class="d-inline-block p-3 border rounded-4 bg-white shadow-sm">
                        <img :src="qrCodeUrl" alt="QR Ph" class="img-fluid" style="max-width: 240px;">
                      </div>
                      <p class="text-danger mt-3 small fw-bold animate-pulse">
                        <i class="bi bi-clock-history me-1"></i> Waiting for your payment...
                      </p>
                    </div>

                    <div v-else class="py-5">
                      <div class="spinner-border text-primary" role="status"></div>
                      <p class="mt-2 text-primary fw-medium">Generating Secure QR Ph...</p>
                    </div>

                    <button @click="cancelPayment" class="btn btn-link text-muted mt-3">
                      Cancel & Change Details
                    </button>
                  </div>
                </div>

                <div class="col-md-5">
                  <div class="p-4 rounded-4 bg-primary bg-opacity-10 border border-primary-subtle shadow-sm h-100">
                    <h5 class="fw-bold text-primary mb-4">Subscription Summary</h5>

                    <div class="d-flex justify-content-between mb-2">
                      <span class="text-muted">Selected Plan:</span>
                      <span class="fw-bold">{{ displayPlanName }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-4">
                      <span class="text-muted">Billing Cycle:</span>
                      <span class="fw-bold text-capitalize">{{ planBilling }}</span>
                    </div>

                    <hr class="border-primary opacity-25">

                    <div class="d-flex justify-content-between align-items-center mb-4">
                      <span class="h5 mb-0">Total Amount:</span>
                      <span class="h3 mb-0 fw-bold text-primary">PHP {{ planPrice.toLocaleString() }}</span>
                    </div>

                    <div class="bg-white p-3 rounded-3 shadow-sm mb-0">
                      <h6 class="fw-bold small mb-2 text-uppercase text-muted">Plan Benefits:</h6>
                      <ul class="list-unstyled small mb-0">
                        <li v-for="(benefit, idx) in planBenefits" :key="`benefit-${idx}`" class="mb-2">
                          <i class="bi bi-patch-check-fill text-primary me-2"></i> {{ benefit }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-footer text-center bg-white py-3 text-muted small">
              <i class="bi bi-lock-fill me-1"></i> Your data and payments are processed through PayMongo Secure Gateway.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="showConfirmModal"
    title="Final Confirmation"
    message="By clicking proceed, you confirm your details and are ready to generate your payment QR code."
    confirm-text="Proceed to Payment"
    @confirm="confirmPayment"
    @cancel="showConfirmModal = false"
  />
</template>

<script>
import api from '@/api/api';
import Header from '@/components/Header.vue';
import ConfirmModal from '@/components/confirmModal.vue';
import { useUserInfo } from '@/store/userInfo';

export default {
  name: "PaymentCheckout",
  components: { Header, ConfirmModal },
  computed: {
    displayPlanName() {
      return this.selectedPlan === "annual" ? "Annual Pro" : "Monthly Starter";
    },
    planBenefits() {
      if (this.selectedPlan === "annual") {
        return [
          "Up to 5 property listings",
          "Property management",
          "Reviews management",
          "Tenant management",
          "Booking management",
          "Billings management",
          "Payment ledger management",
          "Reports & Analytics",
        ];
      }
      return [
        "2 property listing limit",
        "Property management",
        "Reviews management",
      ];
    },
  },
  data() {
    return {
      isProcessingPayment: false,
      showConfirmModal: false,
      qrCodeUrl: null,
      subscriptionId: null,
      checkStatusInterval: null,
      name: "",
      email: "",
      paymentType: "gcash",
      phoneNumber: "",
      permitAcknowledged: false,
      selectedPlan: this.$route.query.plan || 'monthly',
      planPrice: this.$route.query.plan === 'annual' ? 1800 : 200,
      planBilling: this.$route.query.plan === 'annual' ? 'per year' : 'per month'
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const status = String(user?.user_verification_status || "unverified").toLowerCase().trim();
    if (status !== "verified") {
      alert("Account verification is required before owner application.");
      this.$router.push("/profile");
      return;
    }
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        this.name = `${userInfo.first_name} ${userInfo.last_name}`;
        this.email = userInfo.email;
      }
    },
    validatedPayment() {
      const phPhoneRegex = /^09\d{9}$/;
      if (!phPhoneRegex.test(this.phoneNumber)) {
        return alert("Please enter a valid 09XXXXXXXXX phone number.");
      }
      if (!this.permitAcknowledged) {
        return alert("Please acknowledge the compliance reminder before continuing.");
      }

      this.showConfirmModal = true;
    },
    async confirmPayment() {
      this.showConfirmModal = false;
      this.isProcessingPayment = true;

      try {
        const fd = new FormData();
        const backendPlan = this.selectedPlan === 'annual' ? 'Annual' : 'Monthly';
        fd.append('plan', backendPlan);
        fd.append('amount', this.planPrice);
        fd.append('paymentType', this.paymentType);
        fd.append('phone', this.phoneNumber);
        fd.append('permit_acknowledged', this.permitAcknowledged ? '1' : '0');

        const response = await api.post('/paymongo/create-payment', fd);

        this.qrCodeUrl = response.data.qr_code;
        this.subscriptionId = response.data.subscription_id;

        const info = useUserInfo();
        info.setOwnerVerificationStatus("pending", null);

        this.startPolling();
      } catch (error) {
        this.isProcessingPayment = false;
        alert("Error connecting to payment gateway. Please check your connection.");
      }
    },
    startPolling() {
      this.checkStatusInterval = setInterval(async () => {
        try {
          const res = await api.get(`/subscription-status/${this.subscriptionId}`);
          if (res.data.status === 'active') {
            clearInterval(this.checkStatusInterval);
            this.$router.push('/payment/success');
          }
        } catch (e) {
          console.error("Polling status failed...");
        }
      }, 3000);
    },
    cancelPayment() {
      clearInterval(this.checkStatusInterval);
      this.isProcessingPayment = false;
      this.qrCodeUrl = null;
    }
  },
  watch: {
    phoneNumber(val) {
      if (!val) return;
      let cleaned = val.replace(/\D/g, '');
      if (cleaned.length > 0 && !cleaned.startsWith('09')) {
        cleaned = cleaned.startsWith('9') ? '0' + cleaned : '09';
      }
      this.phoneNumber = cleaned.substring(0, 11);
    }
  },
  beforeUnmount() {
    clearInterval(this.checkStatusInterval);
  }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-pulse { animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
.card { border-radius: 1.5rem; }
.form-control:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15); }
</style>
