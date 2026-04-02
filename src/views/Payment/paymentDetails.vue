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
                    <p class="text-muted small mb-4">Review your details and generate a QR payment to continue your owner subscription.</p>

                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label fw-semibold">Full Name</label>
                        <input v-model="name" type="text" class="form-control bg-light" readonly>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-semibold">Email</label>
                        <input v-model="email" type="text" class="form-control bg-light" readonly>
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
                      <button @click="downloadQr" class="btn btn-outline-primary btn-sm mt-2">
                        <i class="bi bi-download me-2"></i>Download QR
                      </button>
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
import { cancelPendingSubscription, getSubscriptionStatus } from '@/api/subscription';
import Header from '@/components/Header.vue';
import ConfirmModal from '@/components/confirmModal.vue';
import { useUserInfo } from '@/store/userInfo';
import { downloadQrImage } from '@/utils/qrDownload';
import {
  getOwnerPlan,
  getOwnerPlanCycleLabel,
  getOwnerPlanDisplayName,
  getOwnerPlanPrice,
} from '@/utils/ownerPlans';
import Swal from 'sweetalert2';

const OWNER_PAYMENT_SESSION_KEY = "ownerPendingPaymentSession";

export default {
  name: "PaymentCheckout",
  components: { Header, ConfirmModal },
  computed: {
    displayPlanName() {
      return getOwnerPlanDisplayName(this.selectedPlan);
    },
    planBenefits() {
      return getOwnerPlan(this.selectedPlan).features;
    },
  },
  data() {
    const initialPlan = this.$route.query.plan || 'monthly_standard';
    return {
      isProcessingPayment: false,
      showConfirmModal: false,
      qrCodeUrl: null,
      subscriptionId: null,
      checkStatusInterval: null,
      bypassLeaveGuard: false,
      isHandlingRouteLeave: false,
      name: "",
      email: "",
      permitAcknowledged: false,
      isRenewal: this.$route.query.renewal === '1',
      selectedPlan: initialPlan,
      planPrice: getOwnerPlanPrice(initialPlan),
      planBilling: getOwnerPlanCycleLabel(initialPlan),
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const status = String(user?.user_verification_status || "unverified").toLowerCase().trim();
    if (status !== "verified") {
      Swal.fire({
        icon: "warning",
        title: "Verification Required",
        text: "Account verification is required before owner application.",
        confirmButtonText: "Okay",
      }).then(() => {
        this.$router.push("/profile");
      });
      return;
    }
    this.getUserInfo();
    this.restorePendingSession();
  },
  methods: {
    showAlert(options) {
      return Swal.fire({
        confirmButtonText: "Okay",
        ...options,
      });
    },
    getUserInfo() {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        this.name = `${userInfo.first_name} ${userInfo.last_name}`;
        this.email = userInfo.email;
      }
    },
    resetPendingOwnerState() {
      const info = useUserInfo();
      info.setOwnerVerificationStatus(null, null);
      info.clearSubscriptionStatus();
    },
    clearPendingCheckoutState() {
      clearInterval(this.checkStatusInterval);
      this.checkStatusInterval = null;
      this.isProcessingPayment = false;
      this.qrCodeUrl = null;
      this.subscriptionId = null;
      this.clearPendingSession();

      if (!this.isRenewal) {
        this.resetPendingOwnerState();
      }
    },
    persistPendingSession() {
      if (this.isRenewal || !this.subscriptionId || !this.qrCodeUrl) return;
      sessionStorage.setItem(OWNER_PAYMENT_SESSION_KEY, JSON.stringify({
        flow: "initial_owner_activation",
        subscriptionId: this.subscriptionId,
        selectedPlan: this.selectedPlan,
        qrCodeUrl: this.qrCodeUrl,
      }));
    },
    clearPendingSession() {
      sessionStorage.removeItem(OWNER_PAYMENT_SESSION_KEY);
    },
    async restorePendingSession() {
      if (this.isRenewal) return;

      const raw = sessionStorage.getItem(OWNER_PAYMENT_SESSION_KEY);
      if (!raw) return;

      let session = null;
      try {
        session = JSON.parse(raw);
      } catch (error) {
        this.clearPendingSession();
        return;
      }

      if (!session?.subscriptionId || session?.flow !== "initial_owner_activation") {
        this.clearPendingSession();
        return;
      }

      this.subscriptionId = session.subscriptionId;
      this.selectedPlan = session.selectedPlan || this.selectedPlan;
      this.planPrice = getOwnerPlanPrice(this.selectedPlan);
      this.planBilling = getOwnerPlanCycleLabel(this.selectedPlan);
      this.qrCodeUrl = session.qrCodeUrl || null;
      this.isProcessingPayment = true;

      try {
        const res = await getSubscriptionStatus(this.subscriptionId);
        const status = String(res?.status || '').toLowerCase();

        if (status === 'pending') {
          this.startPolling();
          return;
        }

        if (status === 'active') {
          this.clearPendingSession();
          this.bypassLeaveGuard = true;
          this.$router.push('/payment/success');
          return;
        }

        if (['failed', 'expired', 'cancelled'].includes(status)) {
          this.finishCancelledAttempt(status, this.getTerminalStatusMessage(status));
          return;
        }

        this.clearPendingSession();
        this.isProcessingPayment = false;
        this.subscriptionId = null;
        this.qrCodeUrl = null;
      } catch (error) {
        console.error("Failed to restore pending payment session...", error);
        this.isProcessingPayment = false;
      }
    },
    getTerminalStatusMessage(status) {
      if (status === 'failed') {
        return "Payment failed. You can try again when you're ready.";
      }
      if (status === 'expired') {
        return "Payment QR expired. Your pending owner application has been cleared.";
      }
      if (status === 'cancelled') {
        return "Payment cancelled. Your pending owner application has been cleared.";
      }
      return `Payment ${status}.`;
    },
    shouldGuardPendingLeave() {
      return !this.isRenewal && this.isProcessingPayment && !!this.subscriptionId;
    },
    async resolvePendingLeaveChoice() {
      const result = await Swal.fire({
        title: 'Leave this payment?',
        text: 'Your QR payment is still pending. You can keep it open and resume later, or cancel it now.',
        icon: 'question',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Cancel Payment',
        denyButtonText: 'Keep Payment Open',
        cancelButtonText: 'Stay Here',
        reverseButtons: true,
        allowOutsideClick: false,
      });

      if (result.isDenied) return 'keep';
      if (result.isConfirmed) return 'cancel';
      return 'stay';
    },
    handleCancelledFlow(message) {
      this.clearPendingCheckoutState();
      this.bypassLeaveGuard = true;
      this.showAlert({
        icon: "info",
        title: "Payment Updated",
        text: message,
      }).then(() => {
        this.$router.push(this.isRenewal ? '/subscription' : '/payment/wall');
      });
    },
    finishCancelledAttempt(status, message) {
      this.handleCancelledFlow(message || `Payment ${status}.`);
    },
    validatedPayment() {
      if (!this.permitAcknowledged) {
        return this.showAlert({
          icon: "warning",
          title: "Acknowledgment Required",
          text: "Please acknowledge the compliance reminder before continuing.",
        });
      }

      this.showConfirmModal = true;
    },
    async confirmPayment() {
      this.showConfirmModal = false;
      this.isProcessingPayment = true;

      try {
        const fd = new FormData();
        fd.append('plan', this.selectedPlan);
        fd.append('amount', this.planPrice);
        fd.append('permit_acknowledged', this.permitAcknowledged ? '1' : '0');

        const endpoint = this.isRenewal ? "/paymongo/renew-payment" : "/paymongo/create-payment";
        const response = await api.post(endpoint, fd);

        this.qrCodeUrl = response.data.qr_code;
        this.subscriptionId = response.data.subscription_id;
        this.persistPendingSession();

        const info = useUserInfo();
        info.setOwnerVerificationStatus("pending", null);

        this.startPolling();
      } catch (error) {
        this.isProcessingPayment = false;
        this.showAlert({
          icon: "error",
          title: "Payment Gateway Error",
          text: "Error connecting to payment gateway. Please check your connection.",
        });
      }
    },
    startPolling() {
      this.checkStatusInterval = setInterval(async () => {
        try {
          const res = await getSubscriptionStatus(this.subscriptionId);
          const status = String(res?.status || '').toLowerCase();

          if (status === 'active') {
            clearInterval(this.checkStatusInterval);
            this.checkStatusInterval = null;
            this.clearPendingSession();
            this.bypassLeaveGuard = true;
            this.$router.push('/payment/success');
            return;
          }

          if (['failed', 'expired', 'cancelled'].includes(status)) {
            this.finishCancelledAttempt(status, this.getTerminalStatusMessage(status));
            return;
          }
        } catch (e) {
          console.error("Polling status failed...");
        }
      }, 3000);
    },
    async cancelPayment() {
      if (this.subscriptionId) {
        try {
          await cancelPendingSubscription(this.subscriptionId);
        } catch (error) {
          const message = error?.response?.data?.message || "Unable to cancel this payment right now.";
          await this.showAlert({
            icon: "error",
            title: "Cancellation Failed",
            text: message,
          });
          return;
        }
      }

      clearInterval(this.checkStatusInterval);
      this.handleCancelledFlow(
        this.isRenewal
          ? "Payment cancelled. Your renewal attempt was closed."
          : "Payment cancelled. Your pending owner application has been cleared."
      );
    },
    async downloadQr() {
      try {
        await downloadQrImage(this.qrCodeUrl, "renta-hub-subscription-qr.png");
      } catch (error) {
        await this.showAlert({
          icon: "error",
          title: "Download Failed",
          text: error?.message || "Unable to download the QR right now.",
        });
      }
    },
  },
  watch: {
    '$route.query.plan': {
      immediate: true,
      handler(plan) {
        if (!plan) return;
        this.selectedPlan = plan;
        this.planPrice = getOwnerPlanPrice(this.selectedPlan);
        this.planBilling = getOwnerPlanCycleLabel(this.selectedPlan);
      }
    }
  },
  async beforeRouteLeave(to, from, next) {
    if (!this.shouldGuardPendingLeave() || this.bypassLeaveGuard) {
      next();
      return;
    }

    if (this.isHandlingRouteLeave) {
      next(false);
      return;
    }

    this.isHandlingRouteLeave = true;

    try {
      const choice = await this.resolvePendingLeaveChoice();

      if (choice === 'keep') {
        next();
        return;
      }

      if (choice === 'cancel') {
        try {
          await cancelPendingSubscription(this.subscriptionId);
          this.clearPendingCheckoutState();
          this.bypassLeaveGuard = true;
          next();
        } catch (error) {
          const message = error?.response?.data?.message || "Unable to cancel this payment right now.";
          await Swal.fire({
            icon: 'error',
            title: 'Cancellation failed',
            text: message,
            confirmButtonText: 'Okay',
          });
          next(false);
        }
        return;
      }

      next(false);
    } finally {
      this.isHandlingRouteLeave = false;
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
