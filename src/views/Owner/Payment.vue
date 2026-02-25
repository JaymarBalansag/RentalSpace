<template>
  <div class="payment-page p-3 p-md-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-0">💳 Payment Records</h4>
        <p class="text-muted small d-none d-md-block">Verify submissions and view transaction history</p>
      </div>
      <button class="btn btn-outline-secondary btn-sm rounded-pill px-3" @click="fetchPayments">
        <i class="bi bi-arrow-clockwise"></i> <span class="d-none d-md-inline">Refresh</span>
      </button>
    </div>

    <div class="row mb-4">
      <div class="col-12 col-md-4">
        <div class="card border-0 shadow-sm bg-primary text-white">
          <div class="card-body p-3">
            <h6 class="small mb-1 opacity-75">Total Verified (This Month)</h6>
            <h3 class="fw-bold mb-0">₱{{ formatAmount(totalMonthly) }}</h3>
          </div>    
        </div>
      </div>
    </div>

    <div class="d-none d-md-block card border-0 shadow-sm overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="ps-3 py-3">Date Submitted</th>
              <th>Tenant</th>
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
              <td>
                <span class="badge bg-light text-dark border">{{ payment.payment_method }}</span>
                <div class="extra-small text-muted mt-1">{{ payment.payment_reference || 'No Ref#' }}</div>
              </td>
              <td>
                <span :class="['badge rounded-pill px-3 py-2', statusClass(payment.status)]">
                  {{ payment.status }}
                </span>
              </td>
              <td class="fw-bold text-dark">₱{{ formatAmount(payment.amount_paid) }}</td>
              <td class="text-end pe-3">
                <div class="d-flex gap-1 justify-content-end">
                  <button v-if="payment.status === 'pending'" 
                    class="btn btn-sm btn-success px-3 fw-bold" 
                    @click="handleVerify(payment.id)">
                    Verify
                  </button>
                  <button v-if="payment.status === 'pending'"
                    class="btn btn-sm btn-outline-danger px-3 fw-bold"
                    @click="handleReject(payment.id)">
                    Reject
                  </button>
                  <button class="btn btn-sm btn-light border" @click="viewProof(payment)">
                    <i class="bi bi-eye"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-md-none">
      <div v-for="payment in payments" :key="payment.id" class="card border-0 shadow-sm mb-3">
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="extra-small text-muted fw-bold text-uppercase">
              <i class="bi bi-calendar3 me-1"></i> {{ formatDate(payment.created_at) }}
            </span>
            <span :class="['badge rounded-pill px-3', statusClass(payment.status)]">
              {{ payment.status }}
            </span>
          </div>

          <div class="mb-3">
            <h6 class="fw-bold mb-0">{{ payment.first_name }} {{ payment.last_name }}</h6>
            <small class="text-muted">{{ payment.property_title }}</small>
          </div>

          <div class="bg-light p-2 rounded mb-3 d-flex justify-content-between align-items-center">
            <div>
              <small class="text-muted d-block extra-small">Amount Paid</small>
              <span class="fw-bold text-dark">₱{{ formatAmount(payment.amount_paid) }}</span>
            </div>
            <div class="text-end">
              <small class="text-muted d-block extra-small">Method</small>
              <span class="badge bg-white border text-dark">{{ payment.payment_method }}</span>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-light border flex-grow-1" @click="viewProof(payment)">
              <i class="bi bi-image me-1"></i> View Proof
            </button>
            <button v-if="payment.status === 'pending'" 
              class="btn btn-success flex-grow-1 fw-bold" 
              @click="handleVerify(payment.id)">
              <i class="bi bi-check-circle me-1"></i> Verify
            </button>
            <button v-if="payment.status === 'pending'"
              class="btn btn-outline-danger flex-grow-1 fw-bold"
              @click="handleReject(payment.id)">
              <i class="bi bi-x-circle me-1"></i> Reject
            </button>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="selectedProof" class="modal-backdrop-custom p-3" @click="selectedProof = null">
        <div class="modal-custom text-center shadow-lg" @click.stop>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0">Payment Proof</h6>
            <button class="btn-close" @click="selectedProof = null"></button>
          </div>
          <div class="proof-container rounded overflow-hidden">
            <img :src="selectedProof" class="img-fluid" style="max-height: 60vh; object-fit: contain;">
          </div>
          <div class="mt-3">
            <button class="btn btn-secondary w-100" @click="selectedProof = null">Close</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import { getPayments, verifyPayment } from '@/api/owner';
import { getPayments, verifyPayment, rejectPayment } from '@/api/Owner/bookings';

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
        alert(error?.response?.data?.message || "Verification failed.");
      }
    },
    async handleReject(id) {
      const reason = prompt("Reason for rejection (optional):", "");
      if (reason === null) return;

      try {
        await rejectPayment(id, { reason: reason.trim() });
        this.fetchPayments();
      } catch (error) {
        alert(error?.response?.data?.message || "Rejection failed.");
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
