<template>
  <div class="renewal-shell">
    <div class="page-head mb-4">
      <p class="eyebrow mb-2">Subscription Renewal</p>
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h4 class="fw-bold mb-1">Renew Your Current Plan</h4>
          <p class="text-muted small mb-0">
            Keep your current access and extend your subscription without losing remaining days.
          </p>
        </div>
        <RouterLink to="/subscription" class="btn btn-light border fw-semibold">
          <i class="bi bi-arrow-left me-2"></i>Back to Subscription
        </RouterLink>
      </div>
    </div>

    <div class="card border-0 shadow-lg rounded-4 overflow-hidden renewal-card">
      <div class="card-header renewal-header text-white d-flex align-items-center justify-content-between flex-wrap gap-2 py-3">
        <div>
          <h5 class="mb-1 fw-semibold">Secure Renewal Checkout</h5>
          <p class="small mb-0 opacity-75">This payment renews your current owner subscription only.</p>
        </div>
        <span class="badge rounded-pill text-bg-light text-primary fw-semibold">{{ displayPlanName }}</span>
      </div>

      <div class="card-body p-4 p-md-5">
        <div class="row g-4">
          <div class="col-md-7 border-end">
            <div v-if="!isProcessingPayment" class="animate-fade-in">
              <h5 class="fw-bold mb-3 text-primary">Renewal Details</h5>
              <p class="text-muted small mb-4">Review your renewal summary and generate a QR payment to continue.</p>

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
                  <div class="renewal-plan-card">
                    <div>
                      <p class="text-muted small text-uppercase fw-semibold mb-1">Current Renewal Plan</p>
                      <h6 class="fw-bold mb-1">{{ displayPlanName }}</h6>
                      <p class="text-muted small mb-0">Billing cycle: {{ billingCycleLabel }}</p>
                    </div>
                    <div class="text-md-end">
                      <p class="text-muted small mb-1">Renewal Amount</p>
                      <p class="fw-bold text-primary mb-0">PHP {{ planPrice.toLocaleString() }}</p>
                    </div>
                  </div>
                </div>

                <div class="col-12">
                  <div class="alert alert-info border-0 renewal-note mb-0 small">
                    Renewing early extends from your current end date. Expired plans restart from today.
                  </div>
                </div>
              </div>

              <button @click="validatedPayment" class="btn btn-primary w-100 mt-4 fw-bold py-2 shadow">
                <i class="bi bi-arrow-repeat me-2"></i>Confirm & Generate Renewal QR
              </button>
            </div>

            <div v-else class="text-center animate-fade-in py-2">
              <h4 class="fw-bold text-success mb-2">Scan QR Ph to Renew</h4>
              <p class="text-muted small">Open GCash, Maya, or any Banking App to scan.</p>

              <div v-if="qrCodeUrl" class="my-4">
                <div class="d-inline-block p-3 border rounded-4 bg-white shadow-sm">
                  <img :src="qrCodeUrl" alt="QR Ph" class="img-fluid" style="max-width: 240px;">
                </div>
                <p class="text-danger mt-3 small fw-bold animate-pulse">
                  <i class="bi bi-clock-history me-1"></i>{{ paymentStatusMessage }}
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
            <div class="p-4 rounded-4 summary-card shadow-sm h-100">
              <h5 class="fw-bold text-primary mb-4">Renewal Summary</h5>

              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Selected Plan:</span>
                <span class="fw-bold">{{ displayPlanName }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Billing Cycle:</span>
                <span class="fw-bold">{{ billingCycleLabel }}</span>
              </div>
              <div class="d-flex justify-content-between mb-4">
                <span class="text-muted">Renewal Type:</span>
                <span class="fw-bold">Same plan renewal</span>
              </div>

              <hr class="border-primary opacity-25">

              <div class="d-flex justify-content-between align-items-center mb-4">
                <span class="h5 mb-0">Total Amount:</span>
                <span class="h3 mb-0 fw-bold text-primary">PHP {{ planPrice.toLocaleString() }}</span>
              </div>

              <div class="bg-white p-3 rounded-3 shadow-sm mb-3">
                <h6 class="fw-bold small mb-2 text-uppercase text-muted">Plan Benefits</h6>
                <ul class="list-unstyled small mb-0">
                  <li v-for="(benefit, idx) in planBenefits" :key="`renewal-benefit-${idx}`" class="mb-2">
                    <i class="bi bi-patch-check-fill text-primary me-2"></i>{{ benefit }}
                  </li>
                </ul>
              </div>

              <div class="timeline-card small">
                <p class="fw-semibold mb-2">Renewal behavior</p>
                <p class="text-muted mb-1">Active plan: your new period starts after the current end date.</p>
                <p class="text-muted mb-0">Expired plan: your new period starts today after payment succeeds.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer text-center bg-white py-3 text-muted small">
        <i class="bi bi-lock-fill me-1"></i>Your renewal payment is processed through PayMongo Secure Gateway.
      </div>
    </div>

    <ConfirmModal
      :show="showConfirmModal"
      title="Confirm Renewal"
      message="Proceed with your current plan renewal and generate the payment QR code?"
      confirm-text="Proceed to Renewal"
      @confirm="confirmPayment"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script>
import api from "@/api/api";
import ConfirmModal from "@/components/confirmModal.vue";
import { cancelPendingSubscription, getOwnerSubscriptionStatus, getSubscriptionStatus } from "@/api/subscription";
import { useUserInfo } from "@/store/userInfo";
import { downloadQrImage } from "@/utils/qrDownload";
import Swal from "sweetalert2";

const RENEWAL_PAYMENT_SESSION_KEY = "ownerRenewalPaymentSession";

export default {
  name: "RenewSubscription",
  components: { ConfirmModal },
  data() {
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
      selectedPlan: "monthly",
      planPrice: 200,
      currentSubscription: null,
      baselineSubscription: null,
      paymentStatusMessage: "Waiting for your payment...",
    };
  },
  computed: {
    displayPlanName() {
      return this.selectedPlan === "annual" ? "Annual Pro" : "Monthly Standard";
    },
    billingCycleLabel() {
      return this.selectedPlan === "annual" ? "per year" : "per month";
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
  async mounted() {
    await this.loadRenewalContext();
    await this.restorePendingSession();
  },
  methods: {
    showAlert(options) {
      return Swal.fire({
        confirmButtonText: "Okay",
        ...options,
      });
    },
    async loadRenewalContext() {
      const info = useUserInfo();
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      this.name = `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim();
      this.email = userInfo.email || "";

      let subscription = info.subscription || null;
      if (!subscription?.plan_name) {
        try {
          subscription = await getOwnerSubscriptionStatus();
          if (subscription) {
            info.setSubscriptionStatus(subscription);
          }
        } catch (error) {
          console.warn("Failed to load renewal subscription context:", error);
        }
      }

      if (!subscription?.plan_name) {
        this.$router.replace("/subscription");
        return;
      }

      this.currentSubscription = subscription;
      this.baselineSubscription = {
        status: String(subscription.status || "").toLowerCase(),
        end_date: subscription.end_date || null,
        plan_name: subscription.plan_name || null,
        billing_cycle: subscription.billing_cycle || null,
      };
      const cycle = String(subscription.billing_cycle || this.$route.query.plan || "monthly").toLowerCase();
      this.selectedPlan = cycle === "annual" ? "annual" : "monthly";
      this.planPrice = this.selectedPlan === "annual" ? 1800 : 200;
    },
    persistPendingSession() {
      if (!this.subscriptionId || !this.qrCodeUrl) return;

      sessionStorage.setItem(
        RENEWAL_PAYMENT_SESSION_KEY,
        JSON.stringify({
          flow: "renewal",
          subscriptionId: this.subscriptionId,
          qrCodeUrl: this.qrCodeUrl,
          selectedPlan: this.selectedPlan,
        })
      );
    },
    clearPendingSession() {
      sessionStorage.removeItem(RENEWAL_PAYMENT_SESSION_KEY);
    },
    async restorePendingSession() {
      const raw = sessionStorage.getItem(RENEWAL_PAYMENT_SESSION_KEY);
      if (!raw) return;

      let session = null;
      try {
        session = JSON.parse(raw);
      } catch (error) {
        this.clearPendingSession();
        return;
      }

      if (!session?.subscriptionId || session?.flow !== "renewal") {
        this.clearPendingSession();
        return;
      }

      this.subscriptionId = session.subscriptionId;
      this.selectedPlan = session.selectedPlan || this.selectedPlan;
      this.planPrice = this.selectedPlan === "annual" ? 1800 : 200;
      this.qrCodeUrl = session.qrCodeUrl || null;
      this.isProcessingPayment = true;
      this.paymentStatusMessage = "Waiting for your payment...";

      try {
        const [tempSubscription, ownerSnapshot] = await Promise.all([
          getSubscriptionStatus(this.subscriptionId),
          getOwnerSubscriptionStatus(),
        ]);

        const tempStatus = String(tempSubscription?.status || "").toLowerCase();
        const hasRenewedPeriod = this.hasRenewedPeriod(ownerSnapshot);

        if (tempStatus === "pending") {
          this.startPolling();
          return;
        }

        if ((tempStatus === "active" || tempStatus === "cancelled") && hasRenewedPeriod) {
          await this.finishRenewal(ownerSnapshot);
          return;
        }

        if (tempStatus === "active" || hasRenewedPeriod) {
          await this.finishRenewal(ownerSnapshot);
          return;
        }

        if (["failed", "expired", "cancelled"].includes(tempStatus)) {
          this.finishTerminalState(tempStatus, this.getTerminalStatusMessage(tempStatus));
          return;
        }

        this.resetPaymentState();
      } catch (error) {
        console.error("Failed to restore renewal session...", error);
        this.resetPaymentState(false);
      }
    },
    validatedPayment() {
      this.showConfirmModal = true;
    },
    async confirmPayment() {
      this.showConfirmModal = false;
      this.isProcessingPayment = true;

      try {
        const fd = new FormData();
        const backendPlan = this.selectedPlan === "annual" ? "Annual" : "Monthly";
        fd.append("plan", backendPlan);
        fd.append("amount", this.planPrice);
        fd.append("permit_acknowledged", "1");

        const response = await api.post("/paymongo/renew-payment", fd);

        this.qrCodeUrl = response.data.qr_code;
        this.subscriptionId = response.data.subscription_id;
        this.paymentStatusMessage = "Waiting for your payment...";
        this.persistPendingSession();
        this.startPolling();
      } catch (error) {
        this.isProcessingPayment = false;
        await this.showAlert({
          icon: "error",
          title: "Payment Gateway Error",
          text: "Error connecting to payment gateway. Please check your connection.",
        });
      }
    },
    startPolling() {
      clearInterval(this.checkStatusInterval);
      this.checkStatusInterval = setInterval(async () => {
        try {
          const [tempSubscription, ownerSnapshot] = await Promise.all([
            getSubscriptionStatus(this.subscriptionId),
            getOwnerSubscriptionStatus(),
          ]);

          const tempStatus = String(tempSubscription?.status || "").toLowerCase();
          const hasRenewedPeriod = this.hasRenewedPeriod(ownerSnapshot);

          if (tempStatus === "failed") {
            this.finishTerminalState(tempStatus, "Renewal payment failed. Please try again.");
            return;
          }

          if (tempStatus === "expired") {
            this.finishTerminalState(tempStatus, "Renewal QR expired. Please generate a new one.");
            return;
          }

          if (tempStatus === "cancelled" && !hasRenewedPeriod) {
            this.finishTerminalState(tempStatus, "Renewal payment was cancelled. You can start again anytime.");
            return;
          }

          if (tempStatus === "cancelled" && hasRenewedPeriod) {
            this.paymentStatusMessage = "Payment received. Finalizing your renewal...";
            clearInterval(this.checkStatusInterval);
            await this.finishRenewal(ownerSnapshot);
            return;
          }

          if (tempStatus === "active") {
            this.paymentStatusMessage = "Payment received. Finalizing your renewal...";
            clearInterval(this.checkStatusInterval);
            await this.finishRenewal(ownerSnapshot);
            return;
          }

          if (hasRenewedPeriod) {
            this.paymentStatusMessage = "Payment received. Finalizing your renewal...";
            clearInterval(this.checkStatusInterval);
            await this.finishRenewal(ownerSnapshot);
            return;
          }

          if (tempStatus === "pending") {
            this.paymentStatusMessage = "Waiting for your payment...";
          }
        } catch (error) {
          console.error("Polling renewal status failed...");
        }
      }, 3000);
    },
    hasRenewedPeriod(snapshot) {
      if (!snapshot) return false;

      const baselineStatus = String(this.baselineSubscription?.status || "").toLowerCase();
      const latestStatus = String(snapshot.status || "").toLowerCase();
      const latestEndDate = snapshot.end_date ? new Date(snapshot.end_date) : null;
      const baselineEndDate = this.baselineSubscription?.end_date
        ? new Date(this.baselineSubscription.end_date)
        : null;

      if (!latestEndDate || Number.isNaN(latestEndDate.getTime())) {
        return false;
      }

      if (baselineStatus === "active") {
        if (!baselineEndDate || Number.isNaN(baselineEndDate.getTime())) {
          return latestStatus === "active";
        }
        return latestEndDate.getTime() > baselineEndDate.getTime();
      }

      return latestStatus === "active" && latestEndDate.getTime() > Date.now();
    },
    async finishRenewal(snapshot = null) {
      const latestSubscription = snapshot || (await getOwnerSubscriptionStatus());
      if (latestSubscription) {
        useUserInfo().setSubscriptionStatus(latestSubscription);
      }

      clearInterval(this.checkStatusInterval);
      this.checkStatusInterval = null;
      this.clearPendingSession();
      this.paymentStatusMessage = "Renewal completed successfully.";
      this.bypassLeaveGuard = true;
      await this.showAlert({
        icon: "success",
        title: "Renewal Complete",
        text: "Subscription renewed successfully.",
      });
      this.$router.push("/subscription");
    },
    async refreshSubscription() {
      try {
        const subscription = await getOwnerSubscriptionStatus();
        if (subscription) {
          useUserInfo().setSubscriptionStatus(subscription);
        }
      } catch (error) {
        console.warn("Failed to refresh renewed subscription:", error);
      }
    },
    resetPaymentState(clearSession = true) {
      clearInterval(this.checkStatusInterval);
      this.checkStatusInterval = null;
      this.isProcessingPayment = false;
      this.qrCodeUrl = null;
      this.subscriptionId = null;
      this.paymentStatusMessage = "Waiting for your payment...";

      if (clearSession) {
        this.clearPendingSession();
      }
    },
    getTerminalStatusMessage(status) {
      if (status === "failed") {
        return "Renewal payment failed. Please try again.";
      }
      if (status === "expired") {
        return "Renewal QR expired. Please generate a new one.";
      }
      if (status === "cancelled") {
        return "Renewal payment was cancelled. You can start again anytime.";
      }
      return `Renewal payment ${status}.`;
    },
    finishTerminalState(status, message) {
      this.resetPaymentState();
      const icon = status === "failed" ? "error" : "info";
      this.showAlert({
        icon,
        title: icon === "error" ? "Renewal Failed" : "Renewal Updated",
        text: message || this.getTerminalStatusMessage(status),
      }).then(() => {
        this.bypassLeaveGuard = true;
        this.$router.push("/subscription");
      });
    },
    shouldGuardPendingLeave() {
      return this.isProcessingPayment && !!this.subscriptionId;
    },
    async resolvePendingLeaveChoice() {
      const result = await Swal.fire({
        title: "Leave this payment?",
        text: "Your QR payment is still pending. You can keep it open and resume later, or cancel it now.",
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Cancel Payment",
        denyButtonText: "Keep Payment Open",
        cancelButtonText: "Stay Here",
        reverseButtons: true,
        allowOutsideClick: false,
      });

      if (result.isDenied) return "keep";
      if (result.isConfirmed) return "cancel";
      return "stay";
    },
    async cancelPayment() {
      if (this.subscriptionId) {
        try {
          await cancelPendingSubscription(this.subscriptionId);
        } catch (error) {
          const message = error?.response?.data?.message || "Unable to cancel this renewal right now.";
          await this.showAlert({
            icon: "error",
            title: "Cancellation Failed",
            text: message,
          });
          return;
        }
      }

      this.resetPaymentState();
      this.bypassLeaveGuard = true;
      await this.showAlert({
        icon: "info",
        title: "Renewal Cancelled",
        text: "Renewal payment was cancelled. You can start again anytime.",
      });
      this.$router.push("/subscription");
    },
    async downloadQr() {
      try {
        await downloadQrImage(this.qrCodeUrl, "renta-hub-renewal-qr.png");
      } catch (error) {
        await this.showAlert({
          icon: "error",
          title: "Download Failed",
          text: error?.message || "Unable to download the QR right now.",
        });
      }
    },
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

      if (choice === "keep") {
        next();
        return;
      }

      if (choice === "cancel") {
        try {
          await cancelPendingSubscription(this.subscriptionId);
          this.resetPaymentState();
          this.bypassLeaveGuard = true;
          next();
        } catch (error) {
          const message = error?.response?.data?.message || "Unable to cancel this renewal right now.";
          await Swal.fire({
            icon: "error",
            title: "Cancellation failed",
            text: message,
            confirmButtonText: "Okay",
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
  },
};
</script>

<style scoped>
.renewal-shell {
  color: #0f172a;
}

.page-head .eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: rgba(43, 106, 243, 0.12);
  color: #1d4ed8;
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.renewal-card {
  border-radius: 24px;
}

.renewal-header {
  background: linear-gradient(135deg, #1d4ed8, #0f766e);
}

.renewal-plan-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 16px;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.14);
}

.summary-card {
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.14);
}

.renewal-note {
  background: rgba(14, 165, 233, 0.12);
  color: #0f172a;
}

.timeline-card {
  padding: 1rem;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.04);
}

.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-pulse { animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

@media (max-width: 768px) {
  .renewal-plan-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
