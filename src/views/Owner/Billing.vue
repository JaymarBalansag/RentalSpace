<template>
  <div class="billing-page p-3 p-md-4">
    <div class="row align-items-center mb-4 g-3">
      <div class="col-12 col-md-6">
        <h4 class="fw-bold mb-0">💰 Billing</h4>
        <p class="text-muted small mb-0">Track rent payments and balances per property</p>
      </div>

      <div class="col-12 col-md-6 text-md-end">
        <select v-model="selectedProperty" class="form-select w-100 w-md-auto d-inline-block shadow-sm" @change="getBillings(1)">
          <option value="">All Properties</option>
          <option v-for="property in properties" :key="property.id" :value="property.id">
            {{ property.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="d-none d-md-block card border-0 shadow-sm overflow-hidden">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="ps-4 py-3">Tenant</th>
              <th>Property</th>
              <th>Amount Due</th>
              <th>Due Date</th>
              <th>Status</th>
              <th class="text-center px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="billings.length === 0">
              <td colspan="6" class="text-center text-muted py-5">No billing records found</td>
            </tr>
            <tr v-for="bill in billings" :key="bill.id">
              <td class="ps-4 fw-medium">{{ bill.first_name }} {{ bill.last_name }}</td>
              <td>{{ bill.property_name }}</td>
              <td class="fw-bold text-primary">₱{{ formatAmount(bill.rent_amount) }}</td>
              <td>{{ bill.rent_due }}</td>
              <td>
                <span class="badge rounded-pill px-3 py-2" :class="statusBadge(bill.rent_status)">
                  {{ bill.rent_status }}
                </span>
              </td>
              <td class="text-center px-4">
                <button class="btn btn-sm btn-light border shadow-sm" @click="openEditModal(bill)">
                  <i class="bi bi-pencil"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-md-none">
      <div v-if="billings.length === 0" class="text-center py-5 bg-white rounded shadow-sm">
        <p class="text-muted">No billing records found</p>
      </div>
      
      <div v-for="bill in billings" :key="bill.id" class="card border-0 shadow-sm mb-3">
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h6 class="fw-bold mb-0">{{ bill.first_name }} {{ bill.last_name }}</h6>
              <small class="text-muted">{{ bill.property_name }}</small>
            </div>
            <span class="badge rounded-pill px-3" :class="statusBadge(bill.rent_status)">
              {{ bill.rent_status }}
            </span>
          </div>
          
          <div class="row g-0 py-2 border-top border-bottom bg-light mx-n3 px-3">
            <div class="col-6">
              <small class="text-muted d-block">Amount Due</small>
              <span class="fw-bold text-primary">₱{{ formatAmount(bill.rent_amount) }}</span>
            </div>
            <div class="col-6 text-end">
              <small class="text-muted d-block">Due Date</small>
              <span class="small fw-medium">{{ bill.rent_due }}</span>
            </div>
          </div>

          <div class="mt-3">
            <button class="btn btn-outline-primary w-100 fw-bold py-2" @click="openEditModal(bill)">
              <i class="bi bi-pencil me-2"></i> Edit Record
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-4 px-1">
      <button class="btn btn-sm btn-white border shadow-sm px-3 py-2" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        <i class="bi bi-chevron-left"></i> <span class="d-none d-md-inline ms-1">Previous</span>
      </button>
      <span class="text-muted small fw-bold">Page {{ currentPage }} / {{ lastPage }}</span>
      <button class="btn btn-sm btn-white border shadow-sm px-3 py-2" :disabled="currentPage === lastPage" @click="changePage(currentPage + 1)">
        <span class="d-none d-md-inline me-1">Next</span> <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <transition name="fade">
      <div v-if="showUserAgreementModal" class="modal-backdrop-custom px-3">
        <div class="modal-custom shadow-lg border-0 my-auto">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold mb-0">Edit Billing Info</h5>
            <button class="btn-close" @click="closeAgreementModal"></button>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-muted text-uppercase">Tenant</label>
            <input type="text" class="form-control bg-light fw-medium" :value="selectedBill.first_name + ' ' + selectedBill.last_name" readonly />
          </div>

          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label small fw-bold text-muted text-uppercase">Amount</label>
              <div class="input-group shadow-sm rounded">
                <span class="input-group-text border-end-0 bg-white">₱</span>
                <input type="number" class="form-control border-start-0 ps-0 fw-bold" v-model="selectedBill.rent_amount" />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label small fw-bold text-muted text-uppercase">Status</label>
              <select class="form-select shadow-sm" v-model="selectedBill.rent_status">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div class="d-flex flex-column-reverse flex-md-row justify-content-end gap-2 mt-4">
            <button class="btn btn-light px-4 py-2" @click="closeAgreementModal">Cancel</button>
            <button class="btn btn-primary px-4 py-2 fw-bold" @click="updateBilling">Update Record</button>
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