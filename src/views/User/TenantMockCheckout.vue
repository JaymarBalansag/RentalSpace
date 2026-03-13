<template>
  <Header></Header>

  <div class="mock-checkout-page p-3 p-md-4">
    <div class="container-sm">
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-bold mb-0">Mock Checkout</h4>
            <span class="badge bg-primary-subtle text-primary border border-primary-subtle">Test Mode</span>
          </div>

          <div class="alert alert-warning small mb-4">
            This is a mock payment checkout. Real escrow-enabled payments will replace this flow.
          </div>

          <div v-if="!checkoutReady" class="alert alert-warning">
            No payment data found. Please go back to the tenant dashboard and start a payment.
          </div>

          <div v-else>
            <div class="checkout-methods mb-4">
              <div class="method-card" :class="{ active: isMethod('GCash') }">
                <div class="method-title">GCash</div>
                <div class="method-sub">Online payment (mock)</div>
              </div>
              <div class="method-card" :class="{ active: isMethod('Maya') }">
                <div class="method-title">Maya</div>
                <div class="method-sub">Online payment (mock)</div>
              </div>
              <div class="method-card" :class="{ active: isMethod('QRPH') }">
                <div class="method-title">QRPH</div>
                <div class="method-sub">QR payment (mock)</div>
              </div>
            </div>

            <div v-if="isMethod('QRPH')" class="mock-qr mb-4">
              <div class="qr-box">
                <div class="qr-title">QRPH Mock QR</div>
                <div class="qr-placeholder">QR</div>
              </div>
              <div class="small text-muted mt-2">
                Scan this mock QR with your payment app (demo only).
              </div>
            </div>

            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <div class="text-muted small">Payment Type</div>
                <div class="fw-semibold">{{ displayPaymentType }}</div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Payment Method</div>
                <div class="fw-semibold">{{ checkout.payment_method }}</div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Amount</div>
                <div class="fw-semibold">PHP {{ formatAmount(checkout.amount) }}</div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Rent Cycle</div>
                <div class="fw-semibold">{{ checkout.rent_cycle || '-' }}</div>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-2 justify-content-end">
              <button class="btn btn-light px-4" @click="goBack" :disabled="loading">Back</button>
              <button class="btn btn-primary px-4 fw-bold" @click="confirmPayment" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                Confirm Payment
              </button>
            </div>

            <div v-if="success" class="alert alert-success mt-4 mb-0">
              Payment completed. Your billing will update immediately.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import { submitMockTenantPayment } from '@/api/tenants';

export default {
  components: { Header },
  data() {
    return {
      checkout: null,
      loading: false,
      success: false
    };
  },
  computed: {
    checkoutReady() {
      return !!this.checkout;
    },
    displayPaymentType() {
      const map = {
        rent: 'Rent',
        deposit: 'Security Deposit',
        advance: 'Advance Payment (Move-out Notice)'
      };
      return map[this.checkout?.payment_type] || '-';
    }
  },
  mounted() {
    this.loadCheckout();
  },
  methods: {
    loadCheckout() {
      const raw = sessionStorage.getItem("tenantMockCheckout");
      if (!raw) return;
      try {
        this.checkout = JSON.parse(raw);
      } catch (e) {
        this.checkout = null;
      }
    },
    formatAmount(val) {
      return Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });
    },
    isMethod(method) {
      return String(this.checkout?.payment_method || '').toLowerCase() === String(method).toLowerCase();
    },
    goBack() {
      this.$router.push("/tenant/dashboard");
    },
    async confirmPayment() {
      if (!this.checkout) return;
      const actual = Number(this.checkout.amount || 0);
      if (!Number.isFinite(actual) || actual <= 0) {
        alert("Please enter a valid payment amount.");
        return;
      }
      this.loading = true;
      try {
        await submitMockTenantPayment(this.checkout);
        sessionStorage.removeItem("tenantMockCheckout");
        window.location.href = "/tenant/dashboard";
      } catch (err) {
        console.error(err);
        alert(err?.response?.data?.message || "Payment failed. Please try again.");
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.mock-checkout-page .card {
  border-radius: 16px;
}
.checkout-methods {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.method-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  background: #f8fafc;
}
.method-card.active {
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.15);
  background: #eef5ff;
}
.method-title {
  font-weight: 700;
}
.method-sub {
  font-size: 0.8rem;
  color: #6b7280;
}
.mock-qr .qr-box {
  border: 1px dashed #cbd5f5;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  background: #f8fbff;
}
.mock-qr .qr-title {
  font-size: 0.85rem;
  color: #5b6b8c;
  margin-bottom: 8px;
}
.mock-qr .qr-placeholder {
  width: 160px;
  height: 160px;
  border-radius: 8px;
  border: 2px solid #0d6efd;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #0d6efd;
}
@media (max-width: 768px) {
  .checkout-methods {
    grid-template-columns: 1fr;
  }
  .mock-qr .qr-placeholder {
    width: 140px;
    height: 140px;
  }
}
</style>
