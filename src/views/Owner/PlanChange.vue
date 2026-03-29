<template>
  <div class="renewal-shell">
    <div class="page-head mb-4">
      <p class="eyebrow mb-2">Plan Change</p>
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h4 class="fw-bold mb-1">{{ isDowngrade ? "Change to Monthly Plan" : "Upgrade to Annual Plan" }}</h4>
          <p class="text-muted small mb-0">
            {{ isDowngrade
              ? "Review the downgrade warning carefully before confirming your new plan."
              : "Switch to Annual and unlock the full owner dashboard right after payment succeeds." }}
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
          <h5 class="mb-1 fw-semibold">Secure Plan Change Checkout</h5>
          <p class="small mb-0 opacity-75">Your new plan takes effect immediately after successful payment.</p>
        </div>
        <span class="badge rounded-pill text-bg-light text-primary fw-semibold">{{ targetPlanName }}</span>
      </div>

      <div class="card-body p-4 p-md-5">
        <div v-if="!isProcessingPayment" class="checkout-body mx-auto">
          <div class="summary-card-simple" :class="{ 'summary-card-simple--danger': isDowngrade }">
            <div class="summary-row">
              <span class="label">Current Plan</span>
              <strong>{{ currentPlanName }}</strong>
            </div>
            <div class="summary-row">
              <span class="label">New Plan</span>
              <strong>{{ targetPlanName }}</strong>
            </div>
            <div class="summary-row">
              <span class="label">Total Amount</span>
              <strong class="text-primary">PHP {{ planPrice.toLocaleString() }}</strong>
            </div>
            <div class="summary-row">
              <span class="label">Effective Timing</span>
              <strong>Immediately after successful payment</strong>
            </div>
          </div>

            <div class="payment-card-simple">
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Full Name</label>
                <input v-model="name" type="text" class="form-control bg-light" readonly>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Email</label>
                  <input v-model="email" type="text" class="form-control bg-light" readonly>
                </div>
              </div>
              <p class="small text-muted mb-0">This checkout uses a secure QR Ph payment request generated through PayMongo.</p>
            </div>

          <div class="ack-card-simple" :class="{ 'ack-card-simple--danger': isDowngrade }">
            <h6 class="fw-bold mb-2">{{ acknowledgmentTitle }}</h6>
            <p class="small text-muted mb-3">{{ acknowledgmentBody }}</p>
            <label for="planChangeAgreement" class="ack-check-simple">
              <input id="planChangeAgreement" v-model="changeAcknowledged" class="form-check-input mt-1" type="checkbox">
              <span class="small">{{ acknowledgmentLabel }}</span>
            </label>
          </div>

          <button @click="validatedPayment" class="btn btn-primary w-100 mt-4 fw-bold py-3 shadow-sm">
            <i class="bi bi-arrow-left-right me-2"></i>{{ isDowngrade ? "Confirm Monthly Plan Change" : "Confirm Annual Upgrade" }}
          </button>
        </div>

        <div v-else class="qr-stage-simple text-center mx-auto py-2">
          <h4 class="fw-bold text-success mb-2">Scan QR Ph to Continue</h4>
          <p class="text-muted small mb-0">Open GCash, Maya, or any banking app to complete the plan change.</p>

          <div v-if="qrCodeUrl" class="my-4">
            <div class="qr-card-simple d-inline-flex flex-column align-items-center">
              <img :src="qrCodeUrl" alt="QR Ph" class="img-fluid" style="max-width: 240px;">
            </div>
            <p class="status-line mt-3 mb-0">
              <i class="bi bi-clock-history me-1"></i>{{ paymentStatusMessage }}
            </p>
            <div class="d-flex flex-wrap justify-content-center gap-2 mt-3">
              <button @click="downloadQr" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-download me-2"></i>Download QR
              </button>
              <button @click="cancelPayment" class="btn btn-link text-muted btn-sm">
                Cancel & Change Details
              </button>
            </div>
          </div>

          <div v-else class="py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-primary fw-medium">Generating Secure QR Ph...</p>
          </div>
        </div>
      </div>

      <div class="card-footer text-center bg-white py-3 text-muted small">
        <i class="bi bi-lock-fill me-1"></i>Your payment is processed through PayMongo Secure Gateway.
      </div>
    </div>

    <ConfirmModal
      :show="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirm-text="confirmButtonText"
      @confirm="confirmPayment"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script>
