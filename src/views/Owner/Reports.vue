
<template>
  <div class="reports-page p-3 p-md-4">
    <section class="reports-hero glass-panel mb-4">
      <div>
        <div class="reports-eyebrow">Owner Insights</div>
        <h3 class="reports-title mb-2">Reports and activity snapshots</h3>
        <p class="reports-copy mb-0">
          Track tenants, bookings, and payment activity in one place before exporting a clean PDF copy.
        </p>
      </div>
      <div class="reports-meta">
        <span class="meta-pill"><i class="bi bi-broadcast-pin"></i>Live owner data</span>
        <span class="meta-pill"><i class="bi bi-clock-history"></i>Updated {{ lastUpdatedLabel }}</span>
      </div>
    </section>

    <section class="tab-switcher mb-4">
      <button
        v-for="item in tabs"
        :key="item.value"
        type="button"
        class="tab-pill"
        :class="{ active: tab === item.value }"
        @click="tab = item.value"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </button>
    </section>

    <div v-if="errorMessage" class="glass-alert alert alert-warning d-flex align-items-start justify-content-between gap-3 mb-4">
      <div>
        <div class="fw-semibold mb-1">We couldn't fully load the reports.</div>
        <div class="small mb-0">{{ errorMessage }}</div>
      </div>
      <button type="button" class="btn btn-sm btn-outline-dark" @click="loadReports">Try again</button>
    </div>

    <div v-if="loading" class="loading-grid mb-4">
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-table"></div>
    </div>

    <div v-else>
      <section v-show="tab === 'tenants'" class="report-section">
        <div class="glass-panel toolbar mb-4">
          <div class="toolbar-grid">
            <div>
              <label class="form-label">Tenant Status Scope</label>
              <select class="form-select" v-model="tenantStatusFilter" @change="loadTenantSummary">
                <option value="all">All tenants</option>
                <option value="active">Active tenants</option>
                <option value="inactive">Inactive tenants</option>
              </select>
            </div>
            <div>
              <label class="form-label">Property Filter</label>
              <select class="form-select" v-model="tenantPropertyFilter" @change="loadTenantSummary">
                <option value="all">All properties</option>
                <option v-for="property in tenantProperties" :key="property.id || property.property_id || property.title" :value="String(property.id || property.property_id)">
                  {{ property.title || property.property_title || 'Untitled property' }}
                </option>
              </select>
            </div>
            <div>
              <label class="form-label">Search Tenant</label>
              <input v-model.trim="tenantSearch" type="text" class="form-control" placeholder="Search tenant or property" />
            </div>
          </div>
          <div class="toolbar-actions">
            <button type="button" class="btn btn-light" @click="resetTenantFilters">Reset Filters</button>
            <button type="button" class="btn btn-outline-primary" :disabled="printingTenantPdf" @click="printTenantSummary">
              <i class="bi bi-printer me-2"></i>{{ printingTenantPdf ? 'Generating PDF...' : 'Print Summary' }}
            </button>
          </div>
        </div>

        <div class="kpi-grid mb-4">
          <article class="kpi-card glass-panel">
            <span class="kpi-label">Total Tenants</span>
            <strong class="kpi-value">{{ tenantSummary.counts.total || 0 }}</strong>
            <small>All records for your listed properties</small>
          </article>
          <article class="kpi-card glass-panel accent-success">
            <span class="kpi-label">Active</span>
            <strong class="kpi-value">{{ tenantSummary.counts.active || 0 }}</strong>
            <small>Currently marked as active</small>
          </article>
          <article class="kpi-card glass-panel accent-muted">
            <span class="kpi-label">Inactive</span>
            <strong class="kpi-value">{{ tenantSummary.counts.inactive || 0 }}</strong>
            <small>Archived or inactive tenants</small>
          </article>
          <article class="kpi-card glass-panel accent-warm">
            <span class="kpi-label">Top Property</span>
            <strong class="kpi-value kpi-text">{{ topTenantPropertyTitle }}</strong>
            <small>{{ topTenantPropertyCount }} tenant{{ topTenantPropertyCount === 1 ? '' : 's' }}</small>
          </article>
        </div>

        <div ref="tenantPrintSection" class="report-card glass-panel">
          <div class="report-head">
            <div>
              <h5 class="mb-1">Tenant Summary</h5>
              <div class="text-muted small">
                {{ filteredTenantRows.length }} tenant record{{ filteredTenantRows.length === 1 ? '' : 's' }}
                <span class="scope-chip">{{ tenantStatusLabel }}</span>
              </div>
            </div>
          </div>

          <div v-if="filteredTenantRows.length === 0" class="empty-state">
            <i class="bi bi-people"></i>
            <h6>No tenant matches right now</h6>
            <p>Try another property or clear the current search filters.</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table report-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Email</th>
                  <th>Property</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tenant in filteredTenantRows" :key="tenant.id">
                  <td><div class="fw-semibold">{{ `${tenant.first_name || ''} ${tenant.last_name || ''}`.trim() || 'Unnamed tenant' }}</div></td>
                  <td>{{ tenant.email || '-' }}</td>
                  <td>{{ tenant.property_title || '-' }}</td>
                  <td><span class="status-chip" :class="statusClass(tenant.status)">{{ formatStatus(tenant.status) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section v-show="tab === 'bookings'" class="report-section">
        <div class="glass-panel toolbar mb-4">
          <div class="toolbar-grid booking-grid">
            <div>
              <label class="form-label">Booking Status Scope</label>
              <select class="form-select" v-model="bookingStatusFilter">
                <option value="all">All bookings</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label class="form-label">Date From</label>
              <input v-model="bookingDateFrom" type="date" class="form-control" />
            </div>
            <div>
              <label class="form-label">Date To</label>
              <input v-model="bookingDateTo" type="date" class="form-control" />
            </div>
            <div>
              <label class="form-label">Search Booking</label>
              <input v-model.trim="bookingSearch" type="text" class="form-control" placeholder="Search tenant or property" />
            </div>
            <div>
              <label class="form-label">Rows per Page</label>
              <select class="form-select" v-model.number="bookingPerPage">
                <option :value="10">10 rows</option>
                <option :value="20">20 rows</option>
                <option :value="30">30 rows</option>
                <option :value="50">50 rows</option>
              </select>
            </div>
          </div>
          <div class="toolbar-actions">
            <button type="button" class="btn btn-primary" @click="fetchBookingLogs(1)">Apply Filters</button>
            <button type="button" class="btn btn-light" @click="resetBookingFilters">Reset Filters</button>
            <button type="button" class="btn btn-outline-primary" :disabled="printingBookingPdf" @click="printBookingLogs">
              <i class="bi bi-printer me-2"></i>{{ printingBookingPdf ? 'Generating PDF...' : 'Print Logs' }}
            </button>
          </div>
        </div>

        <div class="kpi-grid mb-4">
          <article class="kpi-card glass-panel">
            <span class="kpi-label">Shown Bookings</span>
            <strong class="kpi-value">{{ bookingPagination.total || bookingLogs.length }}</strong>
            <small>Current API result set</small>
          </article>
          <article class="kpi-card glass-panel accent-warning">
            <span class="kpi-label">Pending</span>
            <strong class="kpi-value">{{ bookingStatusCounts.pending }}</strong>
            <small>Awaiting owner decision</small>
          </article>
          <article class="kpi-card glass-panel accent-success">
            <span class="kpi-label">Approved</span>
            <strong class="kpi-value">{{ bookingStatusCounts.approved }}</strong>
            <small>Ready to move forward</small>
          </article>
          <article class="kpi-card glass-panel accent-danger">
            <span class="kpi-label">Rejected</span>
            <strong class="kpi-value">{{ bookingStatusCounts.rejected }}</strong>
            <small>Declined bookings in this page</small>
          </article>
        </div>

        <div ref="bookingPrintSection" class="report-card glass-panel">
          <div class="report-head">
            <div>
              <h5 class="mb-1">Booking Logs</h5>
              <div class="text-muted small">
                {{ filteredBookingRows.length }} visible row{{ filteredBookingRows.length === 1 ? '' : 's' }}
                <span class="scope-chip">{{ bookingStatusLabel }}</span>
              </div>
            </div>
          </div>

          <div v-if="filteredBookingRows.length === 0" class="empty-state">
            <i class="bi bi-journal-text"></i>
            <h6>No booking logs found</h6>
            <p>Adjust the date range or status filter to widen the results.</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table report-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in filteredBookingRows" :key="log.id">
                  <td>{{ formatDate(log.created_at) }}</td>
                  <td>
                    <div class="fw-semibold">{{ `${log.first_name || ''} ${log.last_name || ''}`.trim() || 'Unknown tenant' }}</div>
                    <small class="text-muted">{{ log.email || 'No email' }}</small>
                  </td>
                  <td>{{ log.property_title || '-' }}</td>
                  <td><span class="status-chip" :class="statusClass(log.status)">{{ formatStatus(log.status) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination-bar" v-if="bookingPagination.lastPage > 1">
            <button type="button" class="btn btn-light" :disabled="bookingPagination.currentPage <= 1" @click="fetchBookingLogs(bookingPagination.currentPage - 1)">Prev</button>
            <span>Page {{ bookingPagination.currentPage }} of {{ bookingPagination.lastPage }}</span>
            <button type="button" class="btn btn-light" :disabled="bookingPagination.currentPage >= bookingPagination.lastPage" @click="fetchBookingLogs(bookingPagination.currentPage + 1)">Next</button>
          </div>
        </div>
      </section>

      <section v-show="tab === 'payments'" class="report-section">
        <div class="glass-panel toolbar mb-4">
          <div class="toolbar-grid payment-grid">
            <div>
              <label class="form-label">Monthly Scope</label>
              <select class="form-select" v-model="paymentMonthScope">
                <option value="all">All months</option>
                <option value="this_month">This month</option>
                <option value="last_month">Last month</option>
                <option value="3">Last 3 months</option>
                <option value="6">Last 6 months</option>
                <option value="12">Last 12 months</option>
              </select>
            </div>
            <div>
              <label class="form-label">Property</label>
              <select class="form-select" v-model="paymentFilters.property_id">
                <option value="">All properties</option>
                <option v-for="property in properties" :key="property.id" :value="property.id">{{ property.title }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">Tenant</label>
              <select class="form-select" v-model="paymentFilters.tenant_id">
                <option value="">All tenants</option>
                <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                  {{ `${tenant.first_name || ''} ${tenant.last_name || ''}`.trim() || tenant.email }}
                </option>
              </select>
            </div>
            <div>
              <label class="form-label">Payment Type</label>
              <select class="form-select" v-model="paymentFilters.payment_type">
                <option value="">All types</option>
                <option value="rent">Rent</option>
                <option value="deposit">Security deposit</option>
                <option value="advance">Advance payment</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div>
              <label class="form-label">Date From</label>
              <input v-model="paymentFilters.date_from" type="date" class="form-control" />
            </div>
            <div>
              <label class="form-label">Date To</label>
              <input v-model="paymentFilters.date_to" type="date" class="form-control" />
            </div>
            <div>
              <label class="form-label">Search Payment</label>
              <input v-model.trim="paymentSearch" type="text" class="form-control" placeholder="Search tenant, property, or type" />
            </div>
          </div>
          <div class="toolbar-actions">
            <button type="button" class="btn btn-primary" @click="fetchPaymentRows">Apply Filters</button>
            <button type="button" class="btn btn-light" @click="resetPaymentFilters">Reset Filters</button>
            <button type="button" class="btn btn-outline-primary" :disabled="printingPaymentPdf" @click="printPaymentAnalytics">
              <i class="bi bi-printer me-2"></i>{{ printingPaymentPdf ? 'Generating PDF...' : 'Print Payment Report' }}
            </button>
          </div>
        </div>

        <div class="kpi-grid mb-4">
          <article class="kpi-card glass-panel accent-success">
            <span class="kpi-label">Verified Total</span>
            <strong class="kpi-value">PHP {{ formatAmount(paymentAnalytics?.totals?.verified_amount_total) }}</strong>
            <small>All verified collections</small>
          </article>
          <article class="kpi-card glass-panel accent-primary">
            <span class="kpi-label">Verified This Month</span>
            <strong class="kpi-value">PHP {{ formatAmount(paymentAnalytics?.totals?.verified_amount_this_month) }}</strong>
            <small>Current month verified revenue</small>
          </article>
          <article class="kpi-card glass-panel accent-warning">
            <span class="kpi-label">Pending Payments</span>
            <strong class="kpi-value">{{ paymentAnalytics?.totals?.pending_count || 0 }}</strong>
            <small>Waiting for verification</small>
          </article>
          <article class="kpi-card glass-panel accent-danger">
            <span class="kpi-label">Verified / Rejected</span>
            <strong class="kpi-value">{{ paymentAnalytics?.totals?.verified_count || 0 }} / {{ paymentAnalytics?.totals?.rejected_count || 0 }}</strong>
            <small>Accepted versus rejected payment submissions</small>
          </article>
        </div>

        <div class="status-strip mb-3">
          <span class="status-chip status-warning">Pending {{ paymentAnalytics?.totals?.pending_count || 0 }}</span>
          <span class="status-chip status-success">Verified {{ paymentAnalytics?.totals?.verified_count || 0 }}</span>
          <span class="status-chip status-danger">Rejected {{ paymentAnalytics?.totals?.rejected_count || 0 }}</span>
        </div>

        <div ref="paymentPrintSection" class="report-card glass-panel">
          <div class="report-head">
            <div>
              <h5 class="mb-1">Payment Analytics</h5>
              <div class="text-muted small">
                {{ filteredPaymentMonthly.length }} monthly row{{ filteredPaymentMonthly.length === 1 ? '' : 's' }}
                <span class="scope-chip">{{ paymentScopeLabel }}</span>
              </div>
            </div>
          </div>

          <div v-if="filteredPaymentMonthly.length === 0" class="empty-state">
            <i class="bi bi-cash-stack"></i>
            <h6>No payment activity in this scope</h6>
            <p>Choose a wider month range to compare older collection activity.</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table report-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Verified Amount</th>
                  <th>Total Payments</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in filteredPaymentMonthly" :key="row.month">
                  <td>
                    <div class="fw-semibold">{{ formatMonth(row.month) }}</div>
                    <small class="text-muted">{{ row.month || '-' }}</small>
                  </td>
                  <td class="amount-strong">PHP {{ formatAmount(row.verified_amount) }}</td>
                  <td>{{ row.total_payments ?? 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="kpi-grid mb-4 mt-4">
          <article class="kpi-card glass-panel">
            <span class="kpi-label">Filtered Payments</span>
            <strong class="kpi-value">{{ filteredPaymentRows.length }}</strong>
            <small>Current detailed records ready for export</small>
          </article>
          <article class="kpi-card glass-panel accent-primary">
            <span class="kpi-label">Filtered Amount</span>
            <strong class="kpi-value">PHP {{ formatAmount(paymentFilteredTotals.totalAmount) }}</strong>
            <small>Total amount across current filtered rows</small>
          </article>
          <article class="kpi-card glass-panel accent-warning">
            <span class="kpi-label">Pending / Verified</span>
            <strong class="kpi-value">{{ paymentFilteredTotals.pending }} / {{ paymentFilteredTotals.verified }}</strong>
            <small>Current filtered payment statuses</small>
          </article>
          <article class="kpi-card glass-panel accent-danger">
            <span class="kpi-label">Rejected</span>
            <strong class="kpi-value">{{ paymentFilteredTotals.rejected }}</strong>
            <small>Rejected rows in the current filtered list</small>
          </article>
        </div>

        <div class="report-card glass-panel">
          <div class="report-head">
            <div>
              <h5 class="mb-1">Filtered Payment Records</h5>
              <div class="text-muted small">
                {{ filteredPaymentRows.length }} payment record{{ filteredPaymentRows.length === 1 ? '' : 's' }} ready to print
              </div>
            </div>
          </div>

          <div v-if="filteredPaymentRows.length === 0" class="empty-state">
            <i class="bi bi-receipt"></i>
            <h6>No payment records match these filters</h6>
            <p>Pick another tenant, property, type, or date range to widen the report.</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table report-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in filteredPaymentRows" :key="row.id">
                  <td>{{ formatDate(row.paid_at || row.created_at) }}</td>
                  <td>
                    <div class="fw-semibold">{{ row.tenant_name || `${row.first_name || ''} ${row.last_name || ''}`.trim() || '-' }}</div>
                  </td>
                  <td>{{ row.property_title || '-' }}</td>
                  <td>{{ formatStatus(row.payment_type || 'payment') }}</td>
                  <td><span class="status-chip" :class="statusClass(row.status)">{{ formatStatus(row.status) }}</span></td>
                  <td class="amount-strong">PHP {{ formatAmount(row.amount || row.amount_paid) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import { getOwnerProperties } from '@/api/property';
import { getTenantsList } from '@/api/Owner/tenants';
import { getLedgerPayments } from '@/api/Owner/ledger';
import { getBookingLogs, getPaymentAnalytics, getTenantSummary } from '@/api/Owner/reports';

export default {
  data() {
    return {
      tab: 'tenants',
      loading: false,
      errorMessage: '',
      lastLoadedAt: null,
      printingTenantPdf: false,
      printingBookingPdf: false,
      printingPaymentPdf: false,
      tenantStatusFilter: 'all',
      tenantPropertyFilter: 'all',
      tenantSearch: '',
      bookingStatusFilter: 'all',
      bookingDateFrom: '',
      bookingDateTo: '',
      bookingSearch: '',
      bookingPerPage: 20,
      paymentMonthScope: 'all',
      paymentSearch: '',
      paymentRows: [],
      properties: [],
      tenants: [],
      paymentFilters: {
        property_id: '',
        tenant_id: '',
        payment_type: '',
        date_from: '',
        date_to: '',
      },
      tenantPrintAt: null,
      bookingPrintAt: null,
      paymentPrintAt: null,
      tabs: [
        { value: 'tenants', label: 'Tenant Summary', icon: 'bi bi-people' },
        { value: 'bookings', label: 'Booking Logs', icon: 'bi bi-journal-text' },
        { value: 'payments', label: 'Payment Analytics', icon: 'bi bi-cash-stack' },
      ],
      tenantSummary: {
        counts: { total: 0, active: 0, inactive: 0 },
        by_property: [],
        tenants: [],
      },
      bookingLogs: [],
      bookingPagination: {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 20,
      },
      paymentAnalytics: {
        totals: {
          verified_amount_total: 0,
          verified_amount_this_month: 0,
          pending_count: 0,
          verified_count: 0,
          rejected_count: 0,
        },
        monthly: [],
      },
    };
  },
  async mounted() {
    await this.loadReports();
  },
  computed: {
    tenantProperties() {
      return this.tenantSummary?.by_property || [];
    },
    filteredTenantRows() {
      const search = this.tenantSearch.trim().toLowerCase();
      return (this.tenantSummary?.tenants || []).filter((tenant) => {
        const propertyId = String(tenant.property_id || tenant.id_property || tenant.property?.id || '');
        const name = `${tenant.first_name || ''} ${tenant.last_name || ''}`.trim().toLowerCase();
        const email = String(tenant.email || '').toLowerCase();
        const propertyTitle = String(tenant.property_title || '').toLowerCase();
        const matchesProperty = this.tenantPropertyFilter === 'all' || propertyId === this.tenantPropertyFilter;
        const matchesSearch = !search || name.includes(search) || email.includes(search) || propertyTitle.includes(search);
        return matchesProperty && matchesSearch;
      });
    },
    bookingStatusCounts() {
      return (this.bookingLogs || []).reduce(
        (acc, item) => {
          const key = String(item?.status || '').toLowerCase();
          if (key === 'pending') acc.pending += 1;
          else if (key === 'approved') acc.approved += 1;
          else if (key === 'rejected') acc.rejected += 1;
          return acc;
        },
        { pending: 0, approved: 0, rejected: 0 }
      );
    },
    filteredBookingRows() {
      const search = this.bookingSearch.trim().toLowerCase();
      return (this.bookingLogs || []).filter((log) => {
        if (!search) return true;
        const name = `${log.first_name || ''} ${log.last_name || ''}`.trim().toLowerCase();
        const propertyTitle = String(log.property_title || '').toLowerCase();
        const email = String(log.email || '').toLowerCase();
        return name.includes(search) || propertyTitle.includes(search) || email.includes(search);
      });
    },
    filteredPaymentMonthly() {
      const rows = this.paymentAnalytics?.monthly || [];
      if (this.paymentMonthScope === 'all') return rows;
      if (this.paymentMonthScope === 'this_month') {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        return rows.filter((row) => row?.month === monthKey);
      }
      if (this.paymentMonthScope === 'last_month') {
        const now = new Date();
        const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const monthKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
        return rows.filter((row) => row?.month === monthKey);
      }
      const limit = Number(this.paymentMonthScope);
      if (!Number.isFinite(limit) || limit <= 0) return rows;
      return rows.slice(-limit);
    },
    filteredPaymentRows() {
      const search = this.paymentSearch.trim().toLowerCase();
      return (this.paymentRows || []).filter((row) => {
        if (!search) return true;
        const tenantName = String(row.tenant_name || `${row.first_name || ''} ${row.last_name || ''}`.trim()).toLowerCase();
        const propertyTitle = String(row.property_title || '').toLowerCase();
        const paymentType = String(row.payment_type || '').toLowerCase();
        return tenantName.includes(search) || propertyTitle.includes(search) || paymentType.includes(search);
      });
    },
    paymentFilteredTotals() {
      return this.filteredPaymentRows.reduce(
        (acc, row) => {
          const amount = Number(row.amount || row.amount_paid || 0);
          const status = String(row.status || '').toLowerCase();
          acc.totalAmount += amount;
          if (status === 'pending') acc.pending += 1;
          if (status === 'verified') acc.verified += 1;
          if (status === 'rejected') acc.rejected += 1;
          return acc;
        },
        { totalAmount: 0, pending: 0, verified: 0, rejected: 0 }
      );
    },
    tenantStatusLabel() {
      if (this.tenantStatusFilter === 'active') return 'Active Tenants';
      if (this.tenantStatusFilter === 'inactive') return 'Inactive Tenants';
      return 'All Tenants';
    },
    bookingStatusLabel() {
      if (this.bookingStatusFilter === 'pending') return 'Pending Bookings';
      if (this.bookingStatusFilter === 'approved') return 'Approved Bookings';
      if (this.bookingStatusFilter === 'rejected') return 'Rejected Bookings';
      return 'All Bookings';
    },
    paymentScopeLabel() {
      if (this.paymentMonthScope === 'this_month') return 'This Month';
      if (this.paymentMonthScope === 'last_month') return 'Last Month';
      if (this.paymentMonthScope === '3') return 'Last 3 Months';
      if (this.paymentMonthScope === '6') return 'Last 6 Months';
      if (this.paymentMonthScope === '12') return 'Last 12 Months';
      return 'All Months';
    },
    topTenantProperty() {
      const rows = this.tenantSummary?.by_property || [];
      if (!rows.length) return null;
      return [...rows].sort((a, b) => Number(b.total || b.count || 0) - Number(a.total || a.count || 0))[0];
    },
    topTenantPropertyTitle() {
      return this.topTenantProperty?.title || this.topTenantProperty?.property_title || 'No property data yet';
    },
    topTenantPropertyCount() {
      return Number(this.topTenantProperty?.total || this.topTenantProperty?.count || 0);
    },
    lastUpdatedLabel() {
      if (!this.lastLoadedAt) return 'just now';
      return this.formatDateTime(this.lastLoadedAt);
    },
  },
  methods: {
    async loadReports() {
      this.loading = true;
      this.errorMessage = '';
      try {
        await Promise.all([
          this.fetchProperties(),
          this.fetchTenants(),
          this.loadTenantSummary(),
          this.fetchBookingLogs(1),
          this.loadPaymentAnalytics(),
          this.fetchPaymentRows(),
        ]);
        this.lastLoadedAt = new Date();
      } catch (error) {
        console.error('Failed to load reports:', error);
        this.errorMessage = error?.response?.data?.message || 'Failed to load reports. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    async fetchProperties() {
      const res = await getOwnerProperties();
      this.properties = res?.data?.data || res?.data?.properties || [];
    },
    async fetchTenants() {
      const res = await getTenantsList();
      this.tenants = res?.data?.data || res?.data?.tenants || res?.data || [];
    },
    async loadTenantSummary() {
      const statusParam = this.tenantStatusFilter === 'all' ? undefined : this.tenantStatusFilter;
      const propertyParam = this.tenantPropertyFilter === 'all' ? undefined : this.tenantPropertyFilter;
      const tenantRes = await getTenantSummary({ status: statusParam, property_id: propertyParam });
      this.tenantSummary = tenantRes?.data?.data || { counts: { total: 0, active: 0, inactive: 0 }, by_property: [], tenants: [] };
    },
    buildBookingParams(page = 1) {
      return {
        page,
        per_page: this.bookingPerPage,
        status: this.bookingStatusFilter === 'all' ? undefined : this.bookingStatusFilter,
        date_from: this.bookingDateFrom || undefined,
        date_to: this.bookingDateTo || undefined,
      };
    },
    setBookingResponse(response) {
      const payload = response?.data?.data || {};
      this.bookingLogs = payload?.data || [];
      this.bookingPagination = {
        currentPage: Number(payload?.current_page || 1),
        lastPage: Number(payload?.last_page || 1),
        total: Number(payload?.total || this.bookingLogs.length || 0),
        perPage: Number(payload?.per_page || this.bookingPerPage),
      };
    },
    async fetchBookingLogs(page = 1) {
      const bookingRes = await getBookingLogs(this.buildBookingParams(page));
      this.setBookingResponse(bookingRes);
    },
    async loadPaymentAnalytics() {
      const paymentRes = await getPaymentAnalytics();
      this.paymentAnalytics = paymentRes?.data?.data || {
        totals: {
          verified_amount_total: 0,
          verified_amount_this_month: 0,
          pending_count: 0,
          verified_count: 0,
          rejected_count: 0,
        },
        monthly: [],
      };
    },
    async fetchPaymentRows() {
      const paymentRes = await getLedgerPayments(this.paymentFilters);
      this.paymentRows = paymentRes?.data?.data || [];
    },
    async resetTenantFilters() {
      this.tenantStatusFilter = 'all';
      this.tenantPropertyFilter = 'all';
      this.tenantSearch = '';
      await this.loadTenantSummary();
    },
    async resetBookingFilters() {
      this.bookingStatusFilter = 'all';
      this.bookingDateFrom = '';
      this.bookingDateTo = '';
      this.bookingSearch = '';
      this.bookingPerPage = 20;
      await this.fetchBookingLogs(1);
    },
    async resetPaymentFilters() {
      this.paymentFilters = {
        property_id: '',
        tenant_id: '',
        payment_type: '',
        date_from: '',
        date_to: '',
      };
      this.paymentMonthScope = 'all';
      this.paymentSearch = '';
      await this.fetchPaymentRows();
    },
    statusClass(status) {
      const normalized = String(status || '').toLowerCase();
      if (normalized === 'active' || normalized === 'approved' || normalized === 'verified') return 'status-success';
      if (normalized === 'pending') return 'status-warning';
      if (normalized === 'rejected' || normalized === 'inactive') return 'status-danger';
      return 'status-neutral';
    },
    formatStatus(status) {
      const text = String(status || '').replace(/[_-]/g, ' ').trim();
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : 'Unknown';
    },
    formatAmount(value) {
      return Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    },
    formatDate(value) {
      if (!value) return '-';
      return new Date(value).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    formatDateTime(value) {
      if (!value) return '-';
      return new Date(value).toLocaleString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    },
    formatMonth(value) {
      if (!value) return '-';
      const [year, month] = String(value).split('-');
      if (!year || !month) return value;
      return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });
    },
    async printTenantSummary() {
      if (this.printingTenantPdf) return;
      this.printingTenantPdf = true;
      this.tenantPrintAt = new Date();
      try {
        const { generateTenantSummaryPdf } = await import('@/utils/ownerReportPdf');
        await generateTenantSummaryPdf({
          rows: this.filteredTenantRows,
          statusLabel: this.tenantStatusLabel,
          generatedAt: new Date(),
          filenameKey: this.tenantStatusFilter,
          formatDateTime: this.formatDateTime,
        });
      } catch (error) {
        console.error('Failed to generate tenant summary PDF:', error);
        this.errorMessage = 'Failed to generate tenant summary PDF. Please try again.';
      } finally {
        this.printingTenantPdf = false;
      }
    },
    async printBookingLogs() {
      if (this.printingBookingPdf) return;
      this.printingBookingPdf = true;
      this.bookingPrintAt = new Date();
      try {
        const { generateBookingLogsPdf } = await import('@/utils/ownerReportPdf');
        await generateBookingLogsPdf({
          rows: this.filteredBookingRows,
          statusLabel: this.bookingStatusLabel,
          generatedAt: new Date(),
          filenameKey: this.bookingStatusFilter,
          formatDate: this.formatDate,
          formatDateTime: this.formatDateTime,
        });
      } catch (error) {
        console.error('Failed to generate booking logs PDF:', error);
        this.errorMessage = 'Failed to generate booking logs PDF. Please try again.';
      } finally {
        this.printingBookingPdf = false;
      }
    },
    async printPaymentAnalytics() {
      if (this.printingPaymentPdf) return;
      this.printingPaymentPdf = true;
      this.paymentPrintAt = new Date();
      try {
        const { generatePaymentReportPdf } = await import('@/utils/ownerReportPdf');
        await generatePaymentReportPdf({
          monthlyRows: this.filteredPaymentMonthly,
          paymentRows: this.filteredPaymentRows,
          generatedAt: new Date(),
          scopeLabel: this.paymentScopeLabel,
          formatAmount: this.formatAmount,
          formatDate: this.formatDate,
          formatDateTime: this.formatDateTime,
          formatMonth: this.formatMonth,
          formatStatus: this.formatStatus,
          totals: this.paymentFilteredTotals,
        });
      } catch (error) {
        console.error('Failed to generate payment analytics PDF:', error);
        this.errorMessage = 'Failed to generate payment analytics PDF. Please try again.';
      } finally {
        this.printingPaymentPdf = false;
      }
    },
  },
};
</script>

<style scoped>
.reports-page {
  --report-border: rgba(91, 120, 176, 0.14);
  --report-shadow: 0 22px 45px rgba(33, 52, 98, 0.09);
  --report-text: #1f2a44;
  --report-muted: #6f7c94;
  --report-blue: #2c6bed;
  --report-success: #2a8f5b;
  --report-warm: #c38723;
  --report-danger: #c45454;
  --report-success-soft: rgba(42, 143, 91, 0.14);
  --report-warm-soft: rgba(195, 135, 35, 0.14);
  --report-danger-soft: rgba(196, 84, 84, 0.14);
  --report-surface: linear-gradient(180deg, rgba(255,255,255,.96), rgba(246,249,255,.94));
  color: var(--report-text);
}
.glass-panel { background: var(--report-surface); border: 1px solid var(--report-border); border-radius: 24px; box-shadow: var(--report-shadow); }
.reports-hero { padding: 1.5rem; display: flex; justify-content: space-between; gap: 1.25rem; align-items: flex-start; }
.reports-eyebrow { font-size: .74rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--report-blue); margin-bottom: .65rem; }
.reports-title { font-weight: 800; color: #21335b; }
.reports-copy { max-width: 640px; color: var(--report-muted); }
.reports-meta,.status-strip,.tab-switcher,.toolbar-actions { display: flex; gap: .7rem; flex-wrap: wrap; }
.meta-pill,.scope-chip,.status-chip { display: inline-flex; align-items: center; gap: .45rem; padding: .5rem .8rem; border-radius: 999px; font-size: .82rem; font-weight: 600; }
.meta-pill,.scope-chip { background: rgba(255,255,255,.75); border: 1px solid rgba(91,120,176,.14); color: #38507d; }
.scope-chip { margin-left: .5rem; }
.tab-pill { border: 1px solid rgba(91,120,176,.14); background: rgba(255,255,255,.88); color: #4f6182; border-radius: 999px; padding: .85rem 1.1rem; display: inline-flex; align-items: center; gap: .55rem; font-weight: 700; box-shadow: 0 10px 24px rgba(46,74,133,.06); }
.tab-pill.active { background: linear-gradient(135deg, #2c6bed, #4c83f1); color: #fff; border-color: transparent; }
.glass-alert { border-radius: 18px; border-color: rgba(220,171,70,.28); background: linear-gradient(180deg, rgba(255,248,228,.95), rgba(255,244,214,.92)); }
.loading-grid,.kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
.loading-grid .skeleton-table { grid-column: 1 / -1; }
.skeleton-card,.skeleton-table { position: relative; overflow: hidden; border-radius: 24px; background: #edf2fb; }
.skeleton-card { height: 150px; }
.skeleton-table { height: 320px; }
.skeleton-card::after,.skeleton-table::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent); animation: shimmer 1.4s infinite; }
@keyframes shimmer { 100% { transform: translateX(100%); } }
.toolbar,.report-card { padding: 1.2rem; }
.toolbar-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .9rem; }
.booking-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.payment-grid { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
.toolbar .form-label { font-size: .78rem; font-weight: 700; color: #60708e; margin-bottom: .45rem; }
.kpi-card { padding: 1.15rem; display: flex; flex-direction: column; gap: .35rem; }
.kpi-label { font-size: .79rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #6a7790; }
.kpi-value { font-size: 1.6rem; line-height: 1.15; font-weight: 800; color: #203255; }
.kpi-text { font-size: 1.1rem; }
.kpi-card small { color: var(--report-muted); }
.accent-success { background: linear-gradient(180deg, rgba(239,251,245,.98), rgba(231,248,238,.95)); }
.accent-muted { background: linear-gradient(180deg, rgba(248,249,253,.98), rgba(238,242,249,.95)); }
.accent-warm,.accent-warning { background: linear-gradient(180deg, rgba(255,249,238,.98), rgba(255,244,226,.95)); }
.accent-danger { background: linear-gradient(180deg, rgba(255,243,243,.98), rgba(253,234,234,.95)); }
.accent-primary { background: linear-gradient(180deg, rgba(239,245,255,.98), rgba(230,239,255,.95)); }
.report-head { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; margin-bottom: 1rem; }
.report-table thead th { border-bottom: 0; background: rgba(239,244,255,.9); color: #546685; font-size: .78rem; letter-spacing: .06em; text-transform: uppercase; padding: .9rem 1rem; }
.report-table tbody td { padding: .95rem 1rem; border-color: rgba(91,120,176,.1); color: #30425f; }
.report-table tbody tr:nth-child(even) { background: rgba(248,250,255,.65); }
.status-chip { justify-content: center; border: 1px solid transparent; }
.status-success { background: var(--report-success-soft); color: var(--report-success); }
.status-warning { background: var(--report-warm-soft); color: var(--report-warm); }
.status-danger { background: var(--report-danger-soft); color: var(--report-danger); }
.status-neutral { background: rgba(113,128,150,.12); color: #617088; }
.empty-state { min-height: 220px; display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; gap: .5rem; color: #66758f; }
.empty-state i { font-size: 2rem; color: #91a2c0; }
.amount-strong { font-weight: 800; color: #214f96; }
.pagination-bar { margin-top: 1rem; display: flex; align-items: center; justify-content: flex-end; gap: .75rem; }
@media (max-width: 1199px) { .booking-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .kpi-grid,.loading-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 768px) { .reports-hero { flex-direction: column; } .toolbar-grid,.booking-grid,.payment-grid,.kpi-grid,.loading-grid { grid-template-columns: 1fr; } .toolbar-actions,.pagination-bar { justify-content: stretch; } .toolbar-actions .btn,.pagination-bar .btn { width: 100%; } }
</style>
