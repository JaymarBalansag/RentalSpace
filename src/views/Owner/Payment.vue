<template>
  <div class="payment-page p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-0">💳 Payment Records</h4>
        <p class="text-muted small">Verify submissions and view transaction history</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary btn-sm" @click="fetchPayments">
          <i class="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm bg-primary text-white">
          <div class="card-body">
            <h6 class="small mb-1">Total Verified (This Month)</h6>
            <h3 class="fw-bold mb-0">₱{{ formatAmount(totalMonthly) }}</h3>
          </div>    
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="ps-3">Date Submitted</th>
              <th>Tenant</th>
              <th>Billing Period</th>
              <th>Method</th>
              <th>Status</th>
              <th>Amount</th>
              <th class="text-end pe-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id">
              <td class="ps-3">
                <div class="fw-medium">{{ formatDate(payment.created_at) }}</div>
                <div class="text-muted extra-small">{{ formatTime(payment.created_at) }}</div>
              </td>
              <td>
                <div class="fw-bold text-dark">{{ payment.first_name }} {{ payment.last_name }}</div>
                <div class="text-muted small">{{ payment.property_title }}</div>
              </td>
              <td>{{ payment.rent_cycle }}</td>
              <td>
                <span class="badge bg-light text-dark border">{{ payment.payment_method }}</span>
                <div class="extra-small text-muted mt-1">{{ payment.payment_reference || 'No Ref#' }}</div>
              </td>
              <td>
                <span :class="['badge rounded-pill px-3', statusClass(payment.status)]">
                  {{ payment.status }}
                </span>
              </td>
              <td class="fw-bold text-dark">₱{{ formatAmount(payment.amount_paid) }}</td>
              <td class="text-end pe-3">
                <button v-if="payment.status === 'pending'" 
                  class="btn btn-sm btn-success me-1" 
                  @click="handleVerify(payment.id)">
                  Verify
                </button>
                
                <button class="btn btn-sm btn-light border" @click="viewProof(payment)">
                  <i class="bi bi-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedProof" class="modal-backdrop-custom" @click="selectedProof = null">
      <div class="modal-custom text-center" @click.stop>
        <h5 class="mb-3 fw-bold">Payment Proof</h5>
        <img :src="selectedProof" class="img-fluid rounded shadow" style="max-height: 70vh;">
        <div class="mt-3">
          <button class="btn btn-secondary" @click="selectedProof = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { getPayments, verifyPayment } from '@/api/owner';
import { getPayments, verifyPayment } from '@/api/Owner/bookings';

export default {
  data() {
    return {
      payments: [],
      totalMonthly: 0,
      selectedProof: null
    };
  },
  mounted() {
    this.fetchPayments();
  },
  methods: {
    async fetchPayments() {
      try {
        const res = await getPayments();
        this.payments = res.data.data;
        // Sum only verified payments
        this.totalMonthly = this.payments
          .filter(p => p.status === 'verified')
          .reduce((acc, curr) => acc + Number(curr.amount_paid), 0);
      } catch (error) {
        console.error("Failed to load payments", error);
      }
    },
    async handleVerify(id) {
      if (!confirm("Confirm this payment? This will update the tenant's bill to PAID.")) return;
      try {
        await verifyPayment(id);
        this.fetchPayments(); // Refresh list
      } catch (error) {
        alert("Verification failed.");
      }
    },
    viewProof(payment) {
      if (!payment.proof) return alert("No image proof provided (Manual Payment).");
      this.selectedProof = payment.proof;
    },
    statusClass(status) {
      if (status === 'pending') return 'bg-warning-subtle text-warning';
      if (status === 'verified') return 'bg-success-subtle text-success';
      return 'bg-secondary-subtle text-secondary';
    },
    formatAmount(val) {
      return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    formatTime(date) {
      return new Date(date).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
    }
  }
};
</script>

<style scoped>
.extra-small { font-size: 0.75rem; }
.modal-backdrop-custom {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 3000;
}
.modal-custom {
  background: white; padding: 20px; border-radius: 12px; max-width: 90%;
}
</style>