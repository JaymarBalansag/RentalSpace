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
            <p class="text-muted small mb-4">
              Payment setup will be enabled once the backend is connected.
            </p>
            <button class="btn btn-primary fw-semibold mt-auto" disabled>
              Proceed to Payment (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OwnerAddonPayment",
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
