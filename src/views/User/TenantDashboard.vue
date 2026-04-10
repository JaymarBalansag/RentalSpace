<template>
  <Header></Header>

  <div class="tenant-dashboard p-3 p-md-4">
    <div v-if="tenantLoadError" class="alert alert-warning small mb-3">
      {{ tenantLoadError }}
    </div>
    <div class="row mb-4 align-items-center">
      <div class="col">
        <h4 class="fw-bold mb-0">Hello, {{ tenantName }}!</h4>
        <p class="text-muted small">Here is your billing and payment summary for {{ currentMonth }}.</p>
      </div>
      <div class="col-auto">
        <div class="d-flex align-items-center gap-2">
          <span class="badge px-3 py-2" :class="tenantStatusClass">
            Status: {{ tenantStatusLabel }}
          </span>
          <button
            v-if="isActiveTenant"
            class="btn btn-outline-primary btn-sm fw-semibold"
            @click="showMoveOutModal = true"
          >
            Notify Move-Out
          </button>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm bg-primary text-white h-100">
          <div class="card-body">
            <h6 class="small opacity-75">Total Paid</h6>
            <h2 class="fw-bold">PHP {{ formatAmount(totalPaid) }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h6 class="small text-muted">Remaining Due</h6>
            <h2 class="fw-bold">PHP {{ formatAmount(remainingDue) }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h6 class="small text-muted">Next Due Date</h6>
            <h2 class="fw-bold">{{ nextDueDate || '-' }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body d-flex align-items-center">
            <div class="flex-shrink-0 bg-light p-2 rounded text-primary">
              <i class="bi bi-house-door"></i>
            </div>
            <div class="ms-3">
              <div class="small text-muted">Active Property</div>
              <div class="fw-semibold">{{ propertyTitle }}</div>
              <div class="small text-muted">{{ propertyType }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ul class="nav nav-pills gap-2 mb-3">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'billings' }" @click="activeTab = 'billings'">
          Billings
        </button>
      </li>
      <li class="nav-item" v-if="showPaymentsTab">
        <button class="nav-link" :class="{ active: activeTab === 'payments' }" @click="activeTab = 'payments'">
          Payments
        </button>
      </li>
      <li class="nav-item" v-if="isActiveTenant">
        <button class="nav-link" :class="{ active: activeTab === 'moveout' }" @click="activeTab = 'moveout'">
          Move-Out Notices
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'">
          Past Tenancies
        </button>
      </li>
    </ul>

    <div v-if="activeTab === 'billings'">
      <div class="card border-0 shadow-sm">
        <div class="card-body border-bottom">
          <div class="row g-2 align-items-end">
            <div class="col-md-4">
              <label class="form-label small fw-bold text-muted">Type</label>
              <select class="form-select" v-model="billingTypeFilter">
                <option value="">All</option>
                <option value="rent">Rent</option>
                <option value="deposit">Security Deposit</option>
                <option value="advance">Advance Payment</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold text-muted">From</label>
              <input type="date" class="form-control" v-model="billingDateFrom" />
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold text-muted">To</label>
              <input type="date" class="form-control" v-model="billingDateTo" />
            </div>
          </div>
        </div>
        <div class="list-group list-group-flush">
          <div v-if="!isActiveTenant" class="p-5 text-center text-muted">
            No active tenancy right now. Your past payments are available in Past Tenancies.
          </div>
          <div v-else-if="filteredPaidRecords.length === 0" class="p-5 text-center text-muted">
            No payment records yet.
          </div>
          <div
            v-for="record in filteredPaidRecords"
            :key="record.id"
            class="list-group-item p-3 border-0 border-bottom d-flex justify-content-between align-items-center"
          >
            <div>
              <p class="mb-0 fw-bold">{{ record.label }}</p>
              <small class="text-muted">Date: {{ record.date || '-' }}</small>
            </div>
            <div class="text-end">
              <p class="mb-0 fw-bold text-primary">PHP {{ formatAmount(record.amount) }}</p>
              <span class="badge rounded-pill px-3 bg-success-subtle text-success">paid</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'payments' && showPaymentsTab">
      <div v-if="payableItems.length === 0" class="p-5 text-center text-muted">
        No payment due right now.
      </div>
      <div class="row g-3">
        <div v-for="item in payableItems" :key="item.id" class="col-12 col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="mb-1 fw-bold">{{ item.label }}</p>
                  <small class="text-muted">Due Date: {{ item.due || '-' }}</small>
                </div>
                <span :class="['badge rounded-pill px-3', statusBadge(item.rent_status)]">
                  {{ item.rent_status }}
                </span>
              </div>
              <div class="mt-3 d-flex justify-content-between align-items-center">
                <div class="fw-bold text-primary">PHP {{ formatAmount(item.amount_due || item.amount) }}</div>
                <button class="btn btn-primary btn-sm fw-bold" @click="openPaymentModal(item)">
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'moveout'">
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div v-if="moveOutNoticesError" class="text-center py-5 text-muted">
            {{ moveOutNoticesError }}
          </div>
          <div v-else-if="moveOutNotices.length === 0" class="text-center py-5 text-muted">
            No notices yet.
          </div>
          <div v-else class="list-group list-group-flush">
            <div v-for="notice in moveOutNotices" :key="notice.id" class="list-group-item border-0 border-bottom">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold">Move-Out Notice</div>
                  <small class="text-muted">Submitted: {{ formatDate(notice.created_at) }}</small>
                </div>
                <span class="badge rounded-pill" :class="noticeStatusClass(notice.status)">
                  {{ (notice.status || 'pending').toUpperCase() }}
                </span>
              </div>
              <p class="mb-0 small text-muted mt-2">{{ notice.message || 'Awaiting owner response.' }}</p>
              <small v-if="notice.requested_move_out_date" class="text-muted">
                Requested Move-Out: {{ formatDate(notice.requested_move_out_date) }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'history'">
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div v-if="pastTenancies.length === 0" class="text-center py-5 text-muted">
            No past tenancies yet.
          </div>
          <div v-else class="list-group list-group-flush">
            <div v-for="tenancy in pastTenancies" :key="tenancy.id" class="list-group-item border-0 border-bottom">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold">{{ tenancy.property_title }}</div>
                  <small class="text-muted">{{ tenancy.property_type || '-' }}</small>
                </div>
                <div class="text-end">
                  <span class="badge rounded-pill" :class="tenancyStatusBadge(tenancy.status)">
                    {{ String(tenancy.status || '').toUpperCase() }}
                  </span>
                  <button class="btn btn-link btn-sm fw-semibold d-block mt-2 p-0" @click="openPastBillings(tenancy)">
                    View Billings
                  </button>
                </div>
              </div>
              <div class="small text-muted mt-2">
                Move-in: {{ formatDate(tenancy.move_in_date) }} - Ended: {{ formatDate(tenancy.ended_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPaymentModal" class="modal-backdrop-custom">
      <div class="modal-custom shadow-lg border-0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Online Payment</h5>
          <button class="btn-close" @click="closePaymentModal"></button>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-bold text-muted">Selected Item</label>
          <div class="border rounded p-2 bg-light small">
            {{ selectedPaymentLabel }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-bold text-muted">Payment Type</label>
          <input type="text" class="form-control" :value="paymentTypeLabel" disabled />
        </div>

        <div class="mb-3">
          <label class="form-label small fw-bold text-muted">Payment Method</label>
          <select class="form-select" v-model="paymentForm.payment_method">
            <option value="GCash">GCash</option>
            <option value="Maya">Maya</option>
            <option value="QRPH">QRPH</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label small fw-bold text-muted">Amount</label>
          <div class="input-group">
            <span class="input-group-text bg-light">PHP</span>
            <input type="number" class="form-control" v-model="paymentForm.amount" min="1" />
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-light px-4" @click="closePaymentModal">Cancel</button>
          <button class="btn btn-primary px-4 fw-bold" @click="proceedToCheckout" :disabled="loading || !paymentForm.billing_id">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            Continue to Checkout
          </button>
        </div>
      </div>
    </div>

    <div v-if="showMoveOutModal" class="modal-backdrop-custom">
      <div class="modal-custom shadow-lg border-0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Notify Move-Out</h5>
          <button class="btn-close" @click="showMoveOutModal = false"></button>
        </div>
        <p class="text-muted small">
          This will notify your owner that you intend to move out. You can cancel if you are not ready yet.
        </p>
        <div class="mb-3">
          <label class="form-label small fw-bold text-muted">Requested Move-Out Date</label>
          <input type="date" class="form-control" v-model="moveOutForm.requested_move_out_date">
        </div>
        <div class="mb-3">
          <label class="form-label small fw-bold text-muted">Message (Optional)</label>
          <textarea class="form-control" rows="3" v-model="moveOutForm.message" placeholder="Share any details with your owner..."></textarea>
        </div>
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-light px-4" @click="showMoveOutModal = false">Cancel</button>
          <button class="btn btn-primary px-4 fw-bold" @click="confirmMoveOut" :disabled="sendingMoveOut">
            <span v-if="sendingMoveOut" class="spinner-border spinner-border-sm me-2"></span>
            Send Notice
          </button>
        </div>
      </div>
    </div>

    <div v-if="showPastBillingModal" class="modal-backdrop-custom">
      <div class="modal-custom shadow-lg border-0" style="max-width: 650px;">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Past Billings</h5>
          <button class="btn-close" @click="closePastBillings"></button>
        </div>
        <div v-if="pastBillingTenant" class="small text-muted mb-3">
          {{ pastBillingTenant.property_title }} · {{ pastBillingTenant.property_type || '-' }}
        </div>
        <div v-if="pastBillingLoading" class="py-5 text-center text-muted">
          Loading billings...
        </div>
        <div v-else-if="pastBillingError" class="py-5 text-center text-muted">
          {{ pastBillingError }}
        </div>
        <div v-else-if="pastBillingRecords.length === 0" class="py-5 text-center text-muted">
          No billings found for this tenancy.
        </div>
        <div v-else class="list-group list-group-flush">
          <div v-for="bill in pastBillingRecords" :key="bill.id" class="list-group-item border-0 border-bottom">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="fw-bold">{{ bill.rent_cycle }} Rent</div>
                <small class="text-muted">Due: {{ bill.rent_due || '-' }}</small>
              </div>
              <div class="text-end">
                <div class="fw-bold text-primary">PHP {{ formatAmount(bill.rent_amount) }}</div>
                <span class="badge rounded-pill" :class="statusBadge(bill.rent_status)">
                  {{ bill.rent_status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTenantDashboard, getTenantMoveOutNotices, submitMoveOutNotice, getTenantBillingsById } from '@/api/tenants';
import Header from '@/components/Header.vue';
import { useUserInfo } from '@/store/userInfo';

export default {
  components: { Header },
  data() {
    return {
      tenantName: 'Tenant',
      propertyTitle: 'Property',
      propertyType: 'Property type',
      propertyAddress: 'Address unavailable',
      propertyId: '',
      currentTenantId: null,
      billings: [],
      tenantStatus: 'inactive',
      moveInDate: null,
      depositRequired: 0,
      advancePaymentMonths: 0,
      depositPaidAmount: 0,
      advancePaidAmount: 0,
      totalPaid: 0,
      currentMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      activeTab: 'billings',
      showPaymentModal: false,
      loading: false,
      dueItems: [],
      dueItemsLoaded: false,
      selectedPaymentItem: null,
      billingTypeFilter: "",
      billingDateFrom: "",
      billingDateTo: "",
      moveOutNotices: [],
      tenancyHistory: [],
      showMoveOutModal: false,
      showPastBillingModal: false,
      pastBillingTenant: null,
      pastBillingRecords: [],
      pastBillingLoading: false,
      pastBillingError: "",
      sendingMoveOut: false,
      tenantLoadError: "",
      moveOutNoticesError: "",
      moveOutForm: {
        requested_move_out_date: "",
        message: ""
      },
      paymentForm: {
        billing_id: '',
        property_id: '',
        payment_method: 'Online',
        payment_type: 'rent',
        amount: ''
      }
    };
  },
  computed: {
    selectedBilling() {
      return this.billings.find(b => String(b.id) === String(this.paymentForm.billing_id)) || null;
    },
    selectedPaymentLabel() {
      if (!this.selectedPaymentItem) return 'No item selected';
      return `${this.selectedPaymentItem.label} - PHP ${this.formatAmount(this.selectedPaymentItem.amount)}`;
    },
    paymentTypeLabel() {
      const type = this.paymentForm.payment_type;
      if (type === 'rent') return 'Rent';
      if (type === 'deposit') return 'Security Deposit';
      if (type === 'advance') return 'Advance Payment (Move-out Notice)';
      return '-';
    },
    paidBillings() {
      if (!this.isActiveTenant) return [];
      return this.billings.filter(b => String(b.rent_status || '').toLowerCase() === 'paid');
    },
    dueBillings() {
      if (!this.isActiveTenant) return [];
      return this.billings.filter(b => ['unpaid', 'overdue', 'pending'].includes(String(b.rent_status || '').toLowerCase()));
    },
    payableItems() {
      const serverItems = Array.isArray(this.dueItems) ? this.dueItems : [];
      if (this.dueItemsLoaded) return serverItems;

      const items = this.dueBillings.map((bill) => ({
        type: "billing",
        id: bill.id,
        label: `${bill.rent_cycle} Rent`,
        amount: Number(bill.rent_amount || 0),
        due: bill.rent_due,
        rent_status: bill.rent_status,
        billing: bill,
      }));

      const depositValue = Number(this.depositRequired || 0);
      const advanceAmount = Number(this.advancePaymentMonths || 0);

      if (depositValue > 0) {
        items.unshift({
          type: "deposit",
          id: "deposit",
          label: "Security Deposit",
          amount: depositValue,
          due: "Upon move-in",
          rent_status: "unpaid",
        });
      }

      if (advanceAmount > 0) {
        items.unshift({
          type: "advance",
          id: "advance",
          label: "Advance Payment (Move-out Notice)",
          amount: advanceAmount,
          due: "Upon move-in",
          rent_status: "unpaid",
        });
      }

      return items;
    },
    showPaymentsTab() {
      return String(this.tenantStatus || '').toLowerCase() === 'active';
    },
    isActiveTenant() {
      return String(this.tenantStatus || '').toLowerCase() === 'active';
    },
    advanceRequired() {
      return Math.max(0, Number(this.advancePaymentMonths || 0));
    },
    remainingDue() {
      if (!this.isActiveTenant) return 0;
      return this.payableItems.reduce((acc, item) => acc + Number(item.amount_due || item.amount || 0), 0);
    },
    nextDueDate() {
      const dates = this.payableItems
        .map(i => i.due)
        .filter(Boolean)
        .map(d => new Date(d))
        .filter(d => !isNaN(d.getTime()))
        .sort((a, b) => a - b);
      if (dates.length === 0) return null;
      return dates[0].toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    paidRecords() {
      const records = [];
      if (!this.isActiveTenant) return records;
      this.billings
        .filter(b => String(b.rent_status || '').toLowerCase() === 'paid')
        .forEach(b => {
          records.push({
            id: `rent_${b.id}`,
            type: 'rent',
            label: `${b.rent_cycle} Rent`,
            amount: Number(b.rent_amount || 0),
            date: b.rent_due || null
          });
        });

      if (Number(this.depositPaidAmount || 0) > 0) {
        records.push({
          id: 'deposit_paid',
          type: 'deposit',
          label: 'Security Deposit',
          amount: Number(this.depositPaidAmount || 0),
          date: this.moveInDate || null
        });
      }
      if (Number(this.advancePaidAmount || 0) > 0) {
        records.push({
          id: 'advance_paid',
          type: 'advance',
          label: 'Advance Payment (Move-out Notice)',
          amount: Number(this.advancePaidAmount || 0),
          date: this.moveInDate || null
        });
      }
      return records;
    },
    filteredPaidRecords() {
      let records = this.paidRecords;
      if (this.billingTypeFilter) {
        records = records.filter(r => r.type === this.billingTypeFilter);
      }
      if (this.billingDateFrom) {
        const from = new Date(this.billingDateFrom);
        records = records.filter(r => r.date && new Date(r.date) >= from);
      }
      if (this.billingDateTo) {
        const to = new Date(this.billingDateTo);
        records = records.filter(r => r.date && new Date(r.date) <= to);
      }
      return records;
    },
    tenantStatusLabel() {
      const value = String(this.tenantStatus || '').toLowerCase();
      if (value === 'active') return 'ACTIVE';
      if (value === 'move_out') return 'MOVE OUT';
      return 'INACTIVE';
    },
    tenantStatusClass() {
      const value = String(this.tenantStatus || '').toLowerCase();
      if (value === 'active') {
        return 'bg-success-subtle text-success border border-success';
      }
      if (value === 'move_out') {
        return 'bg-secondary-subtle text-secondary border border-secondary';
      }
      return 'bg-secondary-subtle text-secondary border border-secondary';
    },
    pastTenancies() {
      const history = Array.isArray(this.tenancyHistory) ? this.tenancyHistory : [];
      const isActive = this.isActiveTenant;
      return history
        .filter(row => row)
        .filter(row => {
          if (isActive && row.id === this.currentTenantId) return false;
          const value = String(row.status || '').toLowerCase();
          return value === 'inactive' || value === 'move_out' || !!row.ended_at;
        });
    }
  },
  mounted() {
    this.fetchMyData();
    this.fetchMoveOutNotices();
  },
  methods: {
    toTitle(text){
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : "-";
    },
    async fetchMyData() {
      try {
        this.tenantLoadError = "";
        const res = await getTenantDashboard();
        const payload = res?.data?.data || {};
        this.billings = payload.billings || [];
        this.dueItems = payload.due_items || [];
        this.dueItemsLoaded = Object.prototype.hasOwnProperty.call(payload, 'due_items');

        const info = useUserInfo();
        const fullName = [info.first_name, info.last_name].filter(Boolean).join(" ").trim();
        if (fullName) this.tenantName = fullName;

        this.propertyTitle = payload.property_title || this.propertyTitle;
        this.propertyType = payload.property_type || this.propertyType;
        this.propertyAddress = payload.property_address || this.propertyAddress;
        this.propertyId = payload.property_id || this.propertyId;
        this.currentTenantId = payload.tenant_id || this.currentTenantId;
        this.tenantStatus = payload.tenant_status || payload.status || this.tenantStatus;
        this.moveInDate = payload.move_in_date || null;
        this.depositRequired = payload.deposit_required || 0;
        this.advancePaymentMonths = payload.advance_payment_months || 0;
        this.tenancyHistory = payload.tenancy_history || [];
        const latestBilling = Array.isArray(this.billings) && this.billings.length > 0 ? this.billings[0] : null;
        this.depositPaidAmount = latestBilling?.deposit_paid_amount || 0;
        this.advancePaidAmount = latestBilling?.advance_paid_amount || 0;

        this.totalPaid = this.isActiveTenant
          ? this.billings
              .filter(b => String(b.rent_status || '').toLowerCase() === 'paid')
              .reduce((acc, curr) => acc + Number(curr.rent_amount), 0)
          : 0;
      } catch (err) {
        console.error("Dashboard error:", err);
        if (err?.response?.status === 404) {
          this.tenantLoadError = "Tenant profile not found. Please contact support.";
        } else {
          this.tenantLoadError = "Unable to load tenant dashboard right now.";
        }
      }
    },
    openPaymentModal(item) {
      if (!item) {
        alert("No payment item selected.");
        return;
      }
      const firstBilling = this.billings[0] || null;
      if (!firstBilling && !item.billing_id) {
        alert("No billing available to attach this payment.");
        return;
      }

      this.selectedPaymentItem = item;
      this.paymentForm.billing_id = item.billing_id || (item.type === "billing" ? item.id : firstBilling?.id);
      this.paymentForm.property_id = item.property_id || item?.billing?.property_id || firstBilling?.property_id || this.propertyId || '';
      this.paymentForm.payment_type = item.type === "billing" ? "rent" : item.type;
      this.paymentForm.payment_method = "GCash";
      this.paymentForm.amount = item.amount;
      this.showPaymentModal = true;
    },
    closePaymentModal() {
      this.showPaymentModal = false;
      this.resetForm();
    },
    resetForm() {
      this.selectedPaymentItem = null;
      this.paymentForm = {
        billing_id: '',
        property_id: '',
        payment_method: 'Online',
        payment_type: 'rent',
        amount: ''
      };
    },
    syncAmountForType() {
      const baseRent = this.billings.length > 0 ? Number(this.billings[0].rent_amount || 0) : 0;
      if (this.paymentForm.payment_type === "rent") {
        const selectedAmount = this.selectedPaymentItem?.amount;
        this.paymentForm.amount = Number.isFinite(Number(selectedAmount)) ? Number(selectedAmount) : baseRent;
        return;
      }
      if (this.paymentForm.payment_type === "deposit") {
        this.paymentForm.amount = Number(this.depositRequired || 0);
        return;
      }
      if (this.paymentForm.payment_type === "advance") {
        this.paymentForm.amount = Number(this.advancePaymentMonths || 0);
      }
    },
    async confirmMoveOut() {
      this.sendingMoveOut = true;
      try {
        await submitMoveOutNotice(this.moveOutForm);
        this.showMoveOutModal = false;
        this.moveOutForm = { requested_move_out_date: "", message: "" };
        await this.fetchMoveOutNotices();
        alert("Move-out notice sent.");
      } catch (error) {
        alert("Failed to send move-out notice. Please try again.");
      } finally {
        this.sendingMoveOut = false;
      }
    },
    async proceedToCheckout() {
      if (!this.paymentForm.billing_id) {
        alert("Please select a billing to pay.");
        return;
      }

      if (!this.selectedBilling) {
        alert("Selected billing is invalid.");
        return;
      }

      const submittedAmount = Number(this.paymentForm.amount);
      if (!Number.isFinite(submittedAmount) || submittedAmount <= 0) {
        alert("Please enter a valid payment amount.");
        return;
      }

      this.loading = true;
      try {
        const info = useUserInfo();
        const payload = {
          tenant_id: info.id || null,
          billing_id: this.paymentForm.billing_id,
          property_id: this.paymentForm.property_id,
          payment_type: this.paymentForm.payment_type,
          payment_method: this.paymentForm.payment_method,
          amount: submittedAmount,
          rent_cycle: this.selectedBilling?.rent_cycle || null
        };

        sessionStorage.setItem("tenantMockCheckout", JSON.stringify(payload));
        this.closePaymentModal();
        this.$router.push("/tenant/checkout");
      } catch (err) {
        console.error(err);
        alert("Error preparing payment. Please check your connection.");
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
    async fetchMoveOutNotices() {
      try {
        this.moveOutNoticesError = "";
        const res = await getTenantMoveOutNotices();
        this.moveOutNotices = res?.data?.data || [];
      } catch (error) {
        console.warn("Failed to load move-out notices", error);
        this.moveOutNoticesError = "Unable to load move-out notices right now.";
      }
    },
    async openPastBillings(tenancy) {
      if (!tenancy?.id) return;
      this.pastBillingTenant = tenancy;
      this.pastBillingLoading = true;
      this.pastBillingError = "";
      this.pastBillingRecords = [];
      this.showPastBillingModal = true;
      try {
        const res = await getTenantBillingsById(tenancy.id);
        this.pastBillingRecords = res?.data?.data || [];
      } catch (error) {
        console.warn("Failed to load past billings", error);
        this.pastBillingError = "Unable to load billings for this tenancy.";
      } finally {
        this.pastBillingLoading = false;
      }
    },
    closePastBillings() {
      this.showPastBillingModal = false;
      this.pastBillingTenant = null;
      this.pastBillingRecords = [];
      this.pastBillingError = "";
    },
    noticeStatusClass(status) {
      const value = String(status || 'pending').toLowerCase();
      if (value === 'approved') return 'bg-success-subtle text-success';
      if (value === 'rejected') return 'bg-danger-subtle text-danger';
      if (value === 'acknowledged') return 'bg-info-subtle text-info';
      return 'bg-warning-subtle text-warning';
    },
    tenancyStatusBadge(status) {
      const value = String(status || '').toLowerCase();
      if (value === 'active') return 'bg-success-subtle text-success';
      if (value === 'inactive') return 'bg-secondary-subtle text-secondary';
      if (value === 'move_out') return 'bg-secondary-subtle text-secondary';
      return 'bg-light text-dark';
    },
    formatDate(date) {
      if (!date) return '-';
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return '-';
      return parsed.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    formatAmount(val) {
      return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 });
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