import ConfirmModal from "@/components/confirmModal.vue";
import { cancelPendingSubscription, createPlanChangeIntent, getOwnerSubscriptionStatus, getSubscriptionStatus } from "@/api/subscription";
import { useUserInfo } from "@/store/userInfo";
import { downloadQrImage } from "@/utils/qrDownload";
import Swal from "sweetalert2";

const PLAN_CHANGE_PAYMENT_SESSION_KEY = "ownerPlanChangePaymentSession";

export default {
  name: "OwnerPlanChange",
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
      selectedPlan: "annual",
      planPrice: 1800,
      currentSubscription: null,
      baselineSubscription: null,
      paymentStatusMessage: "Waiting for your payment...",
      changeAcknowledged: false,
    };
  },
  computed: {
    currentCycle() {
      return String(this.currentSubscription?.billing_cycle || "").toLowerCase();
    },
    currentPlanName() {
      return this.currentCycle === "monthly" ? "Monthly Standard" : "Annual Pro";
    },
    targetPlanName() {
      return this.selectedPlan === "monthly" ? "Monthly Standard" : "Annual Pro";
    },
    isDowngrade() {
      return this.currentCycle === "annual" && this.selectedPlan === "monthly";
    },
    acknowledgmentTitle() {
      return this.isDowngrade ? "Downgrade acknowledgment" : "Upgrade acknowledgment";
    },
    acknowledgmentBody() {
      return this.isDowngrade
        ? "Your plan will switch to Monthly immediately after successful payment. Existing records will remain stored, but annual-only tools such as tenants, bookings, billing, ledger, and reports will no longer be accessible until you upgrade again."
        : "Your plan will switch to Annual immediately after successful payment. This unlocks the full owner management experience, including bookings, tenants, billing, ledger, and reports.";
    },
    acknowledgmentLabel() {
      return this.isDowngrade
        ? "I understand that changing to Monthly will take effect immediately after payment, stop new bookings on my listings, and remove access to annual-only management tools while keeping my records stored."
        : "I understand that changing to Annual will take effect immediately after payment and unlock bookings, tenants, billing, ledger, and reports access.";
    },
    confirmTitle() {
      return this.isDowngrade ? "Confirm Monthly Downgrade" : "Confirm Annual Upgrade";
    },
    confirmMessage() {
      return this.isDowngrade
        ? "Proceed with changing to Monthly and apply the downgrade immediately after payment?"
        : "Proceed with changing to Annual and unlock the annual features immediately after payment?";
    },
    confirmButtonText() {
      return this.isDowngrade ? "Proceed to Monthly" : "Proceed to Annual";
    },
  },
  async mounted() {
    await this.loadPlanChangeContext();
    await this.restorePendingSession();
  },
  methods: {
    showAlert(options) {
      return Swal.fire({
        confirmButtonText: "Okay",
        ...options,
      });
    },
    async loadPlanChangeContext() {
      const info = useUserInfo();
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      this.name = `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim();
      this.email = userInfo.email || "";

      let subscription = info.subscription || null;
      if (!subscription?.plan_name) {
        subscription = await getOwnerSubscriptionStatus();
        if (subscription) {
          info.setSubscriptionStatus(subscription);
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
        billing_cycle: String(subscription.billing_cycle || "").toLowerCase(),
      };

      const requested = String(this.$route.query.plan || "").toLowerCase();
      const target = requested === "monthly" ? "monthly" : requested === "annual" ? "annual" : "";
      if (!target || target === this.currentCycle || !this.canChangePlan(subscription)) {
        this.$router.replace("/subscription");
        return;
      }

      this.selectedPlan = target;
      this.planPrice = target === "annual" ? 1800 : 200;
    },
    persistPendingSession() {
      if (!this.subscriptionId || !this.qrCodeUrl) return;

      sessionStorage.setItem(
        PLAN_CHANGE_PAYMENT_SESSION_KEY,
        JSON.stringify({
          flow: "plan_change",
          subscriptionId: this.subscriptionId,
          qrCodeUrl: this.qrCodeUrl,
          selectedPlan: this.selectedPlan,
        })
      );
    },
    clearPendingSession() {
      sessionStorage.removeItem(PLAN_CHANGE_PAYMENT_SESSION_KEY);
    },
    async restorePendingSession() {
      const raw = sessionStorage.getItem(PLAN_CHANGE_PAYMENT_SESSION_KEY);
      if (!raw) return;

      let session = null;
      try {
        session = JSON.parse(raw);
      } catch (error) {
        this.clearPendingSession();
        return;
      }

      if (!session?.subscriptionId || session?.flow !== "plan_change") {
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
        const hasChangedPlan = this.hasChangedPlan(ownerSnapshot);

        if (tempStatus === "pending") {
          this.startPolling();
          return;
        }

        if ((tempStatus === "active" || tempStatus === "cancelled") && hasChangedPlan) {
          await this.finishPlanChange(ownerSnapshot);
          return;
        }

        if (tempStatus === "active" || hasChangedPlan) {
          await this.finishPlanChange(ownerSnapshot);
          return;
        }

        if (["failed", "expired", "cancelled"].includes(tempStatus)) {
          this.finishTerminalState(tempStatus, this.getTerminalStatusMessage(tempStatus));
          return;
        }

        this.resetPaymentState();
      } catch (error) {
        console.error("Failed to restore plan change session...", error);
        this.resetPaymentState(false);
      }
    },
    canChangePlan(subscription) {
      if (typeof subscription?.can_change_plan === "boolean") {
        return subscription.can_change_plan;
      }
      const status = String(subscription?.status || "").toLowerCase();
      const days = Number(subscription?.days_left);
      if (status === "expired") return true;
      return status === "active" && Number.isFinite(days) && days <= 7;
    },
    validatedPayment() {
      if (!this.changeAcknowledged) {
        this.showAlert({
          icon: "warning",
          title: "Acknowledgment Required",
          text: `Please acknowledge the ${this.isDowngrade ? "downgrade" : "upgrade"} notice before continuing.`,
        });
        return;
      }

      this.showConfirmModal = true;
    },
    async confirmPayment() {
      this.showConfirmModal = false;
      this.isProcessingPayment = true;

      try {
        const payload = new FormData();
        payload.append("plan", this.selectedPlan === "annual" ? "Annual" : "Monthly");
        payload.append("permit_acknowledged", "1");
        payload.append("change_acknowledged", this.changeAcknowledged ? "1" : "0");

        const response = await createPlanChangeIntent(payload);
        this.qrCodeUrl = response.qr_code;
        this.subscriptionId = response.subscription_id;
        this.paymentStatusMessage = "Waiting for your payment...";
        this.persistPendingSession();
        this.startPolling();
      } catch (error) {
        this.isProcessingPayment = false;
        await this.showAlert({
          icon: "error",
          title: "Payment Gateway Error",
          text: error?.response?.data?.message || "Error connecting to payment gateway. Please check your connection.",
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
          const hasChangedPlan = this.hasChangedPlan(ownerSnapshot);

          if (tempStatus === "failed") {
            this.finishTerminalState(tempStatus, "Plan change payment failed. Please try again.");
            return;
          }

          if (tempStatus === "expired") {
            this.finishTerminalState(tempStatus, "Plan change QR expired. Please generate a new one.");
            return;
          }

          if (tempStatus === "cancelled" && !hasChangedPlan) {
            this.finishTerminalState(tempStatus, "Plan change payment was cancelled. You can start again anytime.");
            return;
          }

          if ((tempStatus === "cancelled" || tempStatus === "active") && hasChangedPlan) {
            this.paymentStatusMessage = "Payment received. Finalizing your plan change...";
            clearInterval(this.checkStatusInterval);
            await this.finishPlanChange(ownerSnapshot);
            return;
          }

          if (hasChangedPlan) {
            this.paymentStatusMessage = "Payment received. Finalizing your plan change...";
            clearInterval(this.checkStatusInterval);
            await this.finishPlanChange(ownerSnapshot);
          }
        } catch (error) {
          console.error("Polling plan change status failed...", error);
        }
      }, 3000);
    },
    hasChangedPlan(snapshot) {
      if (!snapshot) return false;
      const latestStatus = String(snapshot.status || "").toLowerCase();
      const latestCycle = String(snapshot.billing_cycle || "").toLowerCase();
      const latestEndDate = snapshot.end_date ? new Date(snapshot.end_date) : null;
      if (latestStatus !== "active" || latestCycle !== this.selectedPlan) return false;
      return latestEndDate && !Number.isNaN(latestEndDate.getTime()) && latestEndDate.getTime() > Date.now();
    },
    async finishPlanChange(snapshot = null) {
      const latestSubscription = snapshot || (await getOwnerSubscriptionStatus());
      if (latestSubscription) {
        useUserInfo().setSubscriptionStatus(latestSubscription);
      }

      clearInterval(this.checkStatusInterval);
      this.checkStatusInterval = null;
      this.clearPendingSession();
      this.paymentStatusMessage = "Plan change completed successfully.";
      this.bypassLeaveGuard = true;
      await this.showAlert({
        icon: "success",
        title: "Plan Change Complete",
        text: `Plan changed successfully to ${this.targetPlanName}.`,
      });
      this.$router.push("/subscription");
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
        return "Plan change payment failed. Please try again.";
      }
      if (status === "expired") {
        return "Plan change QR expired. Please generate a new one.";
      }
      if (status === "cancelled") {
        return "Plan change payment was cancelled. You can start again anytime.";
      }
      return `Plan change payment ${status}.`;
    },
    finishTerminalState(status, message) {
      this.resetPaymentState();
      const icon = status === "failed" ? "error" : "info";
      this.showAlert({
        icon,
        title: icon === "error" ? "Plan Change Failed" : "Plan Change Updated",
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
          const message = error?.response?.data?.message || "Unable to cancel this plan change right now.";
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
        title: "Plan Change Cancelled",
        text: "Plan change payment was cancelled. You can start again anytime.",
      });
      this.$router.push("/subscription");
    },
    async downloadQr() {
      try {
        await downloadQrImage(this.qrCodeUrl, "renta-hub-plan-change-qr.png");
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
          const message = error?.response?.data?.message || "Unable to cancel this plan change right now.";
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

.checkout-body,
.qr-stage-simple {
  max-width: 720px;
}

.summary-card-simple,
.ack-card-simple,
.payment-card-simple {
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.92);
  padding: 1.15rem 1.2rem;
}

.summary-card-simple {
  display: grid;
  gap: 0.75rem;
  background: rgba(37, 99, 235, 0.05);
  border-color: rgba(37, 99, 235, 0.14);
}

.summary-card-simple--danger {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.18);
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.summary-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.summary-row .label {
  color: #64748b;
  font-size: 0.88rem;
  font-weight: 600;
}

.ack-card-simple {
  margin-top: 1rem;
}

.ack-card-simple--danger {
  border-color: rgba(245, 158, 11, 0.2);
  background: rgba(255, 247, 237, 0.9);
}

.ack-check-simple {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.8rem;
  align-items: flex-start;
}

.payment-card-simple {
  margin-top: 1rem;
}

.qr-card-simple {
  padding: 1rem;
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.status-line {
  color: #b91c1c;
  font-size: 0.9rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .summary-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
