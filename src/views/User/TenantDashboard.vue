<template>
  <Header></Header>

  <div class="tenant-dashboard p-3 p-md-4">
    <div class="row mb-4 align-items-center">
      <div class="col">
        <h4 class="fw-bold mb-0">Kumusta, {{ tenantName }}! 👋</h4>
        <p class="text-muted small">Here is your rent summary for {{ currentMonth }}.</p>
      </div>
      <div class="col-auto">
        <span class="badge bg-success-subtle text-success border border-success px-3 py-2">
          Status: ACTIVE
        </span>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-6 col-lg-4">
        <div class="card border-0 shadow-sm bg-primary text-white h-100">
          <div class="card-body">
            <h6 class="small opacity-75">Outstanding Balance</h6>
            <h2 class="fw-bold">₱{{ formatAmount(totalBalance) }}</h2>
            <button 
              class="btn btn-light btn-sm w-100 mt-2 fw-bold" 
              :disabled="totalBalance <= 0"
              @click="openPaymentModal"
            >
              <i class="bi bi-credit-card me-2"></i> Pay Now
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-8">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body d-flex align-items-center">
            <div class="flex-shrink-0 bg-light p-3 rounded text-primary">
              <i class="bi bi-house-door fs-3"></i>
            </div>
            <div class="ms-3">
              <h6 class="mb-0 fw-bold">{{ propertyTitle }}</h6>
              <p class="text-muted small mb-0">{{ propertyAddress }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPaymentModal" class="modal-backdrop-custom">
      <div class="modal-custom shadow-lg border-0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Submit Payment Proof</h5>
          <button class="btn-close" @click="closePaymentModal"></button>
        </div>

        <div class="alert alert-primary py-2 small border-0">
          <i class="bi bi-info-circle me-2"></i>
          Please upload your GCash or Bank Transfer receipt.
        </div>

        <div class="mb-3">
          <label class="form-label small fw-bold text-muted">Select Bill to Pay</label>
          <select class="form-select" v-model="paymentForm.billing_id">
            <option v-for="bill in unpaidBillings" :key="bill.id" :value="bill.id">
              {{ toTitle(bill.rent_cycle) }} Rent - ₱{{ formatAmount(bill.rent_amount) }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-bold text-muted">Payment Method</label>
          <select class="form-select" v-model="paymentForm.payment_method">
            <option value="GCash">GCash</option>
            <option value="Maya">Maya</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other Online Payment</option>
          </select>
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label small fw-bold text-muted">Amount Paid</label>
            <div class="input-group">
              <span class="input-group-text bg-light">₱</span>
              <input type="number" class="form-control" v-model="paymentForm.amount_paid" />
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold text-muted">Reference No.</label>
            <input type="text" class="form-control" v-model="paymentForm.payment_reference" placeholder="Ref #" />
          </div>
        </div>

        <div class="mt-3">
          <label class="form-label small fw-bold text-muted">Proof of Payment (Image)</label>
          <input type="file" class="form-control" @change="handleFileUpload" accept="image/*" />
        </div>

        <div class="mt-3">
          <label class="form-label small fw-bold text-muted">Remarks (Optional)</label>
          <textarea class="form-control" rows="2" v-model="paymentForm.remarks" placeholder="Notes for the owner..."></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-light px-4" @click="closePaymentModal">Cancel</button>
          <button class="btn btn-primary px-4 fw-bold" @click="submitPayment" :disabled="loading || !paymentForm.billing_id">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            Submit Payment
          </button>
        </div>
      </div>
    </div>

    <h6 class="fw-bold mb-3">Billing History</h6>
    <div class="card border-0 shadow-sm">
      <div class="list-group list-group-flush">
        <div v-if="billings.length === 0" class="p-5 text-center text-muted">
          No billing records yet.
        </div>
        
        <div 
          v-for="bill in billings" 
          :key="bill.id" 
          class="list-group-item p-3 border-0 border-bottom d-flex justify-content-between align-items-center"
        >
          <div>
            <p class="mb-0 fw-bold">{{ bill.rent_cycle }} Rent</p>
            <small class="text-muted">Due Date: {{ bill.rent_due }}</small>
          </div>
          <div class="text-end">
            <p class="mb-0 fw-bold" :class="bill.rent_status === 'unpaid' ? 'text-danger' : 'text-dark'">
              ₱{{ formatAmount(bill.rent_amount) }}
            </p>
            <span :class="['badge rounded-pill px-3', statusBadge(bill.rent_status)]">
              {{ bill.rent_status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMyBillings, submitPaymentRecords } from '@/api/tenants';
import Header from '@/components/Header.vue';

export default {
  components: { Header },
  data() {
    return {
      tenantName: 'Juan Dela Cruz',
      propertyTitle: 'Unit 402 - Seaside Apartments',
      propertyAddress: '123 Coastal Road, Pasay City',
      billings: [],
      totalBalance: 0,
      currentMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      
      // Modal State
      showPaymentModal: false,
      loading: false,
      paymentForm: {
        billing_id: '',
        payment_method: 'GCash',
        amount_paid: '',
        payment_reference: '',
        proof: null,
        remarks: ''
      }
    };
  },
  computed: {
    unpaidBillings() {
      return this.billings.filter(b => ['unpaid', 'overdue'].includes(String(b.rent_status || '').toLowerCase()));
    },
    selectedBilling() {
      return this.billings.find(b => String(b.id) === String(this.paymentForm.billing_id)) || null;
    }
  },
  mounted() {
    this.fetchMyData();
  },
  methods: {
    toTitle(text){
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : "asd";
    },
    async fetchMyData() {
      try {
        const res = await getMyBillings();
        this.billings = res.data.data;

        const local = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const fullName = [local.first_name, local.last_name].filter(Boolean).join(" ").trim();
        if (fullName) this.tenantName = fullName;
        if (this.billings.length > 0) {
          this.propertyTitle = this.billings[0].property_title || this.propertyTitle;
          this.propertyAddress = "Address unavailable";
        }

        this.totalBalance = this.billings
          .filter(b => ['unpaid', 'overdue'].includes(String(b.rent_status || '').toLowerCase()))
          .reduce((acc, curr) => acc + Number(curr.rent_amount), 0);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    },
    openPaymentModal() {
      if (this.unpaidBillings.length > 0) {
        this.paymentForm.billing_id = this.unpaidBillings[0].id;
        this.paymentForm.amount_paid = this.unpaidBillings[0].rent_amount;
      } else {
        alert("No unpaid billing is available for payment.");
        return;
      }
      this.showPaymentModal = true;
    },
    closePaymentModal() {
      this.showPaymentModal = false;
      this.resetForm();
    },
    resetForm() {
      this.paymentForm = { 
        billing_id: '', 
        payment_method: 'GCash', 
        amount_paid: '', 
        payment_reference: '', 
        proof: null, 
        remarks: '' 
      };
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        this.paymentForm.proof = null;
        return;
      }

      const allowed = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowed.includes(file.type)) {
        alert("Only JPG and PNG files are allowed.");
        event.target.value = "";
        this.paymentForm.proof = null;
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Proof image must be 5MB or less.");
        event.target.value = "";
        this.paymentForm.proof = null;
        return;
      }

      this.paymentForm.proof = file;
    },
    async submitPayment() {
      if (!this.paymentForm.billing_id) {
        alert("Please select a billing to pay.");
        return;
      }

      if (!this.selectedBilling) {
        alert("Selected billing is invalid.");
        return;
      }

      if (!this.paymentForm.proof) {
        alert("Please upload proof of payment.");
        return;
      }

      const submittedAmount = Number(this.paymentForm.amount_paid);
      const expectedAmount = Number(this.selectedBilling.rent_amount);
      if (!Number.isFinite(submittedAmount) || submittedAmount <= 0) {
        alert("Please enter a valid payment amount.");
        return;
      }

      if (submittedAmount !== expectedAmount) {
        alert(`Amount must exactly match the billing amount of ₱${this.formatAmount(expectedAmount)}.`);
        return;
      }

      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('billing_id', this.paymentForm.billing_id);
        formData.append('payment_method', this.paymentForm.payment_method);
        formData.append('amount_paid', this.paymentForm.amount_paid);
        formData.append('payment_reference', this.paymentForm.payment_reference);
        formData.append('proof', this.paymentForm.proof);
        formData.append('remarks', this.paymentForm.remarks);

        await submitPaymentRecords(formData);
        
        alert("Payment submitted successfully! The owner will verify your proof.");
        this.closePaymentModal();
        this.fetchMyData();
      } catch (err) {
        console.error(err);
        alert("Error submitting payment. Please check your connection.");
      } finally {
        this.loading = false;
      }
    },
    statusBadge(status) {
      const map = {
        paid: "bg-success-subtle text-success",
        unpaid: "bg-danger-subtle text-danger",
        pending: "bg-warning-subtle text-warning",
        overdue: "bg-dark text-white"
      };
      return map[status] || "bg-secondary";
    },
    formatAmount(val) {
      return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 });
    }
  }
  ,
  watch: {
    'paymentForm.billing_id'(nextId) {
      const selected = this.billings.find(b => String(b.id) === String(nextId));
      if (selected) {
        this.paymentForm.amount_paid = selected.rent_amount;
      }
    }
  }
};
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-custom {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 95%;
  max-width: 500px;
}
</style>
