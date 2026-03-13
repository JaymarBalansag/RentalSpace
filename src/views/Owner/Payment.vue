<template>
  <div class="ledger-page p-3 p-md-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-0">Payment Ledger</h4>
        <p class="text-muted small d-none d-md-block">Record manual payments and track collections.</p>
      </div>
      <button class="btn btn-outline-secondary btn-sm rounded-pill px-3" @click="refreshAll">
        <i class="bi bi-arrow-clockwise"></i> <span class="d-none d-md-inline">Refresh</span>
      </button>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-8">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-3">
            <div class="row g-3 align-items-end">
              <div class="col-md-4">
                <label class="form-label small fw-bold text-muted">Property</label>
                <select class="form-select" v-model="filters.property_id">
                  <option value="">All</option>
                  <option v-for="p in properties" :key="p.id" :value="p.id">{{ p.title }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold text-muted">Tenant</label>
                <select class="form-select" v-model="filters.tenant_id">
                  <option value="">All</option>
                  <option v-for="t in tenants" :key="t.id" :value="t.id">{{ t.first_name }} {{ t.last_name }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold text-muted">Payment Type</label>
                <select class="form-select" v-model="filters.payment_type">
                  <option value="">All</option>
                  <option value="rent">Rent</option>
                  <option value="deposit">Security Deposit</option>
                  <option value="advance">Advance Payment</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold text-muted">From</label>
                <input type="date" class="form-control" v-model="filters.date_from" />
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold text-muted">To</label>
                <input type="date" class="form-control" v-model="filters.date_to" />
              </div>
              <div class="col-md-4 d-flex gap-2">
                <button class="btn btn-primary flex-grow-1" @click="fetchLedger">Apply</button>
                <button class="btn btn-light border flex-grow-1" @click="resetFilters">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm bg-primary text-white h-100">
          <div class="card-body p-3">
            <h6 class="small mb-1 opacity-75">Overall Total</h6>
            <h3 class="fw-bold mb-0">PHP {{ formatAmount(totalCollected) }}</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-3">
            <div class="text-muted small">Online Total</div>
            <div class="fw-bold">PHP {{ formatAmount(totalOnline) }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-3">
            <div class="text-muted small">Personal Total</div>
            <div class="fw-bold">PHP {{ formatAmount(totalPersonal) }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-3">
            <div class="text-muted small">Security Deposit Total</div>
            <div class="fw-bold">PHP {{ formatAmount(totalDeposit) }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-3">
            <div class="text-muted small">Advance Payment Total</div>
            <div class="fw-bold">PHP {{ formatAmount(totalAdvance) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-lg-5">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-3">
            <h6 class="fw-bold mb-3">Record Personal Payment</h6>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Property</label>
              <select class="form-select" v-model="entry.property_id" @change="handlePropertyChange">
                <option value="">Select property</option>
                <option v-for="p in properties" :key="p.id" :value="p.id">{{ p.title }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Tenant (Active)</label>
              <select class="form-select" v-model="entry.tenant_id" @change="handleTenantChange" :disabled="!entry.property_id">
                <option value="">Select tenant</option>
                <option v-for="t in ledgerTenants" :key="t.id" :value="t.id">{{ t.first_name }} {{ t.last_name }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Due Item</label>
              <select class="form-select" v-model="entry.due_id" :disabled="!entry.tenant_id">
                <option value="">Select due item</option>
                <option v-for="d in ledgerDues" :key="d.id" :value="d.id">
                  {{ d.label }} - PHP {{ formatAmount(d.amount_due || d.amount) }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Amount</label>
              <div class="input-group">
                <span class="input-group-text bg-light">PHP</span>
                <input type="number" class="form-control" v-model="entry.amount" min="1" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Date</label>
              <input type="date" class="form-control" v-model="entry.paid_at" />
            </div>
            <button class="btn btn-primary w-100 fw-bold" :disabled="submitting" @click="submitEntry">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
              Save Payment
            </button>
          </div>
        </div>
      </div>

      <div class="col-lg-7">
        <div class="card border-0 shadow-sm h-100">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-3 py-3">Date</th>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="payments.length === 0">
                  <td colspan="5" class="text-center text-muted py-4">No ledger entries found.</td>
                </tr>
                <tr v-for="row in payments" :key="row.id">
                  <td class="ps-3">
                    <div class="fw-medium">{{ formatDate(row.paid_at || row.created_at) }}</div>
                  </td>
                  <td>
                    <div class="fw-semibold">{{ row.tenant_name || '-' }}</div>
                  </td>
                  <td>
                    <div class="text-muted">{{ row.property_title || '-' }}</div>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ formatType(row.payment_type) }}</span>
                  </td>
                  <td class="fw-bold">PHP {{ formatAmount(row.amount || row.amount_paid) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOwnerProperties } from '@/api/property';
import { getTenantsList } from '@/api/Owner/tenants';
import { getLedgerPayments, createLedgerPayment, getLedgerTenants, getLedgerDues } from '@/api/Owner/ledger';

export default {
  data() {
    return {
      properties: [],
      tenants: [],
      ledgerTenants: [],
      ledgerDues: [],
      payments: [],
      totalCollected: 0,
      totalDeposit: 0,
      totalAdvance: 0,
      totalOnline: 0,
      totalPersonal: 0,
      submitting: false,
      filters: {
        property_id: '',
        tenant_id: '',
        payment_type: '',
        date_from: '',
        date_to: ''
      },
      entry: {
        tenant_id: '',
        property_id: '',
        due_id: '',
        amount: '',
        paid_at: ''
      }
    };
  },
  mounted() {
    this.refreshAll();
  },
  methods: {
    async refreshAll() {
      await Promise.all([this.fetchProperties(), this.fetchTenants(), this.fetchLedger()]);
    },
    async fetchProperties() {
      try {
        const res = await getOwnerProperties();
        this.properties = res?.data?.data || res?.data?.properties || [];
      } catch (err) {
        console.error("Failed to load properties", err);
      }
    },
    async fetchTenants() {
      try {
        const res = await getTenantsList();
        this.tenants = res?.data?.data || res?.data?.tenants || res?.data || [];
      } catch (err) {
        console.error("Failed to load tenants", err);
      }
    },
    async fetchLedgerTenants(propertyId) {
      if (!propertyId) {
        this.ledgerTenants = [];
        return;
      }
      try {
        const res = await getLedgerTenants({ property_id: propertyId });
        this.ledgerTenants = res?.data?.data || [];
      } catch (err) {
        console.error("Failed to load ledger tenants", err);
      }
    },
    async fetchLedgerDues(tenantId, propertyId) {
      if (!tenantId || !propertyId) {
        this.ledgerDues = [];
        return;
      }
      try {
        const res = await getLedgerDues({ tenant_id: tenantId, property_id: propertyId });
        this.ledgerDues = res?.data?.data || [];
      } catch (err) {
        console.error("Failed to load due items", err);
      }
    },
    async fetchLedger() {
      try {
        const res = await getLedgerPayments(this.filters);
        const rows = res?.data?.data || [];
        this.payments = rows;
        this.totalCollected = rows.reduce((acc, curr) => acc + Number(curr.amount || curr.amount_paid || 0), 0);
        this.totalDeposit = rows.filter(r => r.payment_type === 'deposit')
          .reduce((acc, curr) => acc + Number(curr.amount || curr.amount_paid || 0), 0);
        this.totalAdvance = rows.filter(r => r.payment_type === 'advance')
          .reduce((acc, curr) => acc + Number(curr.amount || curr.amount_paid || 0), 0);
        this.totalOnline = rows.filter(r => String(r.payment_method || '').toLowerCase() === 'online')
          .reduce((acc, curr) => acc + Number(curr.amount || curr.amount_paid || 0), 0);
        this.totalPersonal = rows.filter(r => String(r.payment_method || '').toLowerCase() === 'personal')
          .reduce((acc, curr) => acc + Number(curr.amount || curr.amount_paid || 0), 0);
      } catch (err) {
        console.error("Failed to load ledger", err);
      }
    },
    async submitEntry() {
      if (!this.entry.property_id || !this.entry.tenant_id || !this.entry.due_id) {
        alert("Please select property, tenant, and due item.");
        return;
      }
      const selectedDue = this.ledgerDues.find(d => String(d.id) === String(this.entry.due_id));
      if (!selectedDue) {
        alert("Selected due item is invalid.");
        return;
      }
      const amount = Number(this.entry.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
      this.submitting = true;
      try {
        const payload = {
          tenant_id: this.entry.tenant_id,
          property_id: this.entry.property_id,
          payment_type: selectedDue.type,
          amount: amount,
          billing_id: selectedDue.billing_id || null,
          paid_at: this.entry.paid_at || null
        };
        await createLedgerPayment(payload);
        this.entry.amount = '';
        this.entry.paid_at = '';
        this.entry.due_id = '';
        await this.fetchLedger();
      } catch (err) {
        console.error(err);
        alert(err?.response?.data?.message || "Failed to save payment.");
      } finally {
        this.submitting = false;
      }
    },
    async handlePropertyChange() {
      this.entry.tenant_id = '';
      this.entry.due_id = '';
      this.ledgerDues = [];
      await this.fetchLedgerTenants(this.entry.property_id);
    },
    async handleTenantChange() {
      this.entry.due_id = '';
      await this.fetchLedgerDues(this.entry.tenant_id, this.entry.property_id);
    },
    resetFilters() {
      this.filters = { property_id: '', tenant_id: '', payment_type: '', date_from: '', date_to: '' };
      this.fetchLedger();
    },
    formatAmount(val) {
      return Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });
    },
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    formatType(type) {
      const map = { rent: 'Rent', deposit: 'Security Deposit', advance: 'Advance Payment', manual: 'Manual' };
      return map[type] || type || '-';
    }
  }
};
</script>

<style scoped>
.ledger-page .card {
  border-radius: 16px;
}
</style>
