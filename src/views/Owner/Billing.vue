<template>
  <div class="billing-page p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-0">💰 Billing</h4>
        <p class="text-muted small">Track rent payments and balances per property</p>
      </div>

      <select v-model="selectedProperty" class="form-select w-auto shadow-sm" @change="getBillings(1)">
        <option value="">All Properties</option>
        <option v-for="property in properties" :key="property.id" :value="property.id">
          {{ property.name }}
        </option>
      </select>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="ps-3">Tenant</th>
              <th>Property</th>
              <th>Amount Due</th>
              <th>Due Date</th>
              <th>Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="billings.length === 0">
              <td colspan="6" class="text-center text-muted py-5">No billing records found</td>
            </tr>

            <tr v-for="bill in billings" :key="bill.id">
              <td class="ps-3 fw-medium">{{ bill.first_name }} {{ bill.last_name }}</td>
              <td>{{ bill.property_name }}</td>
              <td class="fw-bold">₱{{ formatAmount(bill.rent_amount) }}</td>
              <td>{{ bill.rent_due }}</td>
              <td>
                <span class="badge rounded-pill px-3" :class="statusBadge(bill.rent_status)">
                  {{ bill.rent_status }}
                </span>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-light border shadow-sm" @click="openEditModal(bill)">
                  <i class="bi bi-pencil"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-3 px-1">
      <button class="btn btn-sm btn-outline-secondary px-3" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        Previous
      </button>
      <span class="text-muted small">Page {{ currentPage }} of {{ lastPage }}</span>
      <button class="btn btn-sm btn-outline-secondary px-3" :disabled="currentPage === lastPage" @click="changePage(currentPage + 1)">
        Next
      </button>
    </div>

    <transition name="fade">
      <div v-if="showUserAgreementModal" class="modal-backdrop-custom">
        <div class="modal-custom shadow-lg border-0">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">Edit Billing Info</h5>
            <button class="btn-close" @click="closeAgreementModal"></button>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-muted">Tenant Name</label>
            <input type="text" class="form-control bg-light" :value="selectedBill.first_name + ' ' + selectedBill.last_name" readonly />
          </div>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label small fw-bold text-muted">Amount Due</label>
              <div class="input-group">
                <span class="input-group-text border-end-0 bg-white">₱</span>
                <input type="number" class="form-control border-start-0 ps-0" v-model="selectedBill.rent_amount" />
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold text-muted">Rent Status</label>
              <select class="form-select" v-model="selectedBill.rent_status">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2 mt-4">
            <button class="btn btn-outline-secondary px-4" @click="closeAgreementModal">Cancel</button>
            <button class="btn btn-primary px-4 fw-bold" @click="updateBilling">Update Record</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getBillings } from '@/api/billings';

export default {
  name: "BillingPage",
  data() {
    return {
      properties: [],
      billings: [],
      status: "all",
      selectedProperty: "",
      
      // Modal States
      showUserAgreementModal: false,
      selectedBill: null,

      // Pagination
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
    };
  },

  mounted() {
    this.getBillings();
  },

  methods: {
    async getBillings(page = 1) {
      try {
        this.currentPage = page;
        const params = {
          page: this.currentPage,
          per_page: this.perPage,
          status: this.status,
          ...(this.selectedProperty && { property_id: this.selectedProperty })
        };

        const res = await getBillings(params);
        this.billings = res.data.data;
        this.currentPage = res.data.current_page;
        this.lastPage = res.data.last_page;
      } catch (error) {
        console.error("Failed to load billings", error);
      }
    },

    openEditModal(bill) {
      // We clone the bill object so edits don't show up in the table immediately
      this.selectedBill = { ...bill };
      this.showUserAgreementModal = true;
    },

    closeAgreementModal() {
      this.showUserAgreementModal = false;
      this.selectedBill = null;
    },

    async updateBilling() {
      // logic to call your update API goes here
      // e.g., await axios.put(`/billings/${this.selectedBill.id}`, this.selectedBill);
      console.log("Saving changes for:", this.selectedBill);
      this.closeAgreementModal();
      this.getBillings(this.currentPage);
    },

    changePage(page) {
      this.getBillings(page);
    },

    statusBadge(status) {
      const map = {
        paid: "bg-success-subtle text-success border border-success",
        pending: "bg-warning-subtle text-warning border border-warning",
        unpaid: "bg-secondary-subtle text-secondary border border-secondary",
        overdue: "bg-danger-subtle text-danger border border-danger",
      };
      return map[status] || "bg-secondary";
    },

    formatAmount(amount) {
      return Number(amount).toLocaleString();
    },
  },
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
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
}

/* Optional: Smooth fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>