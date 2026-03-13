<template>
  <div class="billing-page p-3 p-md-4">
    <div class="row align-items-center mb-3 g-3">
      <div class="col-12 col-md-6">
        <h4 class="fw-bold mb-0">Billing Records</h4>
        <p class="text-muted small mb-0">View payment records by tenant, property, and type</p>
      </div>

      <div class="col-12 col-md-6 text-md-end d-flex flex-wrap gap-2 justify-content-md-end">
        <input v-model="tenantSearch" class="form-control w-100 w-md-auto shadow-sm" placeholder="Search tenant" @keyup.enter="getRecords(1)" />
        <select v-model="selectedProperty" class="form-select w-100 w-md-auto d-inline-block shadow-sm" @change="getRecords(1)">
          <option value="">All Properties</option>
          <option v-for="property in properties" :key="property.id" :value="property.id">
            {{ property.title }}
          </option>
        </select>
        <select v-model="selectedType" class="form-select w-100 w-md-auto d-inline-block shadow-sm" @change="getRecords(1)">
          <option value="">All Types</option>
          <option value="rent">Rent</option>
          <option value="deposit">Security Deposit</option>
          <option value="advance">Advance Payment</option>
        </select>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-3">
            <div class="text-muted small">Overall Total</div>
            <div class="fw-bold">PHP {{ formatAmount(totalCollected) }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-3">
            <div class="text-muted small">Online Total</div>
            <div class="fw-bold">PHP {{ formatAmount(totalOnline) }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-3">
            <div class="text-muted small">Personal Total</div>
            <div class="fw-bold">PHP {{ formatAmount(totalPersonal) }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-3">
            <div class="text-muted small">Deposit Total</div>
            <div class="fw-bold">PHP {{ formatAmount(totalDeposit) }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-3">
            <div class="text-muted small">Advance Total</div>
            <div class="fw-bold">PHP {{ formatAmount(totalAdvance) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-3">
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <span class="text-muted small">Quick dates:</span>
          <button class="btn btn-sm btn-light border" @click="setQuickDate('today')">Today</button>
          <button class="btn btn-sm btn-light border" @click="setQuickDate('week')">This Week</button>
          <button class="btn btn-sm btn-light border" @click="setQuickDate('month')">This Month</button>
          <button class="btn btn-sm btn-light border" @click="clearDates">Clear</button>
        </div>
        <div class="row g-3 mt-2">
          <div class="col-md-3">
            <label class="form-label small fw-bold text-muted">From</label>
            <input type="date" class="form-control" v-model="dateFrom" @change="getRecords(1)" />
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-bold text-muted">To</label>
            <input type="date" class="form-control" v-model="dateTo" @change="getRecords(1)" />
          </div>
          <div class="col-md-3 d-flex align-items-end">
            <button class="btn btn-primary w-100" @click="getRecords(1)">Apply</button>
          </div>
        </div>
      </div>
    </div>

    <div class="d-none d-md-block card border-0 shadow-sm overflow-hidden">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="ps-4 py-3">Tenant</th>
              <th>Property</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="records.length === 0">
              <td colspan="7" class="text-center text-muted py-5">No payment records found</td>
            </tr>
            <tr v-for="row in records" :key="row.id">
              <td class="ps-4 fw-medium">{{ row.tenant_name }}</td>
              <td>{{ row.property_title }}</td>
              <td><span class="badge bg-light text-dark border">{{ formatType(row.payment_type) }}</span></td>
              <td class="fw-bold text-primary">PHP {{ formatAmount(row.amount || row.amount_paid) }}</td>
              <td>{{ formatDate(row.date_paid || row.created_at) }}</td>
              <td><span class="badge bg-light text-dark border">{{ formatMethod(row.payment_method) }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-md-none">
      <div v-if="records.length === 0" class="text-center py-5 bg-white rounded shadow-sm">
        <p class="text-muted">No payment records found</p>
      </div>

      <div v-for="row in records" :key="row.id" class="card border-0 shadow-sm mb-3">
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h6 class="fw-bold mb-0">{{ row.tenant_name }}</h6>
              <small class="text-muted">{{ row.property_title }}</small>
            </div>
            <span class="badge rounded-pill px-3 bg-light text-dark border">{{ formatType(row.payment_type) }}</span>
          </div>

          <div class="row g-0 py-2 border-top border-bottom bg-light mx-n3 px-3">
            <div class="col-6">
              <small class="text-muted d-block">Amount</small>
              <span class="fw-bold text-primary">PHP {{ formatAmount(row.amount || row.amount_paid) }}</span>
            </div>
            <div class="col-6 text-end">
              <small class="text-muted d-block">Date</small>
              <span class="small fw-medium">{{ formatDate(row.date_paid || row.created_at) }}</span>
            </div>
          </div>
          <div class="mt-2">
            <span class="badge bg-light text-dark border">{{ formatMethod(row.payment_method) }}</span>
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
import { getLedgerPayments } from '@/api/Owner/ledger';
import { getOwnerProperties } from '@/api/property';

export default {
  name: "BillingPage",
  data() {
    return {
      properties: [],
      records: [],
      tenantSearch: "",
      selectedProperty: "",
      selectedType: "",
      dateFrom: "",
      dateTo: "",
      totalCollected: 0,
      totalOnline: 0,
      totalPersonal: 0,
      totalDeposit: 0,
      totalAdvance: 0,
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
    };
  },

  async mounted() {
    await Promise.all([this.getRecords(), this.getOwnerProperties()]);
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
    async getRecords(page = 1) {
      try {
        this.currentPage = page;
        const params = {
          page: this.currentPage,
          per_page: this.perPage,
          ...(this.selectedProperty && { property_id: this.selectedProperty }),
          ...(this.selectedType && { payment_type: this.selectedType }),
          ...(this.tenantSearch && { tenant_search: this.tenantSearch }),
          ...(this.dateFrom && { date_from: this.dateFrom }),
          ...(this.dateTo && { date_to: this.dateTo })
        };

        const res = await getLedgerPayments(params);
        const rows = res?.data?.data || [];
        this.records = rows;
        this.totalCollected = rows.reduce((acc, curr) => acc + Number(curr.amount || curr.amount_paid || 0), 0);
        this.totalOnline = rows.filter(r => String(r.payment_method || '').toLowerCase() === 'online')
          .reduce((acc, curr) => acc + Number(curr.amount || curr.amount_paid || 0), 0);
        this.totalPersonal = rows.filter(r => String(r.payment_method || '').toLowerCase() === 'personal')
          .reduce((acc, curr) => acc + Number(curr.amount || curr.amount_paid || 0), 0);
        this.totalDeposit = rows.filter(r => r.payment_type === 'deposit')
          .reduce((acc, curr) => acc + Number(curr.amount || curr.amount_paid || 0), 0);
        this.totalAdvance = rows.filter(r => r.payment_type === 'advance')
          .reduce((acc, curr) => acc + Number(curr.amount || curr.amount_paid || 0), 0);
        this.currentPage = 1;
        this.lastPage = 1;
      } catch (error) {
        console.error("Failed to load billing records", error);
      }
    },

    changePage(page) {
      this.getRecords(page);
    },

    formatAmount(amount) {
      return Number(amount || 0).toLocaleString();
    },
    formatType(type) {
      const map = { rent: 'Rent', deposit: 'Security Deposit', advance: 'Advance Payment', manual: 'Manual' };
      return map[type] || type || '-';
    },
    formatMethod(method) {
      if (!method) return '-';
      return method;
    },
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    setQuickDate(type) {
      const today = new Date();
      if (type === 'today') {
        const iso = today.toISOString().slice(0, 10);
        this.dateFrom = iso;
        this.dateTo = iso;
      } else if (type === 'week') {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const start = new Date(today);
        start.setDate(diff);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        this.dateFrom = start.toISOString().slice(0, 10);
        this.dateTo = end.toISOString().slice(0, 10);
      } else if (type === 'month') {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.dateFrom = start.toISOString().slice(0, 10);
        this.dateTo = end.toISOString().slice(0, 10);
      }
      this.getRecords(1);
    },
    clearDates() {
      this.dateFrom = "";
      this.dateTo = "";
      this.getRecords(1);
    },
  },
};
</script>
