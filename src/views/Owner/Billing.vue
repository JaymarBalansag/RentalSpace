<template>
  <div class="billing-page p-3 p-md-4">
    <div class="row align-items-center mb-4 g-3">
      <div class="col-12 col-md-6">
        <h4 class="fw-bold mb-0">Billing</h4>
        <p class="text-muted small mb-0">Track rent payments and balances per property</p>
      </div>

      <div class="col-12 col-md-6 text-md-end">
        <select v-model="selectedProperty" class="form-select w-100 w-md-auto d-inline-block shadow-sm" @change="getBillings(1)">
          <option value="">All Properties</option>
          <option v-for="property in properties" :key="property.id" :value="property.id">
            {{ property.title }}
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
            </tr>
          </thead>
          <tbody>
            <tr v-if="billings.length === 0">
              <td colspan="5" class="text-center text-muted py-5">No billing records found</td>
            </tr>
            <tr v-for="bill in billings" :key="bill.id">
              <td class="ps-4 fw-medium">{{ bill.first_name }} {{ bill.last_name }}</td>
              <td>{{ bill.property_name }}</td>
              <td class="fw-bold text-primary">PHP {{ formatAmount(bill.rent_amount) }}</td>
              <td>{{ bill.rent_due }}</td>
              <td>
                <span class="badge rounded-pill px-3 py-2" :class="statusBadge(bill.rent_status)">
                  {{ bill.rent_status }}
                </span>
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
              <span class="fw-bold text-primary">PHP {{ formatAmount(bill.rent_amount) }}</span>
            </div>
            <div class="col-6 text-end">
              <small class="text-muted d-block">Due Date</small>
              <span class="small fw-medium">{{ bill.rent_due }}</span>
            </div>
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
  </div>
</template>

<script>
import { getBillings } from '@/api/billings';
import { getOwnerProperties } from '@/api/property';

export default {
  name: "BillingPage",
  data() {
    return {
      properties: [],
      billings: [],
      status: "all",
      selectedProperty: "",
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
    };
  },

  async mounted() {
    await Promise.all([this.getBillings(), this.getOwnerProperties()]);
  },

  methods: {
    async getOwnerProperties() {
      try {
        const res = await getOwnerProperties();
        this.properties = res?.data?.properties || [];
      } catch (error) {
        this.properties = [];
        console.error("Failed to load owner properties", error);
      }
    },
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
        this.billings = res?.data?.data || [];
        this.currentPage = res?.data?.current_page || 1;
        this.lastPage = res?.data?.last_page || 1;
      } catch (error) {
        console.error("Failed to load billings", error);
      }
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
      return Number(amount || 0).toLocaleString();
    },
  },
};
</script>
