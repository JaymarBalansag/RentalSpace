<template>
  <div class="addon-payment-page p-3 p-md-4">
    <div class="mb-4">
      <h4 class="fw-bold text-dark mb-1">Listing Limit Upgrade</h4>
      <p class="text-muted small mb-0">Review your add-on details before proceeding to payment.</p>
    </div>

    <div class="row g-3 g-lg-4">
      <div class="col-12 col-lg-7">
        <div class="card border-0 glass-card">
          <div class="card-body p-4">
            <h6 class="fw-bold mb-3">Add-on Summary</h6>
            <div class="summary-row">
              <span class="label">Extra listings</span>
              <span class="value">{{ qty }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Billing cycle</span>
              <span class="value text-capitalize">{{ cycle }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Unit price</span>
              <span class="value">PHP {{ unitPrice }}</span>
            </div>
            <div class="summary-row total">
              <span class="label">Total</span>
              <span class="value">PHP {{ total }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-5">
        <div class="card border-0 glass-card h-100">
          <div class="card-body p-4 d-flex flex-column">
            <h6 class="fw-bold mb-2">Payment</h6>
            <p class="text-muted small mb-3">
              Scan the QR code to complete your listing limit upgrade.
            </p>

            <div v-if="errorMessage" class="alert alert-danger small">
              {{ errorMessage }}
            </div>

            <div v-if="isLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="small text-muted mt-2">Generating QR code...</p>
            </div>

            <div v-else-if="qrCodeUrl" class="text-center">
              <div class="d-inline-block p-3 border rounded-4 bg-white shadow-sm">
                <img :src="qrCodeUrl" alt="QR Ph" class="img-fluid" style="max-width: 220px;">
              </div>
              <p class="text-danger mt-3 small fw-bold">
                <i class="bi bi-clock-history me-1"></i> Waiting for payment confirmation...
              </p>
            </div>

            <button class="btn btn-light border fw-semibold mt-auto" @click="goBack">
              Back to Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createListingAddonIntent, getListingAddonStatus, getOwnerSubscriptionStatus } from "@/api/subscription";
import { useUserInfo } from "@/store/userInfo";

export default {
  name: "OwnerAddonPayment",
  data() {
    return {
      isLoading: true,
      qrCodeUrl: null,
      addonId: null,
      checkStatusInterval: null,
      errorMessage: "",
    };
  },
  mounted() {
    this.initAddonPayment();
  },
  computed: {
    qty() {
      return Number(this.$route.query.qty || 1);
    },
    cycle() {
      return String(this.$route.query.cycle || "monthly");
    },
    unitPrice() {
      return Number(this.$route.query.unit_price || 0);
    },
    total() {
      return Number(this.$route.query.total || 0);
    },
  },
  methods: {
    async initAddonPayment() {
      try {
        this.isLoading = true;
        const payloadQty = Number(this.$route.query.qty || 1);
        const qty = Number.isFinite(payloadQty) && payloadQty > 0 ? payloadQty : 1;
        const response = await createListingAddonIntent(qty);
        this.qrCodeUrl = response?.qr_code || null;
        this.addonId = response?.addon_id || null;
        this.isLoading = false;
        if (this.addonId) {
          this.startPolling();
        }
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = "Unable to connect to payment gateway. Please try again.";
      }
    },
    startPolling() {
      this.checkStatusInterval = setInterval(async () => {
        try {
          const res = await getListingAddonStatus(this.addonId);
          const status = String(res?.status || "").toLowerCase();
          if (status === "active") {
            clearInterval(this.checkStatusInterval);
            await this.refreshSubscription();
            this.$router.push("/subscription");
          }
          if (status === "failed" || status === "expired") {
            clearInterval(this.checkStatusInterval);
            this.errorMessage = "Payment was not completed. Please try again.";
          }
        } catch (e) {
          console.error("Add-on status polling failed:", e);
        }
      }, 3000);
    },
    async refreshSubscription() {
      try {
        const subscription = await getOwnerSubscriptionStatus();
        const info = useUserInfo();
        info.setSubscriptionStatus(subscription);
      } catch (error) {
        console.warn("Failed to refresh subscription after add-on:", error);
      }
    },
    goBack() {
      this.$router.push("/subscription");
    },
  },
  beforeUnmount() {
    clearInterval(this.checkStatusInterval);
  },
};
</script>

<style scoped>
.addon-payment-page {
  color: #0f172a;
}
.glass-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(14px);
}
.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}
.summary-row.total {
  border-bottom: none;
  padding-top: 1rem;
  font-size: 1.05rem;
}
.summary-row .label {
  color: #64748b;
  font-weight: 600;
}
.summary-row .value {
  font-weight: 700;
}
</style>
